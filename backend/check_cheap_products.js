const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const checkProducts = async () => {
    try {
        await connectDB();

        const count = await Product.countDocuments({ price: { $lt: 200 } });
        console.log(`Number of products below 200: ${count}`.green.inverse);

        const products = await Product.find({ price: { $lt: 200 } }).select('name price');
        console.log('Products:'.cyan);
        products.forEach(p => console.log(`- ${p.name}: ${p.price}`));

        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

checkProducts();
