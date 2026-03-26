import { useState } from "react";
import { X, Loader } from "lucide-react";

const FilePreviewModal = ({ isOpen, onClose, file, previewUrl, loading }) => {
    if (!isOpen) return null;

    const getPreviewType = (fileName) => {
        if (!fileName) return null;
        const extension = fileName.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) return "image";
        if (["mp4", "webm", "mov"].includes(extension)) return "video";
        if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
        if (["pdf"].includes(extension)) return "pdf";
        return null;
    };

    const type = file ? getPreviewType(file.name) : null;

    const renderPreview = () => {
        if (loading) {
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "60px 0" }}>
                    <Loader size={32} className="animate-spin" style={{ color: "#7c3aed" }} />
                    <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading preview...</p>
                </div>
            );
        }

        if (!previewUrl || !type) {
            return (
                <div style={{ padding: "60px 0", textAlign: "center" }}>
                    <p style={{ color: "#6b7280", fontSize: "15px" }}>Preview not available for this file type.</p>
                </div>
            );
        }

        switch (type) {
            case "image":
                return (
                    <img
                        src={previewUrl}
                        alt={file.name}
                        style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px" }}
                    />
                );
            case "video":
                return (
                    <video src={previewUrl} controls style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "8px" }} />
                );
            case "audio":
                return <audio src={previewUrl} controls style={{ width: "100%" }} />;
            case "pdf":
                return (
                    <iframe
                        src={previewUrl}
                        title={file.name}
                        style={{ width: "100%", height: "70vh", border: "none", borderRadius: "8px" }}
                    />
                );
            default:
                return <p style={{ color: "#6b7280" }}>Preview not available.</p>;
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    padding: "24px",
                    maxWidth: "900px",
                    width: "90%",
                    maxHeight: "90vh",
                    overflow: "auto",
                    position: "relative",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#1e1b4b",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "calc(100% - 40px)",
                        }}
                    >
                        {file?.name || "File Preview"}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6b7280",
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview Content */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;
