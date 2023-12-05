import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export const POST = withApiAuthRequired(async function postHandler(
    request: NextRequest
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();
    let body = await request.json();
    let content = {
        content: body.content,
    };

    // Parse the URL to get path parameters
    const pathname = request.nextUrl.pathname;
    const pathSegments = pathname.split("/");
    const postId = pathSegments[pathSegments.length - 2];

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
