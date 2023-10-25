"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_client_1 = __importStar(require("@fusionauth/typescript-client"));
require("dotenv").config();
var APPLICATION_ID = "55053a18-d1cb-4f34-8951-2d0b5d3982ab";
var GOOGLE_ID = "55053a18-d1cb-4f34-8951-2d0b5d3986ab";
var FACEBOOK_ID = "55053a18-d1cb-4f34-8951-2d0b5d3986ac";
var fusionAuthAPIKey = "87c688b6-df4a-4579-96da-e07188fb437a";
var RSA_KEY_ID = "356a6624-b33c-471a-b707-48bbfcfbc593";
var ADMIN_ID = "00000000-0000-0000-0000-000000000001";
//Create first admin account
if (!fusionAuthAPIKey) {
    console.log("please set api key in the fusionauth_api_key environment variable");
    process.exit(1);
}
function getTenant(client, tenantId) {
    return __awaiter(this, void 0, void 0, function () {
        var tenant, tenants, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!tenantId) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.retrieveTenant(tenantId)];
                case 1:
                    tenant = (_a.sent()).response.tenant;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, client.retrieveTenants()];
                case 3:
                    tenants = (_a.sent()).response.tenants;
                    if (tenants && tenants.length > 0)
                        tenant = tenants[0];
                    else
                        console.log("No tenants found");
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log("couldn't find tenants " + JSON.stringify(error_1));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, tenant];
            }
        });
    });
}
function getUser(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.retrieveUser(userId)];
                case 1:
                    user = (_a.sent()).response.user;
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.log("couldn't find tenants " + JSON.stringify(error_2));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, user];
            }
        });
    });
}
function patchTenant(client, tenant) {
    return __awaiter(this, void 0, void 0, function () {
        var tenantId, clientResponse, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    tenantId = tenant.id;
                    if (tenantId == undefined)
                        throw new Error("Tenant Id Not Found");
                    return [4 /*yield*/, client.patchTenant(tenantId, {
                            tenant: {
                                issuer: "http://localhost:9011",
                                multiFactorConfiguration: {
                                    loginPolicy: typescript_client_1.MultiFactorLoginPolicy.Required,
                                },
                            },
                        })];
                case 1:
                    clientResponse = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.log("couldn't update tenant " + JSON.stringify(error_3));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Create Admin User
function makeUserGlobalAdmin(client, user) {
    return __awaiter(this, void 0, void 0, function () {
        var ADMIN_UI_APPLICATION_ID, clientResponse, error_4, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ADMIN_UI_APPLICATION_ID = "3c219e58-ed0e-4b18-ad48-f4f92793ae32";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!(user.registrations == undefined || user.registrations.length == 0)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, client.register(ADMIN_ID, {
                            registration: {
                                applicationId: ADMIN_UI_APPLICATION_ID,
                                roles: ["admin"],
                            },
                        })];
                case 3:
                    clientResponse = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.log("couldn't register user " + JSON.stringify(error_4));
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    console.log("couldn't find user " + JSON.stringify(error_5));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Create API Gateway Application
function setupApiGatewayApplication(client) {
    return __awaiter(this, void 0, void 0, function () {
        var clientResponse, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.createApplication(APPLICATION_ID, {
                            application: {
                                name: "API Gateway",
                                oauthConfiguration: {
                                    clientSecret: "KtDYXkzhrj7Ur8K_cCffRh8aUoadz44mYkOw57V3H94",
                                    enabledGrants: [
                                        typescript_client_1.GrantType.authorization_code,
                                        typescript_client_1.GrantType.refresh_token,
                                    ],
                                    generateRefreshTokens: true,
                                    requireClientAuthentication: true,
                                    authorizedRedirectURLs: [
                                        "http://localhost:3000/oauth-callback",
                                    ],
                                    logoutURL: "http://localhost:3000/logout",
                                },
                                jwtConfiguration: {
                                    enabled: true,
                                    timeToLiveInSeconds: 3600,
                                    refreshTokenTimeToLiveInMinutes: 43200,
                                    refreshTokenExpirationPolicy: typescript_client_1.RefreshTokenExpirationPolicy.Fixed,
                                    refreshTokenUsagePolicy: typescript_client_1.RefreshTokenUsagePolicy.Reusable,
                                },
                                registrationConfiguration: {
                                    enabled: true,
                                    firstName: {
                                        enabled: true,
                                        required: false,
                                    },
                                    lastName: {
                                        enabled: true,
                                        required: false,
                                    },
                                },
                                roles: [
                                    {
                                        name: "admin",
                                        description: "Admin Role",
                                        isSuperRole: true,
                                    },
                                    {
                                        name: "user",
                                        description: "User Role",
                                        isDefault: true,
                                    },
                                ],
                            },
                        })];
                case 1:
                    clientResponse = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.log("couldn't create application " + JSON.stringify(error_6));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setupGoogleIDP(client) {
    return __awaiter(this, void 0, void 0, function () {
        var identityProvider, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    identityProvider = {
                        enabled: true,
                        type: typescript_client_1.IdentityProviderType.Google,
                        applicationConfiguration: {
                            "55053a18-d1cb-4f34-8951-2d0b5d3982ab": {
                                enabled: true,
                            },
                        },
                        client_id: "1058247280652-5h877srgvm0ef0uplakjj737meigkuvf.apps.googleusercontent.com",
                        client_secret: "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",
                        scope: "openid profile email",
                    };
                    return [4 /*yield*/, client.createIdentityProvider(GOOGLE_ID, {
                            identityProvider: identityProvider,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.log("couldn't create Google IDP " + JSON.stringify(error_7));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setupFacebookIDP(client) {
    return __awaiter(this, void 0, void 0, function () {
        var identityProvider, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    identityProvider = {
                        enabled: true,
                        type: typescript_client_1.IdentityProviderType.Facebook,
                        applicationConfiguration: {
                            "55053a18-d1cb-4f34-8951-2d0b5d3982ab": {
                                enabled: true,
                            },
                        },
                        appId: "320114854075971",
                        client_secret: "ebabf373bdb305ad3bd5dfc675742b72",
                    };
                    return [4 /*yield*/, client.createIdentityProvider(FACEBOOK_ID, {
                            identityProvider: identityProvider,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    console.log("couldn't create Google IDP " + JSON.stringify(error_8));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main(client) {
    return __awaiter(this, void 0, void 0, function () {
        var tenant, _a, user, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getTenant(client)];
                case 1:
                    tenant = _c.sent();
                    if (!tenant) return [3 /*break*/, 3];
                    return [4 /*yield*/, patchTenant(client, tenant)];
                case 2:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = console.log("Tenant Not Found");
                    _c.label = 4;
                case 4:
                    _a;
                    return [4 /*yield*/, getUser(client, ADMIN_ID)];
                case 5:
                    user = _c.sent();
                    if (!user) return [3 /*break*/, 7];
                    return [4 /*yield*/, makeUserGlobalAdmin(client, user)];
                case 6:
                    _b = _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _b = console.log("User Not Found");
                    _c.label = 8;
                case 8:
                    _b;
                    //await setupApiGatewayApplication(client);
                    return [4 /*yield*/, setupGoogleIDP(client)];
                case 9:
                    //await setupApiGatewayApplication(client);
                    _c.sent();
                    return [4 /*yield*/, setupFacebookIDP(client)];
                case 10:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var client = new typescript_client_1.default(fusionAuthAPIKey, "http://localhost:9011");
main(client);
