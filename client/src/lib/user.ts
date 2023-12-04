import { UnpopulatedPost } from "@/types/post";
import { User } from "@/types/user";

export const getUser = async (userId: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";

    try {
        const response = await fetch(api_url + `/follow-service/${userId}`);
        const user: User = await response.json();

        return user;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export const getFollowers = async (userId: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";
    try {
        const response = await fetch(
            api_url + `/follow-service/${userId}/followers`
        );
        const followers: User[] = await response.json();

        return followers;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export const getFollowing = async (userId: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";
    try {
        const response = await fetch(
            api_url + `/follow-service/${userId}/following`
        );
        const following: User[] = await response.json();

        return following;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export const getUsersPosts = async (userId: string) => {
    let api_url = process.env.API_BASE_URL || "http://localhost:80";
    try {
        const response = await fetch(api_url + `/post-service/${userId}/posts`);
        const posts: UnpopulatedPost[] = await response.json();

        return posts;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};
