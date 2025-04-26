import {
    CalendarIcon,
    ClipboardDocumentListIcon,
    ClipboardIcon,
} from "@heroicons/react/24/outline";
import {
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CogIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

const Sidebar = ({ isOpen }: { isOpen?: boolean }) => {
    const groupedItems = [
        {
            group: "General",
            items: [
                {
                    name: "Dashboard",
                    icon: <HomeIcon className="w-5 h-5 mr-2" />,
                    route: "dashboard",
                },
            ],
        },
        {
            group: "Task & Attendance",
            items: [
                {
                    name: "Daily Tasks",
                    icon: (
                        <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                    ),
                    route: "dailyTasks",
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
            ],
        },
        {
            group: "Employee Management",
            items: [
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
            ],
        },
        {
            group: "Settings",
            items: [
                {
                    name: "Settings",
                    icon: <CogIcon className="w-5 h-5 mr-2" />,
                    route: "settings",
                },
            ],
        },
    ];

    return (
        <aside
            className={`w-56 h-[calc(100vh-4rem)] bg-gray-900 lg:border-r lg:border-gray-700 shadow-md flex-col transition-transform duration-300 z-50
                     ${isOpen ? "fixed top-16 left-0 flex w-full" : "hidden"}
                      lg:flex lg:static`}
        >
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-4 px-3">
                    {groupedItems.map((group) => (
                        <div key={group.group} className="mt-4">
                            <h2 className="text-xs text-gray-400 uppercase mb-2 tracking-wide">
                                {group.group}
                            </h2>
                            {group.items.map((item) => {
                                const isActive = route().current(item.route);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={route(item.route)}
                                            className={`flex items-center gap-1 px-2 py-2 rounded-md text-sm transition-all duration-200 ease-in-out ${
                                                isActive
                                                    ? "bg-gray-800 text-blue-400 border-l-4 border-blue-500"
                                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                            }`}
                                            onClick={(e) => {
                                                if (isActive)
                                                    e.preventDefault();
                                            }}
                                        >
                                            <span className="text-base">
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {item.name}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </div>
                    ))}
                </ul>
            </nav>
            <div className="px-4 py-4 text-xs text-gray-500 border-t border-gray-700">
                &copy; 2025 HRM. All rights reserved.
            </div>
        </aside>
    );
};

export default Sidebar;
