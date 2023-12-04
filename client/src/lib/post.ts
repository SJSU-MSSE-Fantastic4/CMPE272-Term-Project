import { PopulatedPost, UnpopulatedPost } from "@/types/post";

export function isPopulatedPost(post: any): post is PopulatedPost {
    if (post) {
        // implement logic to determine if 'post' conforms to the 'PopulatedPost' structure
        if (post.comments === undefined || post.likes === undefined)
            return false;
        return post;
    }
    return false;
}

export function isUnpopulatedPost(post: any): post is UnpopulatedPost {
    // implement logic to determine if 'post' conforms to the 'PopulatedPost' structure
    if (
        typeof post.commentsCount != "number" ||
        typeof post.likesCount != "number"
    )
        return false;
    return post;
}

export const userLikesPost = async (postId: string, accessToken: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    try {
        const response = await fetch(
            api_url + `/post-service/post/${postId}/like`,
            {
                method: "Get",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (response.status === 204) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
};

export const likePost = async (postId: string, accessToken: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    try {
        const response = await fetch(
            api_url + `/post-service/post/${postId}/like`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (response.status === 204 || response.status === 409) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
};

export const unlikePost = async (postId: string, accessToken: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    try {
        const response = await fetch(
            api_url + `/post-service/post/${postId}/like`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (response.status === 204) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
};
