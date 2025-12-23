const mongoose = require('mongoose');

const brandSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        logo: {
            type: String,
            required: true,
            default: '/images/sample-brand.jpg', // Placeholder
        },
        description: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
