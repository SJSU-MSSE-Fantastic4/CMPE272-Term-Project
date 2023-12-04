import { PopulatedPost, UnpopulatedPost } from "@/types/post";
import { User } from "@/types/user";
import { useState, useEffect, useCallback } from "react";

const useCurrentUser = () => {
    const [user, setUser] = useState<User | undefined>(undefined);

    // Fetch initial likes state
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/user/me`);

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch likes:", error);
            }
        };

        fetchUser();
    }, []);

    return user;
};

export default useCurrentUser;
