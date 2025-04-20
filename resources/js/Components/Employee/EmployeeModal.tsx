import { Employee } from "@/types/Admin";
import React from "react";
import ActionButton from "../ActionButton";
import { Detail } from "../TextDetail&Info";
import Modal from "../Modal";

type Props = {
    show: boolean;
    onClose: () => void;
    employee: Employee | null;
    onEdit?: () => void;
    onDelete?: () => void;
};

const EmployeeModal: React.FC<Props> = ({
    show,
    onClose,
    employee,
    onEdit,
    onDelete,
}) => {
    if (!show || !employee) return null;

    return (
        <Modal onClose={onClose} show={show}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                <h2 className="text-lg font-semibold">Employee Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <Detail label="Name" value={employee.name} />
                <Detail label="Email" value={employee.email} />
                <Detail label="Phone" value={employee.phone || "N/A"} />
                <Detail label="Gender" value={employee.gender || "N/A"} />
                <Detail label="Employee ID" value={employee.employee_id} />
                <Detail
                    label="Department"
                    value={employee.department?.name || "N/A"}
                />
                <Detail label="Position" value={employee.position.name} />
                <div>
                    <span className="block text-gray-400 mb-1">Status</span>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            employee.status === "Active"
                                ? "bg-green-600 text-white"
                                : employee.status === "Inactive"
                                ? "bg-yellow-500 text-white"
                                : employee.status === "Suspended"
                                ? "bg-red-600 text-white"
                                : employee.status === "Pending"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-500 text-white"
                        }`}
                    >
                        {employee.status}
                    </span>
                </div>
            </div>

            <div className="mt-6 text-right flex gap-2 justify-end">
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

export default EmployeeModal;
