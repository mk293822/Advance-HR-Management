import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { DashboardProps, LeaveRequest, UpcomingEvent } from "@/types/Admin";
import AdminLayout from "@/Layouts/AdminLayout";
import UpcomingEventModal from "@/Components/UpcomingEvent/UpcomingEventModal";
import ActionButton from "@/Components/ActionButton";
import CreateEvent from "@/Components/UpcomingEvent/CreateEvent";
import axios from "axios";
import AttendanceChart from "@/Components/Parts/AttendanceChart";
import ErrorShowModal from "@/Components/ErrorShowModal";

export default function Dashboard({
    employee_count,
    department_count,
    leave_request_count,
    pending_approvals,
    leave_requests,
    upcoming_events,
    attendances,
    chart_type,
}: DashboardProps) {
    const pendingItems = [
        {
            count: pending_approvals.leave_requests_count,
            value: `${pending_approvals.leave_requests_count} pending leave requests`,
            type: "leaveRequests",
        },
        {
            count: pending_approvals.employees_count,
            value: `${pending_approvals.employees_count} pending employee`,
            type: "employees",
        },
        {
            count: pending_approvals.departments_count,
            value: `${pending_approvals.departments_count} pending departments`,
            type: "departments",
        },
    ].filter((item) => item.count > 0);

    const [pendingTasks, setPendingTasks] =
        useState<Array<{ value: string; type: string }>>(pendingItems);

    const [leaveRequests, setLeaveRequests] = useState<
        Array<LeaveRequest & { date: string }>
    >(
        leave_requests.map((request) => ({
            ...request,
            date: `${new Date(
                request.start_date
            ).toLocaleDateString()} - ${new Date(
                request.end_date
            ).toLocaleDateString()}`,
        }))
    );

    const [openUpcomingEventModal, setOpenUpcomingEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(
        null
    );
    const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
    const [localUpcomingEvents, setLocalUpcomingEvents] =
        useState<UpcomingEvent[]>(upcoming_events);
    const [isEditEvent, setIsEditEvent] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<{
        message: string;
        status: number;
    }>({
        message: "",
        status: 0,
    });

    // cards
    const cards: Array<{ title: string; count: number; color: string }> = [
        {
            title: "Total Employees",
            count: employee_count,
            color: "border-l-blue-500",
        },
        {
            title: "Departments",
            count: department_count,
            color: "border-l-green-500",
        },
        {
            title: "Leave Requests",
            count: leave_request_count,
            color: "border-l-yellow-500",
        },
        {
            title: "Pending Approvals",
            count:
                pending_approvals.employees_count +
                pending_approvals.leave_requests_count,
            color: "border-l-red-500",
        },
    ];

    // Handle Upcoming Event Click
    const handleUpcomingEventClick = (event: UpcomingEvent | null) => {
        setSelectedEvent(event);
        setOpenUpcomingEventModal(true);
    };

    // Handle Create and Update Upcoming Event
    const handleCreateEvent = (data: UpcomingEvent) => {
        const request = isEditEvent
            ? axios.put(route("upcomingEvent.update", selectedEvent?.id), data)
            : axios.post(route("upcomingEvent.store"), data);

        request
            .then((res) => {
                if (res.data.status === "success") {
                    setLocalUpcomingEvents((prev) => {
                        let updated;
                        if (isEditEvent && selectedEvent) {
                            updated = prev.map((event) =>
                                event.id === selectedEvent.id
                                    ? res.data.data
                                    : event
                            );
                        } else {
                            updated = [...prev, res.data.data];
                        }

                        return updated.sort(
                            (a, b) =>
                                new Date(a.start_date).getTime() -
                                new Date(b.start_date).getTime()
                        );
                    });
                }
                setOpenCreateEventModal(false);
                setSelectedEvent(null);
            })
            .catch((err) => {
                setErrorMessage({
                    message: err.response.data.errors,
                    status: err.response.status,
                });
                setSelectedEvent(null);
                setShowErrorModal(true);
                setIsEditEvent(false);
                setOpenCreateEventModal(false);
                setOpenUpcomingEventModal(false);
            });
    };

    // Handle Edit Upcoming Event
    const handleEditEvent = () => {
        setIsEditEvent(true);
        setOpenCreateEventModal(true);
        setOpenUpcomingEventModal(false);
    };

    // Handle Delete Upcoming Event
    const handleDeleteEvent = () => {
        if (selectedEvent) {
            axios
                .delete(route("upcomingEvent.destroy", selectedEvent.id))
                .then((res) => {
                    if (res.data.status === "success") {
                        setLocalUpcomingEvents((prev) =>
                            prev.filter(
                                (event) => event.id !== selectedEvent.id
                            )
                        );
                        setOpenUpcomingEventModal(false);
                        setSelectedEvent(null);
                    }
                })
                .catch((err) => {
                    setErrorMessage({
                        message: err.response.data.errors,
                        status: err.response.status,
                    });
                    setSelectedEvent(null);
                    setShowErrorModal(true);
                    setIsEditEvent(false);
                    setOpenCreateEventModal(false);
                    setOpenUpcomingEventModal(false);
                });
        }
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            {/* Body */}
            <main className="space-y-6">
                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className={`p-4 h-24 rounded-lg shadow-sm border-t border-b border-r border-gray-300 border-l-8 ${card.color}`}
                        >
                            <div className="text-sm text-gray-500">
                                {card.title}
                            </div>
                            <div className="text-2xl font-bold mt-2">
                                {card.count}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Attendance Chart */}
                <AttendanceChart
                    attendances={attendances}
                    chart_type={chart_type}
                />

                {/* Second row: Leave requests + Tasks + Events */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Recent Leave Requests */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 xl:col-span-2">
                        <h2 className="text-lg font-semibold mb-4">
                            Recent Leave Requests
                        </h2>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {leaveRequests.map((req, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <span>{req.employee_name}</span>
                                    <span>{req.date}</span>
                                    <span
                                        className={`px-2 py-1 font-semibold text-white rounded-full text-xs ${
                                            req.status === "approved"
                                                ? "bg-green-600"
                                                : req.status === "rejected"
                                                ? " bg-red-600"
                                                : " bg-yellow-600"
                                        }`}
                                    >
                                        {req.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Pending Tasks
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {pendingTasks.length > 0 &&
                                pendingTasks.map((task, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between"
                                    >
                                        <span>{task.value}</span>
                                        <Link
                                            href={route(task.type)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Review
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
                {/* Upcoming Events */}
                <div className="bg-gray-800 rounded-lg shadow p-6 pt-4">
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-md mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Events
                        </h2>
                        <ActionButton
                            color="blue"
                            onClick={() => setOpenCreateEventModal(true)}
                        >
                            + Add Event
                        </ActionButton>
                    </div>

                    <ul className="text-sm text-gray-300 max-h-64 overflow-y-auto divide-y divide-gray-700">
                        {localUpcomingEvents.map(
                            (event, index) =>
                                event.start_date > new Date().toISOString() && (
                                    <li
                                        onClick={() =>
                                            handleUpcomingEventClick(event)
                                        }
                                        key={index}
                                        className="flex flex-col hover:bg-gray-700 sm:flex-row justify-between items-start sm:items-center py-3 px-2 rounded-lg transition-colors"
                                    >
                                        <span className="font-medium text-white">
                                            {event.title}
                                        </span>
                                        <div className="text-xs sm:text-sm text-gray-400 flex mt-1 sm:mt-0 sm:text-right">
                                            <span className="block lg:hidden">
                                                At{" "}
                                                <span className="text-blue-400">
                                                    {event.start_date}
                                                </span>
                                            </span>
                                            <span className="hidden lg:block">
                                                from{" "}
                                                <span className="text-blue-400">
                                                    {event.start_date}
                                                </span>
                                            </span>
                                            <span className="hidden lg:block ml-0 sm:ml-2">
                                                to{" "}
                                                <span className="text-green-400">
                                                    {event.end_date}
                                                </span>
                                            </span>
                                        </div>
                                    </li>
                                )
                        )}
                    </ul>
                </div>
            </main>

            {/* Modals */}
            {/* <UpcomingEventModal /> */}
            <UpcomingEventModal
                event={selectedEvent}
                open={openUpcomingEventModal}
                onClose={() => {
                    setOpenUpcomingEventModal(false);
                    setSelectedEvent(null);
                }}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
            />
            {/* Creating Event Modal */}
            <CreateEvent
                isOpen={openCreateEventModal}
                onClose={() => {
                    setOpenCreateEventModal(false);
                    setSelectedEvent(null);
                    setOpenUpcomingEventModal(false);
                    setIsEditEvent(false);
                }}
                onCreate={(data) => handleCreateEvent(data)}
                editData={selectedEvent}
                isEdit={isEditEvent}
            />

            {/* Error */}
            <ErrorShowModal
                show={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </AdminLayout>
    );
}
