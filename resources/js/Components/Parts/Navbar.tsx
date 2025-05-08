import Dropdown from "@/Components/Dropdown";
import { ArrowLeftIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Sidebar from "./Sidebar";

const Navbar = () => {
    const [showingNavigationSidebar, setShowingNavigationSidebar] =
        useState(false);
    const user = usePage().props.auth.user;
    const isProfileEditPage = route().current("profile.edit");

    return (
        <>
            {/* Overlay for drawer */}
            {showingNavigationSidebar && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setShowingNavigationSidebar(false)}
                ></div>
            )}

            {/* Mobile Sidebar Drawer */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 shadow-md transform transition-transform duration-300 lg:hidden ${
                    showingNavigationSidebar
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                <div className="h-16 flex items-center justify-between px-5 border-b border-gray-700">
                    <span className="text-white text-lg font-bold">Menu</span>
                    <button
                        onClick={() => setShowingNavigationSidebar(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <Sidebar isOpen={showingNavigationSidebar} />
            </aside>

            {/* Top Navbar */}
            <nav className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg px-4 z-30 relative">
                <div className="flex h-16 justify-between items-center">
                    {/* Left: Sidebar toggle + title/back */}
                    <div className="flex items-center">
                        {/* Sidebar toggle button (Mobile only) */}
                        <button
                            onClick={() => setShowingNavigationSidebar(true)}
                            className="lg:hidden block mr-2 text-gray-300 hover:text-white"
                        >
                            <Bars3Icon className="w-7 h-7" />
                        </button>

                        {isProfileEditPage ? (
                            <Link
                                href={route("dashboard")}
                                className="text-gray-700 dark:text-gray-300"
                                aria-label="Back to dashboard"
                            >
                                <ArrowLeftIcon className="w-6 h-6" />
                            </Link>
                        ) : (
                            <Link
                                href="/"
                                className="text-xl font-semibold text-gray-900 dark:text-white ml-2"
                            >
                                HR Management
                            </Link>
                        )}
                    </div>

                    {/* Right: Notification, Dropdown, Avatar */}
                    <div className="hidden sm:flex items-center space-x-3">
                        <button className="hover:opacity-50">
                            <BellAlertIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                        </button>

                        <Dropdown>
                            <Dropdown.Trigger>
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

                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
