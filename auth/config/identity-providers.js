let GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID";
let GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET";

let FACEBOOK_CLIENT_ID = "FACEBOOK_CLIENT_ID";
let FACEBOOK_CLIENT_SECRET = "FACEBOOK_CLIENT_SECRET";

let googleIDP = {
    alias: "google",
    internalId: "86436789-aade-488f-bd88-76168316d952",
    providerId: "google",
    enabled: true,
    updateProfileFirstLoginMode: "on",
    trustEmail: true,
    storeToken: false,
    addReadTokenRoleOnCreate: false,
    authenticateByDefault: false,
    linkOnly: false,
    firstBrokerLoginFlowAlias: "first broker login",
    config: {
        hideOnLoginPage: "false",
        clientId: GOOGLE_CLIENT_ID,
        acceptsPromptNoneForwardFromClient: "false",
        disableUserInfo: "false",
        filteredByClaim: "false",
        syncMode: "IMPORT",
        clientSecret: GOOGLE_CLIENT_SECRET,
        defaultScope: "openid profile email",
    },
};

let facebookIDP = {
    alias: "facebook",
    internalId: "2a7bb400-2b4e-4d25-846d-def1f9543687",
    providerId: "facebook",
    enabled: true,
    updateProfileFirstLoginMode: "on",
    trustEmail: false,
    storeToken: false,
    addReadTokenRoleOnCreate: false,
    authenticateByDefault: false,
    linkOnly: false,
    firstBrokerLoginFlowAlias: "first broker login",
    config: {
        clientSecret: FACEBOOK_CLIENT_SECRET,
        clientId: FACEBOOK_CLIENT_ID,
    },
};

let identityProviders = [googleIDP, facebookIDP];

export { identityProviders };
