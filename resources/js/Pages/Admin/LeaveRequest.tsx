import CreateLeaveRequestModal from "@/Components/LeaveRequest/CreateLeaveRequestModal";
import LeaveRequestModal from "@/Components/LeaveRequest/LeaveRequestModal";
import LeaveRequestTable from "@/Components/LeaveRequest/LeaveRequestTable";
import SuccessErrorShowModal from "@/Components/SuccessErrorShowModal";
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
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

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
            .put(route("leaveRequests.update", id), { status: type })
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

    // handle Create Leave Requests
    const handleCreateLeaveRequest = (data: LeaveRequest) => {
        console.log(data, isEdit);
        const request = isEdit
            ? axios.put(route("leaveRequests.update", selectedLeave?.id), data)
            : axios.post(route("leaveRequests.store"), data);

        request
            .then((res) => {
                if (res.data.status === "success") {
                    setLocalLeaveRequests((prev) => {
                        let updated;
                        if (isEdit && selectedLeave) {
                            updated = prev.map((pre) =>
                                pre.id === selectedLeave.id
                                    ? res.data.data
                                    : pre
                            );
                        } else {
                            updated = [...prev, res.data.data];
                        }

                        return updated;
                    });
                }
                setIsOpenCreateModal(false);
                setSelectedLeave(null);
            })
            .catch((err) => {
                setErrorMessage({
                    message: err.response.data.errors,
                    status: err.response.status,
                });
                setSelectedLeave(null);
                setShowErrorModal(true);
                setIsEdit(false);
                setIsOpenCreateModal(false);
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

            <LeaveRequestTable
                filteredLeaveRequests={filteredLeaveRequests}
                handleLeaveRequestClick={handleLeaveRequestClick}
                handleRequestApprove={handleRequestApprove}
            />
            {/* Modals */}
            {/* Leave Request Modal */}
            {selectedLeave && (
                <LeaveRequestModal
                    onEdit={() => {
                        setIsOpenCreateModal(true);
                        setIsEdit(true);
                    }}
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
                            type: "approved",
                            id: selectedLeave.id,
                        });
                    }}
                    onReject={() => {
                        // Handle reject action
                        setIsModalOpen(false);
                        handleRequestApprove({
                            type: "rejected",
                            id: selectedLeave.id,
                        });
                    }}
                />
            )}
            {/* Create or Update LeaveREquest */}
            <CreateLeaveRequestModal
                isOpen={isOpenCreateModal}
                onClose={() => {
                    setIsOpenCreateModal(false);
                    setSelectedLeave(null);
                    setIsEdit(false);
                    setIsModalOpen(false);
                }}
                onCreate={handleCreateLeaveRequest}
                editData={selectedLeave}
                isEdit={isEdit}
            />
            {/* Error */}
            <SuccessErrorShowModal
                show={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </AdminLayout>
    );
}
