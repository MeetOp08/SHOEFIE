const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Filter by Category
    if (req.query.category) {
        const categories = req.query.category.split(',');
        keyword.category = { $in: categories };
    }

    // Filter by Brand
    if (req.query.brand) {
        const brands = req.query.brand.split(',');
        keyword.brand = { $in: brands };
    }

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .populate('category', 'name')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('brand', 'name logo')
        .populate('category', 'name');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin



// Helper for slug generation
const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name, price, discountPrice, image, images, brand, category,
        countInStock, description, sizes, colors, isFeatured, isActive, status
    } = req.body;

    const slug = name ? generateSlug(name) : `sample-${Date.now()}`;

    // If data is provided, create product with it
    if (name && price && category) {
        const product = new Product({
            name,
            slug,
            price,
            discountPrice: discountPrice || 0,
            user: req.user._id,
            image: image || '/images/sample.jpg',
            images: images || [],
            brand: brand || 'Sample Brand',
            category,
            countInStock: countInStock || 0,
            numReviews: 0,
            description: description || 'Sample description',
            sizes: sizes || [],
            colors: colors || [],
            isFeatured: isFeatured || false,
            isActive: isActive !== undefined ? isActive : true,
            status: status || 'Published',
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } else {
        // Fallback or Draft creation
        const product = new Product({
            name: 'Sample Name',
            slug: `sample-name-${Date.now()}`,
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Sample Brand',
            category: 'Sample Category',
            countInStock: 0,
            numReviews: 0,
            description: 'Sample description',
            sizes: [],
            colors: [],
            isFeatured: false,
            isActive: true,
            status: 'Draft'
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        discountPrice,
        description,
        image,
        images,
        brand,
        category,
        countInStock,
        sizes,
        colors,
        isFeatured,
        isActive,
        status,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        if (name) product.slug = generateSlug(name);

        product.price = price || product.price;
        product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
        product.description = description || product.description;
        product.image = image || product.image;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;
        product.sizes = sizes || product.sizes;
        product.colors = colors || product.colors;
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.isActive = isActive !== undefined ? isActive : product.isActive;
        product.status = status || product.status;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
});

// @desc    Get all brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
    const Brand = require('../models/Brand'); // Local require to avoid circular dependency issues if any, though top-level is fine usually.
    const brands = await Brand.find({});
    res.json(brands);
});

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const Category = require('../models/Category');
    const categories = await Category.find({});
    res.json(categories);
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
    getBrands,
    getCategories
};
