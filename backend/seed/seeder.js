const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const { faker } = require('@faker-js/faker'); // Ensure this is installed

// Models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

const connectDB = require('../config/db');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log(`Loading env from: ${path.join(__dirname, '../.env')}`.yellow);
console.log(`MONGO_URI currently is: ${process.env.MONGO_URI}`.yellow);

connectDB();

const importData = async () => {
    try {
        console.log('Starting Safe Product Seeding...'.cyan.underline);

        // 1. CLEAR PRODUCT-RELATED DATA ONLY
        // We DO NOT clear Users or Orders
        await Product.deleteMany();
        await Brand.deleteMany();
        await Category.deleteMany();

        console.log('Cleared Products, Brands, and Categories.'.red);

        // 2. GET ADMIN USER (for 'user' field in schema)
        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            console.error('No Admin User found! Please create a user first.'.red.inverse);
            process.exit(1);
        }
        const adminUserId = adminUser._id;

        // 3. CREATE CATEGORIES
        const categoriesList = [
            { name: "Men's Footwear", description: 'Stylish and comfortable shoes for men', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80' },
            { name: "Women's Footwear", description: 'Trendy and elegant footwear for women', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80' },
            { name: "Kids' Footwear", description: 'Durable and fun shoes for kids', image: 'https://images.unsplash.com/photo-1514989940723-e882bc015ec2?auto=format&fit=crop&q=80' },
            { name: 'Sports & Performance', description: 'High-performance gear for athletes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80' },
            { name: 'Lifestyle & Fashion', description: 'Street style and limited editions', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80' },
        ];

        const createdCategories = await Category.insertMany(
            categoriesList.map(c => ({ ...c, user: adminUserId }))
        );
        console.log(`Created ${createdCategories.length} Categories`.green);

        // Helper to get Category ID
        const getCatId = (name) => {
            const cat = createdCategories.find(c => c.name === name);
            return cat ? cat._id : createdCategories[0]._id;
        };

        // 4. CREATE BRANDS
        const brandsList = [
            { name: 'Nike', description: 'Just Do It', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
            { name: 'Adidas', description: 'Impossible is Nothing', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
            { name: 'Puma', description: 'Forever Faster', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.png' },
            { name: 'Reebok', description: 'Fitness is Life', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Reebok_2019_logo.svg' },
            { name: 'Bata', description: 'Comfort First', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Bata_Logo.svg' },
            { name: 'Woodland', description: 'Explore More', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Woodland_Corporate_logo.svg' },
            { name: 'Skechers', description: 'The Comfort Technology Company', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Skechers-logo.svg' },
            { name: 'Local', description: 'Affordable Quality', logo: 'https://via.placeholder.com/150' },
        ];

        const createdBrands = await Brand.insertMany(
            brandsList.map(b => ({ ...b, user: adminUserId }))
        );
        console.log(`Created ${createdBrands.length} Brands`.green);

        const getBrandId = (name) => {
            const brand = createdBrands.find(b => b.name === name);
            return brand ? brand._id : createdBrands[0]._id;
        };

        // 5. IMAGE POOL (Curated High Quality Unsplash)
        const imagePool = [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1080', // Red Nike
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1080', // Nike Gray
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1080', // Green Nike
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1080', // Puma Suede
            'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1080', // Boots
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=1080', // New Balance
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1080', // Vans
            'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=1080', // Nike Air colored
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1080', // Leather
            'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=1080', // Blue sneaker
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?auto=format&fit=crop&q=80&w=1080', // Stan Smith
            'https://images.unsplash.com/photo-1514989940723-e882bc015ec2?auto=format&fit=crop&q=80&w=1080', // Kids
            'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=1080', // Running
            'https://images.unsplash.com/photo-1579338559194-a162d19bd842?auto=format&fit=crop&q=80&w=1080', // Timberland
            'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?auto=format&fit=crop&q=80&w=1080', // Doc Martens
            'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=1080', // White/Black
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1080', // White nike
            'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=1080', // Air max
        ];

        // 6. GENERATE 200 PRODUCTS
        const productsData = [];
        const TOTAL_PRODUCTS = 200;

        for (let i = 0; i < TOTAL_PRODUCTS; i++) {
            // Randomly select Brand and Category
            const brandObj = faker.helpers.arrayElement(createdBrands);
            const categoryObj = faker.helpers.arrayElement(createdCategories);

            // Generate Name: e.g. "Nike Air Zoom Runner"
            const modelName = faker.commerce.productName().split(' ').slice(0, 2).join(' '); // "Handcrafted Rubber" -> "Handcrafted Rubber"
            const shoeType = faker.helpers.arrayElement(['Runner', 'Sneaker', 'Boot', 'Loafer', 'Trainer', 'Walker', 'Hiker', 'Air', 'Zoom', 'Max', 'Prime']);
            const finalName = `${brandObj.name} ${modelName} ${shoeType}`;

            // Image Selection
            const mainImage = faker.helpers.arrayElement(imagePool);
            const additionalImages = faker.helpers.arrayElements(imagePool, 3); // 3 random images

            // Price & Stock
            const price = parseFloat(faker.commerce.price({ min: 1500, max: 15000, dec: 0 }));
            const discount = faker.helpers.arrayElement([0, 10, 15, 20, 25, 30, 50]);

            // Sizes & Colors
            const allSizes = [6, 7, 8, 9, 10, 11, 12];
            const productSizes = faker.helpers.arrayElements(allSizes, faker.number.int({ min: 3, max: 6 }));
            const productColors = faker.helpers.arrayElements(['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Grey'], faker.number.int({ min: 1, max: 4 }));

            productsData.push({
                user: adminUserId,
                name: finalName,
                image: mainImage,
                images: additionalImages,
                brand: brandObj._id,
                category: categoryObj._id,
                subCategory: faker.helpers.arrayElement(['Casual', 'Formal', 'Sports', 'Outdoor', 'Party']),
                description: faker.commerce.productDescription(),

                rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
                numReviews: faker.number.int({ min: 5, max: 100 }),

                price: price,
                discount: discount,
                countInStock: faker.number.int({ min: 0, max: 100 }),

                sizes: productSizes,
                colors: productColors,

                // Delivery / Origin Defaults
                originWarehouse: 'Warehouse',
                originCity: 'Mumbai',
                originState: 'Maharashtra',
                originCountry: 'India',
                dispatchCenter: 'Mumbai Central Hub'
            });
        }

        await Product.insertMany(productsData);
        console.log(`Successfully Seeded ${productsData.length} Products!`.green.inverse);

        process.exit();

    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        // Safe destroy - only products-related
        await Product.deleteMany();
        await Brand.deleteMany();
        await Category.deleteMany();

        console.log('Products, Brands, and Categories Destroyed! (Users/Orders Intact)'.red.inverse);
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
