import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
            <div className="mt-6 w-full shadow-gray-700 overflow-hidden bg-white px-6 py-10 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
