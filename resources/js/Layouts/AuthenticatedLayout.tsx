import Navbar from "@/Components/Parts/Navbar";
import { PropsWithChildren, ReactNode } from "react";

export default function AuthenticatedLayout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <div className="h-screen overflow-y-hidden bg-gray-200 dark:bg-gray-900 scrollbar-hidden ">
            <Navbar />
            <main>{children}</main>
        </div>
    );
}
