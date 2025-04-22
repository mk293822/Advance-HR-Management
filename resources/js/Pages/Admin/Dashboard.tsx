import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Chart from "chart.js/auto";
import { DashboardProps, LeaveRequest, UpcomingEvent } from "@/types/Admin";
import AdminLayout from "@/Layouts/AdminLayout";
import UpcomingEventModal from "@/Components/UpcomingEvent/UpcomingEventModal";
import ActionButton from "@/Components/ActionButton";
import CreateEvent from "@/Components/UpcomingEvent/CreateEvent";
import axios from "axios";
import { type } from "os";

export default function Dashboard({
    employee_count,
    department_count,
    leave_request_count,
    pending_approval_count,
    leave_requests,
    upcoming_events,
}: DashboardProps) {
    const chartRef = useRef(null);

    const pending_leave_requests = leave_requests.filter(
        (request) => request.status === "pending"
    ).length;

    const [pendingTasks, setPendingTasks] = useState<
        Array<{ value: string; type: string }>
    >(
        pending_leave_requests > 0
            ? [
                  {
                      value: `${pending_leave_requests} leave requests`,
                      type: "leaveRequests",
                  },
              ]
            : []
    );

    console.log(pendingTasks);

    const [leaveRequests, setLeaveRequests] = useState<Array<LeaveRequest>>(
        leave_requests
            .map((request) => ({
                ...request,
                date: `${new Date(
                    request.start_date
                ).toLocaleDateString()} - ${new Date(
                    request.end_date
                ).toLocaleDateString()}`,
            }))
            .sort(
                (a, b) =>
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime()
            )
            .slice(0, 10) // Sort by latest start_date first
    );
    const [openUpcomingEventModal, setOpenUpcomingEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(
        null
    );
    const [openCreateEventModal, setOpenCreateEventModal] = useState(false);
    const [localUpcomingEvents, setLocalUpcomingEvents] =
        useState<UpcomingEvent[]>(upcoming_events);
    const [isEditEvent, setIsEditEvent] = useState(false);

    // Chart Setup
    useEffect(() => {
        let chartInstance: Chart | null = null;

        let monthlyData = Array.from({ length: 12 }, () => ({
            leaves: 0,
            approved: 0,
            rejected: 0,
        }));
        leave_requests.forEach((request) => {
            const date = new Date(request.start_date);
            const month = date.getMonth();
            const year = date.getFullYear();
            const status = request.status;
            if (year === new Date().getFullYear()) {
                monthlyData[month].leaves += 1;
                if (status === "approved") {
                    monthlyData[month].approved += 1;
                } else if (status === "rejected") {
                    monthlyData[month].rejected += 1;
                }
            }
        });
        const leavesData = monthlyData.map((data) => data.leaves);
        const approvedData = monthlyData.map((data) => data.approved);
        const rejectedData = monthlyData.map((data) => data.rejected);

        if (chartRef.current) {
            chartInstance = new Chart(chartRef.current, {
                type: "bar",
                data: {
                    labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                    ],
                    datasets: [
                        {
                            label: "Leaves",
                            data: leavesData,
                            backgroundColor: "#3b82f6", // Blue
                        },
                        {
                            label: "Approved",
                            data: approvedData,
                            backgroundColor: "#34d399", // Green
                        },
                        {
                            label: "Rejected",
                            data: rejectedData,
                            backgroundColor: "#f87171", // Red
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            });
        }

        return () => {
            chartInstance?.destroy();
        };
    }, []);

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
            count: pending_approval_count,
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
                console.error(err);
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
                    console.error(err);
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

                {/* Employee Chart */}
                <div className="bg-gray-800 p-6 hidden md:block rounded-lg shadow col-span-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold mb-4">
                            Employee Leave Status
                        </h2>
                        <small>{new Date().toLocaleDateString()}</small>
                    </div>
                    <canvas ref={chartRef} height="100"></canvas>
                </div>

                {/* Second row: Leave requests + Tasks + Events */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Recent Leave Requests */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 xl:col-span-2">
                        <h2 className="text-lg font-semibold mb-4">
                            Recent Leave Requests
                        </h2>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {leaveRequests.map((req) => (
                                <li
                                    key={req.id}
                                    className="flex justify-between items-center"
                                >
                                    <span>{req.employee_name}</span>
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
                onClose={() => setOpenCreateEventModal(false)}
                onCreate={(data) => handleCreateEvent(data)}
                editData={selectedEvent}
                isEdit={isEditEvent}
            />
        </AdminLayout>
    );
}
