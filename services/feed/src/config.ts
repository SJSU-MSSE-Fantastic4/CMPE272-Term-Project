const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER || "root";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "root";
const MONGO_URL =
    process.env.MONGO_URL ||
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "feedDB";

const AMQP_URL = process.env.AMQP_URL || "amqp://localhost";

export const config = {
    PORT: 3000,
    MONGO_URL: MONGO_URL,
    MONGO_USER: MONGO_USER,
    MONGO_PASSWORD: MONGO_PASSWORD,
    MONGO_DB_NAME: MONGO_DB_NAME,
    AMQP_URL: AMQP_URL,
};
