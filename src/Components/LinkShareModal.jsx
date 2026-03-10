
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "./Model.jsx";

const LinkShareModal = ({
                            isOpen,
                            onClose,
                            link,
                            title = "Share File"
                        }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast.success("Link copied to clipboard");

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy link:", error);
            toast.error("Failed to copy link");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            confirmText={null}
            cancelText="Close"
        >
            <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                    Anyone with this link can access this file.
                </p>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={link}
                        readOnly
                        className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50"
                    />

                    <button
                        onClick={handleCopy}
                        className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LinkShareModal;