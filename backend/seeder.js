const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Brand = require('./models/Brand');
const Category = require('./models/Category');

// Config
const path = require('path');
console.log(`Loading env from: ${path.join(__dirname, '.env')}`);
dotenv.config({ path: path.join(__dirname, '.env') });
console.log(`MONGO_URI IS: ${process.env.MONGO_URI}`);
const connectDB = require('./config/db');

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Brand.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed...'.red.inverse);

        // --- 1. Create Users ---
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password,
                isAdmin: true,
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password,
            },
        ]);

        const adminUser = createdUsers[0]._id;

        // --- 2. Load Products Data & Extract Unique Categories/Brands ---
        const productsData = require('./data/products');

        // Extract unique Categories
        const uniqueCategories = [...new Set(productsData.map(p => p.category))];
        const categoryDocs = uniqueCategories.map(name => ({
            name,
            description: `Best collection of ${name}`,
            image: '/images/sample-category.jpg', // Placeholder
            user: adminUser
        }));

        const createdCategories = await Category.insertMany(categoryDocs);

        // Extract unique Brands
        const uniqueBrands = [...new Set(productsData.map(p => p.brand))];
        const brandDocs = uniqueBrands.map(name => ({
            name,
            description: `Official ${name} Store`,
            logo: `/images/brand-${name.toLowerCase()}.png`, // Placeholder
            user: adminUser
        }));

        const createdBrands = await Brand.insertMany(brandDocs);


        // --- 3. Map Products to IDs and Insert ---
        // --- 3. Map Products to IDs and Insert ---
        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')     // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-');  // Replace multiple - with single -
        };

        const sampleProducts = productsData.map((product) => {
            const categoryObj = createdCategories.find(c => c.name === product.category);
            // If category matches, use its ID. If not found (e.g. data mismatch), default to first category or error.
            // For robustness, we'll try to match.
            const categoryId = categoryObj ? categoryObj._id : createdCategories[0]._id;

            return {
                ...product,
                user: adminUser,
                category: categoryId,
                brand: product.brand, // Schema expects String
                slug: slugify(product.name), // Schema expects unique slug
                subCategory: product.subCategory,
            };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();

    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Brand.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
