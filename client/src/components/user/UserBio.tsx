"use client";

import { getSession } from "@auth0/nextjs-auth0";
import { BiCalendar } from "react-icons/bi";
import Button from "../Button";
import { User } from "@/types/user";
import useFollows from "@/hooks/useFollows";
import { useRouter } from "next/navigation";

interface UserBioProps {
    user: User;
    followers: User[];
    following: User[];
    currentUserId?: string;
}

//If the current User Id is not provided we should assume that it is the current user
const UserBio = ({ user, currentUserId }: UserBioProps) => {
    const router = useRouter();

    const { isFollowing, followers, following, follow, unfollow } = useFollows(
        user.userId
    );

    const isCurrentUser = currentUserId === user.userId;
    const followerUrl = isCurrentUser
        ? "/users/me/followers"
        : `/users/${user.userId}/followers`;
    const followingUrl = isCurrentUser
        ? "/users/me/following"
        : `/users/${user.userId}/following`;

    return (
        <div className="border-b-[1px] border-neutral-800 pb-4">
            <div className="flex justify-end p-2">
                {isCurrentUser ? (
                    <Button
                        secondary
                        label="Edit"
                        onClick={() => {
                            router.push("/users/me/edit");
                        }}
                    />
                ) : (
                    <Button
                        onClick={() => {
                            isFollowing ? unfollow() : follow();
                        }}
                        label={isFollowing ? "Unfollow" : "Follow"}
                        secondary={!false}
                        outline={false}
                    />
                )}
            </div>
            <div className="mt-8 px-4">
                <div className="flex flex-col">
                    <p className="text-white text-2xl font-semibold">
                        {user.name}
                    </p>
                    <p className="text-md text-neutral-500">
                        @{user?.nickname}
                    </p>
                </div>
                <div className="flex flex-col mt-4">
                    <div
                        className="
                  flex 
                  flex-row 
                  items-center 
                  gap-2 
                  mt-4 
                  text-neutral-500
              "
                    >
                        <BiCalendar size={24} />
                        <p>Joined {user.updated_at}</p>
                    </div>
                </div>
                <div className="flex flex-row items-center mt-4 gap-6">
                    <div
                        onClick={() => {
                            router.push(followerUrl);
                        }}
                        className="flex flex-row items-center gap-1"
                    >
                        <p className="text-white">{followers?.length || 0}</p>
                        <p className="text-neutral-500 hover:underline">
                            Followers
                        </p>
                    </div>
                    <div
                        onClick={() => {
                            router.push(followingUrl);
                        }}
                        className="flex flex-row items-center gap-1 "
                    >
                        <p className="text-white">{following?.length || 0}</p>
                        <p className="text-neutral-500 hover:underline">
                            Following
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBio;
