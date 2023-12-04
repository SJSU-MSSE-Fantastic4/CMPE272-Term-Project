import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Profile from "@/components/Profile";

export default withPageAuthRequired(UserProfile as any, {
    returnTo: "/users/me",
});

interface ProfileProps {
    params: {
        userId: string;
        tab: string[];
    };
}

async function UserProfile({ params }: ProfileProps) {
    let activePage: "posts" | "following" | "followers" = "posts";
    if (params.tab && params.tab?.length > 0) {
        if (params.tab[0] == "following" || params.tab[0] == "followers") {
            activePage = params.tab[0];
        }
    }

    const session = await getSession();
    if (session && session.user) {
        const currentUser = session.user;
        const currentUserId = currentUser.sub;

        return (
            <Profile
                userId={params.userId}
                currentUserId={currentUserId}
                activePage={activePage}
            />
        );
    }
}
