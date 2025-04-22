import React from "react";
import clsx from "clsx";

const colorClasses: Record<string, string> = {
    red: "border-red-500 text-red-400 hover:bg-red-500",
    green: "border-green-500 text-green-400 hover:bg-green-500",
    blue: "border-blue-500 text-blue-400 hover:bg-blue-500",
    yellow: "border-yellow-500 text-yellow-400 hover:bg-yellow-500",
    gray: "border-gray-500 text-gray-400 hover:bg-gray-500",
};

const ActionButton = React.memo(
    ({
        onClick,
        color,
        children,
        type = "button",
    }: {
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        color: string;
        children: React.ReactNode;
        type?: "button" | "submit" | "reset";
    }) => {
        const baseClasses =
            "px-3 py-1.5 text-sm rounded transition border font-medium hover:text-white";
        const variantClasses = colorClasses[color] || "";

        return (
            <button
                type={type}
                onClick={onClick}
                className={clsx(baseClasses, variantClasses)}
            >
                {children}
            </button>
        );
    }
);

export default ActionButton;
