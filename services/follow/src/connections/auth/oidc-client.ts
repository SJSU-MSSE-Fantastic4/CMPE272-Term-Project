import { Request, Response, NextFunction } from "express";
import { BaseClient, Issuer, TokenSet } from "openid-client";
import { config } from "../../config";
import logger from "../../logger";
import { HttpException } from "../../types";

export async function setupAuthClient() {
    const auth0Issuer = await Issuer.discover(config.AUTH.serverUrl);
    const client = new auth0Issuer.Client({
        client_id: config.AUTH.clientId,
    });

    return client;
}

export async function authenticateToken(client: BaseClient, token: string) {
    try {
        const userinfo = await client.userinfo(token); // This validates the token
        return userinfo;
    } catch (error) {
        console.error("Token validation error:", error);
        return null;
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.headers.authorization) {
            logger.error("No authorization header provided");
            throw new HttpException(401, "Unauthorized");
        }

        const token = req.headers.authorization.split(" ")[1];
        const client = await setupAuthClient();
        const userinfo = await authenticateToken(client, token);

        if (!userinfo) {
            return res.status(401).send("Unauthorized");
        }

        // Check user roles or other claims
        // ...
        req.user = userinfo;
        next();
    } catch (error) {
        next(error);
    }
};
