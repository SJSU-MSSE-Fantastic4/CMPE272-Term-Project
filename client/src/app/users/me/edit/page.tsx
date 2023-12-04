import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Profile from "@/components/Profile";
import UserEdit from "@/components/user/UserEdit";

export default withPageAuthRequired(EditUserProfile as any, {
    returnTo: "/users/me",
});

async function EditUserProfile() {
    const session = await getSession();
    if (session && session.user) {
        const currentUser = session.user;
        const currentUserId = currentUser.sub;

        return <UserEdit />;
    }
}
