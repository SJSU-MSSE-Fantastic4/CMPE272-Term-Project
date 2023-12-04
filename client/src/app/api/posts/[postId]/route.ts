import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
    AppRouteHandlerFn,
    getAccessToken,
    withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = withApiAuthRequired(async function deleteHandler(
    request: NextRequest,
    context: { params: { postId: string } }
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { accessToken } = await getAccessToken();
    const { postId } = context.params;
    if (accessToken) {
        console.log("Deleteing post: " + postId);

        let deleteResponse = await fetch(
            api_url + `/post-service/me/post/${postId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return deleteResponse;
    } else {
        throw new Error("Access token not found");
    }
});
