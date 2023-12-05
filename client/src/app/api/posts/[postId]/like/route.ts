import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { userLikesPost } from "@/lib/post";

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
    const postId = pathSegments[pathSegments.length - 2];

    if (accessToken) {
        return await fetch(api_url + `/post-service/post/${postId}/like`, {
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
    const postId = pathSegments[pathSegments.length - 2];

    if (accessToken) {
        return await fetch(api_url + `/post-service/post/${postId}/like`, {
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
    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();
    let postIsLiked = false;

    // Parse the URL to get path parameters
    const pathname = request.nextUrl.pathname;
    const pathSegments = pathname.split("/");
    const postId = pathSegments[pathSegments.length - 2];

    if (accessToken) {
        postIsLiked = await userLikesPost(postId, accessToken);
    } else {
        throw new Error("Access token not found");
    }

    return NextResponse.json({ likedByUser: postIsLiked });
});
