"use client";

import PostItem from "@/components/posts/PostItem";
import { User } from "@/types/user";
import { UnpopulatedPost } from "@/types/post";

interface UserPostsProps {
    user: User;
    posts: UnpopulatedPost[];
}

const UserPosts = ({ user, posts = [] }: UserPostsProps) => {
    return (
        <>
            {posts
                .slice(0)
                .reverse()
                .map((post) => (
                    <PostItem
                        key={post._id}
                        post={post}
                        postedByCurrenyUser={user.userId == post.authorId}
                    />
                ))}
        </>
    );
};

export default UserPosts;
