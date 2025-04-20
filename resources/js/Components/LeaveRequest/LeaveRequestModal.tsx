import { LeaveRequest } from "@/types/Admin";
import React from "react";
import ActionButton from "../ActionButton";
import { Info } from "../TextDetail&Info";
import Modal from "../Modal";

interface Props {
    leave: LeaveRequest;
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
}

export default function LeaveRequestModal({
    leave,
    isOpen,
    onClose,
    onApprove,
    onReject,
}: Props) {
    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} show={isOpen}>
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                <h2 className="text-lg font-semibold">Leave Request Details</h2>
            </div>

            <div className="space-y-3 text-sm">
                <Info label="Employee" value={leave.employee_name} />
                <Info label="Type" value={leave.leave_type} />
                <Info label="From" value={leave.start_date} />
                <Info label="To" value={leave.end_date} />
                <Info label="Reason" value={leave.reason} />
                <Info label="Status" value={leave.status} />
                <Info label="Requested At" value={leave.created_at} />
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
                <ActionButton onClick={onClose} color="gray">
                    Close
                </ActionButton>
            </div>
        </Modal>
    );
}
