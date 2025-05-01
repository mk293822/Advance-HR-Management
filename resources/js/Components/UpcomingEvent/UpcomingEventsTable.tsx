import { router } from '@inertiajs/react';
import ActionButton from '../ActionButton';
import { UpcomingEvent } from '@/types/Admin';

const UpcomingEventsTable = ({
    localUpcomingEvents,
    event_type,
    handleAddEventClick,
    handleUpcomingEventClick,
}: {
    localUpcomingEvents: UpcomingEvent[];
    handleAddEventClick: () => void;
    event_type: "upcoming" | "all";
    handleUpcomingEventClick: (event: UpcomingEvent) => void;
}) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow p-6 pt-4">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {event_type === "upcoming"
                        ? "Upcoming Events"
                        : "All Events"}
                </h2>
                <div className="flex gap-3 justify-center items-center">
                    <ActionButton color="blue" onClick={handleAddEventClick}>
                        + Add Event
                    </ActionButton>
                    <ActionButton
                        color="green"
                        onClick={() =>
                            router.visit(
                                route("dashboard", {
                                    event_type:
                                        event_type === "upcoming"
                                            ? "all"
                                            : "upcoming",
                                }),
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                }
                            )
                        }
                    >
                        {event_type === "upcoming"
                            ? "View All"
                            : "View Upcoming"}
                    </ActionButton>
                </div>
            </div>

            <ul className="text-sm text-gray-300 max-h-96 overflow-y-auto divide-y divide-gray-700">
                {localUpcomingEvents.length > 0 ? (
                    localUpcomingEvents.map((event) => (
                        <li key={event.id}>
                            <button
                                onClick={() => handleUpcomingEventClick(event)}
                                className="flex flex-col w-full hover:bg-gray-700 sm:flex-row justify-between items-start sm:items-center py-3 px-2 rounded-lg transition-colors"
                            >
                                <span className="font-medium text-white">
                                    {event.title}
                                </span>
                                <div className="text-xs sm:text-sm text-gray-400 flex mt-1 sm:mt-0 sm:text-right">
                                    <span className="block lg:hidden">
                                        At{" "}
                                        <span className="text-blue-400">
                                            {event.start_date}
                                        </span>
                                    </span>
                                    <span className="hidden lg:block">
                                        from{" "}
                                        <span className="text-blue-400">
                                            {event.start_date}
                                        </span>
                                    </span>
                                    <span className="hidden lg:block ml-0 sm:ml-2">
                                        to{" "}
                                        <span className="text-green-400">
                                            {event.end_date}
                                        </span>
                                    </span>
                                </div>
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="flex justify-center items-center py-20 px-2 text-2xl">
                        <span className="text-gray-500">
                            No upcoming events
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default UpcomingEventsTable
