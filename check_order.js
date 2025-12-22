const mongoose = require('mongoose');
const Order = require('./backend/models/Order');
const User = require('./backend/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const checkLatestOrder = async () => {
    try {
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
