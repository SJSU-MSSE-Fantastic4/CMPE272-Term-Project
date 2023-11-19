// Connect to MongoDB
import mongoose from "mongoose";
import { config } from "../config";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {
            dbName: config.MONGO_DB_NAME,
            user: config.MONGO_USER,
            pass: config.MONGO_PASSWORD,
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
    }
};

export default connectToMongoDB;
