//Neo4j config
const NEO4J_PROTOCOL = process.env.NEO4J_PROTOCOL || "neo4j+s";
const NEO4J_HOST = process.env.NEO4J_HOST || "f6b09929.databases.neo4j.io";
const NEO4J_PORT = process.env.NEO4J_PORT || 7687;
const NEO4J_USER = process.env.NEO4J_USER || "neo4j";
const NEO4J_PASSWORD =
    process.env.NEO4J_PASSWORD || "ytqJ0tx2OZxsllLlMFDkGMA4_Kib0tp906BXyebCPYc";
const NEO4J_URL =
    process.env.NEO4J_URL || "neo4j+s://f6b09929.databases.neo4j.io"; //`${NEO4J_PROTOCOL}://${NEO4J_HOST}:${NEO4J_PORT}`;

//Keycloak config
const AUTH_SERVER_URL =
    process.env.AUTH_SERVER_URL || "https://dev-2ttpe83i3lninaj8.us.auth0.com";
const AUTH_CLIENT_SECRET =
    process.env.AUTH_CLIENT_SECRET ||
    "263rcqJ2sIUFwNtxJfRncGNs3aNDcE1rcbEclHn3MVALCH-3cA-_4cEynHMdNlrX";
const AUTH_CLIENT_ID =
    process.env.KEYCLOAK_CLIENT_ID || "ZRU5C0kWtPWbs41hBPgFecP7I1OyBJ0z";

export const config = {
    NEO4J: {
        URL: NEO4J_URL,
        USERNAME: NEO4J_USER,
        PASSWORD: NEO4J_PASSWORD,
    },
    PORT: 3000,

    AUTH: {
        clientId: AUTH_CLIENT_ID,
        clientSecret: AUTH_CLIENT_SECRET,
        serverUrl: AUTH_SERVER_URL,
    },
};
