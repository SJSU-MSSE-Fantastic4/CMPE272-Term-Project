import { Request } from "express";

export interface KeycloakRequest extends Request {
    kauth: {
        grant: {
            access_token: {
                content: {
                    scope: string;
                    sid: string;
                    sub: string;
                    email_verified: boolean;
                    preferred_username: string;
                    email: string;
                };
            };
        };
    };
}
