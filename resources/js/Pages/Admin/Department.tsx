import ActionButton from "@/Components/ActionButton";
import CreateDepartment from "@/Components/Department/CreateDepartment";
import DepartmentModal from "@/Components/Department/DepartmentModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Department, DepartmentProps } from "@/types/Admin";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";

export default function DepartmentsPage({
    departments,
    users,
}: DepartmentProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);
    const [showCreateDepartmentModal, setShowCreateDepartmentModal] =
        useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [localDepartments, setLocalDepartments] =
        useState<Department[]>(departments);

    // Handle Department Detail Modal
    const handleDepartmentClick = (department: Department) => {
        setSelectedDepartment(department);
        setShowModal(true);
    };

    // Handle Department Create and Edit
    const handleDepartmentCreate = (data: Department) => {
        const request = isEdit
            ? axios.put(
                  route("departments.update", selectedDepartment?.id),
                  data
              )
            : axios.post(route("departments.store"), data);

        request
            .then((res) => {
                setSelectedDepartment(null);
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
                            target.header_id = null;
                        }
                    }
                    setShowCreateDepartmentModal(false);
                }
            })
            .catch((err) => {
                console.error(err);
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
                console.error(err);
            });
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
                        {localDepartments.map((dept, index) => (
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
                                    {users.find(
                                        (usr) =>
                                            usr.employee_id === dept.header_id
                                    )?.full_name || "No Header"}
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
                    onClose={() => setShowModal(false)}
                    department={selectedDepartment}
                    onDelete={handleDepartmentDelete}
                    onEdit={handleDepartmentEdit}
                    header={users.find(
                        (usr) =>
                            usr.employee_id === selectedDepartment.header_id
                    )}
                />
            )}
            {/* Create Department Modal */}
            <CreateDepartment
                isOpen={showCreateDepartmentModal}
                onClose={() => setShowCreateDepartmentModal(false)}
                onCreate={handleDepartmentCreate}
                isEdit={isEdit}
                editData={selectedDepartment}
                users={users}
            />
        </AdminLayout>
    );
}
