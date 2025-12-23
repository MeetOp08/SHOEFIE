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
                password, // 123456
                isAdmin: true,
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password,
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password,
            },
        ]);

        const adminUser = createdUsers[0]._id;

        // --- 2. Create Categories ---
        const categoriesData = [
            { name: "Men's Footwear", description: 'Stylish and comfortable shoes for men', image: '/images/cat-men.jpg', user: adminUser },
            { name: "Women's Footwear", description: 'Trendy and elegant footwear for women', image: '/images/cat-women.jpg', user: adminUser },
            { name: "Kids' Footwear", description: 'Durable and fun shoes for kids', image: '/images/cat-kids.jpg', user: adminUser },
            { name: 'Sports & Performance', description: 'High-performance gear for athletes', image: '/images/cat-sports.jpg', user: adminUser },
            { name: 'Lifestyle & Fashion', description: 'Street style and limited editions', image: '/images/cat-lifestyle.jpg', user: adminUser },
        ];

        const createdCategories = await Category.insertMany(categoriesData);
        // Helper to get ID by name
        const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

        // --- 3. Create Brands ---
        const brandsData = [
            { name: 'Nike', description: 'Just Do It', logo: '/images/brand-nike.png', user: adminUser },
            { name: 'Adidas', description: 'Impossible is Nothing', logo: '/images/brand-adidas.png', user: adminUser },
            { name: 'Puma', description: 'Forever Faster', logo: '/images/brand-puma.png', user: adminUser },
            { name: 'Reebok', description: 'Fitness is Life', logo: '/images/brand-reebok.png', user: adminUser },
            { name: 'Bata', description: 'Comfort First', logo: '/images/brand-bata.png', user: adminUser },
            { name: 'Woodland', description: 'Explore More', logo: '/images/brand-woodland.png', user: adminUser },
        ];

        const createdBrands = await Brand.insertMany(brandsData);
        const getBrandId = (name) => createdBrands.find(b => b.name === name)._id;

        // --- 4. Create Products ---
        const products = [
            // MEN
            {
                name: 'Air Jordan 1 Retro High',
                image: '/images/air-jordan-1.jpg',
                description: 'The sneaker that started it all. Premium leather and timeless design.',
                brand: getBrandId('Nike'),
                category: getCatId("Men's Footwear"),
                subCategory: 'Sneakers',
                price: 180,
                discount: 10,
                countInStock: 15,
                rating: 4.8,
                numReviews: 12,
                sizes: [8, 9, 10, 11, 12],
                colors: ['Red', 'Black', 'White'],
                user: adminUser,
            },
            {
                name: 'Ultraboost Light',
                image: '/images/ultraboost.jpg',
                description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.',
                brand: getBrandId('Adidas'),
                category: getCatId('Sports & Performance'),
                subCategory: 'Running Shoes',
                price: 190,
                discount: 0,
                countInStock: 20,
                rating: 4.7,
                numReviews: 8,
                sizes: [7, 8, 9, 10, 11],
                colors: ['White', 'Black'],
                user: adminUser,
            },
            {
                name: 'Woodland Camel Leather Boots',
                image: '/images/woodland-boots.jpg',
                description: 'Rugged and durable leather boots perfect for trekking and outdoors.',
                brand: getBrandId('Woodland'),
                category: getCatId("Men's Footwear"),
                subCategory: 'Casual Shoes',
                price: 120,
                discount: 15,
                countInStock: 10,
                rating: 4.5,
                numReviews: 5,
                sizes: [8, 9, 10],
                colors: ['Camel', 'Brown'],
                user: adminUser,
            },

            // WOMEN
            {
                name: 'Puma Cali Star',
                image: '/images/puma-cali.jpg',
                description: 'Shine brighter than the rest in the Cali Star. A fresh take on the classic 80s California.',
                brand: getBrandId('Puma'),
                category: getCatId("Women's Footwear"),
                subCategory: 'Sneakers',
                price: 85,
                discount: 5,
                countInStock: 25,
                rating: 4.6,
                numReviews: 10,
                sizes: [5, 6, 7, 8],
                colors: ['White', 'Gold'],
                user: adminUser,
            },
            {
                name: 'Bata Comfit Flats',
                image: '/images/bata-flats.jpg',
                description: 'Everyday comfort with soft cushioning and elegant design.',
                brand: getBrandId('Bata'),
                category: getCatId("Women's Footwear"),
                subCategory: 'Flats',
                price: 40,
                discount: 20,
                countInStock: 50,
                rating: 4.3,
                numReviews: 22,
                sizes: [5, 6, 7, 8],
                colors: ['Black', 'Beige'],
                user: adminUser,
            },

            // KIDS
            {
                name: 'Nike Revolution 6 Kids',
                image: '/images/nike-rev-kids.jpg',
                description: 'Versatile comfort for all-day play. Easy on/off strap.',
                brand: getBrandId('Nike'),
                category: getCatId("Kids' Footwear"),
                subCategory: 'Sports Shoes',
                price: 55,
                discount: 0,
                countInStock: 30,
                rating: 4.8,
                numReviews: 4,
                sizes: [1, 2, 3, 4],
                colors: ['Blue', 'Black'],
                user: adminUser,
            },

            // SPORTS
            {
                name: 'Reebok Nano X3',
                image: '/images/reebok-nano.jpg',
                description: 'The most versatile workout shoe for lifting and running.',
                brand: getBrandId('Reebok'),
                category: getCatId('Sports & Performance'),
                subCategory: 'Training Shoes',
                price: 140,
                discount: 10,
                countInStock: 12,
                rating: 4.9,
                numReviews: 6,
                sizes: [8, 9, 10, 11],
                colors: ['Neon', 'Black'],
                user: adminUser,
            }
        ];

        await Product.insertMany(products);

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
