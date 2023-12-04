"use client";

import PostItem from "@/components/posts/PostItem";
import { ClipLoader } from "react-spinners";
import { getUser, getUsersPosts } from "@/lib/user";
import { User } from "@/types/user";
import { UnpopulatedPost } from "@/types/post";

interface UserPostsProps {
    user: User;
    posts: UnpopulatedPost[];
}

const UserPosts = ({ user, posts }: UserPostsProps) => {
    return (
        <>
            {posts.map((post) => (
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
