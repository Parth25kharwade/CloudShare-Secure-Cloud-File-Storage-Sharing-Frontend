import { useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../Layout/Dashboard.jsx";
import UploadBox from "../Components/UploadBox.jsx";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { apiEndpoints } from "../utill/apiEndpoint.js";
import { AlertCircle } from "lucide-react";

const Upload = () => {

    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const { getToken } = useAuth();
    const { credits, setCredits } = useContext(UserCreditsContext);

    const MAX_FILES = 5;

    // Add files
    const handleFileChange = (selectedFiles) => {

        if (files.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType("error");
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    };

    // Remove file
    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessage("");
        setMessageType("");
    };

    // Upload files
    const handleUpload = async () => {

        if (files.length === 0) {
            setMessageType("error");
            setMessage("Please select atleast one file to upload.");
            return;
        }

        if (files.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
            setMessageType("error");
            return;
        }

        setUploading(true);
        setMessage("Uploading files...");
        setMessageType("");

        try {

            const token = await getToken();

            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            const response = await axios.post(
                apiEndpoints.UPLOAD_FILE,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data && response.data.remainingCredits !== undefined) {
                setCredits(response.data.remainingCredits);
            }

            setMessage("Files uploaded successfully.");
            setMessageType("success");
            setFiles([]);

        } catch (error) {

            console.error("Error uploading files:", error);

            setMessage(
                error?.response?.data?.message ||
                "Error uploading files. Please try again."
            );

            setMessageType("error");

        } finally {
            setUploading(false);
        }
    };

    const isUploadDisabled =
        files.length === 0 ||
        files.length > MAX_FILES ||
        credits <= 0 ||
        files.length > credits;

    return (
        <DashboardLayout activeMenu="Upload">

            <div className="p-6">

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3
            ${messageType === "error"
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"}`}
                    >
                        {messageType === "error" && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />

            </div>

        </DashboardLayout>
    );
};

export default Upload;