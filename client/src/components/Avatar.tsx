"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

interface AvatarProps {
    userId: string;
    picture?: string;
    isLarge?: boolean;
    hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
    userId,
    picture,
    isLarge,
    hasBorder,
}) => {
    const router = useRouter();
    const user = useUser(userId);

    const openProfile = (event: React.MouseEvent) => {
        event.stopPropagation();
        router.push(`/users/${userId}`);
    };

    return (
        <div
            className={`
        ${hasBorder ? "border-4 border-black" : ""}
        ${isLarge ? "h-32" : "h-12"}
        ${isLarge ? "w-32" : "w-12"}
        rounded-full 
        hover:opacity-90 
        transition 
        cursor-pointer
        relative
      `}
        >
            {user?.picture ? (
                <Image
                    unoptimized
                    onClick={openProfile}
                    fill
                    sizes="100%"
                    style={{
                        objectFit: "cover",
                        borderRadius: "100%",
                    }}
                    alt="Avatar"
                    src={user.picture}
                />
            ) : (
                <Image
                    unoptimized
                    onClick={openProfile}
                    fill
                    sizes="100%"
                    style={{
                        objectFit: "cover",
                        borderRadius: "100%",
                    }}
                    alt="Avatar"
                    src="/images/placeholder.png"
                />
            )}
        </div>
    );
};

export default Avatar;
