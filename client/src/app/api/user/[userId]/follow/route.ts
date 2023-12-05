import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export const POST = withApiAuthRequired(async function postHandler(
    request: NextRequest
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();

    // Parse the URL to get path parameters
    const pathname = request.nextUrl.pathname;
    const pathSegments = pathname.split("/");
    const userId = pathSegments[pathSegments.length - 2];

    if (accessToken) {
        return await fetch(api_url + `/follow-service/me/follow/${userId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        throw new Error("Access token not found");
    }
});

export const DELETE = withApiAuthRequired(async function deleteHandler(
    request: NextRequest
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";
    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();

    // Parse the URL to get path parameters
    const pathname = request.nextUrl.pathname;
    const pathSegments = pathname.split("/");
    const userId = pathSegments[pathSegments.length - 2];

    if (accessToken) {
        return await fetch(api_url + `/follow-service/me/follow/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        throw new Error("Access token not found");
    }
});

export const GET = withApiAuthRequired(async function getHandler(
    request: NextRequest
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    const session = await getSession();
    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();

    // Parse the URL to get path parameters
    const pathname = request.nextUrl.pathname;
    const pathSegments = pathname.split("/");
    const userId = pathSegments[pathSegments.length - 2];

    if (accessToken && session && session.user) {
        const { user } = session;
        const [followingRes, followersRes] = await Promise.all([
            fetch(api_url + `/follow-service/${userId}/following/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            fetch(api_url + `/follow-service/${userId}/followers/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        ]);
        const [following, followers] = await Promise.all([
            followingRes.json(),
            followersRes.json(),
        ]);

        let isFollowing = false;
        for (let follower of followers) {
            if (follower.userId === user.sub) {
                isFollowing = true;
                break;
            }
        }

        let response = new NextResponse(
            JSON.stringify({
                isFollowing: isFollowing,
                following: following,
                followers: followers,
            })
        );
        response.headers.set("Content-Type", "application/json");

        return response;
    } else {
        throw new Error("Access token not found");
    }
});
