import React, { PropsWithChildren } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import Sidebar from "@/Components/Parts/Sidebar";

const AdminLayout = ({ children }: PropsWithChildren) => {
    return (
        <AuthenticatedLayout>
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default AdminLayout;
