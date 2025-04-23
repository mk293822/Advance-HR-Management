import { Department, Employee } from "@/types/Admin";
import React from "react";
import ActionButton from "../ActionButton";
import { Detail } from "../TextDetail&Info";
import Modal from "../Modal";

type Props = {
    show: boolean;
    onClose: () => void;
    department: Department | null;
    onDelete: () => void;
    onEdit: () => void;
    header: {
        full_name: string;
        employee_id: string | null;
    } | null;
};

const DepartmentModal: React.FC<Props> = ({
    show,
    onClose,
    department,
    onDelete,
    onEdit,
    header,
}) => {
    if (!show || !department) return null;

    return (
        <Modal onClose={onClose} show={show}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                <h2 className="text-lg font-semibold">Department Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <Detail label="Name" value={department.name} />
                <Detail
                    label="Header"
                    value={header?.full_name || "No Header"}
                />
                <Detail
                    label="Employees Count"
                    value={department.employees_count ?? "N/A"}
                />
                <div>
                    <span className="block text-gray-400 mb-1">Status</span>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            department.status === "Active"
                                ? "bg-green-600 text-white"
                                : department.status === "Inactive"
                                ? "bg-yellow-500 text-white"
                                : department.status === "Suspended"
                                ? "bg-red-600 text-white"
                                : department.status === "Pending"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-500 text-white"
                        }`}
                    >
                        {department.status}
                    </span>
                </div>
                <div className="sm:col-span-2">
                    <span className="block text-gray-400 mb-1">
                        Description
                    </span>
                    <p className="text-gray-100 whitespace-pre-line">
                        {department.description || "N/A"}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
                <ActionButton onClick={onDelete} color="red">
                    Delete
                </ActionButton>
                <ActionButton onClick={onEdit} color="yellow">
                    Edit
                </ActionButton>
                <ActionButton onClick={onClose} color="green">
                    Close
                </ActionButton>
            </div>
        </Modal>
    );
};

export default DepartmentModal;
