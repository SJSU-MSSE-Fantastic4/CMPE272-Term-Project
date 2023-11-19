//Neo4j config
const NEO4J_PROTOCOL = process.env.NEO4J_PROTOCOL || "bolt";
const NEO4J_HOST = process.env.NEO4J_HOST || "localhost";
const NEO4J_PORT = process.env.NEO4J_PORT || 7687;
const NEO4J_USER = process.env.NEO4J_USER || "neo4j";
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || "password";
const NEO4J_URL =
    process.env.NEO4J_URL || `${NEO4J_PROTOCOL}://${NEO4J_HOST}:${NEO4J_PORT}`;

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

export const config = {
    NEO4J: {
        URL: NEO4J_URL,
        USERNAME: NEO4J_USER,
        PASSWORD: NEO4J_PASSWORD,
    },
    PORT: 3000,

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
};
