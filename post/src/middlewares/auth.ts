import { Request, Response, NextFunction } from "express";
import Keycloak, { KeycloakConfig } from "keycloak-connect";

const keycloakConfig = {
    clientId: process.env.KEYCLOAK_CLIENT_ID || "",
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_SERVER_URL || "",
    realm: process.env.KEYCLOAK_REALM || "",
    credentials: {
        secret: process.env.KEYCLOAK_CLIENT_SECRET || "",
    },
    "ssl-required": "external",
    "confidential-port": "0",
    "auth-server-url": process.env.KEYCLOAK_AUTH_SERVER_URL || "",
    resource: process.env.KEYCLOAK_RESOURCE || "",
};

const keycloak = new Keycloak({}, keycloakConfig);

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    keycloak.protect()(req, res, next);
};

export default authMiddleware;
