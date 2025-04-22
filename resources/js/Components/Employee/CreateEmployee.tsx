import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import ActionButton from "../ActionButton";
import { Gender, Status } from "@/types/Enums";
import { Department, Employee, PositionProps, RoleProps } from "@/types/Admin";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Employee) => void;
    editData?: Employee | null;
    isEdit?: boolean;
    departments?: Department[];
    positions?: PositionProps[];
    roles?: RoleProps[];
}

export default function CreateEmployee({
    isOpen,
    onClose,
    onCreate,
    editData,
    isEdit = false,
    departments,
    positions,
    roles,
}: Props) {
    const initialForm = {
        name: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
        department: "",
        position: "",
        role: "",
        date_hired: "",
        salary: "",
        status: "",
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (isEdit && editData) {
            setFormData({
                name: editData.name || "",
                email: editData.email || "",
                first_name: editData.first_name || "",
                last_name: editData.last_name || "",
                phone: editData.phone || "",
                password: "",
                gender: editData.gender || "",
                date_of_birth: editData.date_of_birth || "",
                address: editData.address?.replace(/\\n/g, "\n") || "",
                department: editData?.department?.id?.toString() ?? "",
                position: editData.position.id.toString() || "",
                role: editData.role.id.toString() || "",
                date_hired: editData.date_hired || "",
                salary: editData.salary?.toString() || "",
                status: editData.status || "",
            });
        } else {
            setFormData(initialForm); // also reset when switching to create mode
        }
    }, [isEdit, editData]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        const modifiedFormData: any = { ...formData };

        ["department", "position", "role"].forEach((key) => {
            if (key in modifiedFormData) {
                modifiedFormData[`${key}_id`] = modifiedFormData[key];
                delete modifiedFormData[key];
            }
        });

        e.preventDefault();
        onCreate(modifiedFormData);
        setFormData(initialForm);
        onClose();
    };

    const handleClose = () => {
        setFormData(initialForm);
        onClose();
    };

    const fieldGroups = [
        {
            title: "Basic Info",
            fields: [
                "name",
                "email",
                "first_name",
                "last_name",
                "password",
                "phone",
            ],
        },
        {
            title: "Details",
            fields: ["gender", "date_of_birth", "address"],
        },
        {
            title: "Job",
            fields: ["department", "position", "role"],
        },
        {
            title: "Employment",
            fields: ["date_hired", "salary", "status"],
        },
    ];

    const renderField = (field: string) => {
        const type = field.includes("date")
            ? "date"
            : field === "password"
            ? "password"
            : field === "salary"
            ? "number"
            : field === "email"
            ? "email"
            : field === "address"
            ? "textarea"
            : ["status", "position", "role", "department", "gender"].includes(
                  field
              )
            ? "select"
            : "text";

        const label = field
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
            <div
                key={field}
                className={`${
                    type === "textarea" ? "md:col-span-2" : ""
                } flex flex-col`}
            >
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
                {type === "textarea" ? (
                    <textarea
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                    />
                ) : type === "select" ? (
                    <select
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select {label}</option>
                        {field === "status" &&
                            Object.values(Status).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        {field === "gender" &&
                            Object.values(Gender).map((gender) => (
                                <option key={gender} value={gender}>
                                    {gender}
                                </option>
                            ))}
                        {field === "position" &&
                            positions?.map((pos) => (
                                <option key={pos.id} value={pos.id}>
                                    {pos.name}
                                </option>
                            ))}
                        {field === "role" &&
                            roles?.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        {field === "department" &&
                            departments?.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        required
                    />
                )}
            </div>
        );
    };

    return (
        <Modal onClose={handleClose} show={isOpen}>
            <h2 className="text-2xl font-semibold text-white mb-6">
                {isEdit ? "Edit Employee" : "Create New Employee"}
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-8 max-h-[80vh] overflow-y-auto pr-2"
            >
                {fieldGroups.map((group) => (
                    <div key={group.title} className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-400 border-b pb-1">
                            {group.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {group.fields.map(renderField)}
                        </div>
                    </div>
                ))}

                <div className="flex justify-end space-x-3 pt-6">
                    <ActionButton onClick={handleClose} color="gray">
                        Cancel
                    </ActionButton>
                    <ActionButton color="blue" type="submit">
                        {isEdit ? "Update" : "Create"}
                    </ActionButton>
                </div>
            </form>
        </Modal>
    );
}
