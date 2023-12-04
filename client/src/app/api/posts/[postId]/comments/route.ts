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
    let body = await request.json();
    let content = {
        content: body.content,
    };

    const { postId } = context.params;
    if (accessToken) {
        return await fetch(api_url + `/post-service/post/${postId}/comment`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        });
    } else {
        throw new Error("Access token not found");
    }
});
