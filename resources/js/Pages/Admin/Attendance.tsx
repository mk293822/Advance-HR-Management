import AttendanceModal from "@/Components/Attendance/AttendanceModal";
import CreateAttendance from "@/Components/Attendance/CreateAttendance";
import SuccessErrorShowModal from "@/Components/SuccessErrorShowModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { AttendanceType, AttendanceProps } from "@/types/Admin";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

const Attendance = ({ attendances, links }: AttendanceProps) => {
    const [localAttendances, setLocalAttendances] = useState(attendances);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showCreateAttendanceModal, setShowCreateAttendanceModal] =
        useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedAttendance, setSelectedAttendance] =
        useState<AttendanceType | null>(null);
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
        return new Fuse(localAttendances, {
            keys: ["id", "employee.employee_id", "employee.full_name"],
            threshold: 0.5,
        });
    }, [localAttendances]);

    const filteredEmployees = useMemo(() => {
        return searchQuery
            ? fuse.search(searchQuery).map((res) => res.item)
            : localAttendances;
    }, [fuse, searchQuery, localAttendances]);

    // Update the Attendance
    const handleCreateAttendance = (data: AttendanceType) => {
        console.log(data);
        const request = isEdit
            ? axios.put(
                  route("attendances.update", selectedAttendance?.id),
                  data
              )
            : axios.post(route("attendances.store"), data);

        request
            .then((res) => {
                if (res.data.status === "success") {
                    setLocalAttendances((prev) => {
                        let updated;
                        if (isEdit && selectedAttendance) {
                            updated = prev.map((pre) =>
                                pre.id === selectedAttendance.id
                                    ? res.data.data
                                    : pre
                            );
                        } else {
                            updated = [...prev, res.data.data];
                        }

                        return updated;
                    });
                }
                setShowCreateAttendanceModal(false);
                setSelectedAttendance(null);
            })
            .catch((err) => {
                setErrorMessage({
                    message: err.response.data.errors,
                    status: err.response.status,
                });
                setSelectedAttendance(null);
                setShowErrorModal(true);
                setIsEdit(false);
                setShowCreateAttendanceModal(false);
                setShowAttendanceModal(false);
            });
    };

    return (
        <AdminLayout>
            <Head title="Attendances" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Attendances</h1>

                <div className="flex justify-end items-center gap-4 w-[60%]">
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
            </div>

            <div className="overflow-x-auto rounded-lg scrollbar-hidden shadow">
                <table className="min-w-full text-xs md:text-sm text-gray-300">
                    <thead className="text-xs uppercase text-gray-400 bg-gray-700">
                        <tr>
                            <th className="px-2 lg:px-4 py-3 text-left">No</th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Employee Name
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Employee ID
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Date
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {filteredEmployees.map((attendance, index) => (
                            <tr
                                key={attendance.id}
                                className="hover:bg-gray-600 cursor-pointer"
                                onClick={() => {
                                    setSelectedAttendance(attendance);
                                    setShowAttendanceModal(true);
                                }}
                            >
                                <td className="px-2 lg:px-4 py-3">
                                    {index + 1}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    {attendance.employee.full_name}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    {attendance.employee.employee_id}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    {new Date(
                                        attendance.date
                                    ).toLocaleDateString()}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full shadow-sm transition duration-300 ${
                                            attendance.status === "present"
                                                ? "bg-green-600 text-white"
                                                : attendance.status === "absent"
                                                ? "bg-red-600 text-white"
                                                : attendance.status === "leave"
                                                ? "bg-yellow-500 text-white"
                                                : attendance.status === "late"
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 flex justify-center items-center text-sm text-gray-300">
                    <div className="space-x-2">
                        {links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url);
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded-lg border ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-700 text-gray-300"
                                } ${
                                    !link.url && "cursor-not-allowed opacity-50"
                                }`}
                                disabled={!link.url}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AttendanceModal
                show={showAttendanceModal}
                onEdit={() => {
                    setIsEdit(true);
                    setShowCreateAttendanceModal(true);
                }}
                onClose={() => {
                    setShowAttendanceModal(false);
                    setSelectedAttendance(null);
                }}
                attendance={selectedAttendance}
            />
            <CreateAttendance
                isOpen={showCreateAttendanceModal}
                onClose={() => {
                    setShowCreateAttendanceModal(false);
                    setShowAttendanceModal(false);
                    setSelectedAttendance(null);
                    setIsEdit(false);
                }}
                isEdit={isEdit}
                editData={selectedAttendance}
                onCreate={handleCreateAttendance}
            />
            {/* Error */}
            <SuccessErrorShowModal
                show={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </AdminLayout>
    );
};

export default Attendance;
