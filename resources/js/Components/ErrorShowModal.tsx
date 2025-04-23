import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { useEffect } from "react";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";

interface ErrorModalProps {
    show: boolean;
    message: string;
    onClose: () => void;
    duration?: number; // in milliseconds (optional)
}

export default function ErrorShowModal({
    show,
    message,
    onClose,
    duration = 3000, // default: 3 seconds
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
                    <DialogPanel role="alert" className="alert alert-error">
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
                        <span className="text-wrap max-w-[60vw] max-h-[10vh] overflow-y-auto">
                            {message.slice(0, 100)}
                        </span>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
