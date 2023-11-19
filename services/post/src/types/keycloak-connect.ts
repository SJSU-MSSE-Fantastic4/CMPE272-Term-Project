import { RequestHandler, Request, Response } from "express";

export interface BaseConfig {
    scope?: any;
}

export interface StoreConfig extends BaseConfig {
    store: any;
}

export interface CookiesConfig extends BaseConfig {
    cookies: any;
}

export type Config = StoreConfig | CookiesConfig | BaseConfig;

export interface KeycloakConfig {
    realm: string;
    realmAdminUrl?: string;
    realmUrl?: string;
    authServerUrl: string;
    resource?: string;
    credentials: {
        secret: string;
    };
    minTimeBetweenJwksRequests?: number;
    bearerOnly?: boolean;
    realmPublicKey?: string;
    clientId?: string;
    public?: boolean;
}

export interface MiddlewareOptions {
    logout?: string;
    admin?: string;
}

export interface TokenContent {
    exp: number;
    resource_access?: any;
    realm_access?: { roles?: string[] };
    sub: string;
}

export interface Token {
    token: string;
    clientId: string;
    header?: any;
    content: TokenContent;
    signature?: Buffer;
    signed?: string;

    isExpired: () => boolean;
    hasRole: (roleName: string) => boolean;
    hasApplicationRole: (appName: string, roleName: string) => boolean;
    hasRealmRole: (roleName: string) => boolean;
}

export type SpecHandler = (
    token: Token,
    request: Request,
    response: Response
) => boolean;

export interface Grant {
    access_token: Token;
    refresh_token: Token;
    id_token: Token;
    expires_in: number;
    token_type: string;
    __raw: string;

    update: (grant: Grant) => void;
    toString: () => string;
    isExpired: () => boolean;
    store: (request: Request, response: Response) => void;
}

export interface GrantManagerConfig {
    realmUrl: string;
    clientId: string;
    secret: string;
    publicKey: string;
    public: string;
    bearerOnly: string;
    notBefore: 0;
    rotation: any;
}

export interface GrantManager {
    new (config: GrantManagerConfig): GrantManager;

    obtainDirectly: (
        username: any,
        password: any,
        callback: any,
        scopeParam: any
    ) => any;

    obtainFromCode: (
        request: any,
        code: any,
        sessionId: any,
        sessionHost: any,
        callback: any
    ) => any;

    checkPermissions: (authzRequest: any, request: any, callback: any) => any;

    obtainFromClientCredentials: (callback: any, scopeParam: any) => any;

    ensureFreshness: (grant: any, callback: any) => any;

    validateAccessToken: (token: any, callback: any) => any;

    userInfo: (token: any, callback: any) => any;

    getAccount: () => any;

    isGrantRefreshable: (grant: any) => any;

    createGrant: (rawData: any) => Promise<any>;

    validateGrant: (grant: any) => Promise<any>;

    validateToken: (token: any, expectedType: any) => Promise<any>;
}
