import { AttendanceType } from "@/types/Admin";
import React from "react";
import ActionButton from "../ActionButton";
import { Detail } from "../TextDetail&Info";
import Modal from "../Modal";

type Props = {
    show: boolean;
    onClose: () => void;
    attendance: AttendanceType | null;
    onEdit?: () => void;
};

const AttendanceModal: React.FC<Props> = ({
    show,
    onClose,
    attendance,
    onEdit,
}) => {
    if (!show || !attendance) return null;

    const getStatusClass = (status: string) => {
        switch (status) {
            case "present":
                return "bg-green-600 text-white";
            case "absent":
                return "bg-red-600 text-white";
            case "leave":
                return "bg-yellow-500 text-white";
            case "late":
                return "bg-orange-500 text-white";
            case "half_day":
                return "bg-blue-600 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <Modal onClose={onClose} show={show}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                <h2 className="text-lg font-semibold">Attendance Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <Detail
                    label="Employee Name"
                    value={attendance.employee.full_name}
                />
                <Detail
                    label="Employee Id"
                    value={attendance.employee.employee_id}
                />
                <Detail label="Date" value={attendance.date} />
                <Detail
                    label="Remark"
                    value={attendance.remark || "No Remark"}
                />
                <Detail label="Check In" value={attendance.check_in || "-"} />
                <Detail label="Check Out" value={attendance.check_out || "-"} />
                <div>
                    <span className="block text-gray-400 mb-1">Status</span>
                    <span
                        className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full shadow-sm transition duration-300 ${getStatusClass(
                            attendance.status
                        )}`}
                    >
                        {attendance.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="mt-6 text-right flex gap-2 justify-end">
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

export default AttendanceModal;
