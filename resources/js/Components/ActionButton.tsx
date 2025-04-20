import React from "react";

interface ActionButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    color: string;
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
}

const ActionButton = React.memo(
    ({ onClick, color, children, type = "button" }: ActionButtonProps) => {
        const baseClasses =
            "px-3 py-1.5 text-sm rounded transition border font-medium hover:text-white";
        const variantClasses = `border-${color}-500 text-${color}-400 hover:bg-${color}-500`;

        return (
            <button
                type={type}
                onClick={onClick}
                className={`${baseClasses} ${variantClasses}`}
            >
                {children}
            </button>
        );
    }
);

export default ActionButton;
