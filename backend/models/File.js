const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    cloudinary_id: { type: String, required: true },
    file_url: { type: String, required: true },
    accessCode: { type: String, required: true },
    tags: [String],
    uploadDate: { type: Date, default: Date.now },
    expiryDate: Date,
    downloadCount: { type: Number, default: 0 },
    maxDownloads: Number
});

module.exports = mongoose.model('File', fileSchema);

