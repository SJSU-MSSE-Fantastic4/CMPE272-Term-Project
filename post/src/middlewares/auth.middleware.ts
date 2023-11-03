import { Request, Response, NextFunction } from "express";
import Keycloak, { KeycloakConfig } from "keycloak-connect";

const keycloakConfig = {
    clientId: "post-microservice",
    bearerOnly: true,
    serverUrl: "http://localhost:8080",
    realm: "microblog",
    credentials: {
        secret: "qD8Yaa2nBvv93TtpJjmZbKgArkOEw30J",
    },
    "ssl-required": "none",
    "confidential-port": "0",
    "auth-server-url": "http://localhost:8080",
    resource: "post-microservice",
};

const keycloak = new Keycloak({}, keycloakConfig);

export default keycloak;
