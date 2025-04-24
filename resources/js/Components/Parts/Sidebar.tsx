import { CalendarIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import NavLink from "../NavLink";
import {
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CogIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

const Sidebar = () => {
    const items = [
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
            name: "Attendances Tracking",
            icon: <CalendarIcon className="w-5 h-5 mr-2" />,
            route: "attendances",
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
        <aside className="w-60 h-[calc(100vh-4rem)] pt-2 bg-gray-900 border-r border-gray-700 shadow-md hidden lg:flex flex-col">
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-1 px-2">
                    {items.map((item) => {
                        const isActive = route().current(item.route);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={route(item.route)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors duration-150 ${
                                        isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                    onClick={(e) => {
                                        if (isActive) {
                                            e.preventDefault(); // prevent page reload
                                        }
                                    }}
                                >
                                    {item.icon && (
                                        <span className="text-xl">
                                            {item.icon}
                                        </span>
                                    )}
                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="px-4 py-4 text-sm text-gray-500 border-t border-gray-700">
                &copy; 2025 HRM. All rights reserved.
            </div>
        </aside>
    );
};

export default Sidebar;
