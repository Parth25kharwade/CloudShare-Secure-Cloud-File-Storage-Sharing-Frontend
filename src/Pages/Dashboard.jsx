import { useAuth, useUser } from "@clerk/clerk-react";
import DashboardLayout from "../Layout/Dashboard.jsx";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../utill/apiEndpoint.js";
import { UserCreditsContext } from "../Context/UserCreditsContext";
import {
    HardDrive,
    CreditCard,
    Upload,
    Globe,
    Lock,
    FileText,
    Image,
    Video,
    Music,
    File as FileIcon,
    ArrowUpRight,
    TrendingUp,
    Clock,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const getFileIcon = (fileName, size = 18) => {
    if (!fileName) return <FileIcon size={size} className="text-gray-400" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
        return <Image size={size} style={{ color: "#a855f7" }} />;
    if (["mp4", "webm", "mov", "avi"].includes(ext))
        return <Video size={size} style={{ color: "#3b82f6" }} />;
    if (["mp3", "wav", "ogg", "flac"].includes(ext))
        return <Music size={size} style={{ color: "#22c55e" }} />;
    if (["pdf", "doc", "docx", "txt"].includes(ext))
        return <FileText size={size} style={{ color: "#ef4444" }} />;
    return <FileIcon size={size} style={{ color: "#6b7280" }} />;
};

const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
};

