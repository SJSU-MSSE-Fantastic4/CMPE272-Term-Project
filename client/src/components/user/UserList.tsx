"use client";

import Avatar from "../Avatar";
import { User } from "@/types/user";

const UserList = ({ users }: { users: User[] }) => {
    return (
        <div className="flex flex-col gap-6 mt-4">
            {users.map((user: User) => (
                <div key={user.userId} className="flex flex-row gap-4">
                    <Avatar userId={user.userId} />
                    <div className="flex flex-col">
                        <p className="text-white font-semibold text-sm">
                            {user.name}
                        </p>
                        <p className="text-neutral-400 text-sm">
                            @{user.nickname}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;
