"use client";

import Button from "../Button";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";

//If the current User Id is not provided we should assume that it is the current user
const UserEdit = () => {
    const router = useRouter();
    const user = useCurrentUser();

    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        setName(user?.name || "");
        setNickname(user?.nickname || "");
    }, [user]);

    return (
        <div>
            <label>Edit Name</label>
            <Input
                placeholder="Name"
                onChange={(e) => {
                    setName(e.target.value);
                }}
                value={name}
                disabled={false}
            />
            <label>Edit Edit Username</label>
            <Input
                placeholder="Username"
                onChange={(e) => {
                    setNickname(e.target.value);
                }}
                value={nickname}
                disabled={false}
            />

            <Button
                label="Save"
                onClick={async () => {
                    const response = await fetch(`/api/user/me`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            nickname,
                        }),
                    });
                    if (response.ok) {
                        router.push("/callback");
                    }
                }}
            />
        </div>
    );
};

export default UserEdit;
