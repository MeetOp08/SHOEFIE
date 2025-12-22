const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User'); // Ensure User model is loaded for population
const dotenv = require('dotenv');

dotenv.config(); // Load .env from current directory (backend)

const checkLatestOrder = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const latestOrder = await Order.findOne().sort({ createdAt: -1 }).populate('user', 'name email');

        if (latestOrder) {
            console.log('LATEST_ORDER_FOUND');
            console.log(JSON.stringify(latestOrder, null, 2));
        } else {
            console.log('NO_ORDERS_FOUND');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkLatestOrder();
