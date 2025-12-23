const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                size: { type: Number },
                color: { type: String }
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentProvider: {
            type: String, // e.g., 'GooglePay', 'HDFC', 'AmazonPayForWallet'
            required: false,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Order Placed', 'Order Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
            default: 'Order Placed'
        },
        shippedAt: {
            type: Date
        },
        deliveryPartner: {
            type: String,
            enum: ['Amazon Logistics', 'Flipkart Ekart', 'Delhivery', 'Blue Dart', 'DTDC', ''],
            default: ''
        },
        trackingId: {
            type: String
        },
        estimatedDeliveryDate: {
            type: Date
        },
        originDetails: {
            originWarehouse: { type: String },
            originCity: { type: String },
            originState: { type: String },
            originCountry: { type: String },
            dispatchCenter: { type: String }
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
