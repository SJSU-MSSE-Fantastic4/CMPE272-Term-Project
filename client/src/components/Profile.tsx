import UserBio from "@/components/user/UserBio";
import UserPosts from "@/components/user/UserPosts";
import { getFollowers, getFollowing, getUser, getUsersPosts } from "@/lib/user";
import UserHero from "@/components/user/UserHero";
import Header from "@/components/Header";

import UserList from "./user/UserList";

interface ProfileProps {
    userId: string;
    currentUserId: string;
    activePage?: "following" | "followers" | "posts";
}

async function Profile({
    userId,
    currentUserId,
    activePage = "posts",
}: ProfileProps) {
    const [user, followers, following, posts] = await Promise.all([
        getUser(userId),
        getFollowers(userId),
        getFollowing(userId),
        getUsersPosts(userId),
    ]);

    return (
        user &&
        followers &&
        following &&
        posts && (
            <div>
                <UserHero userId={user.userId} />
                <UserBio
                    user={user}
                    followers={followers}
                    following={following}
                    currentUserId={currentUserId}
                />

                {activePage === "posts" ? (
                    <UserPosts user={user} posts={posts} />
                ) : null}
                {activePage === "following" ? (
                    <div>
                        <Header label="Following" />
                        <div className="px-4">
                            <UserList users={following} />
                        </div>{" "}
                    </div>
                ) : null}

                {activePage === "followers" ? (
                    <div>
                        <Header label="Followers" />
                        <div className="px-4">
                            <UserList users={followers} />
                        </div>
                    </div>
                ) : null}
            </div>
        )
    );
}

export default Profile;
