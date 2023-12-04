import { isPopulatedPost, isUnpopulatedPost } from "@/lib/post";
import { PopulatedPost, UnpopulatedPost } from "@/types/post";
import { useState, useEffect, useCallback } from "react";

const useLikes = (post: PopulatedPost | UnpopulatedPost) => {
    const [likes, setLikes] = useState({ count: 0, likedByUser: false });

    // Fetch initial likes state
    useEffect(() => {
        const fetchLikes = async () => {
            let count;
            if (isPopulatedPost(post)) {
                count = post.likes.length;
            } else if (isUnpopulatedPost(post)) {
                count = post.likesCount;
            } else {
                throw new Error("The provided post is an invalid type");
            }

            try {
                const response = await fetch(`/api/posts/${post._id}/like`);
                const data = await response.json();
                setLikes({ count: count, likedByUser: data.likedByUser });
            } catch (error) {
                console.error("Failed to fetch likes:", error);
            }
        };

        fetchLikes();
    }, [post]);

    // Handle liking a post
    const likePost = useCallback(async () => {
        try {
            let response = await fetch(`/api/posts/${post._id}/like`, {
                method: "POST",
            });
            if (response.status === 409 || response.status === 204) {
                setLikes((prevLikes) => ({
                    count: prevLikes.count + 1,
                    likedByUser: true,
                }));
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    }, [post]);

    // Handle unliking a post
    const unlikePost = useCallback(async () => {
        try {
            let response = await fetch(`/api/posts/${post._id}/like`, {
                method: "DELETE",
            });
            if (response.status === 204 || response.status === 404) {
                setLikes((prevLikes) => ({
                    count: prevLikes.count - 1,
                    likedByUser: false,
                }));
            }
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    }, [post]);

    return {
        likes,
        likePost,
        unlikePost,
    };
};

export default useLikes;
