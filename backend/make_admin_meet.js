const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const makeAdmin = async () => {
    try {
        console.log("Connecting to DB...".yellow);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!".green);

        const email = "patelmeet5967@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            user.isAdmin = true;
            user.password = '123456'; // Reset password
            await user.save();
            console.log(`User ${user.name} (${email}) password reset to '123456' and is now an Admin! 👑`.green.bold);
        } else {
            console.log(`User with email ${email} not found!`.red);
            console.log("Please create an account on the website first.".yellow);
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

makeAdmin();
