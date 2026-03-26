import DashboardLayout from "../Layout/Dashboard.jsx";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
    Receipt,
    Loader,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    IndianRupee,
    CreditCard,
    Calendar,
    Search,
    ArrowUpDown,
} from "lucide-react";
import { apiEndpoints } from "../utill/apiEndpoint.js";

const statusConfig = {
    SUCCESS: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
        dot: "bg-emerald-500",
    },
    FAILED: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        dot: "bg-red-500",
    },
    PENDING: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
        dot: "bg-amber-500",
    },
};

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    const { getToken } = useAuth();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");
            const token = await getToken();
            const response = await axios.get(apiEndpoints.FETCH_TRANSACTIONS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTransactions(response.data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAmount = (amount) => {
        return (amount / 100).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        });
    };

    const filtered = transactions
        .filter((t) => {
            const term = searchTerm.toLowerCase();
            return (
                t.orderId?.toLowerCase().includes(term) ||
                t.planId?.toLowerCase().includes(term) ||
                t.status?.toLowerCase().includes(term) ||
                t.userName?.toLowerCase().includes(term) ||
                t.userEmail?.toLowerCase().includes(term)
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.transactionDate);
            const dateB = new Date(b.transactionDate);
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

    const totalSpent = transactions
        .filter((t) => t.status === "SUCCESS")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalCredits = transactions
        .filter((t) => t.status === "SUCCESS")
        .reduce((sum, t) => sum + t.creditsAdded, 0);

    return (
        <DashboardLayout activeMenu="Transaction">
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            color: "#1e1b4b",
                            marginBottom: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <Receipt
                            size={28}
                            style={{ color: "#7c3aed" }}
                        />
                        Transaction History
                    </h1>
                    <p style={{ color: "#6b7280", fontSize: "14px" }}>
                        View all your payment transactions and credit purchases
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            marginBottom: "24px",
                            padding: "16px",
                            borderRadius: "12px",
                            backgroundColor: "#fef2f2",
                            color: "#b91c1c",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            border: "1px solid #fecaca",
                        }}
                    >
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "80px 0",
                            gap: "16px",
                        }}
                    >
                        <Loader
                            size={36}
                            className="animate-spin"
                            style={{ color: "#7c3aed" }}
                        />
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>
                            Loading transactions...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "16px",
                                marginBottom: "28px",
                            }}
                        >
                            {/* Total Transactions */}
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
                                    borderRadius: "16px",
                                    padding: "20px 24px",
                                    border: "1px solid #ddd6fe",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CreditCard size={22} style={{ color: "#fff" }} />
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "#6d28d9",
                                            fontWeight: "600",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                        }}
                                    >
                                        Total Transactions
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "800",
                                            color: "#4c1d95",
                                        }}
                                    >
                                        {transactions.length}
                                    </p>
                                </div>
                            </div>

                            {/* Total Spent */}
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
                                    borderRadius: "16px",
                                    padding: "20px 24px",
                                    border: "1px solid #bbf7d0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #059669, #34d399)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <IndianRupee size={22} style={{ color: "#fff" }} />
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "#047857",
                                            fontWeight: "600",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                        }}
                                    >
                                        Total Spent
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "800",
                                            color: "#064e3b",
                                        }}
                                    >
                                        {formatAmount(totalSpent)}
                                    </p>
                                </div>
                            </div>

                            {/* Credits Earned */}
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)",
                                    borderRadius: "16px",
                                    padding: "20px 24px",
                                    border: "1px solid #bfdbfe",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Receipt size={22} style={{ color: "#fff" }} />
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "#1d4ed8",
                                            fontWeight: "600",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                        }}
                                    >
                                        Credits Earned
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "800",
                                            color: "#1e3a5f",
                                        }}
                                    >
                                        {totalCredits}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search & Sort Bar */}
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                marginBottom: "20px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div
                                style={{
                                    flex: "1",
                                    minWidth: "220px",
                                    position: "relative",
                                }}
                            >
                                <Search
                                    size={18}
                                    style={{
                                        position: "absolute",
                                        left: "14px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#9ca3af",
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search by order ID, plan, status, name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px 10px 42px",
                                        borderRadius: "12px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "14px",
                                        outline: "none",
                                        backgroundColor: "#f9fafb",
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#7c3aed";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e5e7eb";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>
                            <button
                                onClick={() =>
                                    setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
                                }
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "10px 18px",
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                    backgroundColor: "#f9fafb",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#374151",
                                    fontWeight: "500",
                                    transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                                }
                            >
                                <ArrowUpDown size={16} />
                                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                            </button>
                        </div>

                        {/* Transactions List */}
                        {filtered.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "64px 0",
                                    color: "#9ca3af",
                                }}
                            >
                                <Receipt
                                    size={48}
                                    style={{ margin: "0 auto 16px", opacity: 0.4 }}
                                />
                                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                                    {searchTerm
                                        ? "No transactions match your search"
                                        : "No transactions yet"}
                                </p>
                                <p style={{ fontSize: "13px", marginTop: "4px" }}>
                                    {searchTerm
                                        ? "Try a different search term"
                                        : "Purchase a plan to see your transactions here"}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {filtered.map((txn) => {
                                    const config = statusConfig[txn.status] || statusConfig.PENDING;
                                    const StatusIcon = config.icon;

                                    return (
                                        <div
                                            key={txn.id}
                                            style={{
                                                backgroundColor: "#fff",
                                                borderRadius: "16px",
                                                border: "1px solid #e5e7eb",
                                                padding: "20px 24px",
                                                transition: "box-shadow 0.2s, transform 0.15s",
                                                cursor: "default",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow =
                                                    "0 4px 24px rgba(124,58,237,0.08)";
                                                e.currentTarget.style.transform = "translateY(-1px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = "none";
                                                e.currentTarget.style.transform = "translateY(0)";
                                            }}
                                        >
                                            {/* Top Row */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-start",
                                                    flexWrap: "wrap",
                                                    gap: "12px",
                                                    marginBottom: "16px",
                                                }}
                                            >
                                                <div>
                                                    <h3
                                                        style={{
                                                            fontWeight: "700",
                                                            fontSize: "17px",
                                                            color: "#1e1b4b",
                                                            margin: "0 0 4px 0",
                                                        }}
                                                    >
                                                        {txn.planId} Plan
                                                    </h3>
                                                    <p
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#9ca3af",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        Order: {txn.orderId}
                                                    </p>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        padding: "5px 14px",
                                                        borderRadius: "20px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        border: "1px solid",
                                                    }}
                                                    className={config.color}
                                                >
                                                    <StatusIcon size={14} />
                                                    {txn.status}
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "repeat(auto-fit, minmax(160px, 1fr))",
                                                    gap: "12px",
                                                    padding: "14px 16px",
                                                    backgroundColor: "#f9fafb",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <div>
                                                    <p
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#9ca3af",
                                                            margin: "0 0 2px 0",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.5px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        Amount
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "700",
                                                            color: "#1e1b4b",
                                                            margin: 0,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                        }}
                                                    >
                                                        <IndianRupee size={14} />
                                                        {formatAmount(txn.amount)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#9ca3af",
                                                            margin: "0 0 2px 0",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.5px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        Credits Added
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "700",
                                                            color: "#059669",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        +{txn.creditsAdded}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#9ca3af",
                                                            margin: "0 0 2px 0",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.5px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        Date
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            color: "#374151",
                                                            margin: 0,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "4px",
                                                        }}
                                                    >
                                                        <Calendar size={13} />
                                                        {formatDate(txn.transactionDate)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#9ca3af",
                                                            margin: "0 0 2px 0",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.5px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        Payment ID
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                            color: "#6b7280",
                                                            margin: 0,
                                                            fontFamily: "monospace",
                                                        }}
                                                    >
                                                        {txn.paymentId}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Transaction;