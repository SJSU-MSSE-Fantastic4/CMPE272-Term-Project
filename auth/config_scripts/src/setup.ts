import FusionAuthClient, {
    Tenant,
    User,
    GrantType,
    RefreshTokenExpirationPolicy,
    RefreshTokenUsagePolicy,
    MultiFactorLoginPolicy,
    IdentityProviderType,
    GoogleIdentityProvider,
    FacebookIdentityProvider,
} from "@fusionauth/typescript-client";
import { request } from "http";
require("dotenv").config();

const APPLICATION_ID = "55053a18-d1cb-4f34-8951-2d0b5d3982ab";
const GOOGLE_ID = "55053a18-d1cb-4f34-8951-2d0b5d3986ab";
const FACEBOOK_ID = "55053a18-d1cb-4f34-8951-2d0b5d3986ac";

const fusionAuthAPIKey = "87c688b6-df4a-4579-96da-e07188fb437a";
const RSA_KEY_ID = "356a6624-b33c-471a-b707-48bbfcfbc593";
const ADMIN_ID = "00000000-0000-0000-0000-000000000001";

//Create first admin account
if (!fusionAuthAPIKey) {
    console.log(
        "please set api key in the fusionauth_api_key environment variable"
    );
    process.exit(1);
}

async function getTenant(
    client: FusionAuthClient,
    tenantId?: string
): Promise<Tenant | undefined> {
    let tenant: Tenant | undefined;

    try {
        if (tenantId) {
            tenant = (await client.retrieveTenant(tenantId)).response.tenant;
        } else {
            const tenants = (await client.retrieveTenants()).response.tenants;
            if (tenants && tenants.length > 0) tenant = tenants[0];
            else console.log("No tenants found");
        }
    } catch (error) {
        console.log("couldn't find tenants " + JSON.stringify(error));
    }
    return tenant;
}

async function getUser(
    client: FusionAuthClient,
    userId: string
): Promise<User | undefined> {
    let user: User | undefined;

    try {
        user = (await client.retrieveUser(userId)).response.user;
    } catch (error) {
        console.log("couldn't find tenants " + JSON.stringify(error));
    }
    return user;
}

async function patchTenant(client: FusionAuthClient, tenant: Tenant) {
    try {
        const tenantId = tenant.id;
        if (tenantId == undefined) throw new Error("Tenant Id Not Found");

        const clientResponse = await client.patchTenant(tenantId, {
            tenant: {
                issuer: "http://localhost:9011",
                multiFactorConfiguration: {
                    loginPolicy: MultiFactorLoginPolicy.Required,
                },
            },
        });
    } catch (error) {
        console.log("couldn't update tenant " + JSON.stringify(error));
    }
}

// Create Admin User
async function makeUserGlobalAdmin(client: FusionAuthClient, user: User) {
    const ADMIN_UI_APPLICATION_ID = "3c219e58-ed0e-4b18-ad48-f4f92793ae32";
    //Get Admin User
    try {
        // if user is not already a global admin
        if (user.registrations == undefined || user.registrations.length == 0) {
            //Register Admin User to FusionAuth ADMIN UI Application as Global Admin
            try {
                const clientResponse = await client.register(ADMIN_ID, {
                    registration: {
                        applicationId: ADMIN_UI_APPLICATION_ID,
                        roles: ["admin"],
                    },
                });
            } catch (error) {
                console.log("couldn't register user " + JSON.stringify(error));
            }
        }
    } catch (error) {
        console.log("couldn't find user " + JSON.stringify(error));
    }
}

// Create API Gateway Application
async function setupApiGatewayApplication(client: FusionAuthClient) {
    try {
        const clientResponse = await client.createApplication(APPLICATION_ID, {
            application: {
                name: "API Gateway",
                oauthConfiguration: {
                    clientSecret: "KtDYXkzhrj7Ur8K_cCffRh8aUoadz44mYkOw57V3H94",
                    enabledGrants: [
                        GrantType.authorization_code,
                        GrantType.refresh_token,
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
                    refreshTokenExpirationPolicy:
                        RefreshTokenExpirationPolicy.Fixed,
                    refreshTokenUsagePolicy: RefreshTokenUsagePolicy.Reusable,
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
        });
    } catch (error) {
        console.log("couldn't create application " + JSON.stringify(error));
    }
}

async function setupGoogleIDP(client: FusionAuthClient) {
    try {
        let identityProvider: GoogleIdentityProvider = {
            enabled: true,
            type: IdentityProviderType.Google,
            applicationConfiguration: {
                "55053a18-d1cb-4f34-8951-2d0b5d3982ab": {
                    enabled: true,
                },
            },
            client_id:
                "1058247280652-5h877srgvm0ef0uplakjj737meigkuvf.apps.googleusercontent.com",
            client_secret: "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",
            scope: "openid profile email",
        };
        await client.createIdentityProvider(GOOGLE_ID, {
            identityProvider: identityProvider,
        });
    } catch (error) {
        console.log("couldn't create Google IDP " + JSON.stringify(error));
    }
}

async function setupFacebookIDP(client: FusionAuthClient) {
    try {
        let identityProvider: FacebookIdentityProvider = {
            enabled: true,
            type: IdentityProviderType.Facebook,
            applicationConfiguration: {
                "55053a18-d1cb-4f34-8951-2d0b5d3982ab": {
                    enabled: true,
                },
            },
            appId: "320114854075971",
            client_secret: "ebabf373bdb305ad3bd5dfc675742b72",
        };
        await client.createIdentityProvider(FACEBOOK_ID, {
            identityProvider: identityProvider,
        });
    } catch (error) {
        console.log("couldn't create Google IDP " + JSON.stringify(error));
    }
}

async function main(client: FusionAuthClient) {
    let tenant = await getTenant(client);
    tenant
        ? await patchTenant(client, tenant)
        : console.log("Tenant Not Found");

    let user = await getUser(client, ADMIN_ID);
    user
        ? await makeUserGlobalAdmin(client, user)
        : console.log("User Not Found");

    //await setupApiGatewayApplication(client);
    await setupGoogleIDP(client);
    await setupFacebookIDP(client);
}

const client = new FusionAuthClient(fusionAuthAPIKey, "http://localhost:9011");

main(client);
