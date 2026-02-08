const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const productsToAdd = [
    {
        name: 'Basic Rubber Flip Flops',
        image: '/images/slippers-blue.jpg',
        description: 'Durable and comfortable rubber flip flops for daily use.',
        brand: 'Bata',
        category: 'Slippers', // Will try to find or create
        price: 149,
        countInStock: 50,
        rating: 4.0,
        numReviews: 12,
        sizes: [6, 7, 8, 9, 10],
        originCity: 'Delhi',
        originState: 'Delhi'
    },
    {
        name: 'Cotton Ankle Socks (Pack of 3)',
        image: '/images/socks-white.jpg',
        description: 'Soft cotton ankle socks, breathable and comfortable.',
        brand: 'Puma',
        category: 'Accessories',
        price: 199,
        countInStock: 100,
        rating: 4.5,
        numReviews: 25,
        sizes: [],
        originCity: 'Mumbai',
        originState: 'Maharashtra'
    },
    {
        name: 'Home Comfort Slides',
        image: '/images/slides-grey.jpg',
        description: 'Soft EVA slides for indoor comfort.',
        brand: 'Sparx',
        category: 'Slippers',
        price: 180,
        countInStock: 40,
        rating: 4.2,
        numReviews: 8,
        sizes: [7, 8, 9],
        originCity: 'Agra',
        originState: 'Uttar Pradesh'
    },
    {
        name: 'Shoe Cleaning Kit',
        image: '/images/cleaner.jpg',
        description: 'Basic shoe cleaning brush and solution.',
        brand: 'Generic',
        category: 'Accessories',
        price: 150,
        countInStock: 30,
        rating: 3.8,
        numReviews: 5,
        sizes: [],
        originCity: 'Bangalore',
        originState: 'Karnataka'
    },
    {
        name: 'Sports Running Socks',
        image: '/images/socks-black.jpg',
        description: 'Moisture-wicking socks for running and sports.',
        brand: 'Adidas',
        category: 'Accessories',
        price: 195,
        countInStock: 80,
        rating: 4.6,
        numReviews: 18,
        sizes: [],
        originCity: 'Pune',
        originState: 'Maharashtra'
    },
    {
        name: 'Flat Laces (Black)',
        image: '/images/laces.jpg',
        description: 'Durable flat laces for sneakers.',
        brand: 'Generic',
        category: 'Accessories',
        price: 49,
        countInStock: 200,
        rating: 4.1,
        numReviews: 40,
        sizes: [],
        originCity: 'Chennai',
        originState: 'Tamil Nadu'
    },
    {
        name: 'Bathroom Anti-Slip Slippers',
        image: '/images/bath-slippers.jpg',
        description: 'Anti-slip slippers designed for bathroom safety.',
        brand: 'Local',
        category: 'Slippers',
        price: 120,
        countInStock: 60,
        rating: 3.9,
        numReviews: 10,
        sizes: [6, 7, 8, 9],
        originCity: 'Jaipur',
        originState: 'Rajasthan'
    },
    {
        name: 'Woolen Winter Socks',
        image: '/images/socks-wool.jpg',
        description: 'Warm woolen socks for winter usage.',
        brand: 'Generic',
        category: 'Accessories',
        price: 185,
        countInStock: 45,
        rating: 4.3,
        numReviews: 15,
        sizes: [],
        originCity: 'Ludhiana',
        originState: 'Punjab'
    },
    {
        name: 'Gel Insoles',
        image: '/images/insoles.jpg',
        description: 'Comfortable gel insoles for all-day support.',
        brand: 'Scholl',
        category: 'Accessories',
        price: 190,
        countInStock: 35,
        rating: 4.4,
        numReviews: 22,
        sizes: [7, 8, 9, 10, 11],
        originCity: 'Mumbai',
        originState: 'Maharashtra'
    },
    {
        name: 'Kids Cartoon Slippers',
        image: '/images/kids-slippers.jpg',
        description: 'Fun cartoon themed slippers for kids.',
        brand: 'Disney',
        category: 'Slippers',
        price: 175,
        countInStock: 25,
        rating: 4.7,
        numReviews: 30,
        sizes: [3, 4, 5],
        originCity: 'Delhi',
        originState: 'Delhi'
    }
];

const importData = async () => {
    try {
        await connectDB();

        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            console.error('Admin user not found!'.red.inverse);
            process.exit(1);
        }

        // Helper to get or create category
        const getCategory = async (name) => {
            let category = await Category.findOne({ name });
            if (!category) {
                category = await Category.create({
                    name,
                    description: `${name} items`,
                    user: adminUser._id
                });
                console.log(`Created Category: ${name}`.green);
            }
            return category._id;
        };

        const productsToInsert = [];

        for (const p of productsToAdd) {
            const categoryId = await getCategory(p.category);

            productsToInsert.push({
                ...p,
                user: adminUser._id,
                category: categoryId,
                slug: p.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
            });
        }

        await Product.insertMany(productsToInsert);

        console.log(`Successfully added ${productsToInsert.length} products below 200!`.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

importData();
