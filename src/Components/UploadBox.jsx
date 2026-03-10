import { UploadCloud, Trash2 } from "lucide-react";

const UploadBox = ({
                       files,
                       onFileChange,
                       onUpload,
                       uploading,
                       onRemoveFile,
                       remainingCredits,
                       isUploadDisabled
                   }) => {

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        onFileChange(selectedFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        onFileChange(droppedFiles);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <UploadCloud size={18} />
                    Upload Files
                </h2>

                <span className="text-sm text-gray-500">
          {remainingCredits} credits remaining
        </span>
            </div>

            {/* Drag & Drop Area */}
            <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-44 cursor-pointer hover:border-purple-500 transition"
            >
                <UploadCloud className="w-8 h-8 text-purple-500 mb-3" />

                <p className="text-gray-700 text-sm">
                    Drag and drop files here
                </p>

                <p className="text-gray-400 text-xs mt-1">
                    or click to browse ({remainingCredits} credits remaining)
                </p>

                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </label>

            {/* Selected Files */}
            {files.length > 0 && (
                <div className="mt-6 space-y-2">

                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
              <span className="text-sm text-gray-700">
                {file.name}
              </span>

                            <button
                                onClick={() => onRemoveFile(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    {/* Upload Button */}
                    <button
                        onClick={onUpload}
                        disabled={isUploadDisabled || uploading}
                        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload Files"}
                    </button>

                </div>
            )}

        </div>
    );
};

export default UploadBox;