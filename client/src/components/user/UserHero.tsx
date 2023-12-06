import Image from "next/image";
import Avatar from "../Avatar";

interface UserHeroProps {
    userId: string;
}

const UserHero: React.FC<UserHeroProps> = ({ userId }) => {
    return (
        <div>
            <div className="bg-neutral-700 h-44 relative">
                <Image
                    unoptimized
                    src="https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2021/03/LinkedIn-Default-Background-2020-.jpg"
                    fill
                    sizes="100%"
                    alt="Cover Image"
                    style={{ objectFit: "cover" }}
                />

                <div className="absolute -bottom-16 left-4">
                    <Avatar userId={userId} isLarge hasBorder />
                </div>
            </div>
        </div>
    );
};

export default UserHero;
