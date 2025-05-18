import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.MONGO_URI;
const connectDB = async() => {
	try {
		const conn = await mongoose.connect(URL,{})
		console.log(`connected to DB ${conn.connection.name}`);
	} catch (error) {
		console.error("MongoDB Error error:", error);
		process.exit(1)
	}
}

export default connectDB;