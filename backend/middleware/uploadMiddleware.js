const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'shoefie_products', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }], // Resize for optimization
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
