const File = require('../models/File');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const QRCode = require('qrcode');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===== Upload Image/Video ===== //
exports.uploadMedia = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { filename, accessCode, tags, expiryDate, maxDownloads } = req.body;
      const hashedCode = await bcrypt.hash(accessCode, 10);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect the file type for upload
          public_id: filename
        },
        async (error, result) => {
          if (error) return res.status(500).json({ message: error.message });

          const newFile = new File({
            filename,
            cloudinary_id: result.public_id,
            file_url: result.secure_url,
            accessCode: hashedCode,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            expiryDate,
            maxDownloads,
            downloadCount: 0
          });

          await newFile.save();

          const qrData = `Filename: ${filename}\nAccess Code: ${accessCode}\nLink: ${result.secure_url}`;
          const qrCode = await QRCode.toDataURL(qrData);

          res.json({ message: 'File Uploaded Successfully!', file: newFile, qrCode });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error: Unable to upload file' });
    }
  }
];

// ===== Access Media ===== //
exports.accessMedia = async (req, res) => {
  try {
    const { filename, accessCode } = req.body;

    const file = await File.findOne({ filename });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const isMatch = await bcrypt.compare(accessCode, file.accessCode);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect Access Code' });

    file.downloadCount++;
    if (file.maxDownloads && file.downloadCount >= file.maxDownloads) {
      await deleteFile(file);
      return res.json({ message: 'File accessed and deleted after reaching download limit', url: file.file_url });
    } else {
      await file.save();
    }

    res.json({ url: file.file_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Unable to access file' });
  }
};

// ===== Delete Media ===== //
exports.deleteMedia = async (req, res) => {
  try {
    const { filename, accessCode } = req.body;

    const file = await File.findOne({ filename });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const isMatch = await bcrypt.compare(accessCode, file.accessCode);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect Access Code' });

    await deleteFile(file);
    res.json({ message: 'File deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Unable to delete file' });
  }
};

async function deleteFile(file) {
  try {
    // Specify resource_type based on file type; defaulting to 'auto' if not set
    const resourceType = file.file_url.includes('image') ? 'image' : 'raw'; // Can adjust based on your file types

    await cloudinary.uploader.destroy(file.cloudinary_id, { resource_type: resourceType });
    await File.deleteOne({ _id: file._id });
    console.log(`Deleted file: ${file.filename}`);
  } catch (err) {
    console.error('Error deleting file:', err.message);
  }
}
