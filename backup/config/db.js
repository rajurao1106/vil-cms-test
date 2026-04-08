import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config()

const connectDB = async () => {
    try {
        // MONGO_URI check karne ke liye log add kiya hai
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

// CommonJS (module.exports) ki jagah ES Module export use karein
export default connectDB;