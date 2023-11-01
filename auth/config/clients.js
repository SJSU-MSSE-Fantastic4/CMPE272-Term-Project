let InterfaceRootURL = "http://MICROBLOG_INTERFACE_ROOT";
let InterfaceHomeURL = "http://MICROBLOG_INTERFACE_ROOT/home";
let InterfaceRedirectUris = [
    "http://MICROBLOG_INTERFACE_ROOT/redirect",
    "http://MICROBLOG_INTERFACE_ROOT/callback",
];

let ServiceRootURL = "http://MICROBLOG_Service_ROOT";
let ServiceHomeURL = "http://MICROBLOG_Service_ROOT/home";
let ServiceRedirectUris = [
    "http://MICROBLOG_Service_ROOT/redirect",
    "http://MICROBLOG_Service_ROOT/callback",
];

let interfaceClient = {
    id: "decac27a-1b5f-4412-b357-b77e28b3a92e",
    clientId: "microblog-interface",
    name: "",
    description: "",
    rootUrl: InterfaceRootURL,
    adminUrl: InterfaceRootURL,
    baseUrl: InterfaceHomeURL,
    surrogateAuthRequired: false,
    enabled: true,
    alwaysDisplayInConsole: true,
    clientAuthenticatorType: "client-secret",
    redirectUris: InterfaceRedirectUris,
    webOrigins: [InterfaceRootURL],
    notBefore: 0,
    bearerOnly: false,
    consentRequired: false,
    standardFlowEnabled: true,
    implicitFlowEnabled: false,
    directAccessGrantsEnabled: true,
    serviceAccountsEnabled: false,
    publicClient: true,
    frontchannelLogout: true,
    protocol: "openid-connect",
    attributes: {
        "oidc.ciba.grant.enabled": "false",
        "post.logout.redirect.uris": InterfaceRootURL + "*",
        "oauth2.device.authorization.grant.enabled": "false",
        "backchannel.logout.session.required": "true",
        "backchannel.logout.revoke.offline.tokens": "false",
    },
    authenticationFlowBindingOverrides: {},
    fullScopeAllowed: true,
    nodeReRegistrationTimeout: -1,
    defaultClientScopes: ["web-origins", "acr", "roles", "profile", "email"],
    optionalClientScopes: [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt",
    ],
};

let serviceClient = {
    id: "75f2f475-46ec-4714-9122-298fa64710bf",
    clientId: "microblog-service",
    name: "",
    description: "",
    rootUrl: ServiceRootURL,
    adminUrl: ServiceRootURL,
    baseUrl: ServiceHomeURL,
    surrogateAuthRequired: false,
    enabled: true,
    alwaysDisplayInConsole: false,
    clientAuthenticatorType: "client-secret",
    secret: "**********",
    redirectUris: ServiceRedirectUris,
    webOrigins: [ServiceRootURL],
    notBefore: 0,
    bearerOnly: false,
    consentRequired: false,
    standardFlowEnabled: true,
    implicitFlowEnabled: false,
    directAccessGrantsEnabled: true,
    serviceAccountsEnabled: false,
    publicClient: false,
    frontchannelLogout: true,
    protocol: "openid-connect",
    attributes: {
        "oidc.ciba.grant.enabled": "false",
        "client.secret.creation.time": "1698182067",
        "backchannel.logout.session.required": "true",
        "post.logout.redirect.uris": "+",
        "oauth2.device.authorization.grant.enabled": "false",
        "backchannel.logout.revoke.offline.tokens": "false",
    },
    authenticationFlowBindingOverrides: {},
    fullScopeAllowed: true,
    nodeReRegistrationTimeout: -1,
    defaultClientScopes: ["web-origins", "acr", "roles", "profile", "email"],
    optionalClientScopes: [
        "address",
        "phone",
        "offline_access",
        "microprofile-jwt",
    ],
};

export { interfaceClient, serviceClient };
