
const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = (stripeKey && stripeKey !== 'placeholder') ? Stripe(stripeKey) : null;
const Order = require('../models/Order');
const Product = require('../models/Product'); // Import Product

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.isPaid) {
        res.status(400);
        throw new Error('Order is already paid');
    }

    const line_items = order.orderItems.map((item) => {
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects paisa
            },
            quantity: item.qty,
        };
    });

    // Add shipping cost if any
    if (order.shippingPrice > 0) {
        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Shipping Charges',
                },
                unit_amount: Math.round(order.shippingPrice * 100),
            },
            quantity: 1,
        });
    }

    // Add tax
    if (order.taxPrice > 0) {
        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Tax',
                },
                unit_amount: Math.round(order.taxPrice * 100),
            },
            quantity: 1,
        });
    }

    // Check for missing or placeholder key and use Mock Mode
    if (!stripe || !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
        console.log('Stripe Key missing or placeholder. Using Mock Payment Mode.');

        // Update Order to Paid for Mock
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: 'mock_transaction_' + orderId,
            status: 'COMPLETED',
            update_time: String(Date.now()),
            email_address: order.user.email,
        };

        // Decrement Stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock -= item.qty;
                if (product.countInStock < 0) product.countInStock = 0;
                product.stockHistory.push({
                    change: -item.qty,
                    reason: `Order ${orderId}`,
                    date: Date.now()
                });
                await product.save();
            }
        }
        await order.save();

        res.json({
            id: 'mock_session_' + orderId,
            url: `${req.headers.origin}/order-success/${orderId}?session_id=mock_session_${orderId}`
        });
        return;
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/order-success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/order/${orderId}?canceled=true`,
        client_reference_id: orderId,
        metadata: {
            orderId: orderId,
        },
        customer_email: order.user.email,
    });

    res.json({ id: session.id, url: session.url });
});

// @desc    Handle Stripe Webhook
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
    // Webhook implementation depends on Stripe CLI/Production setup with raw body parsing
    // Since implementing raw body parsing middleware across Express can be tricky if not planned,
    // we'll rely on frontend callback for now for simplicity in MVP, OR user can implement true webhook later.
    // However, user specifically asked for webhook.
    // For proper webhook:
    // 1. Need express.raw({type: 'application/json'}) for this route specifically.
    // 2. Need endpoint secret.

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.client_reference_id;

        const order = await Order.findById(orderId);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: session.payment_intent,
                status: session.payment_status,
                update_time: String(Date.now()),
                email_address: session.customer_details.email,
            };

            // Decrement Stock
            for (const item of order.orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.countInStock -= item.qty;
                    if (product.countInStock < 0) product.countInStock = 0;
                    product.stockHistory.push({
                        change: -item.qty,
                        reason: `Order ${orderId}`,
                        date: Date.now()
                    });
                    await product.save();
                }
            }

            await order.save();
            console.log(`Order ${orderId} paid successfully`);
        }
    }

    res.status(200).send();
});

module.exports = {
    createCheckoutSession,
    handleWebhook
};
