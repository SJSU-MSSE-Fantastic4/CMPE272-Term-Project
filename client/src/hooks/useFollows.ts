import { PopulatedPost, UnpopulatedPost } from "@/types/post";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const useFollows = (userId: string) => {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch initial likes state
    useEffect(() => {
        const fetchFollowInfo = async () => {
            try {
                const response = await fetch(`/api/user/${userId}/follow`);
                if (response.status === 200) {
                    const data = await response.json();
                    setFollowers(data.followers);
                    setFollowing(data.following);
                    setIsFollowing(data.isFollowing);
                }
            } catch (error) {
                console.log(error);
                console.error("Failed to fetch likes:", error);
            }
        };

        fetchFollowInfo();
    }, [userId, isFollowing]);

    // Handle liking a post
    const follow = useCallback(async () => {
        try {
            let response = await fetch(`/api/user/${userId}/follow`, {
                method: "POST",
            });
            if (response.status === 204) {
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    }, [userId]);

    // Handle unliking a post
    const unfollow = useCallback(async () => {
        try {
            let response = await fetch(`/api/user/${userId}/follow`, {
                method: "DELETE",
            });
            if (response.status === 204) {
                setIsFollowing(false);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    }, [userId]);

    return {
        isFollowing,
        followers,
        following,
        follow,
        unfollow,
    };
};

export default useFollows;
