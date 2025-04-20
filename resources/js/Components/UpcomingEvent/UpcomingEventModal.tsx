import Modal from "@/Components/Modal";
import { UpcomingEvent } from "@/types/Admin";
import ActionButton from "../ActionButton";

export default function UpcomingEventModal({
    event,
    open,
    onClose,
    onEdit,
    onDelete,
}: {
    event: UpcomingEvent | null;
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <>
            {event && (
                <Modal show={open} onClose={onClose}>
                    <h2 className="text-2xl font-bold border-b pb-2 mb-4">
                        📅 {event.title}
                    </h2>

                    <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="font-medium text-gray-600 dark:text-gray-300">
                                Start Date
                            </p>
                            <p className="text-lg font-semibold">
                                {new Date(
                                    event.start_date
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="font-medium text-gray-600 dark:text-gray-300">
                                End Date
                            </p>
                            <p className="text-lg font-semibold">
                                {new Date(event.end_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {event.description && (
                        <div className="bg-gray-50 mb-4 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-300 mb-1 font-medium">
                                Description
                            </p>
                            <p>{event.description}</p>
                        </div>
                    )}

                    <div className="justify-end flex space-x-2">
                        <ActionButton onClick={onDelete} color="red">
                            Delete
                        </ActionButton>
                        <ActionButton onClick={onEdit} color="yellow">
                            Edit
                        </ActionButton>
                        <ActionButton onClick={onClose} color="green">
                            Close
                        </ActionButton>
                    </div>
                </Modal>
            )}
        </>
    );
}
