import React, { useState } from "react";
import Modal from "../Modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateDepartment({ isOpen, onClose }: Props) {
    const [name, setName] = useState("");
    const [head, setHead] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setName("");
        setHead("");
        setDescription("");
    };

    const Close = () => {
        setName("");
        setHead("");
        setDescription("");
        onClose();
    };

    return (
        <Modal onClose={onClose} show={isOpen}>
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Head</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={head}
                        onChange={(e) => setHead(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Description</label>
                    <textarea
                        className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={Close}
                        className="px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    );
}
