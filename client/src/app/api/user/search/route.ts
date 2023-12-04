import { NextRequest, NextResponse } from "next/server";

export const GET = async function getHandler(request: NextRequest) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";

    return await fetch(
        api_url +
            `/follow-service/search/?` +
            new URLSearchParams({ search: searchQuery })
    );
};
