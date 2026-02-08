const express = require('express');
const router = express.Router();
const {
    getInventory,
    getLowStockProducts,
    restockProduct,
    updateThreshold
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getInventory);
router.route('/low-stock').get(protect, admin, getLowStockProducts);
router.route('/restock/:id').put(protect, admin, restockProduct);
router.route('/threshold/:id').put(protect, admin, updateThreshold);

module.exports = router;
