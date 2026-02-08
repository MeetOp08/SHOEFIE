const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private/Admin
const getInventory = asyncHandler(async (req, res) => {
    const products = await Product.find({})
        .select('name countInStock lowStockThreshold category brand price image stockHistory')
        .sort({ countInStock: 1 }); // Low stock first
    res.json(products);
});

// @desc    Get low stock products
// @route   GET /api/inventory/low-stock
// @access  Private/Admin
const getLowStockProducts = asyncHandler(async (req, res) => {
    // MongoDB aggregation or simple find where countInStock <= lowStockThreshold
    // Since lowStockThreshold is per document, we need $expr inside $match
    const products = await Product.find({
        $expr: { $lte: ["$countInStock", "$lowStockThreshold"] }
    });
    res.json(products);
});

// @desc    Restock product
// @route   PUT /api/inventory/restock/:id
// @access  Private/Admin
const restockProduct = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const addedAmount = Number(amount);
        if (isNaN(addedAmount) || addedAmount <= 0) {
            res.status(400);
            throw new Error('Invalid restock amount');
        }

        product.countInStock += addedAmount;
        product.stockHistory.push({
            change: addedAmount,
            reason: 'Admin Restock',
            date: Date.now()
        });

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Update Low Stock Threshold
// @route   PUT /api/inventory/threshold/:id
// @access  Private/Admin
const updateThreshold = asyncHandler(async (req, res) => {
    const { threshold } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.lowStockThreshold = Number(threshold);
        await product.save();
        res.json({ message: 'Threshold updated' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getInventory,
    getLowStockProducts,
    restockProduct,
    updateThreshold
};
