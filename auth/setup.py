import requests
import json

ADMIN_NAME = 'admin'
ADMIN_PASSWORD = 'admin'
AUTH_HOST = 'http://localhost:8080'
MICROBLOG_REALM_ID='55053a18-d1cb-4f34-8951-2d0b5d3982ab'
MICROBLOG_REALM_NAME='microblog'
GOOGLE_CLIENT_ID ='1058247280652-5h877srgvm0ef0uplakjj737meigkuvf.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = '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'


def getAdminAuthToken():
    # Authenticate and get token
    url = 'http://localhost:8080/realms/master/protocol/openid-connect/token'
    data = {
        'client_id': 'admin-cli',
        'username': ADMIN_NAME,
        'password': ADMIN_PASSWORD,
        'grant_type': 'password'
    }
    response = requests.post(url, data=data)

    token = response.json()['access_token']

    return token

def createRealm(token):
    # Use the token to create a new realm
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
    data = {
        'id': MICROBLOG_REALM_ID,
        'realm': MICROBLOG_REALM_NAME,
        'enabled': True,
        "registrationAllowed": True,
        "registrationEmailAsUsername": True,
        "rememberMe": True,
        "verifyEmail": False,
        "loginWithEmailAllowed": True,
        "duplicateEmailsAllowed": False,
        "resetPasswordAllowed": True,
    }

    response = requests.post('http://localhost:8080/admin/realms', json=data, headers=headers)

    # Check if the realm was created successfully
    if response.status_code == 201:
        print("Realm created successfully!")
    else:
        print("Failed to create realm!")
        print(json.dumps(response.json(), indent=4))


def createPostClient(token):
    # Use the token to create a new realm
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
    data = {
        "clientId": "post-microservice",
        "name": "post-service",
        "description": "",
        "rootUrl": "http://localhost:5000",
        "adminUrl": "http://localhost:5000",
        "baseUrl": "http://localhost:5000",
        "surrogateAuthRequired": False,
        "enabled": True,
        "alwaysDisplayInConsole": False,
        "clientAuthenticatorType": "client-secret",
        "secret": "qD8Yaa2nBvv93TtpJjmZbKgArkOEw30J",
        "redirectUris": [
            "http://localhost:5000/redirect",
            "http://localhost:5000/callback"
        ],
        "webOrigins": [
            "*",
            "http://localhost:3000"
        ],
        "notBefore": 0,
        "bearerOnly": False,
        "consentRequired": False,
        "standardFlowEnabled": True,
        "implicitFlowEnabled": False,
        "directAccessGrantsEnabled": True,
        "serviceAccountsEnabled": True,
        "authorizationServicesEnabled": True,
        "publicClient": False,
        "frontchannelLogout": True,
        "protocol": "openid-connect",
        "attributes": {
            "oidc.ciba.grant.enabled": "False",
            "oauth2.device.authorization.grant.enabled": "False",
            "client.secret.creation.time": "1698869131",
            "backchannel.logout.session.required": "True",
            "backchannel.logout.revoke.offline.tokens": "False"
        },
        "authenticationFlowBindingOverrides": {},
        "fullScopeAllowed": True,
        "nodeReRegistrationTimeout": -1,
        "protocolMappers": [
            {
            "name": "Client ID",
            "protocol": "openid-connect",
            "protocolMapper": "oidc-usersessionmodel-note-mapper",
            "consentRequired": False,
            "config": {
                "user.session.note": "client_id",
                "id.token.claim": "True",
                "access.token.claim": "True",
                "claim.name": "client_id",
                "jsonType.label": "String"
            }
            },
            {
            "name": "Client IP Address",
            "protocol": "openid-connect",
            "protocolMapper": "oidc-usersessionmodel-note-mapper",
            "consentRequired": False,
            "config": {
                "user.session.note": "clientAddress",
                "id.token.claim": "True",
                "access.token.claim": "True",
                "claim.name": "clientAddress",
                "jsonType.label": "String"
            }
            },
            {
            "name": "Client Host",
            "protocol": "openid-connect",
            "protocolMapper": "oidc-usersessionmodel-note-mapper",
            "consentRequired": False,
            "config": {
                "user.session.note": "clientHost",
                "id.token.claim": "True",
                "access.token.claim": "True",
                "claim.name": "clientHost",
                "jsonType.label": "String"
            }
            }
        ],
        "defaultClientScopes": [
            "web-origins",
            "acr",
            "profile",
            "roles",
            "email"
        ],
        "optionalClientScopes": [
            "address",
            "phone",
            "offline_access",
            "microprofile-jwt"
        ],
        "access": {
            "view": True,
            "configure": True,
            "manage": True
        }
    }

    response = requests.post('http://localhost:8080/admin/realms/microblog/clients', json=data, headers=headers)

    # Check if the realm was created successfully
    if response.status_code == 201:
        print("Client created successfully!")
    else:
        print("Failed to create Client!")
        print(json.dumps(response.json(), indent=4))

def createTestUser(token):
    # Use the token to create a new realm
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
    data = {
        "email": "test@example.com",
        "emailVerified": True,
        "username": "test",
        "enabled": True,
        "credentials": [
            {
                "type": "password",
                "value": "password",
                "temporary": False
            }
        ]
    }

    response = requests.post('http://localhost:8080/admin/realms/microblog/users', json=data, headers=headers)

    # Check if the realm was created successfully
    if response.status_code == 201:
        print("User created successfully!")
    else:
        print("Failed to create User!")
        print(json.dumps(response.json(), indent=4))


def listRealms(token):
    headers = {
        'Authorization': 'Bearer ' + token,
    }

    response = requests.get('http://localhost:8080/admin/realms', headers=headers)
    return response.json()

def createGoogleIDP(token):
    #Add Google as IDP
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    data = {
        "alias": "google",
        "providerId": "google",
        "enabled": True,
        "updateProfileFirstLoginMode": "on",
        "trustEmail": True,
        "storeToken": False,
        "addReadTokenRoleOnCreate": False,
        "authenticateByDefault": False,
        "linkOnly": False,
        "config": {
            "clientId": "1058247280652-5h877srgvm0ef0uplakjj737meigkuvf.apps.googleusercontent.com",
            "clientSecret": "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",
            "defaultScope": "openid profile email"
        }
    }

    url = 'http://localhost:8080/admin/realms/twitterclone/identity-provider/instances'
    response = requests.post(url, json=data, headers=headers)
    print(response.status_code)
    return response



token = getAdminAuthToken()
createRealm(token)
createPostClient(token)
createTestUser(token)

#res = createGoogleIDP(token)







