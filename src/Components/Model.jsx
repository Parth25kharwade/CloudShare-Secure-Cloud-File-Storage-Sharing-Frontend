import { X } from "lucide-react";

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   confirmText,
                   cancelText,
                   onConfirm,
                   confirmationButtonClass = "bg-purple-600 hover:bg-purple-700",
                   size = "md",
               }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
                className={`bg-white rounded-xl shadow-lg w-full ${sizeClasses[size]} p-6 relative animate-fadeIn`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                {title && (
                    <h2 className="text-lg font-semibold mb-4">
                        {title}
                    </h2>
                )}

                {/* Content */}
                <div className="mb-6">
                    {children}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3">
                    {cancelText && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                        >
                            {cancelText}
                        </button>
                    )}

                    {confirmText && (
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-lg text-white transition ${confirmationButtonClass}`}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;