//Mongo config
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USERNAME = process.env.MONGO_USERNAME || "root";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "password";
const MONGO_URL =
    process.env.MONGO_URL || `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "postDB";

//Keycloak config
const AUTH_SERVER_URL =
    process.env.AUTH_SERVER_URL || "https://dev-2ttpe83i3lninaj8.us.auth0.com";
const AUTH_CLIENT_SECRET =
    process.env.AUTH_CLIENT_SECRET || "rHHtKZJDb8SrfvrQktuIBC9n73qlEiLa";
const AUTH_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "chatwave-interface";

const AMQP_URL = process.env.AMQP_URL || "amqp://localhost";

const PORT = process.env.PORT || 5000;

export const config = {
    MONGO: {
        MONGO_URL: MONGO_URL,
        MONGO_USERNAME: MONGO_USERNAME,
        MONGO_PASSWORD: MONGO_PASSWORD,
        MONGO_DB_NAME: MONGO_DB_NAME,
    },
    PORT: PORT,

    AUTH: {
        clientId: AUTH_CLIENT_ID,
        clientSecret: AUTH_CLIENT_SECRET,
        serverUrl: AUTH_SERVER_URL,
    },

    AMQP_URL: AMQP_URL,
};
