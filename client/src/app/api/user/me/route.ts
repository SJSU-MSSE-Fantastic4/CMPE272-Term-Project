import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async function getHandler(
    request: NextRequest
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();
    if (accessToken) {
        return await fetch(api_url + `/follow-service/me/`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        throw new Error("Access token not found");
    }
});

export const PATCH = async function getHandler(request: NextRequest) {
    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const managementBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
    if (!managementBaseUrl) throw new Error("Auth0 issuer base url not found");

    const managementUrl = managementBaseUrl + "/oauth/token";
    const body = {
        client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID || "",
        client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET || "",
        audience: process.env.AUTH0_MANAGEMENT_AUDIENCE || "",
        grant_type: "client_credentials",
    };
    console.log(managementUrl);
    console.log(body);
    const response = await fetch(managementUrl, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (response.status === 200) {
        const data = await response.json();
        const managementToken = data.access_token;

        const session = await getSession();
        if (session && session.user) {
            const { user } = session;

            const reqBody = await request.json();
            let name = reqBody.name;
            let nickname = reqBody.nickname;

            const patchResponse = await fetch(
                managementBaseUrl + "/api/v2/users/" + user.sub,
                {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${managementToken}`,
                    },
                    body: JSON.stringify({
                        name: name,
                        nickname: nickname,
                    }),
                }
            );

            if (patchResponse.status === 200) {
                return new NextResponse("", { status: 200 });
            } else {
                return new NextResponse("", { status: 500 });
            }
        }
    }

    return new NextResponse("", { status: 500 });
};
