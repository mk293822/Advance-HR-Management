import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import ActionButton from "../ActionButton";
import { UpcomingEvent } from "@/types/Admin";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: UpcomingEvent) => void;
    editData?: UpcomingEvent | null;
    isEdit?: boolean;
}

export default function CreateEvent({
    isOpen,
    onClose,
    onCreate,
    editData,
    isEdit = false,
}: Props) {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isEdit && editData) {
            setTitle(editData.title);
            setStartDate(editData.start_date);
            setEndDate(editData.end_date);
            setDescription(editData.description || "");
        }
    }, [isEdit, editData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const eventData = {
            title,
            start_date: startDate,
            end_date: endDate,
            description,
        };

        if (onCreate) {
            onCreate(eventData);
        }

        setTitle("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        onClose();
    };

    const Close = () => {
        setTitle("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        onClose();
    };

    return (
        <Modal onClose={onClose} show={isOpen}>
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Start Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">End Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1">Description</label>
                    <textarea
                        className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <ActionButton onClick={Close} color="gray">
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
