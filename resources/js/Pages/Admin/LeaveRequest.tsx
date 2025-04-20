import LeaveRequestModal from "@/Components/LeaveRequest/LeaveRequestModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { LeaveRequest, LeaveRequestProps } from "@/types/Admin";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function LeaveRequestsPage({
    leave_requests,
}: LeaveRequestProps) {
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleLeaveRequestClick = (leave: LeaveRequest) => {
        setSelectedLeave(leave);
        setIsModalOpen(true);
    };

    return (
        <AdminLayout>
            <Head title="Leave Requests" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Leave Requests
                </h1>
            </div>

            <div className="w-full overflow-x-auto rounded-lg shadow max-w-full">
                <table className="min-w-full text-xs lg:text-sm text-left text-gray-300 bg-gray-800">
                    <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-4 py-3">No</th>
                            <th className="px-4 py-3">Employee Name</th>
                            <th className="px-4 py-3 hidden md:table-cell">
                                Leave Type
                            </th>
                            <th className="px-4 py-3 hidden xl:table-cell">
                                From
                            </th>
                            <th className="px-4 py-3 hidden xl:table-cell">
                                To
                            </th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leave_requests.map((leave, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-700 hover:bg-gray-600"
                                onClick={() => handleLeaveRequestClick(leave)}
                            >
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">
                                    {leave.employee_name}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    {leave.leave_type}
                                </td>
                                <td className="px-4 py-3 hidden xl:table-cell">
                                    {leave.start_date}
                                </td>
                                <td className="px-4 py-3 hidden xl:table-cell">
                                    {leave.end_date}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 text-xs text-white capitalize font-medium rounded-full ${
                                            leave.status === "approved"
                                                ? "bg-green-600"
                                                : leave.status === "rejected"
                                                ? "bg-red-600"
                                                : "bg-yellow-600"
                                        }`}
                                    >
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="py-3 text-center px-2 md:px-0">
                                    {leave.status === "pending" && (
                                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                            <button className="px-3 py-1 text-xs text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 text-xs text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition">
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {leave.status !== "pending" && (
                                        <button className="px-3 w-24 py-1 text-xs text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition">
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {/* Leave Request Modal */}
            {selectedLeave && (
                <LeaveRequestModal
                    leave={selectedLeave}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onApprove={() => {
                        // Handle approve action
                        setIsModalOpen(false);
                    }}
                    onReject={() => {
                        // Handle reject action
                        setIsModalOpen(false);
                    }}
                />
            )}
        </AdminLayout>
    );
}
