import { useState } from "react";
import {
    Image,
    Video,
    Music,
    FileText,
    File as FileIcon,
    Download,
    Globe,
    Lock,
    Eye,
    Copy
} from "lucide-react";
import { Trash2 } from "lucide-react";

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const FileCard = ({ file,
                      onDownload,
                      onTogglePublic,
                      onDelete,
                      onShare }) => {
    const [hovered, setHovered] = useState(false);

    // ✅ Detect file icon
    const getFileIcon = () => {
        const extension = file.name.split(".").pop().toLowerCase();

        if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
            return <Image size={50} className="text-purple-500" />;
        }

        if (["mp4", "webm", "mov", "avi"].includes(extension)) {
            return <Video size={50} className="text-blue-500" />;
        }

        if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
            return <Music size={50} className="text-green-500" />;
        }

        if (["pdf", "doc", "docx", "txt"].includes(extension)) {
            return <FileText size={50} className="text-red-500" />;
        }

        return <FileIcon size={50} className="text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 KB";
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
    };


    return (
        <div
            className="relative bg-white rounded-xl shadow-sm p-6 transition hover:shadow-lg overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* File Icon */}
            <div className="flex justify-center mb-4">
                {getFileIcon()}
            </div>

            {/* File Name */}
            {/* File Name */}
            <h3 className="text-sm font-medium text-gray-800 truncate text-center">
                {file.name}
            </h3>

            {/* Size + Date */}
            <div className="text-xs text-gray-500 text-center mt-1 space-y-1">
                <p>{formatFileSize(file.size)}</p>
                <p>Uploaded: {formatDate(file.uploadedAt)}</p>
            </div>

            {/* Size */}
            <p className="text-xs text-gray-500 text-center mt-1">
                {formatFileSize(file.size)}
            </p>

            {/* Public/Private Badge */}
            <div className="flex justify-center mt-2">
                {file.public ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs">
            <Globe size={14} />
            Public
          </span>
                ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
            <Lock size={14} />
            Private
          </span>
                )}
            </div>

            {/* 🔥 Hover Gradient Overlay */}
            {hovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center pb-6 transition">
                    <div className="flex gap-3">

                        {/* Copy Share Link (Only if Public) */}
                        {file.public && (
                            <button
                                title="Share Link"
                                onClick={() => onShare(file.id)}
                                className="p-2 bg-white/90 rounded-full hover:bg-white transition text-purple-600"
                            >
                                <Copy size={18} />
                            </button>
                        )}

                        {/* View File (Only if Public) */}
                        {file.public && (
                            <a
                                href={`/file/${file.id}`}
                                target="_blank"
                                rel="noreferrer"
                                title="View File"
                                className="p-2 bg-white/90 rounded-full hover:bg-white transition text-blue-600"
                            >
                                <Eye size={18} />
                            </a>
                        )}

                        {/* Download */}
                        <button
                            title="Download"
                            onClick={() => onDownload(file)}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition text-green-600"
                        >
                            <Download size={18} />
                        </button>

                        {/* Toggle Public/Private */}
                        <button
                            title={file.public ? "Make Private" : "Make Public"}
                            onClick={() => onTogglePublic(file)}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition text-amber-600"
                        >
                            {file.public ? <Lock size={18} /> : <Globe size={18} />}
                        </button>
                        <button
                            title="Delete"
                            onClick={() => onDelete(file.id)}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition text-red-600"
                        >
                            <Trash2 size={18} />
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default FileCard;