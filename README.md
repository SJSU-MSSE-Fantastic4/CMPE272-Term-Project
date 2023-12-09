# CMPE272-Term-Project

## Local Docker Compose Deployment Steps

#### Prerequisites

-   A computer with Docker installed - [Install Docker](https://docs.docker.com/get-docker/)
-   A OpenAI API Key - [Create New API Key](https://beta.openai.com/account/api-keys)
    -   This is required for the translation feature. Without it translations will not work

#### Steps

1.  Clone this git repository.
2.  Inside the repository, create a .env file with the following content in the deployments/local-infra/ folder
    ensuring that you add your OpenAI API Key

    ```
    OPENAI_API_KEY=<YOUR OPENAI API KEY>

    # Auth0 API
    AUTH0_SERVER_URL=https://dev-2ttpe83i3lninaj8.us.auth0.com
    AUTH0_INTERFACE_CLIENT_ID=ZRU5C0kWtPWbs41hBPgFecP7I1OyBJ0z

    ### CLient
    AUTH0_SECRET='7519ba492f9d3874fb7dcfc0b96ecab33bb3deb92956426d925abaf52b63b264'
    AUTH0_BASE_URL='http://localhost:3000'
    AUTH0_ISSUER_BASE_URL='https://dev-2ttpe83i3lninaj8.us.auth0.com'
    AUTH0_CLIENT_ID='kWNrYmHvlTsgLF3DWOBnwfn1xRYfuzB2'
    AUTH0_CLIENT_SECRET='yW7rTjQPNVj6jp90VMMIld2yBMNy7OPVMBITtbrJ9Eyf840ksUoFOBgHMNxiMYgp'

    AUTH0_MANAGEMENT_CLIENT_ID='3O0CrGgMyr3E7PTW323B6POQmrvNle02'
    AUTH0_MANAGEMENT_CLIENT_SECRET='UDgsFWcbEhrbi97iFeKcbNm4lRVdjkmxX8rD2vIFwvRQ0ObKQS8-u1lG66OnRlfg'
    AUTH0_MANAGEMENT_AUDIENCE="https://dev-2ttpe83i3lninaj8.us.auth0.com/api/v2/"
    ```

3.  Navigate to deployments/local-infra/ and run docker compose up

    ```
    $ cd deployments/local-infra
    $ docker compose up -d
    ```

4.  When the containers have finished starting, navigate to http://localhost:3000 in your browser.

Note: You may need to try running it multiple times. Depending on the startup order of the containers, sometimes certain microservices are not accessible through the NGINX gateway, despite being running and accessible, causing a very buggy frontend. If this occurs run

```
docker compose down
```

wait for all the services to shut down, then run again

```
docker compose up -d
```
