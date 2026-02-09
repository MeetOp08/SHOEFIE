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
            $or: [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } },
                { brand: { $regex: req.query.keyword, $options: 'i' } },
                { subCategory: { $regex: req.query.keyword, $options: 'i' } },
            ],
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
// @desc    Create a product (with image upload)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    // --- DEBUG LOGS START ---
    console.log("-----------------------------------------");
    console.log("1. Create Product Controller Reached");
    console.log("2. User:", req.user ? req.user._id : "No User Found");
    console.log("3. Req Body:", JSON.stringify(req.body, null, 2));
    console.log("4. Req Files:", req.files ? req.files.length : "No Files");
    // --- DEBUG LOGS END ---

    try {
        const {
            name,
            price,
            discountPrice,
            description,
            brand,
            category,
            countInStock,
            gender,
            material,
            sizesAvailable,
            colorsAvailable,
            isFeatured
        } = req.body;

        // Image Handling
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path); // Cloudinary URL
        }

        console.log("5. Images Processed:", images);

        // Validate
        if (!name || !price || !category || !gender || !material) {
            console.log("!!! Validation Failed: Missing required fields !!!");
            res.status(400);
            throw new Error('Please fill all required fields');
        }

        // Parse Arrays if sent as strings (FormData quirk)
        let parsedSizes = [];
        if (typeof sizesAvailable === 'string') {
            try {
                parsedSizes = JSON.parse(sizesAvailable);
            } catch (e) {
                console.log("Error parsing sizes:", e.message);
                parsedSizes = sizesAvailable.split(',').map(s => Number(s.trim()));
            }
        } else if (Array.isArray(sizesAvailable)) {
            parsedSizes = sizesAvailable.map(Number);
        }

        let parsedColors = [];
        if (typeof colorsAvailable === 'string') {
            try {
                parsedColors = JSON.parse(colorsAvailable);
            } catch (e) {
                console.log("Error parsing colors:", e.message);
                parsedColors = colorsAvailable.split(',').map(c => c.trim());
            }
        } else if (Array.isArray(colorsAvailable)) {
            parsedColors = colorsAvailable;
        }

        console.log("6. Sizes/Colors Parsed:", parsedSizes, parsedColors);

        // Create Product
        const product = new Product({
            user: req.user._id,
            name,
            price,
            discountPrice: discountPrice || 0,
            image: images[0] || '/images/sample.jpg', // Main image
            images: images,
            brand,
            category, // Expecting ObjectId from Frontend
            countInStock: countInStock || 0,
            gender,
            material,
            sizesAvailable: parsedSizes,
            colorsAvailable: parsedColors,
            // Legacy mapping
            sizes: parsedSizes,
            colors: parsedColors,

            description,
            isFeatured: isFeatured === 'true' || isFeatured === true, // Check boolean
            numReviews: 0,
            rating: 0,
            slug: name.toLowerCase().split(' ').join('-') + '-' + Date.now()
        });

        console.log("7. Saving Product to DB...");
        const createdProduct = await product.save();
        console.log("8. Product Saved Successfully:", createdProduct._id);

        res.status(201).json(createdProduct);
    } catch (error) {
        // --- ERROR LOG START ---
        console.error("!!! ERROR SAVING PRODUCT !!!");
        console.error("Error Message:", error.message);
        if (error.errors) console.error("Validation Errors:", error.errors);
        // --- ERROR LOG END ---

        res.status(400);
        throw new Error(error.message);
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

// @desc    Create a brand (Admin)
// @route   POST /api/products/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
    const Brand = require('../models/Brand');
    const { name, logo, description } = req.body;
    const brand = new Brand({
        name,
        logo: logo || '/images/sample-brand.jpg',
        description,
        user: req.user._id
    });
    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
});

// @desc    Delete a brand (Admin)
// @route   DELETE /api/products/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
    const Brand = require('../models/Brand');
    const brand = await Brand.findById(req.params.id);
    if (brand) {
        await brand.deleteOne();
        res.json({ message: 'Brand removed' });
    } else {
        res.status(404);
        throw new Error('Brand not found');
    }
});

// @desc    Get all reviews (Admin)
// @route   GET /api/products/reviews
// @access  Private/Admin
const getReviews = asyncHandler(async (req, res) => {
    const products = await Product.find({}).select('reviews name');
    let reviews = [];
    products.forEach(product => {
        product.reviews.forEach(review => {
            reviews.push({
                ...review.toObject(),
                productName: product.name,
                productId: product._id
            });
        });
    });
    res.json(reviews);
});

// @desc    Delete review (Admin)
// @route   DELETE /api/products/reviews/:productId/:reviewId
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);

    if (product) {
        product.reviews = product.reviews.filter(
            (r) => r._id.toString() !== reviewId
        );

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.length > 0
                ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length
                : 0;

        await product.save();
        res.json({ message: 'Review removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
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
    getCategories,
    createBrand,
    deleteBrand,
    getReviews,
    deleteReview
};
