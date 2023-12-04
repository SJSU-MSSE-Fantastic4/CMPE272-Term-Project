import {
    withPageAuthRequired,
    getSession,
    getAccessToken,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import PostFeed from "@/components/posts/PostFeed";
import Header from "@/components/Header";
import Form from "@/components/Form";
import { getUser } from "@/lib/user";

export default withPageAuthRequired(Feed as any, {
    returnTo: "/callback",
});

async function Feed(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession();

    if (session && session.user) {
        const { user } = session;
        const currentUser = await getUser(user.sub);

        return (
            currentUser && (
                <>
                    <Header label="Home" />
                    <Form placeholder="What's happening?" />
                    <Header label="Feed" />
                    <PostFeed userId={user.sub} />
                </>
            )
        );
    }
}
