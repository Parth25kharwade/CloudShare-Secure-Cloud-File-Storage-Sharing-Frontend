import DashboardLayout from "../Layout/Dashboard.jsx";
import { useEffect, useState } from "react";
import { List, Grid, File } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Globe, Lock, Download, Trash2, Eye } from "lucide-react";
import FileCard from "../Components/FileCard.jsx";
import { Share2 } from "lucide-react";
import {
    Image,
    Video,
    Music,
    FileText,
    File as FileIcon,
} from "lucide-react";
import {apiEndpoints} from "../utill/apiEndpoint.js";
import ConfirmationDialog from "../Components/ConfirmationDialogBox.jsx";


const handleShare = (file) => {
    const shareUrl = `${window.location.origin}/file/${file.id}`;

    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
};

const getFileIcon = (fileName, size = 20) => {
    const extension = fileName.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
        return <Image size={size} className="text-purple-500" />;
    }

    if (["mp4", "webm", "mov", "avi"].includes(extension)) {
        return <Video size={size} className="text-blue-500" />;
    }

    if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        return <Music size={size} className="text-green-500" />;
    }

    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
        return <FileText size={size} className="text-red-500" />;
    }

    return <FileIcon size={size} className="text-gray-500" />;
};


const Myfiles = () => {
    const [files, setFiles] = useState([]);
    const [remainingCredits, setRemainingCredits] = useState(0);
    const [viewMode, setViewMode] = useState("list");
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        fileId: null
    });

    // Open modal
    const openDeleteConfirmation = (fileId) => {
        setDeleteConfirmation({
            isOpen: true,
            fileId
        });
    };

// Close modal
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            fileId: null
        });
    };

    // fetching files
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const token = await getToken();

                const response = await axios.get(
                    apiEndpoints.FETCH_FILES,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setFiles(response.data.files || []);
                    setRemainingCredits(response.data.remainingCredits || 0);
                }

            } catch (error) {
                console.error("Error fetching files:", error);

                const message =
                    error.response?.data?.message ||
                    "Error fetching files from server";

                toast.error(message);
            }
        };

        fetchFiles();
    }, []);


    //toggel public /private
    const toggelTopublic = async (fileToUpdate) => {
        try {
            const token = await getToken();
            await axios.patch(apiEndpoints.TOGGLE_FILE(fileToUpdate.id), {},{headers: {
                    Authorization: `Bearer ${token}`,
                }})
            setFiles(files.map(file => file.id === fileToUpdate.id ? {...file, public: !file.public} : file))
            toast.success(
                fileToUpdate.public ? "File is now private" : "File is now public"
            )

        }catch (e) {console.error("Error toggling public:", e);
            toast.error(
                "Error toggling public. Please try again later."
            )
        }

    }
    //handel download
    const handleDownload = async (file) => {
        try {
            const token = await getToken();

            const response = await axios.get(
                apiEndpoints.DOWNLOAD_FILE(file.id),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const contentType = response.headers["content-type"];

            // 🚨 If backend returned JSON error
            if (contentType.includes("application/json")) {
                const text = await response.data.text();
                const error = JSON.parse(text);
                toast.error(error.message || "Download failed");
                return;
            }

            // ✅ Correct file download
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (e) {
            console.error("Error downloading file:", e);
            toast.error("Error downloading file");
        }
    };

    const handelDelete = async () => {
        const fileId = deleteConfirmation.fileId;

        if (!fileId) return;

        try {
            const token = await getToken();

            await axios.delete(
                apiEndpoints.DELETE_FILE(fileId),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove file from UI

                setFiles((prev) =>
                    prev.filter((file) => file.id !== fileId)
                );




            toast.success("File deleted successfully");

            // Close modal
            setDeleteConfirmation({
                isOpen: false,
                fileId: null
            });
            closeDeleteConfirmation();

        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("Error deleting file");
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 KB";
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
    };

    return (
        <DashboardLayout>
            <div className="p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            My Files ({files.length})
                        </h2>
                        <p className="text-sm text-gray-500">
                            Remaining Credits: {remainingCredits}
                        </p>
                    </div>

                    {files.length > 0 && (
                        <div className="flex items-center gap-3">
                            <List
                                size={24}
                                onClick={() => setViewMode("list")}
                                className={`cursor-pointer transition-colors ${
                                    viewMode === "list"
                                        ? "text-purple-600"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            />

                            <Grid
                                size={24}
                                onClick={() => setViewMode("grid")}
                                className={`cursor-pointer transition-colors ${
                                    viewMode === "grid"
                                        ? "text-purple-600"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            />
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {files.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">

                        <File
                            size={60}
                            className="text-purple-300 mb-4"
                        />

                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No files uploaded yet
                        </h3>

                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Upload your first file to start sharing securely.
                        </p>

                        <button
                            onClick={() => navigate("/upload")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
                        >
                            Upload File
                        </button>

                    </div>
                ) : viewMode === "list" ? (
                    /* List View */
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-xs uppercase text-gray-500">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Uploaded</th>
                                <th className="px-6 py-4">Sharing</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {files.map((file) => (
                                <tr
                                    key={file.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    {/* NAME */}
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {getFileIcon(file.name, 18)}
                                        <span className="font-medium">{file.name}</span>
                                    </td>

                                    {/* SIZE */}
                                    <td className="px-6 py-4">
                                        {formatFileSize(file.size)}
                                    </td>

                                    {/* UPLOADED */}
                                    <td className="px-6 py-4">
                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                    </td>

                                    {/* SHARING */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggelTopublic(file)}
                                            className="flex items-center gap-2 group">
                                            {file.public ? (
                                                <>
                                                    <Globe size={16} className="text-green-500" />
                                                    <span className="group-hover:underline text-green-600">
                    Public
                  </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock size={16} className="text-gray-500" />
                                                    <span className="group-hover:underline">
                    Private
                  </span>
                                                </>
                                            )
                                            }
                                        </button>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-4 text-gray-500">

                                            {/* Share Link (Only if Public) */}
                                            {file.public && (
                                                <Share2
                                                    size={18}
                                                    onClick={() => handleShare(file)}
                                                    className="cursor-pointer hover:text-green-600"
                                                />
                                            )}

                                            <button
                                                onClick={() => handleDownload(file)}
                                                className="hover:text-purple-600 transition"
                                            >
                                                <Download size={18} className="cursor-pointer" />
                                            </button>

                                            <button
                                                onClick={() => openDeleteConfirmation(file.id)}
                                                className="hover:text-red-500 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>


                                            <Eye
                                                size={18}
                                                className="cursor-pointer hover:text-blue-500"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {files.map((file) => (
                            <FileCard key={file.id} file={file} />
                        ))}
                    </div>
                )}

                <ConfirmationDialog
                    isOpen={deleteConfirmation.isOpen}
                    onClose={closeDeleteConfirmation}
                    title="Delete File"
                    message="Are you sure you want to delete this file? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handelDelete}
                    confirmationButtonClass="bg-red-600 hover:bg-red-700"
                />
            </div>
        </DashboardLayout>
    );
};

export default Myfiles;
