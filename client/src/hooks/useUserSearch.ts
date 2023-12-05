import { PopulatedPost, UnpopulatedPost } from "@/types/post";
import { User } from "@/types/user";
import { useState, useEffect, useCallback } from "react";

const useUserSearch = (searchQuery = "") => {
    const [users, setUsers] = useState<User[]>([]);

    // Fetch initial likes state
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `/api/user/search/?` +
                        new URLSearchParams({ search: searchQuery })
                );

                const data = await response.json();
                console.log(data);
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch likes:", error);
            }
        };

        fetchUser();
    }, [searchQuery]);

    return users;
};

export default useUserSearch;
