import ErrorShowModal from "@/Components/ErrorShowModal";
import LeaveRequestModal from "@/Components/LeaveRequest/LeaveRequestModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { LeaveRequest, LeaveRequestProps } from "@/types/Admin";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

export default function LeaveRequestsPage({
    leave_requests,
}: LeaveRequestProps) {
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(
        null
    );
    const [localLeaveRequests, setLocalLeaveRequests] =
        useState<LeaveRequest[]>(leave_requests);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<{
        message: string;
        status: number;
    }>({
        message: "",
        status: 0,
    });

    // Search box
    const [searchQuery, setSearchQuery] = useState("");

    const fuse = useMemo(() => {
        return new Fuse(localLeaveRequests, {
            keys: ["employee_name", "leave_type"],
            threshold: 0.5,
        });
    }, [localLeaveRequests]);

    const filteredLeaveRequests = useMemo(() => {
        return searchQuery
            ? fuse.search(searchQuery).map((res) => res.item)
            : localLeaveRequests;
    }, [fuse, searchQuery, localLeaveRequests]);

    const handleLeaveRequestClick = (leave: LeaveRequest) => {
        setSelectedLeave(leave);
        setIsModalOpen(true);
    };

    // Handle Leave Request Approving
    const handleRequestApprove = ({
        type,
        id,
    }: {
        type: string;
        id: number;
    }) => {
        axios
            .put(route("leaveRequests.approving", id), { type: type })
            .then((res) => {
                if (res.data.status === "success") {
                    setLocalLeaveRequests((pre) =>
                        pre.map((leave) =>
                            leave.id === id ? res.data.data : leave
                        )
                    );
                }
            })
            .catch((err) => {
                setErrorMessage({
                    message: err.response.data.errors,
                    status: err.response.status,
                });
                setSelectedLeave(null);
                setShowErrorModal(true);
                setIsModalOpen(false);
            });
    };

    return (
        <AdminLayout>
            <Head title="Leave Requests" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Leave Requests
                </h1>
                {/* Search Input */}
                <div className="relative w-72">
                    <input
                        type="search"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
                        <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                            />
                        </svg>
                    </div>
                </div>
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
                        {filteredLeaveRequests.map((leave, index) => (
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
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRequestApprove({
                                                        type: "approve",
                                                        id: leave.id,
                                                    });
                                                }}
                                                className="px-3 py-1 text-xs text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRequestApprove({
                                                        type: "reject",
                                                        id: leave.id,
                                                    });
                                                }}
                                                className="px-3 py-1 text-xs text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
                                            >
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
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedLeave(null);
                    }}
                    onApprove={() => {
                        // Handle approve action
                        setIsModalOpen(false);
                        handleRequestApprove({
                            type: "approve",
                            id: selectedLeave.id,
                        });
                    }}
                    onReject={() => {
                        // Handle reject action
                        setIsModalOpen(false);
                        handleRequestApprove({
                            type: "reject",
                            id: selectedLeave.id,
                        });
                    }}
                />
            )}

            {/* Error */}
            <ErrorShowModal
                show={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </AdminLayout>
    );
}
