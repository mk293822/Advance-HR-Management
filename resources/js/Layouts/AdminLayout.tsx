import { PropsWithChildren } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import Sidebar from "@/Components/Parts/Sidebar";

const AdminLayout = ({ children }: PropsWithChildren) => {
    return (
        <AuthenticatedLayout>
            <div className="flex">
                <Sidebar />
                <main className="flex-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    <div className="px-6 pt-6 min-h-[calc(100vh-9.5rem)]">
                        {children}
                    </div>
                    <footer className="text-xs py-4 mt-10 border-t border-gray-600 text-gray-600">
                        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                            <div>
                                &copy; {new Date().getFullYear()} HR Management
                                System. All rights reserved.
                            </div>
                            <div className="flex space-x-4 mt-2 sm:mt-0">
                                <a href="/privacy" className="hover:underline">
                                    Privacy Policy
                                </a>
                                <a href="/terms" className="hover:underline">
                                    Terms
                                </a>
                                <a href="/contact" className="hover:underline">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default AdminLayout;