const Dashboard = () => {
    const { getToken } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const { credits, setCredits } = useContext(UserCreditsContext);

    const [files, setFiles] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const headers = { Authorization: `Bearer ${token}` };

                const [filesRes, creditsRes, txnRes] = await Promise.allSettled([
                    axios.get(apiEndpoints.FETCH_FILES, { headers }),
                    axios.get(apiEndpoints.GET_CREDITS, { headers }),
                    axios.get(apiEndpoints.FETCH_TRANSACTIONS, { headers }),
                ]);

                if (filesRes.status === "fulfilled") {
                    setFiles(filesRes.value.data.files || []);
                }
                if (creditsRes.status === "fulfilled") {
                    setCredits(creditsRes.value.data.credits);
                }
                if (txnRes.status === "fulfilled") {
                    setTransactions(txnRes.value.data || []);
                }
            } catch (err) {
                console.error("Dashboard data error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Compute stats
    const totalFiles = files.length;
    const publicFiles = files.filter((f) => f.public).length;
    const privateFiles = totalFiles - publicFiles;
    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const recentFiles = [...files]
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, 5);
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
        .slice(0, 4);
    const totalSpent = transactions
        .filter((t) => t.status === "SUCCESS")
        .reduce((sum, t) => sum + t.amount, 0);

    // File type breakdown
    const fileTypes = files.reduce(
        (acc, f) => {
            const ext = f.name?.split(".").pop().toLowerCase();
            if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) acc.images++;
            else if (["mp4", "webm", "mov", "avi"].includes(ext)) acc.videos++;
            else if (["mp3", "wav", "ogg", "flac"].includes(ext)) acc.audio++;
            else if (["pdf", "doc", "docx", "txt"].includes(ext)) acc.documents++;
            else acc.other++;
            return acc;
        },
        { images: 0, videos: 0, audio: 0, documents: 0, other: 0 }
    );

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60vh",
                        gap: "16px",
                    }}
                >
                    <div className="animate-spin" style={{ color: "#7c3aed" }}>
                        <Sparkles size={40} />
                    </div>
                    <p style={{ color: "#6b7280", fontSize: "14px" }}>
                        Loading your dashboard...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                {/* Welcome Header */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)",
                        borderRadius: "20px",
                        padding: "32px 36px",
                        marginBottom: "28px",
                        color: "#fff",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "-40px",
                            right: "-20px",
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.06)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-60px",
                            right: "80px",
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.04)",
                        }}
                    />
                    <p
                        style={{
                            fontSize: "14px",
                            opacity: 0.8,
                            marginBottom: "4px",
                            fontWeight: "500",
                        }}
                    >
                        {greeting()} 👋
                    </p>
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            marginBottom: "8px",
                        }}
                    >
                        {user?.fullName || "Welcome back"}
                    </h1>
                    <p style={{ fontSize: "14px", opacity: 0.75 }}>
                        Here's an overview of your CloudShare account
                    </p>
                </div>

                {/* Stats Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        marginBottom: "28px",
                    }}
                >
                    {/* Total Files */}
                    <div
                        onClick={() => navigate("/my-files")}
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "22px 24px",
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <HardDrive size={20} style={{ color: "#7c3aed" }} />
                            </div>
                            <ArrowUpRight size={16} style={{ color: "#9ca3af" }} />
                        </div>
                        <p style={{ fontSize: "28px", fontWeight: "800", color: "#1e1b4b", margin: "12px 0 2px" }}>
                            {totalFiles}
                        </p>
                        <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Total Files</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                            {formatFileSize(totalSize)} used
                        </p>
                    </div>

                    {/* Credits */}
                    <div
                        onClick={() => navigate("/subscriptions")}
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "22px 24px",
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(5,150,105,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #ecfdf5, #bbf7d0)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CreditCard size={20} style={{ color: "#059669" }} />
                            </div>
                            <ArrowUpRight size={16} style={{ color: "#9ca3af" }} />
                        </div>
                        <p style={{ fontSize: "28px", fontWeight: "800", color: "#064e3b", margin: "12px 0 2px" }}>
                            {credits}
                        </p>
                        <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Available Credits</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                            Upload {credits} more files
                        </p>
                    </div>

                    {/* Public Files */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "22px 24px",
                            border: "1px solid #e5e7eb",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #eff6ff, #bfdbfe)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Globe size={20} style={{ color: "#2563eb" }} />
                            </div>
                        </div>
                        <p style={{ fontSize: "28px", fontWeight: "800", color: "#1e3a5f", margin: "12px 0 2px" }}>
                            {publicFiles}
                        </p>
                        <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Public Files</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                            {privateFiles} private
                        </p>
                    </div>

                    {/* Transactions */}
                    <div
                        onClick={() => navigate("/transactions")}
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "22px 24px",
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(217,119,6,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #fffbeb, #fde68a)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <TrendingUp size={20} style={{ color: "#d97706" }} />
                            </div>
                            <ArrowUpRight size={16} style={{ color: "#9ca3af" }} />
                        </div>
                        <p style={{ fontSize: "28px", fontWeight: "800", color: "#78350f", margin: "12px 0 2px" }}>
                            {transactions.length}
                        </p>
                        <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Transactions</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                            ₹{(totalSpent / 100).toLocaleString("en-IN")} spent
                        </p>
                    </div>
                </div>

                {/* Bottom Section: Two Columns */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                    }}
                >
                    {/* Recent Files */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #e5e7eb",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "18px 24px",
                                borderBottom: "1px solid #f3f4f6",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h3 style={{ fontWeight: "700", fontSize: "15px", color: "#1e1b4b", margin: 0 }}>
                                Recent Files
                            </h3>
                            <button
                                onClick={() => navigate("/my-files")}
                                style={{
                                    fontSize: "12px",
                                    color: "#7c3aed",
                                    fontWeight: "600",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                View All <ArrowUpRight size={12} />
                            </button>
                        </div>

                        {recentFiles.length === 0 ? (
                            <div style={{ padding: "40px 24px", textAlign: "center" }}>
                                <Upload size={32} style={{ color: "#d1d5db", margin: "0 auto 8px" }} />
                                <p style={{ fontSize: "13px", color: "#9ca3af" }}>No files uploaded yet</p>
                                <button
                                    onClick={() => navigate("/upload")}
                                    style={{
                                        marginTop: "12px",
                                        padding: "8px 20px",
                                        borderRadius: "10px",
                                        background: "#7c3aed",
                                        color: "#fff",
                                        border: "none",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                    }}
                                >
                                    Upload Now
                                </button>
                            </div>
                        ) : (
                            <div>
                                {recentFiles.map((file, i) => (
                                    <div
                                        key={file.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "12px 24px",
                                            borderBottom: i < recentFiles.length - 1 ? "1px solid #f9fafb" : "none",
                                            transition: "background-color 0.15s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#faf5ff")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                    >
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "10px",
                                                backgroundColor: "#f5f3ff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {getFileIcon(file.name)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p
                                                style={{
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    color: "#1e1b4b",
                                                    margin: 0,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {file.name}
                                            </p>
                                            <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
                                                {formatFileSize(file.size)} •{" "}
                                                {new Date(file.uploadedAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            {file.public ? (
                                                <Globe size={14} style={{ color: "#22c55e" }} />
                                            ) : (
                                                <Lock size={14} style={{ color: "#9ca3af" }} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* File Type Breakdown */}
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                border: "1px solid #e5e7eb",
                                padding: "20px 24px",
                            }}
                        >
                            <h3 style={{ fontWeight: "700", fontSize: "15px", color: "#1e1b4b", margin: "0 0 16px" }}>
                                Storage Breakdown
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                    { label: "Images", count: fileTypes.images, color: "#a855f7", bg: "#f5f3ff" },
                                    { label: "Videos", count: fileTypes.videos, color: "#3b82f6", bg: "#eff6ff" },
                                    { label: "Documents", count: fileTypes.documents, color: "#ef4444", bg: "#fef2f2" },
                                    { label: "Audio", count: fileTypes.audio, color: "#22c55e", bg: "#f0fdf4" },
                                    { label: "Other", count: fileTypes.other, color: "#6b7280", bg: "#f9fafb" },
                                ].map((cat) => (
                                    <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                width: "8px",
                                                height: "8px",
                                                borderRadius: "50%",
                                                backgroundColor: cat.color,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span style={{ flex: 1, fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                                            {cat.label}
                                        </span>
                                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e1b4b" }}>
                                            {cat.count}
                                        </span>
                                        {/* Progress bar */}
                                        <div
                                            style={{
                                                width: "80px",
                                                height: "6px",
                                                borderRadius: "3px",
                                                backgroundColor: "#f3f4f6",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: "100%",
                                                    width: totalFiles > 0 ? `${(cat.count / totalFiles) * 100}%` : "0%",
                                                    backgroundColor: cat.color,
                                                    borderRadius: "3px",
                                                    transition: "width 0.6s ease",
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                border: "1px solid #e5e7eb",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    padding: "18px 24px",
                                    borderBottom: "1px solid #f3f4f6",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <h3 style={{ fontWeight: "700", fontSize: "15px", color: "#1e1b4b", margin: 0 }}>
                                    Recent Transactions
                                </h3>
                                {transactions.length > 0 && (
                                    <button
                                        onClick={() => navigate("/transactions")}
                                        style={{
                                            fontSize: "12px",
                                            color: "#7c3aed",
                                            fontWeight: "600",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        View All <ArrowUpRight size={12} />
                                    </button>
                                )}
                            </div>

                            {recentTransactions.length === 0 ? (
                                <div style={{ padding: "32px 24px", textAlign: "center" }}>
                                    <CreditCard size={28} style={{ color: "#d1d5db", margin: "0 auto 8px" }} />
                                    <p style={{ fontSize: "13px", color: "#9ca3af" }}>No transactions yet</p>
                                </div>
                            ) : (
                                <div>
                                    {recentTransactions.map((txn, i) => (
                                        <div
                                            key={txn.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "12px 24px",
                                                borderBottom:
                                                    i < recentTransactions.length - 1 ? "1px solid #f9fafb" : "none",
                                                transition: "background-color 0.15s",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor = "#faf5ff")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.backgroundColor = "transparent")
                                            }
                                        >
                                            <div
                                                style={{
                                                    width: "36px",
                                                    height: "36px",
                                                    borderRadius: "10px",
                                                    backgroundColor:
                                                        txn.status === "SUCCESS" ? "#f0fdf4" : "#fef2f2",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {txn.status === "SUCCESS" ? (
                                                    <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
                                                ) : (
                                                    <Clock size={16} style={{ color: "#ef4444" }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: "600",
                                                        color: "#1e1b4b",
                                                        margin: 0,
                                                    }}
                                                >
                                                    {txn.planId} Plan
                                                </p>
                                                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
                                                    {new Date(txn.transactionDate).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: "700",
                                                        color: "#059669",
                                                        margin: 0,
                                                    }}
                                                >
                                                    +{txn.creditsAdded} credits
                                                </p>
                                                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
                                                    ₹{(txn.amount / 100).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div
                    style={{
                        marginTop: "20px",
                        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                        borderRadius: "16px",
                        padding: "24px",
                        border: "1px solid #ddd6fe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}
                >
                    <div>
                        <h3 style={{ fontWeight: "700", fontSize: "16px", color: "#4c1d95", margin: "0 0 4px" }}>
                            Ready to upload more files?
                        </h3>
                        <p style={{ fontSize: "13px", color: "#6d28d9", margin: 0, opacity: 0.8 }}>
                            You have {credits} credits remaining. Each upload costs 1 credit.
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            onClick={() => navigate("/upload")}
                            style={{
                                padding: "10px 24px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                                color: "#fff",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.3)";
                            }}
                        >
                            <Upload size={16} /> Upload Files
                        </button>
                        <button
                            onClick={() => navigate("/subscriptions")}
                            style={{
                                padding: "10px 24px",
                                borderRadius: "12px",
                                background: "#fff",
                                color: "#7c3aed",
                                border: "2px solid #7c3aed",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f5f3ff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#fff";
                            }}
                        >
                            Buy Credits
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;