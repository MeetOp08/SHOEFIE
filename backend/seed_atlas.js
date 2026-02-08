const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const ATLAS_URI = process.env.MONGO_URI;

const importData = async () => {
    try {
        if (!ATLAS_URI || ATLAS_URI.includes("PASTE_YOUR")) {
            console.error("❌ ERROR: MONGO_URI not found in backend/.env or is invalid!".red.bold);
            process.exit(1);
        }

        console.log(`Connecting to Atlas...`.yellow);
        await mongoose.connect(ATLAS_URI);
        console.log(`Connected!`.green);

        // Clear old data
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Old Data Destroyed...'.red.inverse);

        // Add Users
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        // Add Products
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('✅ Data Imported Successfully to Live Site!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

importData();
