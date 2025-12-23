const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');

const Product = require('./models/Product');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const verifyData = async () => {
    try {
        console.log('--- VERIFICATION START ---'.blue.bold);

        const pCount = await Product.countDocuments();
        const bCount = await Brand.countDocuments();
        const cCount = await Category.countDocuments();
        const uCount = await User.countDocuments();

        console.log(`Products: ${pCount} (Target: ~200)`.yellow);
        console.log(`Brands: ${bCount}`.yellow);
        console.log(`Categories: ${cCount}`.yellow);
        console.log(`Users: ${uCount} (Should be > 0)`.yellow);

        if (pCount === 0) {
            console.error('FAIL: No products found!'.red.bold);
            process.exit(1);
        }

        const sample = await Product.findOne().populate('brand category');
        console.log('\nSample Product:'.cyan);
        console.log(`Name: ${sample.name}`);
        console.log(`Brand: ${sample.brand?.name}`);
        console.log(`Category: ${sample.category?.name}`);
        console.log(`Images: ${sample.images.length + 1} (Main + Extra)`);
        console.log(`Price: ${sample.price}`);
        console.log(`Review Count: ${sample.numReviews}`);

        if (!sample.brand || !sample.category) {
            console.error('FAIL: Product missing brand or category correlation!'.red.bold);
        }

        console.log('\n--- VERIFICATION END ---'.blue.bold);
        process.exit();

    } catch (error) {
        console.error(`${error}`.red);
        process.exit(1);
    }
};

verifyData();
