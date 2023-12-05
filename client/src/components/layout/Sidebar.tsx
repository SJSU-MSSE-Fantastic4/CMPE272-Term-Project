import { BiLogOut } from "react-icons/bi";
import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import { getSession } from "@auth0/nextjs-auth0";

const Sidebar = async () => {
    const session = await getSession();

    const items = [
        {
            icon: BsHouseFill,
            label: "Home",
            href: "/",
        },
        {
            icon: FaUser,
            label: "Profile",
            href: `/users/me`,
            auth: true,
        },
    ];

    return (
        <div className="col-span-1 h-full pr-4 md:pr-6">
            <div className="flex flex-col items-end">
                <div className="space-y-2 lg:w-[230px]">
                    <SidebarLogo />
                    {items.map((item) => (
                        <SidebarItem
                            key={item.href}
                            auth={item.auth}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                        />
                    ))}
                    {session?.user && (
                        <SidebarItem
                            href="/api/auth/logout"
                            icon={BiLogOut}
                            label="Logout"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
