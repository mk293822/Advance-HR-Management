import Dropdown from "@/Components/Dropdown";
import { ArrowLeftIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/24/solid";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

const Navbar = () => {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const user = usePage().props.auth.user;

    return (
        <nav className="border-b border-gray-200 px-4 dark:border-gray-700 dark:bg-gray-800 shadow-lg">
            <div className="flex h-16 justify-between items-center">
                <div className=" flex items-center justify-center">
                    <button className="lg:hidden block">
                        <FolderOpenIcon className="w-5 h-5 mr-2" />
                    </button>

                    {route().current("profile.edit") && (
                        <Link
                            href={route("dashboard")}
                            className="ml-4 text-sm text-gray-700 dark:text-gray-300"
                        >
                            <ArrowLeftIcon className="w-6 h-6 font-extrabold" />
                        </Link>
                    )}
                    {!route().current("profile.edit") && (
                        <Link
                            href={"/"}
                            className="text-xl ml-2 font-semibold text-gray-900 dark:text-white"
                        >
                            Hr Management
                        </Link>
                    )}
                </div>

                <div className="sm:flex hidden items-center space-x-2">
                    <button>
                        <BellAlertIcon className="size-6 hover:opacity-50" />
                    </button>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    aria-label="User options"
                                >
                                    {user.name}
                                    <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06 0L10 10.939l3.71-3.73a.75.75 0 111.06 1.06l-4.24 4.26a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route("profile.edit")}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>

                    {/* User Avatar */}
                    <img
                        src={"https://i.pravatar.cc/40"}
                        alt="User Avatar"
                        className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600"
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
