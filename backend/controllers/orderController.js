const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const orderConfirmationTemplate = require('../templates/orderConfirmationTemplate');
const shippingUpdateTemplate = require('../templates/shippingUpdateTemplate');
const paymentSuccessTemplate = require('../templates/paymentSuccessTemplate');
const deliveryConfirmationTemplate = require('../templates/deliveryConfirmationTemplate');

// ... (imports)

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    // ... (destructuring)
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        paymentProvider,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const product = await Product.findById(orderItems[0].product);
        // ... (validation)

        const order = new Order({
            // ... (fields)
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x.product || x._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            paymentProvider,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            originDetails: {
                originWarehouse: product?.originWarehouse || 'Central Warehouse',
                originCity: product?.originCity || 'Mumbai',
                originState: product?.originState || 'Maharashtra',
                originCountry: product?.originCountry || 'India',
                dispatchCenter: product?.dispatchCenter || 'DC-001'
            }
        });

        const createdOrder = await order.save();

        // Send Order Confirmation Email
        try {
            await sendEmail({
                email: req.user.email,
                subject: `Order Confirmation - #${createdOrder._id}`,
                message: orderConfirmationTemplate(createdOrder) // Use template
            });

            // Send Admin Notification
            if (process.env.ADMIN_EMAIL) {
                await sendEmail({
                    email: process.env.ADMIN_EMAIL,
                    subject: `New Order Received - #${createdOrder._id}`,
                    message: `<p>New order placed by ${req.user.name} (${req.user.email}). Total: $${createdOrder.totalPrice}</p>`
                });
            }
        } catch (error) {
            console.error('Order email send failed:', error);
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        // Decrement Product Stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                const newStock = product.countInStock - item.qty;
                product.countInStock = newStock < 0 ? 0 : newStock;
                product.stockHistory.push({
                    change: -item.qty,
                    reason: `Order ${order._id}`,
                    date: Date.now()
                });
                await product.save();
            }
        }

        // Send Payment Success Email
        try {
            await sendEmail({
                email: order.user.email,
                subject: `Payment Successful - Order #${updatedOrder._id}`,
                message: paymentSuccessTemplate(updatedOrder)
            });
        } catch (error) {
            console.error('Payment email send failed:', error);
        }

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/:id/pay/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: razorpay_payment_id,
                status: 'COMPLETED',
                email_address: req.user.email,
            };
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } else {
        res.status(400);
        throw new Error('Invalid signature');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered';

        const updatedOrder = await order.save();

        // Send Delivery Confirmation Email
        try {
            await sendEmail({
                email: order.user.email,
                subject: `Order Delivered - #${updatedOrder._id}`,
                message: deliveryConfirmationTemplate(updatedOrder)
            });
        } catch (error) {
            console.error('Delivery email send failed:', error);
        }

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to Confirmed
// @route   PUT /api/orders/:id/confirm
// @access  Private/Admin
const updateOrderToConfirmed = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'Order Confirmed';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to Packed
// @route   PUT /api/orders/:id/pack
// @access  Private/Admin
const updateOrderToPacked = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'Packed';
        // Logic to assign specific dispatch center if needed
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to Shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'Shipped';
        order.shippedAt = Date.now();
        order.deliveryPartner = req.body.deliveryPartner;
        order.trackingId = req.body.trackingId;
        order.estimatedDeliveryDate = req.body.estimatedDeliveryDate;

        const updatedOrder = await order.save();

        // Send Shipping Email
        try {
            await sendEmail({
                email: order.user.email,
                subject: `Order Shipped - #${updatedOrder._id}`,
                message: shippingUpdateTemplate(updatedOrder)
            });
        } catch (error) {
            console.error('Shipping email send failed:', error);
        }

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to Out for Delivery
// @route   PUT /api/orders/:id/out
// @access  Private/Admin
const updateOrderToOutForDelivery = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'Out for Delivery';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Get dashboard analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find({ isPaid: true });
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

    const dailySales = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo },
                isPaid: true
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                sales: { $sum: "$totalPrice" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.json({
        totalOrders,
        totalUsers,
        totalSales: totalSales.toFixed(2),
        dailySales
    });
});

module.exports = {
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
    getAnalytics,
    verifyPayment,
};
