const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const User = require('./models/User');

dotenv.config();

connectDB();

const addCategories = async () => {
    try {
        console.log('Adding Comprehensive Categories...'.cyan);

        // 1. Get Admin User
        let adminUser = await User.findOne({ isAdmin: true });

        if (!adminUser) {
            console.log('No Admin User found. Creating default admin...'.yellow);
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                isAdmin: true
            });
        }

        // 2. Define Extensive Categories List
        const categories = [
            // Major Groups
            { name: "Men", description: "All Footwear for Men", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80" },
            { name: "Women", description: "All Footwear for Women", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80" },
            { name: "Kids", description: "Footwear for Children", image: "https://images.unsplash.com/photo-1514989940723-e882bc015ec2?auto=format&fit=crop&q=80" },

            // Styles
            { name: "Sneakers", description: "Casual & Streetwear Sneakers", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80" },
            { name: "Running", description: "Performance Running Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" },
            { name: "Walking", description: "Comfortable Walking Shoes", image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80" },
            { name: "Training & Gym", description: "Workout & Gym Shoes", image: "https://images.unsplash.com/photo-1579338559194-a162d8417876?auto=format&fit=crop&q=80" },
            { name: "Formal", description: "Oxfords, Derbys & Dress Shoes", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&q=80" },
            { name: "Loafers", description: "Slip-on Casual & Formal Loafers", image: "https://images.unsplash.com/photo-1616406432452-921343460678?auto=format&fit=crop&q=80" },
            { name: "Boots", description: "Chukka, Chelsea & Hiking Boots", image: "https://images.unsplash.com/photo-1638367015509-c45428a2a7aa?auto=format&fit=crop&q=80" },
            { name: "Sandals & Floaters", description: "Open Footwear for Summer", image: "https://images.unsplash.com/photo-1621257962493-2426df3324c7?auto=format&fit=crop&q=80" },
            { name: "Slippers & Flip Flops", description: "Casual Home & Beach Wear", image: "https://images.unsplash.com/photo-1596700813936-cbaf9cc95ec1?auto=format&fit=crop&q=80" },
            { name: "Heels", description: "High Heels, Pumps & Stilettos", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80" },
            { name: "Flats", description: "Comfortable Flat Shoes for Women", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80" },
            { name: "Canvas", description: "Casual Canvas Shoes", image: "https://images.unsplash.com/photo-1627885473723-5e921dcd3f8d?auto=format&fit=crop&q=80" },

            // Sports Specific
            { name: "Basketball", description: "Court Shoes", image: "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&q=80" },
            { name: "Football", description: "Cleats & Turf Shoes", image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80" },
            { name: "Cricket", description: "Spikes & Studs", image: "https://images.unsplash.com/photo-1596515902123-5e75da9001b9?auto=format&fit=crop&q=80" },
            { name: "Badminton/Tennis", description: "Court & Indoor Shoes", image: "https://images.unsplash.com/photo-1582895697330-749cce54d6fa?auto=format&fit=crop&q=80" },

            // Other
            { name: "Ethnic", description: "Mojaris, Juttis & Traditional", image: "https://images.unsplash.com/photo-1616406432452-921343460678?auto=format&fit=crop&q=80" },
            { name: "Outdoor & Hiking", description: "Trekking & Adventure", image: "https://images.unsplash.com/photo-1520639888713-7851186b63c9?auto=format&fit=crop&q=80" }
        ];

        // 3. Update existing Categories (Upsert logic would be better, but user cleared db recently)
        // Since user 'reversed' and cleared, we just insert.
        // But running this script twice duplicates unless we clear.
        await Category.deleteMany();
        console.log('Cleared previous categories.'.red);

        // 4. Insert
        const categoryDocs = categories.map(c => ({
            ...c,
            user: adminUser._id
        }));

        await Category.insertMany(categoryDocs);
        console.log(`Successfully Added ${categoryDocs.length} Categories!`.green.inverse);
        process.exit();

    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

addCategories();
