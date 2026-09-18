const mongoose = require('mongoose');

const resolveMongoUri = () => {
  return process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arambh';
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(resolveMongoUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.resolveMongoUri = resolveMongoUri;
