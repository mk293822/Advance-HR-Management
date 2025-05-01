import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import ActionButton from "../ActionButton";
import { LeaveRequest } from "@/types/Admin";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: LeaveRequest) => void;
    editData?: LeaveRequest | null;
    isEdit?: boolean;
}

export default function CreateLeaveRequestModal({
    isOpen,
    onClose,
    onCreate,
    editData,
    isEdit = false,
}: Props) {
    const initialForm: LeaveRequest = {
        id: 0,
        user_id: 0,
        employee_id: "",
        employee_name: "",
        start_date: "",
        end_date: "",
        leave_type: "Casual",
        reason: "",
        status: "pending",
        approved_by: null,
    };

    const [formData, setFormData] = useState<LeaveRequest>(initialForm);

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
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.type === "number" ? Number(value) : value,
        }));
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
        { label: "Start Date", name: "start_date", type: "date" },
        { label: "End Date", name: "end_date", type: "date" },
        { label: "Leave Type", name: "leave_type", type: "text" },
        {
            label: "Status",
            name: "status",
            type: "select",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
            ],
        },
        { label: "Reason", name: "reason", type: "textarea" },
    ];

    const input_types = (field: {
        name: string;
        type: string;
        options?: Array<{ label: string; value: string }>;
    }) => {
        const value = String(
            formData[field.name as keyof LeaveRequest] ?? ""
        );

        if (field.type === "textarea") {
            return (
                <textarea
                    name={field.name}
                    value={value}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
            );
        } else if (field.type === "select") {
            return (
                <select
                    name={field.name}
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 capitalize py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                >
                    {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        } else {
            return (
                <input
                    type={field.type}
                    name={field.name}
                    value={value}
                    onChange={handleChange}
                    required={
                        field.name !== "approved_by" &&
                        field.name !== "attendance_id"
                    }
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                />
            );
        }
    };

    return (
        <Modal onClose={handleClose} show={isOpen}>
            <h2 className="text-2xl font-semibold text-white mb-6">
                {isEdit ? "Edit Leave Request" : "Create Leave Request"}
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-5 max-h-[80vh] overflow-y-auto pr-2"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            value={formData.employee_name}
                            readOnly
                            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Employee Id:</label>
                        <input
                            type="text"
                            value={formData.employee_id}
                            readOnly
                            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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
                            {input_types(field)}
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
