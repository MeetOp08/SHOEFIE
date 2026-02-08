const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const makeAdmin = async () => {
    try {
        console.log("Connecting to DB...".yellow);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!".green);

        const email = "patelmeet5967@gmail.com";
        const pass = "Admin@123"; // NEW PASSWORD
        const user = await User.findOne({ email });

        if (user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(pass, salt);
            user.isAdmin = true;

            await user.save();

            console.log(`User ${user.name} is now ADMIN 👑`.green.bold);
            console.log(`Login Email: ${email}`.cyan);
            console.log(`Login Password: ${pass}`.cyan.bold);
        } else {
            console.log(`User with email ${email} not found!`.red);
            console.log("Please register on the website first.".yellow);
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

makeAdmin();
