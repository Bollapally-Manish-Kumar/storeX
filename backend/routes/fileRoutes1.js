const express = require('express');
const router = express.Router();
const { uploadPDF, accessPDF, deletePDF } = require('../controllers/pdfController');

router.post('/upload', uploadPDF);
router.post('/access', accessPDF);
router.post('/delete', deletePDF);

module.exports = router;

router.post('/delete', async (req, res) => {
    const { filename, accessCode } = req.body;
    try {
      const file = await File.findOne({ filename });
      if (!file) return res.status(404).json({ message: 'File not found' });
      if (file.accessCode !== accessCode) return res.status(401).json({ message: 'Invalid Access Code' });
  
      if (file.cloudinary_id) await cloudinary.uploader.destroy(file.cloudinary_id);
      await file.deleteOne();
      res.json({ message: 'File deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  