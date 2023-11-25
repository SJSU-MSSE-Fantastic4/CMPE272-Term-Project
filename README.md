# CMPE272-Term-Project

### Local Docker Deployment Steps

You will need to add keycloak to your hosts files

On wsl/linux:

```
sudo nano /etc/hosts
```

Add the following to that file

```
127.0.0.1   keycloak
```

On windows

We currently have to syncronize our users with auth0 every so often. This causes slight inconsistencies, and is a performance problem.
We could use Auth0 post login flows to fix this, however because we are only deploying locally, auth0 cannot access the follow service.

TODO: Change Get Feed to get feed with users posts, and User information related to each post.

    - Create endpoint in follow service to get user by id.
