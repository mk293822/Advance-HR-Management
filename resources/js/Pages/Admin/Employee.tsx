import ActionButton from "@/Components/ActionButton";
import CreateEmployee from "@/Components/Employee/CreateEmployee";
import EmployeeModal from "@/Components/Employee/EmployeeModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Employee, EmployeeProps } from "@/types/Admin";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";

const index = ({
    all_employees,
    all_departments,
    all_positions,
    all_roles,
}: EmployeeProps) => {
    const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null
    );
    const [showCreateEmployee, setShowCreateEmployee] =
        useState<boolean>(false);
    const [showEditEmployee, setShowEditEmployee] = useState(false);
    const [localEmployees, setLocalEmployees] =
        useState<Employee[]>(all_employees);

    // Handle employee modal
    const handleEmployeeClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setShowEmployeeModal(true);
    };

    // Handle Create and Update Upcoming Event
    const handleCreateEmployee = (data: Employee) => {
        const request = showEditEmployee
            ? axios.put(route("employees.update", selectedEmployee?.id), data)
            : axios.post(route("employees.store"), data);

        request
            .then((res) => {
                setSelectedEmployee(null);
                if (res.data.status === "success") {
                    setLocalEmployees((prev) => {
                        let updated;
                        if (showEditEmployee && selectedEmployee) {
                            updated = prev.map((event) =>
                                event.id === selectedEmployee.id
                                    ? res.data.data
                                    : event
                            );
                        } else {
                            updated = [...prev, res.data.data];
                        }

                        return updated;
                    });

                    setShowCreateEmployee(false);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // Handle Edit Employee
    const handleEditEmployee = () => {
        setShowEditEmployee(true);
        setShowCreateEmployee(true);
        setShowEmployeeModal(false);
    };

    // Handle Delete Employee
    const handleDeleteEmployee = () => {
        axios
            .delete(route("employees.destroy", selectedEmployee?.id))
            .then((res) => {
                if (res.data.status === "success") {
                    setLocalEmployees((prev) =>
                        prev.filter(
                            (employee) => employee.id !== selectedEmployee?.id
                        )
                    );
                    setShowEmployeeModal(false);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <AdminLayout>
            <Head title="Employee" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Leave Requests
                </h1>
                <div className="flex gap-4">
                    <ActionButton
                        color="blue"
                        onClick={() => setShowCreateEmployee(true)}
                    >
                        + Add Employee
                    </ActionButton>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg scrollbar-hidden shadow">
                <table className="min-w-full text-xs md:text-sm text-gray-300">
                    <thead className="text-xs uppercase text-gray-400 bg-gray-700">
                        <tr>
                            <th className="px-2 lg:px-4 py-3 text-left">No</th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Name
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Role
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Department
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Position
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left hidden sm:table-cell">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y  divide-gray-700">
                        {localEmployees.map((employee, index) => (
                            <tr
                                key={index}
                                onClick={() => handleEmployeeClick(employee)}
                                className="hover:bg-gray-600"
                            >
                                <td className="px-2 lg:px-4 py-3">
                                    {index + 1}
                                </td>
                                <td className="px-2 lg:px-4 py-3 capitalize">
                                    {employee.first_name} {employee.last_name}
                                </td>
                                <td className="px-2 lg:px-4 py-3 capitalize">
                                    {employee.role.name}
                                </td>
                                <td className="px-2 lg:px-4 py-3 capitalize">
                                    {employee.department.name}
                                </td>
                                <td className="px-2 lg:px-4 py-3">
                                    {employee.position.name}
                                </td>
                                <td className="px-2 lg:px-4 py-3 hidden sm:table-cell">
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full shadow-sm transition duration-300 ${
                                            employee.status === "Active"
                                                ? "bg-green-600 text-white"
                                                : employee.status === "Inactive"
                                                ? "bg-yellow-500 text-white"
                                                : employee.status ===
                                                  "Suspended"
                                                ? "bg-red-600 text-white"
                                                : employee.status === "Pending"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-500 text-white"
                                        }`}
                                    >
                                        {employee.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {/* Employee Modal */}
            <EmployeeModal
                show={showEmployeeModal}
                employee={selectedEmployee}
                onClose={() => setShowEmployeeModal(false)}
                onDelete={handleDeleteEmployee}
                onEdit={handleEditEmployee}
            />
            <CreateEmployee
                isOpen={showCreateEmployee}
                onClose={() => {
                    setShowCreateEmployee(false);
                    setShowEditEmployee(false);
                }}
                onCreate={(data) => handleCreateEmployee(data)}
                editData={selectedEmployee}
                isEdit={showEditEmployee}
                departments={all_departments}
                positions={all_positions}
                roles={all_roles}
            />
        </AdminLayout>
    );
};

export default index;
