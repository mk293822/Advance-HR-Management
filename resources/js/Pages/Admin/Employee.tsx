import ActionButton from "@/Components/ActionButton";
import CreateEmployee from "@/Components/Employee/CreateEmployee";
import EmployeeModal from "@/Components/Employee/EmployeeModal";
import AdminLayout from "@/Layouts/AdminLayout";
import { Employee, EmployeeProps } from "@/types/Admin";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";

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

    // Search box
    const [searchQuery, setSearchQuery] = useState("");

    const fuse = useMemo(() => {
        return new Fuse(localEmployees, {
            keys: ["name", "first_name", "last_name"],
            threshold: 0.5,
        });
    }, [localEmployees]);

    const filteredEmployees = useMemo(() => {
        return searchQuery
            ? fuse.search(searchQuery).map((res) => res.item)
            : localEmployees;
    }, [fuse, searchQuery, localEmployees]);

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
                if (res.data.status === "success") {
                    setLocalEmployees((prev) => {
                        let updated;
                        if (showEditEmployee && selectedEmployee) {
                            updated = prev.map((pre) =>
                                pre.id === selectedEmployee.id
                                    ? res.data.data
                                    : pre
                            );
                        } else {
                            updated = [...prev, res.data.data];
                        }

                        return updated;
                    });
                }
                setShowCreateEmployee(false);
                setSelectedEmployee(null);
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

                    {/* Action Button */}
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
                            <th className="px-2 lg:px-4 hidden 2xl:table-cell py-3 text-left">
                                Role
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left">
                                Department
                            </th>
                            <th className="px-2 lg:px-4 py-3 hidden xl:table-cell text-left">
                                Position
                            </th>
                            <th className="px-2 hidden md:table-cell lg:px-4 py-3 text-left">
                                Id
                            </th>
                            <th className="px-2 lg:px-4 py-3 text-left hidden sm:table-cell">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y  divide-gray-700">
                        {filteredEmployees.map((employee, index) => (
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
                                <td className="px-2 lg:px-4 hidden 2xl:table-cell py-3 capitalize">
                                    {employee.role.name
                                        .replace(/_/g, " ")
                                        .replace(/\b\w/g, (l) =>
                                            l.toUpperCase()
                                        )}
                                </td>
                                <td className="px-2 lg:px-4 py-3 capitalize">
                                    {employee.department?.name ||
                                        "No department"}
                                </td>
                                <td className="px-2 lg:px-4 hidden xl:table-cell py-3">
                                    {employee.position.name}
                                </td>
                                <td className="px-2 hidden md:table-cell lg:px-4 py-3">
                                    {employee.employee_id}
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
