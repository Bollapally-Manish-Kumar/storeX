// Importing dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const fileRoutes = require('./routes/fileRoutes');
const cors = require('cors');
const cron = require('node-cron');
const File = require('./models/File');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many attempts, try again later'
});
app.use(limiter);

// Routes
app.use('/api/files', fileRoutes);

// MongoDB Connection (Fixed: Removed deprecated options!)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cron Job to delete expired files daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cleanup job...');
    try {
        const expiredFiles = await File.find({ expiryDate: { $lt: new Date() } });
        for (const file of expiredFiles) {
            // If stored on Cloudinary
            if (file.cloudinary_id) {
                await cloudinary.uploader.destroy(file.cloudinary_id);
            }
            await file.deleteOne();
            console.log(`Deleted expired file: ${file.filename}`);
        }
    } catch (err) {
        console.error('Error during cleanup job:', err);
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
