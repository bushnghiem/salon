import type { ReactNode } from "react";


interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}


export default function Modal({
    isOpen,
    title,
    onClose,
    children,
}: ModalProps) {

    if (!isOpen) {
        return null;
    }


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "
            onMouseDown={(e) => {

                if (
                    e.target ===
                    e.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="
                    w-full
                    max-w-md
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-xl
                    bg-white
                    p-6
                    shadow-xl
                "
            >

                <div
                    className="
                        mb-6
                        flex
                        items-center
                        justify-between
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                            text-gray-900
                        "
                    >
                        {title}
                    </h2>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            px-2
                            py-1
                            text-xl
                            text-gray-400
                            hover:bg-gray-100
                            hover:text-gray-600
                        "
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {children}

            </div>

        </div>

    );
}