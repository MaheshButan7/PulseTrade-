const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || 'crypto_sim'

    const uri = `${process.env.MONGO_BASE_URI}/${dbName}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully to: ${dbName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;