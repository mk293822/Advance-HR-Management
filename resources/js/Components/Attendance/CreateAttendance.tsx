import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import ActionButton from "../ActionButton";
import { AttendanceType } from "@/types/Admin";
import { AttendanceEnum } from "@/types/Enums";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: AttendanceType) => void;
    editData?: AttendanceType | null;
    isEdit?: boolean;
}

export default function CreateAttendance({
    isOpen,
    onClose,
    onCreate,
    editData,
    isEdit = false,
}: Props) {
    const initialForm: AttendanceType = {
        id: 0,
        employee: {
            full_name: "",
            employee_id: "",
        },
        status: "",
        date: "",
        check_in: "",
        check_out: "",
        remark: "",
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (isEdit && editData) {
            setFormData(editData);
        } else {
            setFormData(initialForm);
        }
    }, [isEdit, editData]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        if (name === "employee_id" || name === "full_name") {
            setFormData((prev) => ({
                ...prev,
                employee: {
                    ...prev.employee,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(formData);
        setFormData(initialForm);
        onClose();
    };

    const handleClose = () => {
        setFormData(initialForm);
        onClose();
    };

    const fields = [
        { label: "Employee ID", name: "employee_id", type: "text" },
        { label: "Full Name", name: "full_name", type: "text" },
        {
            label: "Status",
            name: "status",
            type: "select",
            options: Object.entries(AttendanceEnum).map(([key, value]) => ({
                label:
                    key.charAt(0) +
                    key.slice(1).toLowerCase().replace("_", " "),
                value: value,
            })),
        },
        { label: "Date", name: "date", type: "date" },
        { label: "Check In", name: "check_in", type: "time" },
        { label: "Check Out", name: "check_out", type: "time" },
        { label: "Remark", name: "remark", type: "textarea" },
    ];

    return (
        <Modal onClose={handleClose} show={isOpen}>
            <h2 className="text-2xl font-semibold text-white mb-6">
                {isEdit ? "Edit Attendance" : "Create New Attendance"}
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-5 max-h-[80vh] overflow-y-auto pr-2"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => (
                        <div
                            key={field.name}
                            className={`${
                                field.type === "textarea" ? "md:col-span-2" : ""
                            }`}
                        >
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {field.label}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={
                                        field.name in formData.employee
                                            ? String(
                                                  formData.employee[
                                                      field.name as keyof typeof formData.employee
                                                  ] || ""
                                              )
                                            : String(
                                                  formData[
                                                      field.name as keyof AttendanceType
                                                  ] || ""
                                              )
                                    }
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            ) : field.type === "select" ? (
                                <select
                                    name={field.name}
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 capitalize py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    {field.options?.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={
                                        field.name in formData.employee
                                            ? String(
                                                  formData.employee[
                                                      field.name as keyof typeof formData.employee
                                                  ] || ""
                                              )
                                            : String(
                                                  formData[
                                                      field.name as keyof AttendanceType
                                                  ] || ""
                                              )
                                    }
                                    onChange={handleChange}
                                    required={
                                        field.name !== "check_in" &&
                                        field.name !== "check_out"
                                    }
                                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    ))}
                </div>

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
