import { NextRequest, NextResponse } from "next/server";

export const GET = async function getHandler(
    request: NextRequest,
    context: { params: { userId: string } }
) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    // res is not actually NextApiResponse. But auth0/nextjs-auth0
    // doesnt work with with the new app directory structure
    const { userId } = context.params;
    return await fetch(api_url + `/follow-service/${userId}/`);
};
