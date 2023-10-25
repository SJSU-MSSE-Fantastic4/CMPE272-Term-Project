import requests
import json

ADMIN_NAME = 'admin'
ADMIN_PASSWORD = 'admin'
AUTH_HOST = 'http://localhost:8080'
TWITTERCLONE_REALM_ID='55053a18-d1cb-4f34-8951-2d0b5d3982ab'
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
        'Authorization': 'Bearer ' + token,@na
        'Content-Type': 'application/json'
    }
    data = {
        'id': TWITTERCLONE_REALM_ID,
        'realm': 'twitterclone',
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
print(token)
res = listRealms(token)
#res = createGoogleIDP(token)

print(json.dumps(res, indent=4))