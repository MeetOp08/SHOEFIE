const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // Prevent API calls hanging
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Only wait 5 seconds before giving up
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Warning (Offline Mode): ${error.message}`);
    // process.exit(1); -> Removed so the backend successfully boots even without internet!
  }
};

module.exports = connectDB;