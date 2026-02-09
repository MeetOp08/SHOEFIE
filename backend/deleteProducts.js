const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

dotenv.config();

connectDB();

const deleteData = async () => {
    try {
        await Product.deleteMany();
        await Category.deleteMany();
        await Brand.deleteMany();

        console.log('Data Destroyed! (Products, Categories, Brands)'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

deleteData();
