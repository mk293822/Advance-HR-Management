import ActionButton from "@/Components/ActionButton";
import CreateDepartment from "@/Components/Department/CreateDepartment";
import DepartmentModal from "@/Components/Department/DepartmentModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Department, DepartmentProps } from "@/types/Admin";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function DepartmentsPage({ departments }: DepartmentProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);
    const [showCreateDepartmentModal, setShowCreateDepartmentModal] =
        useState(false);

    const handleDepartmentClick = (department: Department) => {
        setSelectedDepartment(department);
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <Head title="Departments" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Departments</h1>
                <ActionButton
                    color="blue"
                    onClick={() => setShowCreateDepartmentModal(true)}
                >
                    + Add Department
                </ActionButton>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full md:text-sm text-left text-xs text-gray-300 bg-gray-800">
                    <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-2 lg:px-4 py-3">No</th>
                            <th className="px-2 lg:px-4 py-3">Department</th>
                            <th className="px-2 lg:px-4 py-3">Head</th>
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
                        {departments.map((dept, index) => (
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
                                    {dept.head}
                                </td>
                                <td className="px-2 lg:px-4 py-3 hidden lg:table-cell">
                                    {dept.employees_count}
                                </td>
                                <td className="px-2 lg:px-4 py-3 hidden xl:table-cell">
                                    {new Date(
                                        dept.created_at
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
                    onClose={() => setShowModal(false)}
                    department={selectedDepartment}
                />
            )}
            {/* Create Department Modal */}
            <CreateDepartment
                isOpen={showCreateDepartmentModal}
                onClose={() => setShowCreateDepartmentModal(false)}
            />
        </AdminLayout>
    );
}
