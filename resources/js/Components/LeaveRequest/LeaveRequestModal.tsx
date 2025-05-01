import { LeaveRequest } from "@/types/Admin";
import ActionButton from "../ActionButton";
import Modal from "../Modal";
import { Detail } from "../TextDetail&Info";

interface Props {
    leave: LeaveRequest;
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    onEdit: () => void;
}

export default function LeaveRequestModal({
    leave,
    isOpen,
    onClose,
    onApprove,
    onReject,
    onEdit,
}: Props) {
    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} show={isOpen}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                <h2 className="text-lg font-semibold text-white">
                    Leave Request Details
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-300">
                <Detail label="Employee" value={leave.employee_name} />
                <Detail label="Type" value={leave.leave_type} />
                <Detail label="From" value={leave.start_date} />
                <Detail label="To" value={leave.end_date} />
                <Detail label="Requested At" value={leave.created_at ?? ""} />
                <div>
                    <p className="text-gray-400 mb-1">Status</p>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            leave.status === "approved"
                                ? "bg-green-600 text-white"
                                : leave.status === "rejected"
                                ? "bg-red-600 text-white"
                                : leave.status === "pending" && "bg-yellow-600"
                        }`}
                    >
                        {leave.status}
                    </span>
                </div>
                <div className="sm:col-span-2">
                    <p className="text-gray-400 mb-1">Reason</p>
                    <p className="whitespace-pre-wrap">{leave.reason}</p>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                {leave.status !== "approved" && (
                    <ActionButton onClick={onApprove} color="green">
                        Approve
                    </ActionButton>
                )}
                {leave.status !== "rejected" && (
                    <ActionButton onClick={onReject} color="red">
                        Reject
                    </ActionButton>
                )}
                <ActionButton onClick={onEdit} color="yellow">
                    Edit
                </ActionButton>
                <ActionButton onClick={onClose} color="gray">
                    Close
                </ActionButton>
            </div>
        </Modal>
    );
}
