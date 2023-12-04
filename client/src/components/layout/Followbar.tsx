"use client";

import Avatar from "../Avatar";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import UserList from "@/components/user/UserList";

const FollowBar = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [debouncedSearch] = useDebounce(search, 1000);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(
                `/api/user/search/?` +
                    new URLSearchParams({ search: debouncedSearch })
            );
            const searchedUsers = await response.json();
            setUsers(searchedUsers);
        };

        fetchUsers();
    }, [debouncedSearch]);

    return (
        users && (
            <div className="px-6 py-4 hidden lg:block">
                <div className="bg-neutral-800 rounded-xl p-4">
                    <h2
                        onClick={() => console.log(users)}
                        className="text-white text-xl font-semibold"
                    >
                        Who to follow
                    </h2>
                    <div className="flex flex-row items-center gap-4 mt-4">
                        <input
                            type="text"
                            placeholder="Search for users"
                            className="
                bg-neutral-700
                text-white
                rounded-lg
                p-2
                w-full
                outline-none
                border-none
                focus:ring-2
                focus:ring-sky-500
                focus:border-transparent
                "
                            onChange={(event) => {
                                setSearch(event.target.value);
                            }}
                        />
                    </div>
                    <UserList users={users} />
                </div>
            </div>
        )
    );
};

export default FollowBar;
