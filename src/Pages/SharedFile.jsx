import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../utill/apiEndpoint.js";
import {
    Download,
    FileText,
    Image,
    Video,
    Music,
    File as FileIcon,
    Loader,
    AlertCircle,
    Cloud,
    Eye,
} from "lucide-react";

const getFileIcon = (fileName, size = 64) => {
    if (!fileName) return <FileIcon size={size} className="text-gray-500" />;
    const extension = fileName.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension))
        return <Image size={size} className="text-purple-500" />;
    if (["mp4", "webm", "mov", "avi"].includes(extension))
        return <Video size={size} className="text-blue-500" />;
    if (["mp3", "wav", "ogg", "flac"].includes(extension))
        return <Music size={size} className="text-green-500" />;
    if (["pdf", "doc", "docx", "txt"].includes(extension))
        return <FileText size={size} className="text-red-500" />;
    return <FileIcon size={size} className="text-gray-500" />;
};

const isPreviewable = (fileName) => {
    if (!fileName) return false;
    const extension = fileName.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "svg", "webp", "mp4", "webm", "mov", "mp3", "wav", "ogg", "pdf"].includes(extension);
};

const getPreviewType = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) return "image";
    if (["mp4", "webm", "mov"].includes(extension)) return "video";
    if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
    if (["pdf"].includes(extension)) return "pdf";
    return null;
};

const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
};

const SharedFile = () => {
    const { fileId } = useParams();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    useEffect(() => {
        const fetchFileInfo = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiEndpoints.PUBLIC_FILE_INFO(fileId));
                setFile(response.data.file);
            } catch (err) {
                console.error("Error fetching file info:", err);
                if (err.response?.status === 404) {
                    setError("File not found or is no longer public.");
                } else {
                    setError("Failed to load file information.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFileInfo();
    }, [fileId]);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
                responseType: "blob",
            });

            const contentType = response.headers["content-type"];
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file?.name || "download";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download error:", err);
            setError("Failed to download file.");
        } finally {
            setDownloading(false);
        }
    };

    const handlePreview = async () => {
        try {
            setLoadingPreview(true);
            const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
                responseType: "blob",
            });
            const contentType = response.headers["content-type"];
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setShowPreview(true);
        } catch (err) {
            console.error("Preview error:", err);
            setError("Failed to load preview.");
        } finally {
            setLoadingPreview(false);
        }
    };

    const renderPreview = () => {
        if (!file || !previewUrl) return null;
        const type = getPreviewType(file.name);

        switch (type) {
            case "image":
                return (
                    <img
                        src={previewUrl}
                        alt={file.name}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "70vh",
                            borderRadius: "12px",
                            objectFit: "contain",
                        }}
                    />
                );
            case "video":
                return (
                    <video
                        src={previewUrl}
                        controls
                        style={{
                            maxWidth: "100%",
                            maxHeight: "70vh",
                            borderRadius: "12px",
                        }}
                    />
                );
            case "audio":
                return (
                    <audio
                        src={previewUrl}
                        controls
                        style={{ width: "100%" }}
                    />
                );
            case "pdf":
                return (
                    <iframe
                        src={previewUrl}
                        title={file.name}
                        style={{
                            width: "100%",
                            height: "70vh",
                            border: "none",
                            borderRadius: "12px",
                        }}
                    />
                );
            default:
                return <p style={{ color: "#6b7280" }}>Preview not available for this file type.</p>;
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 30%, #e0e7ff 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    width: "100%",
                    padding: "16px 32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid #e5e7eb",
                }}
            >
                <Cloud size={24} style={{ color: "#7c3aed" }} />
                <span
                    style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#4c1d95",
                    }}
                >
                    CloudShare
                </span>
            </div>

            {/* Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    width: "100%",
                }}
            >
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        <Loader
                            size={40}
                            className="animate-spin"
                            style={{ color: "#7c3aed" }}
                        />
                        <p style={{ color: "#6b7280" }}>Loading file...</p>
                    </div>
                ) : error ? (
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "20px",
                            padding: "48px",
                            maxWidth: "480px",
                            width: "100%",
                            textAlign: "center",
                            boxShadow: "0 8px 40px rgba(124,58,237,0.1)",
                        }}
                    >
                        <AlertCircle
                            size={48}
                            style={{ color: "#ef4444", margin: "0 auto 16px" }}
                        />
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#1e1b4b",
                                marginBottom: "8px",
                            }}
                        >
                            Oops!
                        </h2>
                        <p style={{ color: "#6b7280" }}>{error}</p>
                    </div>
                ) : (
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "24px",
                            padding: "48px",
                            maxWidth: "560px",
                            width: "100%",
                            boxShadow: "0 8px 40px rgba(124,58,237,0.12)",
                            textAlign: "center",
                        }}
                    >
                        {/* File icon */}
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "24px",
                                background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                            }}
                        >
                            {getFileIcon(file.name)}
                        </div>

                        {/* File name */}
                        <h1
                            style={{
                                fontSize: "22px",
                                fontWeight: "800",
                                color: "#1e1b4b",
                                marginBottom: "8px",
                                wordBreak: "break-word",
                            }}
                        >
                            {file.name}
                        </h1>

                        {/* File meta */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "24px",
                                marginBottom: "8px",
                                flexWrap: "wrap",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                }}
                            >
                                Size: <strong>{formatFileSize(file.size)}</strong>
                            </span>
                            {file.uploadedAt && (
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "#6b7280",
                                    }}
                                >
                                    Uploaded:{" "}
                                    <strong>
                                        {new Date(file.uploadedAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </strong>
                                </span>
                            )}
                        </div>

                        {file.ownerName && (
                            <p
                                style={{
                                    fontSize: "13px",
                                    color: "#9ca3af",
                                    marginBottom: "28px",
                                }}
                            >
                                Shared by <strong>{file.ownerName}</strong>
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Preview Button */}
                            {isPreviewable(file.name) && (
                                <button
                                    onClick={handlePreview}
                                    disabled={loadingPreview}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "14px 28px",
                                        borderRadius: "14px",
                                        border: "2px solid #7c3aed",
                                        backgroundColor: "#fff",
                                        color: "#7c3aed",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        cursor: loadingPreview ? "wait" : "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#f5f3ff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#fff";
                                    }}
                                >
                                    {loadingPreview ? (
                                        <Loader size={18} className="animate-spin" />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                    {loadingPreview ? "Loading..." : "Preview"}
                                </button>
                            )}

                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "14px 32px",
                                    borderRadius: "14px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                                    color: "#fff",
                                    fontSize: "15px",
                                    fontWeight: "700",
                                    cursor: downloading ? "wait" : "pointer",
                                    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 6px 24px rgba(124,58,237,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 16px rgba(124,58,237,0.3)";
                                }}
                            >
                                {downloading ? (
                                    <Loader size={18} className="animate-spin" />
                                ) : (
                                    <Download size={18} />
                                )}
                                {downloading ? "Downloading..." : "Download File"}
                            </button>
                        </div>

                        {/* Preview Area */}
                        {showPreview && previewUrl && (
                            <div
                                style={{
                                    marginTop: "28px",
                                    padding: "16px",
                                    borderRadius: "16px",
                                    backgroundColor: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                {renderPreview()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedFile;
