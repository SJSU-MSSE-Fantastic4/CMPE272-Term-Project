import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
    AppRouteHandlerFn,
    getAccessToken,
    withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { likePost, unlikePost, userLikesPost } from "@/lib/post";

export const POST = withApiAuthRequired(async function postHandler(
    request: NextRequest,
    context: { params: { postId: string } }
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();
    const { postId } = context.params;
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
    request: NextRequest,
    context: { params: { postId: string } }
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();
    let postUnliked = false;
    const { postId } = context.params;
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
    request: NextRequest,
    context: { params: { postId: string } }
) {
    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();
    let postIsLiked = false;
    const { postId } = context.params;
    if (accessToken) {
        postIsLiked = await userLikesPost(postId, accessToken);
    } else {
        throw new Error("Access token not found");
    }

    return NextResponse.json({ likedByUser: postIsLiked });
});
