// Connect to MongoDB
import mongoose from "mongoose";
import { config } from "../config";
import logger from "../logger";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(config.MONGO.MONGO_URL, {
            dbName: config.MONGO.MONGO_DB_NAME,
            user: config.MONGO.MONGO_USERNAME,
            pass: config.MONGO.MONGO_PASSWORD,
        });
        logger.info(
            `Established a connection to MongoDB at ${config.MONGO.MONGO_URL}`
        );
    } catch (error) {
        logger.error("Failed to connect to MongoDB:", error);
        logger.error(config.MONGO);
        process.exit(1); // Exit the process with an error code
    }
};

export default connectToMongoDB;
