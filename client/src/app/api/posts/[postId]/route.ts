import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

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
    const postId = pathSegments[pathSegments.length - 1];

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
