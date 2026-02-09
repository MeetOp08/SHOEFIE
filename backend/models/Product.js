const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
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

const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String, // Main image
            required: true,
        },
        images: [
            { type: String } // Additional images
        ],
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category',
        },
        subCategory: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        discount: {
            type: Number,
            required: true,
            default: 0, // Percentage discount
        },
        discountPrice: {
            type: Number,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            required: true,
            default: 5,
        },
        stockHistory: [
            {
                change: { type: Number, required: true },
                reason: { type: String, required: true },
                date: { type: Date, default: Date.now }
            }
        ],
        sizes: [
            { type: Number } // e.g., 7, 8, 9, 10
        ],
        gender: {
            type: String,
            required: true,
            enum: ['Men', 'Women', 'Kids', 'Unisex'],
        },
        material: {
            type: String,
            required: true,
        },
        sizesAvailable: [
            { type: Number }
        ],
        colorsAvailable: [
            { type: String }
        ],
        // Legacy Fields (Optional Keep for compatibility)
        sizes: [{ type: Number }],
        colors: [{ type: String }],
        originWarehouse: {
            type: String,
            enum: ['Warehouse', 'Seller'],
            default: 'Warehouse',
        },
        originCity: {
            type: String,
            required: true,
            default: 'Mumbai'
        },
        originState: {
            type: String,
            required: true,
            default: 'Maharashtra'
        },
        originCountry: {
            type: String,
            required: true,
            default: 'India'
        },
        dispatchCenter: {
            type: String,
            default: 'Mumbai Central Hub'
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ['Draft', 'Published'],
            default: 'Published',
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
