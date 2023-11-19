//Mongo config
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USERNAME = process.env.MONGO_USERNAME || "root";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "root";
const MONGO_URL =
    process.env.MONGO_URL || `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "postDB";

//Keycloak config
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "post-service";
const KEYCLOAK_SERVER_URL =
    process.env.KEYCLOAK_SERVER_URL || "http://localhost:8080/auth";
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || "microblog-realm";
const KEYCLOAK_CLIENT_SECRET =
    process.env.KEYCLOAK_CLIENT_SECRET || "rHHtKZJDb8SrfvrQktuIBC9n73qlEiLa";
const KEYCLOAK_AUTH_SERVER_URL =
    process.env.KEYCLOAK_AUTH_SERVER_URL || "http://localhost:8080/auth";
const KEYCLOAK_RESOURCE = process.env.KEYCLOAK_RESOURCE || "post-microservice";

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

    KEYCLOAK: {
        clientId: KEYCLOAK_CLIENT_ID,
        bearerOnly: true,
        serverUrl: KEYCLOAK_SERVER_URL,
        realm: KEYCLOAK_REALM,
        credentials: {
            secret: KEYCLOAK_CLIENT_SECRET,
        },
        "ssl-required": "none",
        "confidential-port": "0",
        "auth-server-url": KEYCLOAK_AUTH_SERVER_URL,
        resource: KEYCLOAK_RESOURCE,
    },

    AMQP_URL: AMQP_URL,
};
