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

// Multer Storage (Temporary local storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload PDF
exports.uploadPDF = [
    upload.single('file'),
    async (req, res) => {
        try {
            const { filename, accessCode, tags, expiryDate, maxDownloads } = req.body;
            const hashedCode = await bcrypt.hash(accessCode, 10);

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload_stream(
                { resource_type: 'raw', public_id: filename },
                async (error, result) => {
                    if (error) return res.status(500).json({ message: error.message });

                    const newFile = new File({
                        filename,
                        cloudinary_id: result.public_id,
                        file_url: result.secure_url,
                        accessCode: hashedCode,
                        tags: tags ? tags.split(',') : [],
                        expiryDate,
                        maxDownloads
                    });

                    await newFile.save();

                    // Generate QR
                    const qrData = `File: ${filename}, Access Code: ${accessCode}, Link: ${result.secure_url}`;
                    const qrCode = await QRCode.toDataURL(qrData);

                    res.json({ message: 'Uploaded!', file: newFile, qrCode });
                }
            );
            result.end(req.file.buffer);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
];

// Access PDF
exports.accessPDF = async (req, res) => {
    try {
        const { filename, accessCode } = req.body;
        const file = await File.findOne({ filename });

        if (!file) return res.status(404).json({ message: 'File not found' });

        const isMatch = await bcrypt.compare(accessCode, file.accessCode);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect access code' });

        file.downloadCount++;
        if (file.maxDownloads && file.downloadCount >= file.maxDownloads) {
            await deleteFile(file);
        } else {
            await file.save();
        }

        res.json({ url: file.file_url });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete PDF
exports.deletePDF = async (req, res) => {
    try {
        const { filename, accessCode } = req.body;
        const file = await File.findOne({ filename });
        if (!file) return res.status(404).json({ message: 'File not found' });

        const isMatch = await bcrypt.compare(accessCode, file.accessCode);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect access code' });

        await deleteFile(file);
        res.json({ message: 'File deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Helper
async function deleteFile(file) {
    await cloudinary.uploader.destroy(file.cloudinary_id, { resource_type: 'raw' });
    await File.deleteOne({ _id: file._id });
}

