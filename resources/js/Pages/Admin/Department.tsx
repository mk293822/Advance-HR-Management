import ActionButton from "@/Components/ActionButton";
import CreateDepartment from "@/Components/Department/CreateDepartment";
import DepartmentModal from "@/Components/Department/DepartmentModal";
import SuccessErrorShowModal from "@/Components/SuccessErrorShowModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Department, DepartmentProps } from "@/types/Admin";
import { Status } from "@/types/Enums";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

interface formProps {
    name: string;
    description: string | null;
    header_id: string;
    status: Status | string; // Use string literal union if status is fixed
    participants: Array<{
        full_name: string;
        employee_id: string;
    }>;
}

export default function DepartmentsPage({
    departments,
    users,
    header_ids,
}: DepartmentProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);
    const [showCreateDepartmentModal, setShowCreateDepartmentModal] =
        useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [localDepartments, setLocalDepartments] =
        useState<Department[]>(departments);
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
        return new Fuse(localDepartments, {
            keys: ["name", "header"],
            threshold: 0.5,
        });
    }, [localDepartments]);

    const filteredDepartments = useMemo(() => {
        return searchQuery
            ? fuse.search(searchQuery).map((res) => res.item)
            : localDepartments;
    }, [fuse, searchQuery, localDepartments]);

    // Handle Department Detail Modal
    const handleDepartmentClick = (department: Department) => {
        setSelectedDepartment(department);
        setShowModal(true);
    };

    // Handle Department Create and Edit
    const handleDepartmentCreate = (data: formProps) => {
        const request = isEdit
            ? axios.put(
                  route("departments.update", selectedDepartment?.id),
                  data
              )
            : axios.post(route("departments.store"), data);

        request
            .then((res) => {
                if (res.data.status === "success") {
                    setLocalDepartments((prev) => {
                        let updated;
                        if (isEdit && selectedDepartment) {
                            updated = prev.map((event) =>
                                event.id === selectedDepartment.id
                                    ? res.data.data
                                    : event
                            );
                        } else {
                            updated = [...prev, res.data.data];
                        }

                        return updated;
                    });

                    if (res.data.unset_header) {
                        const target = localDepartments.find(
                            (dep) => dep.id === res.data.unset_header
                        );
                        if (target) {
                            if (target.header) {
                                target.header.employee_id = null;
                            }
                        }
                    }
                }
                setShowCreateDepartmentModal(false);
                setSelectedDepartment(null);
            })
            .catch((err) => {
                setErrorMessage({
                    message: err.response.data.errors,
                    status: err.response.status,
                });
                setShowErrorModal(true);
                setIsEdit(false);
                setSelectedDepartment(null);
                setShowCreateDepartmentModal(false);
                setShowModal(false);
            });
    };

    // Handle Department Edit
    const handleDepartmentEdit = () => {
        setIsEdit(true);
        setShowModal(false);
        setShowCreateDepartmentModal(true);
    };

    // Hadle Department Delete
    const handleDepartmentDelete = () => {
        axios
            .delete(route("departments.destroy", selectedDepartment?.id))
            .then((res) => {
                if (res.data.status === "success") {
                    setLocalDepartments((prev) =>
                        prev.filter(
                            (employee) => employee.id !== selectedDepartment?.id
                        )
                    );
                    setShowModal(false);
                }
            })
            .catch((err) => {
                setErrorMessage({
                    message: err.response.data.errors,
                    status: err.response.status,
                });
                setShowErrorModal(true);
                setIsEdit(false);
                setSelectedDepartment(null);
                setShowCreateDepartmentModal(false);
                setShowModal(false);
            });
    };

    return (
        <AdminLayout>
            <Head title="Departments" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Departments</h1>
                <div className="flex justify-end items-center w-[60%] gap-4">
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
                    <ActionButton
                        color="blue"
                        onClick={() => setShowCreateDepartmentModal(true)}
                    >
                        + Add Department
                    </ActionButton>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full md:text-sm text-left text-xs text-gray-300 bg-gray-800">
                    <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-2 lg:px-4 py-3">No</th>
                            <th className="px-2 lg:px-4 py-3">Department</th>
                            <th className="px-2 lg:px-4 py-3">Header</th>
                            <th className="px-2 lg:px-4 py-3 hidden lg:table-cell">
                                Employees
                            </th>
                            <th className="px-2 lg:px-4 py-3 hidden xl:table-cell">
                                Created
                            </th>
                            <th className="px-2 lg:px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDepartments.map((dept, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-700 hover:bg-gray-600"
                                onClick={() => handleDepartmentClick(dept)}
                            >
                                <td className="px-2 lg:px-4 py-3">
                                    {index + 1}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    {dept.name}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    {dept.header?.full_name || "No Header"}
                                </td>
                                <td className="px-2 lg:px-4 py-3 hidden lg:table-cell">
                                    {dept.employees_count}
                                </td>
                                <td className="px-2 lg:px-4 py-3 hidden xl:table-cell">
                                    {new Date(
                                        dept.created_at
                                            ? new Date(
                                                  dept.created_at
                                              ).toLocaleDateString()
                                            : "N/A"
                                    ).toLocaleDateString()}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    <span
                                        className={`inline-block px-3 py-1 text-xs uppercase tracking-wide rounded-full shadow-sm transition duration-300 ${
                                            dept.status === "Active"
                                                ? "bg-green-600 text-white"
                                                : dept.status === "Inactive"
                                                ? "bg-yellow-500 text-white"
                                                : dept.status === "Suspended"
                                                ? "bg-red-600 text-white"
                                                : dept.status === "Pending"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-500 text-white"
                                        }`}
                                    >
                                        {dept.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {/* Department Modal */}
            {selectedDepartment && (
                <DepartmentModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedDepartment(null);
                    }}
                    department={selectedDepartment}
                    onDelete={handleDepartmentDelete}
                    onEdit={handleDepartmentEdit}
                    header={selectedDepartment.header}
                />
            )}
            {/* Create Department Modal */}
            <CreateDepartment
                isOpen={showCreateDepartmentModal}
                onClose={() => {
                    setShowCreateDepartmentModal(false);
                    setIsEdit(false);
                    setShowModal(false);
                    setSelectedDepartment(null);
                }}
                onCreate={handleDepartmentCreate}
                isEdit={isEdit}
                toeditData={selectedDepartment}
                users={users}
                header_ids={header_ids}
            />

            {/* Error Modal */}
            <SuccessErrorShowModal
                show={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
        </AdminLayout>
    );
}
