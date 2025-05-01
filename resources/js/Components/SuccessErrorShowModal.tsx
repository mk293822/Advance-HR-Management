import { useEffect } from "react";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";

interface ErrorModalProps {
    show: boolean;
    message: { message: string; status: number };
    onClose: () => void;
    duration?: number; // in milliseconds (optional)
}

export default function SuccessErrorShowModal({
    show,
    message,
    onClose,
    duration = 5000, // default: 3 seconds
}: ErrorModalProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    return (
        <Transition show={show} leave="duration-100">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 mt-4 max-h-[10vh] flex justify-end items-start px-4"
                onClose={() => {}}
                static
            >
                <TransitionChild
                    enter="ease-out duration-100"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        role="alert"
                        className={`alert ${
                            message.status === 200
                                ? "alert-success"
                                : "alert-error"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-wrap capitalize flex flex-col max-w-[60vw] max-h-[10vh] overflow-y-auto">
                            {message.status === 200
                                ? message.message
                                : message.status === 500
                                ? "Internal Server Error"
                                : Object.values(message.message)
                                      .flat()
                                      .map((err, index) => (
                                          <span key={index}>{err}</span>
                                      ))}
                        </span>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
