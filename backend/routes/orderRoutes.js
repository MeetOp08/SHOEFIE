const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderToConfirmed,
    updateOrderToPacked,
    updateOrderToShipped,
    updateOrderToOutForDelivery,
    getMyOrders,
    getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/confirm').put(protect, admin, updateOrderToConfirmed);
router.route('/:id/pack').put(protect, admin, updateOrderToPacked);
router.route('/:id/ship').put(protect, admin, updateOrderToShipped);
router.route('/:id/out').put(protect, admin, updateOrderToOutForDelivery);

module.exports = router;
