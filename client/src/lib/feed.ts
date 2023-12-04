import { UnpopulatedPost } from "@/types/post";
import { User } from "@/types/user";

export const fetchFeed = async (userId: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    try {
        const response = await fetch(api_url + `/feed-service/feed/${userId}`);

        if (response.status === 404) {
            return [];
        }
        const postIds = await response.json();
        let posts = await fetchPosts(postIds);

        return posts;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return [];
};

export const fetchPosts = async (postIds: string[]) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";
    try {
        const response = await fetch(
            api_url +
                `/post-service/posts?` +
                new URLSearchParams({ ids: postIds.join(",") })
        );
        const posts: UnpopulatedPost[] = await response.json();
        return posts;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return [];
};
