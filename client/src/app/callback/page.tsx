import {
    withPageAuthRequired,
    getSession,
    getAccessToken,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

import { redirect } from "next/navigation";

export default withPageAuthRequired(Callback as any, {
    returnTo: "/callback",
});

async function Callback(req: NextApiRequest, res: NextApiResponse) {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";
    const { accessToken } = await getAccessToken(req, res);

    try {
        // Add auth0 user to follower service
        fetch(api_url + "/follow-service/me", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (e) {
        console.error(e);
    }

    redirect("/");
}
