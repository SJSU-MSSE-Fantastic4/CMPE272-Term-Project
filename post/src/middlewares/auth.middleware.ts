import { Request, Response, NextFunction } from "express";
import Keycloak, { KeycloakConfig } from "keycloak-connect";

const keycloakConfig = {
    clientId: "post-service",
    bearerOnly: true,
    serverUrl: "http://localhost:8080/auth",
    realm: "microblog-realm",
    credentials: {
        secret: "rHHtKZJDb8SrfvrQktuIBC9n73qlEiLa",
    },
    "ssl-required": "none",
    "confidential-port": "0",
    "auth-server-url": "http://localhost:8080/auth",
    resource: "post-microservice",
};

const keycloak = new Keycloak({}, keycloakConfig);

export default keycloak;
