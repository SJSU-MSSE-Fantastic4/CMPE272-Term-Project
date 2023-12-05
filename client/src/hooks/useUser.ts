import { PopulatedPost, UnpopulatedPost } from "@/types/post";
import { User } from "@/types/user";
import { useState, useEffect, useCallback } from "react";

const useUser = (userId: string) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    // Fetch initial likes state
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/user/${userId}`);

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch likes:", error);
            }
        };

        fetchUser();
    }, [userId]);

    return user;
};

export default useUser;
