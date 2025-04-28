import {
    CalendarDaysIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    BellAlertIcon,
    CakeIcon,
} from "@heroicons/react/24/outline";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    AttendanceType,
    Employee,
    LeaveRequest,
    UpcomingEvent,
} from "@/types/Admin";
import ActionButton from "@/Components/ActionButton";
import { AttendanceEnum } from "@/types/Enums";
import { stat } from "fs";
import axios from "axios";
import { useState } from "react";
import ErrorShowModal from "@/Components/ErrorShowModal";

const DailyTasks = ({
    attendances,
    leave_requests,
    birthday_users,
    upcoming_events,
}: {
    attendances: AttendanceType[];
    leave_requests: LeaveRequest[];
    birthday_users: Employee[];
    upcoming_events: UpcomingEvent[];
}) => {
    const [localAttendances, setLocalAttendances] =
        useState<AttendanceType[]>(attendances);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<{
        message: string;
        status: number;
    }>({
        message: "",
        status: 0,
    });

    // Handle attendance status change
    const handleAttendanceStatusChange = ({
        status,
        id,
    }: {
        status: string;
        id: number;
    }) => {
        axios
            .put(route("attendances.update", id), { status: status })
            .then((response) => {
                if (response.data.status === "success") {
                    setLocalAttendances((pre) =>
                        pre.map((att) =>
                            att.id === id ? { ...att, status: status } : att
                        )
                    );
                }
            })
            .catch((err) => {
                setErrorMessage({
                    message: err.response.data.errors,
                    status: err.response.status,
                });
                setShowErrorModal(true);
            });
    };

    return (
        <AdminLayout>
            <Head title="Daily Tasks" />
            <div className=" min-h-screen text-gray-200 ">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Daily Tasks
                </h1>
                {/* Attendance Summary */}
                <div className="card bg-gray-800/50 hover:bg-gray-800 shadow-xl mb-4">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="card-title text-xl text-white">
                                    Attendance Summary
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Today’s stats
                                </p>
                            </div>
                            <UserGroupIcon className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="mt-4 flex space-x-4 items-center">
                            <span className="badge badge-success">
                                Present:{" "}
                                {
                                    localAttendances.filter(
                                        (att) =>
                                            att.status ===
                                            AttendanceEnum.PRESENT
                                    ).length
                                }
                            </span>
                            <span className="badge badge-error">
                                Absent:{" "}
                                {
                                    localAttendances.filter(
                                        (att) =>
                                            att.status === AttendanceEnum.ABSENT
                                    ).length
                                }
                            </span>
                            <span className="badge badge-warning">
                                Leave:{" "}
                                {
                                    localAttendances.filter(
                                        (att) =>
                                            att.status === AttendanceEnum.LEAVE
                                    ).length
                                }
                            </span>
                            <span className="badge badge-accent">
                                Late:{" "}
                                {
                                    localAttendances.filter(
                                        (att) =>
                                            att.status === AttendanceEnum.LATE
                                    ).length
                                }
                            </span>
                            <span className="badge badge-info">
                                Half-day:{" "}
                                {
                                    localAttendances.filter(
                                        (att) =>
                                            att.status ===
                                            AttendanceEnum.HALF_DAY
                                    ).length
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Leave Requests */}
                    <div className="card bg-gray-800/50 hover:bg-gray-800 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="card-title text-xl text-white">
                                        Leave Requests
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        New today
                                    </p>
                                </div>
                                <ClipboardDocumentListIcon className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div className="mt-4 space-y-3">
                                {leave_requests.length > 0 ? (
                                    leave_requests.map((leave) => (
                                        <div
                                            key={leave.id}
                                            className="flex justify-between items-center"
                                        >
                                            <span>
                                                {leave.employee_name} -{" "}
                                                {leave.leave_type} Leave
                                            </span>
                                            <div className="space-x-1">
                                                <button className="btn btn-sm btn-outline btn-success">
                                                    Approve
                                                </button>
                                                <button className="btn btn-sm btn-error">
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <h1 className="text-left mt-4 list list-item ml-4">
                                        No Leave Requests For Today
                                    </h1>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Task Overview */}
                    <div className="card bg-gray-800/50 hover:bg-gray-800 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="card-title text-xl text-white">
                                        Task Overview
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Daily task progress
                                    </p>
                                </div>
                                <ClipboardDocumentListIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <ul className="mt-4 space-y-2 text-sm text-gray-300">
                                <li>✔️ Update employee records - Completed</li>
                                <li>🔄 Review payroll reports - In Progress</li>
                                <li>🕒 Schedule interviews - Pending</li>
                            </ul>
                        </div>
                    </div>

                    {/* Birthdays */}
                    {birthday_users.length > 0 && (
                        <div className="card bg-gray-800/50 hover:bg-gray-800 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="card-title text-xl text-white">
                                            Birthdays Today
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            🎉 Don’t forget to wish!
                                        </p>
                                    </div>
                                    <CakeIcon className="w-6 h-6 text-pink-400" />
                                </div>
                                <ul className="mt-4 space-y-1 text-sm text-gray-300">
                                    {birthday_users.map((user) => (
                                        <li key={user.id}>
                                            {`${user.first_name} ${user.last_name}`}{" "}
                                            -{" "}
                                            {new Date(
                                                user.date_of_birth
                                                    ? new Date(
                                                          user.date_of_birth
                                                      )
                                                    : new Date()
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Events */}
                    {upcoming_events.length > 0 && (
                        <div className="card bg-gray-800/50 hover:bg-gray-800 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="card-title text-xl text-white">
                                            Upcoming Events
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            This week
                                        </p>
                                    </div>
                                    <CalendarDaysIcon className="w-6 h-6 text-indigo-400" />
                                </div>
                                <ul className="mt-4 text-sm space-y-1 text-gray-300">
                                    {upcoming_events.map((event) => (
                                        <li key={event.id}>
                                            {event.title} -{" "}
                                            {new Date(
                                                event.start_date
                                                    ? new Date(event.start_date)
                                                    : new Date()
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                {/* Attendance Approval */}
                <div className="card bg-gray-800/50 shadow-xl mt-4">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="card-title text-xl text-white">
                                    Attendance Approve
                                </h2>
                                <p className="text-sm">Today’s stats</p>
                            </div>
                            <UserGroupIcon className="w-6 h-6 text-green-400" />
                        </div>
                        <ul className="mt-4 divide-y divide-gray-600">
                            {localAttendances.length > 0 ? (
                                localAttendances.map((attendance) => (
                                    <li
                                        key={attendance.id}
                                        className="grid grid-cols-2 hover:bg-gray-800 p-2 py-3 rounded-sm"
                                    >
                                        <span className="">
                                            {attendance.employee.full_name}
                                        </span>
                                        <div className="flex items-center justify-between ">
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full shadow-sm transition duration-300 ${
                                                    attendance.status ===
                                                    "present"
                                                        ? "bg-green-600 text-white"
                                                        : attendance.status ===
                                                          "absent"
                                                        ? "bg-red-600 text-white"
                                                        : attendance.status ===
                                                          "leave"
                                                        ? "bg-yellow-500 text-white"
                                                        : attendance.status ===
                                                          "late"
                                                        ? "bg-orange-500 text-white"
                                                        : attendance.status ===
                                                          "half_day"
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-500 text-white"
                                                }`}
                                            >
                                                {attendance.status
                                                    .replace(/_/g, " ")
                                                    .toUpperCase()}
                                            </span>
                                            <div className="space-x-1">
                                                {Object.values(AttendanceEnum)
                                                    .filter(
                                                        (att) =>
                                                            att !==
                                                            attendance.status
                                                    )
                                                    .map((status) => (
                                                        <ActionButton
                                                            key={status}
                                                            color={
                                                                status ===
                                                                "present"
                                                                    ? "green"
                                                                    : status ===
                                                                      "absent"
                                                                    ? "red"
                                                                    : status ===
                                                                      "leave"
                                                                    ? "yellow"
                                                                    : status ===
                                                                      "late"
                                                                    ? "orange"
                                                                    : status ===
                                                                      "half_day"
                                                                    ? "blue"
                                                                    : "gray"
                                                            }
                                                            onClick={() =>
                                                                handleAttendanceStatusChange(
                                                                    {
                                                                        status,
                                                                        id: attendance.id,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            {status
                                                                .replace(
                                                                    /_/g,
                                                                    " "
                                                                )
                                                                .toUpperCase()}
                                                        </ActionButton>
                                                    ))}
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="badge badge-outline badge-secondary">
                                    No attendance records found
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ErrorShowModal
                show={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </AdminLayout>
    );
};

export default DailyTasks;
