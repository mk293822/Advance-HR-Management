import { ClipboardIcon } from "@heroicons/react/24/outline";
import NavLink from "../NavLink";
import {
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CogIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
    const parts = [
        {
            name: "Dashboard",
            icon: <HomeIcon className="w-5 h-5 mr-2" />,
            route: "dashboard",
        },
        {
            name: "Employees",
            icon: <UsersIcon className="w-5 h-5 mr-2" />,
            route: "employees",
        },
        {
            name: "Departments",
            icon: <BuildingOfficeIcon className="w-5 h-5 mr-2" />,
            route: "departments",
        },
        {
            name: "Leave Requests",
            icon: <ClipboardIcon className="w-5 h-5 mr-2" />,
            route: "leaveRequests",
        },
        {
            name: "Settings",
            icon: <CogIcon className="w-5 h-5 mr-2" />,
            route: "settings",
        },
    ];

    return (
        <aside className="w-48 h-[calc(100vh-4rem)] border-r-gray-600 border-r shadow-md hidden lg:block">
            <nav className="flex flex-col justify-start">
                {/* Sidebar links */}
                {parts.map((item) => (
                    <NavLink
                        key={item.name}
                        active={route().current(item.route)}
                        href={route(item.route)}
                        className="flex items-center justify-end text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
