const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const { faker } = require('@faker-js/faker');

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

connectDB();

const importData = async () => {
    try {
        console.log('Starting Safe Product Seeding...'.cyan.underline);

        // 1. CLEAR PRODUCT-RELATED DATA ONLY
        await Product.deleteMany();
        await Brand.deleteMany();
        // await Category.deleteMany(); // Keep Categories if present

        console.log('Cleared Products and Brands.'.red);

        // 2. GET OR CREATE ADMIN USER
        let adminUser = await User.findOne({ isAdmin: true });
        
        if (!adminUser) {
            console.log('No Admin User found. Creating default users...'.yellow);
            const { users } = require('./data');
            // We use User.create instead of insertMany to trigger password hashing pre-save hooks
            await User.create(users);
            adminUser = await User.findOne({ isAdmin: true });
            console.log('Default users created!'.green);
        }
        const adminUserId = adminUser._id;

        // 3. CREATE CATEGORIES (Fallback if empty)
        let createdCategories = await Category.find({});
        if (createdCategories.length === 0) {
            const categoriesList = [
                { name: "Men's Footwear", description: 'Stylish and comfortable shoes for men', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80' },
                { name: "Women's Footwear", description: 'Trendy and elegant footwear for women', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80' },
                { name: "Kids' Footwear", description: 'Durable and fun shoes for kids', image: 'https://images.unsplash.com/photo-1514989940723-e882bc015ec2?auto=format&fit=crop&q=80' },
                { name: 'Sports & Performance', description: 'High-performance gear for athletes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80' },
                { name: 'Lifestyle & Fashion', description: 'Street style and limited editions', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80' },
            ];
            createdCategories = await Category.insertMany(categoriesList.map(c => ({ ...c, user: adminUserId })));
        }

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

        // 5. IMAGE POOL
        const imagePool = [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1514989940723-e882bc015ec2?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1579338559194-a162d19bd842?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1080',
            'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=1080',
        ];

        // 6. GENERATE 100 PRODUCTS
        const productsData = [];
        const TOTAL_PRODUCTS = 100;

        for (let i = 0; i < TOTAL_PRODUCTS; i++) {
            const brandObj = faker.helpers.arrayElement(createdBrands);
            const categoryObj = faker.helpers.arrayElement(createdCategories);

            const modelName = faker.commerce.productName().split(' ').slice(0, 2).join(' ');
            const shoeType = faker.helpers.arrayElement(['Runner', 'Sneaker', 'Boot', 'Loafer', 'Trainer', 'Walker']);
            const finalName = `${brandObj.name} ${modelName} ${shoeType}`;
            const slug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() + '-' + i;

            const mainImage = faker.helpers.arrayElement(imagePool);
            const additionalImages = faker.helpers.arrayElements(imagePool, 3);

            const price = parseFloat(faker.commerce.price({ min: 1500, max: 15000, dec: 0 }));

            const allSizes = [6, 7, 8, 9, 10, 11, 12];
            const productSizes = faker.helpers.arrayElements(allSizes, faker.number.int({ min: 3, max: 6 }));
            const productColors = faker.helpers.arrayElements(['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Grey'], faker.number.int({ min: 1, max: 4 }));

            // NEW FIELDS for Schema Compatibility
            const gender = faker.helpers.arrayElement(['Men', 'Women', 'Kids', 'Unisex']);
            const material = faker.helpers.arrayElement(['Leather', 'Canvas', 'Mesh', 'Synthetic']);

            productsData.push({
                user: adminUserId,
                name: finalName,
                slug: slug,
                image: mainImage,
                images: additionalImages,
                brand: brandObj._id,
                category: categoryObj._id,
                subCategory: faker.helpers.arrayElement(['Casual', 'Formal', 'Sports', 'Outdoor']),
                description: faker.commerce.productDescription(),

                // New Schema Fields
                gender: gender,
                material: material,
                sizesAvailable: productSizes,
                colorsAvailable: productColors,

                // Legacy
                sizes: productSizes,
                colors: productColors,

                rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
                numReviews: faker.number.int({ min: 5, max: 100 }),
                price: price,
                countInStock: faker.number.int({ min: 0, max: 100 }),
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
        await Product.deleteMany();
        await Brand.deleteMany();
        // await Category.deleteMany();
        console.log('Products and Brands Destroyed!'.red.inverse);
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
