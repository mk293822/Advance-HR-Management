import React, { Fragment, useEffect, useState } from "react";
import Modal from "../Modal";
import { Department } from "@/types/Admin";
import { Status } from "@/types/Enums";
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import Fuse from "fuse.js";
import ActionButton from "../ActionButton";
import axios from "axios";

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

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: formProps) => void;
    isEdit: boolean;
    department_id: number | null;
}

export default function CreateDepartment({
    isOpen,
    onClose,
    onCreate,
    isEdit,
    department_id,
}: Props) {
    const [header_ids, setHeaderIds] = useState<string[]>([]);
    const [users, setUsers] = useState<
        Array<{
            full_name: string;
            employee_id: string;
        }>
    >([]);

    const initialForm: formProps = {
        name: "",
        header_id: "",
        description: "",
        status: "",
        participants: [],
    };

    const [form, setForm] = useState<formProps>(initialForm);
    const [showParticipantModal, setShowParticipantModal] = useState(false);

    const [query, setQuery] = useState("");
    const fuse = new Fuse(users, {
        keys: ["full_name"],
        threshold: 0.5,
    });
    const [selectedHead, setSelectedHead] = useState<string | null>(
        form.header_id
    );

    useEffect(() => {
        if (isEdit && department_id) {
            axios
                .get(route("departments.edit", department_id))
                .then((res) => {
                    if (res.data.status === "success") {
                        setForm(res.data.department);
                        setHeaderIds(res.data.header_ids);
                        setUsers(res.data.users);
                        setSelectedHead(res.data.department.header_id);
                    } else {
                        setForm(initialForm);
                        setHeaderIds([]);
                        setUsers([]);
                    }
                })
                .catch((err) => {});
        }
    }, [department_id, isEdit]);

    const filteredUsers =
        query === "" ? users : fuse.search(query).map((result) => result.item);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(form);
        setForm(initialForm);
        onClose();
    };

    const Close = () => {
        setForm(initialForm);
        setSelectedHead("");
        onClose();
        setSelectedHead(null);
    };

    return (
        <>
            <Modal onClose={onClose} show={isOpen}>
                <h2 className="text-xl font-semibold mb-4">
                    {isEdit ? "Update Department" : "Create New Department"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-2 sm:space-y-4"
                >
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-1">Head</label>
                            <Combobox
                                value={selectedHead}
                                onChange={(value) => {
                                    setSelectedHead(value);
                                    setForm({
                                        ...form,
                                        header_id: value || "",
                                    });
                                }}
                            >
                                <div className="relative">
                                    <ComboboxInput
                                        className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(event) =>
                                            setQuery(event.target.value)
                                        }
                                        displayValue={(value: string) =>
                                            users.find(
                                                (u) => u.employee_id === value
                                            )?.full_name || ""
                                        }
                                        placeholder="Search user..."
                                    />
                                    <ComboboxOptions className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded max-h-60 overflow-auto shadow-lg">
                                        {filteredUsers.length === 0 ? (
                                            <div className="px-4 py-2 text-sm text-gray-400">
                                                No users found.
                                            </div>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <ComboboxOption
                                                    key={user.employee_id}
                                                    value={user.employee_id}
                                                    as={Fragment}
                                                >
                                                    {({ active, selected }) => (
                                                        <li
                                                            className={`cursor-pointer px-4 py-2 ${
                                                                active
                                                                    ? "bg-blue-600 text-white"
                                                                    : "text-gray-300"
                                                            }`}
                                                        >
                                                            {user.full_name}
                                                        </li>
                                                    )}
                                                </ComboboxOption>
                                            ))
                                        )}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Status</label>
                            <select
                                className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value as Status,
                                    })
                                }
                                required
                            >
                                <option value="">Select Status</option>
                                {Object.values(Status).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            Participants
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowParticipantModal(true)}
                            className="w-full text-left px-4 py-2 rounded bg-gray-700 border border-gray-600 hover:bg-gray-600"
                        >
                            {form.participants.length > 0
                                ? `${form.participants.length} selected`
                                : "Select Participants"}
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.description || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <ActionButton
                            type="button"
                            onClick={Close}
                            color="gray"
                        >
                            Cancel
                        </ActionButton>
                        <ActionButton type="submit" color="blue">
                            {isEdit ? "Update" : "Create"}
                        </ActionButton>
                    </div>
                </form>
            </Modal>

            {/* Popup Modal */}
            {showParticipantModal && (
                <Modal
                    show={showParticipantModal}
                    onClose={() => setShowParticipantModal(false)}
                >
                    <h3 className="text-lg font-semibold mb-4">
                        Select Participants
                    </h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {users
                            .filter(
                                (user) =>
                                    !header_ids.some(
                                        (h) => h === user.employee_id
                                    )
                            )
                            .map((user) => (
                                <div
                                    key={user.employee_id}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.participants.some(
                                            (participant) =>
                                                participant.employee_id ===
                                                user.employee_id
                                        )}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setForm({
                                                    ...form,
                                                    participants: [
                                                        ...form.participants,
                                                        user,
                                                    ],
                                                });
                                            } else {
                                                setForm({
                                                    ...form,
                                                    participants:
                                                        form.participants.filter(
                                                            (participant) =>
                                                                participant.employee_id !==
                                                                user.employee_id
                                                        ),
                                                });
                                            }
                                        }}
                                    />
                                    <span>{user.full_name}</span>
                                </div>
                            ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => setShowParticipantModal(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Done
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
