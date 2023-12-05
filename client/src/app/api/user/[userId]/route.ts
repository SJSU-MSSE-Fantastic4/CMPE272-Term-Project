import { NextRequest, NextResponse } from "next/server";

export const GET = async function getHandler(
    request: NextRequest,
    context: { params: { userId: string } }
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure

    // Parse the URL to get path parameters
    const pathname = request.nextUrl.pathname;
    const pathSegments = pathname.split("/");
    const userId = pathSegments[pathSegments.length - 1];

    return await fetch(api_url + `/follow-service/${userId}/`);
};
