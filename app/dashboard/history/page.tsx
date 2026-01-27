"use client";

import { useEffect, useState } from "react";
import { walletService } from "../../../services";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    Loader2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
    X,
    Eye,
    EyeOff
} from "lucide-react";

interface Transaction {
    id: string;
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
    amount: any; // Updated to handle object or number
    status: "PENDING" | "COMPLETED" | "FAILED";
    createdAt: string;
    reference?: string;
    description?: string;
}

type FilterType = "ALL" | "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState<any>(null);
    const [showAmounts, setShowAmounts] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Filters
    const [typeFilter, setTypeFilter] = useState<FilterType>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        applyFilters();
    }, [transactions, typeFilter, searchQuery]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            // Fetch wallet first
            try {
                const walletRes = await walletService.getWalletByUserId(userId);
                const walletData = walletRes.data?.data || walletRes.data;
                if (walletData?.id) {
                    setWallet(walletData);

                    // Fetch transactions
                    const txRes = await walletService.getTransactions(
                        walletData.id,
                        currentPage,
                        100 // Fetch more to allow client-side filtering
                    );
                    const txData = txRes.data?.data || txRes.data || [];
                    const txArray = Array.isArray(txData) ? txData : [];
                    setTransactions(txArray);
                    setTotalPages(Math.ceil(txArray.length / itemsPerPage));
                }
            } catch (e) {
                console.log("Error fetching data:", e);
            }
        } catch (err) {
            console.error("History Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...transactions];

        // Type filter
        if (typeFilter !== "ALL") {
            filtered = filtered.filter((tx) => tx.type === typeFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (tx) =>
                    tx.reference?.toLowerCase().includes(query) ||
                    tx.description?.toLowerCase().includes(query) ||
                    tx.type.toLowerCase().includes(query)
            );
        }

        setFilteredTransactions(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage) || 1);
    };

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatCurrency = (amount: any) => {
        let value = 0;
        if (typeof amount === 'object' && amount !== null) {
            value = parseFloat(amount.kobo || amount.amount || amount.balance || 0);
        } else {
            value = parseFloat(amount || 0);
        }

        if (isNaN(value)) return "₦0.00";
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(value / 100);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }),
            time: date.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "DEPOSIT":
                return <ArrowDownLeft className="h-5 w-5" />;
            case "WITHDRAWAL":
            case "TRANSFER":
                return <ArrowUpRight className="h-5 w-5" />;
            default:
                return <ArrowDownLeft className="h-5 w-5" />;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case "DEPOSIT":
                return "bg-emerald-500/10 text-emerald-600";
            case "WITHDRAWAL":
                return "bg-orange-500/10 text-orange-600";
            case "TRANSFER":
                return "bg-indigo-500/10 text-indigo-600";
            default:
                return "bg-slate-500/10 text-slate-600";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Completed
                    </span>
                );
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending
                    </span>
                );
            case "FAILED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Failed
                    </span>
                );
            default:
                return null;
        }
    };

    const clearFilters = () => {
        setTypeFilter("ALL");
        setSearchQuery("");
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    Loading History...
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
                        Transaction History
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        View all your deposits, withdrawals, and transfers
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAmounts(!showAmounts)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-fit"
                    >
                        {showAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showAmounts ? 'Hide Balance' : 'Show Balance'}
                    </button>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-fit"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by reference or description..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Type Filter */}
                    <div className="flex gap-2 p-1.5 bg-card rounded-2xl border border-border overflow-x-auto">
                        {(["ALL", "DEPOSIT", "WITHDRAWAL", "TRANSFER"] as FilterType[]).map(
                            (type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setTypeFilter(type);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${typeFilter === type
                                        ? "bg-foreground text-background shadow"
                                        : "text-slate-500 hover:text-foreground"
                                        }`}
                                >
                                    {type === "ALL" ? "All" : type.charAt(0) + type.slice(1).toLowerCase()}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Active Filters */}
                {(typeFilter !== "ALL" || searchQuery) && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Active filters:</span>
                        {typeFilter !== "ALL" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                                {typeFilter}
                                <button onClick={() => setTypeFilter("ALL")}>
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold">
                                "{searchQuery}"
                                <button onClick={() => setSearchQuery("")}>
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-red-500 font-bold hover:underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Transaction List */}
            <div className="rounded-3xl bg-card border border-border overflow-hidden">
                {paginatedTransactions.length === 0 ? (
                    <div className="py-24 text-center space-y-5">
                        <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
                            <Calendar className="text-slate-300 h-10 w-10" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-500 font-black text-lg">
                                {transactions.length === 0
                                    ? "No transactions yet"
                                    : "No matching transactions"}
                            </p>
                            <p className="text-xs text-slate-400 font-bold max-w-[280px] mx-auto">
                                {transactions.length === 0
                                    ? "Your transaction history will appear here once you make deposits or transfers."
                                    : "Try adjusting your filters to find what you're looking for."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-border text-xs font-black uppercase tracking-widest text-slate-400">
                            <div className="col-span-4">Transaction</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Reference</div>
                            <div className="col-span-2 text-right">Amount</div>
                        </div>

                        {/* Transaction Rows */}
                        <div className="divide-y divide-border">
                            {paginatedTransactions.map((tx) => {
                                const { date, time } = formatDate(tx.createdAt);
                                return (
                                    <div
                                        key={tx.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        {/* Transaction Type */}
                                        <div className="col-span-4 flex items-center gap-4">
                                            <div
                                                className={`h-12 w-12 rounded-xl flex items-center justify-center ${getTransactionColor(
                                                    tx.type
                                                )}`}
                                            >
                                                {getTransactionIcon(tx.type)}
                                            </div>
                                            <div>
                                                <p className="font-bold">{tx.type}</p>
                                                <p className="text-xs text-slate-500 md:hidden">
                                                    {date} • {time}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="hidden md:flex col-span-2 flex-col justify-center">
                                            <p className="font-bold text-sm">{date}</p>
                                            <p className="text-xs text-slate-500">{time}</p>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2 flex items-center">
                                            {getStatusBadge(tx.status)}
                                        </div>

                                        {/* Reference */}
                                        <div className="hidden md:flex col-span-2 items-center">
                                            <p className="text-xs font-mono text-slate-500 truncate">
                                                {tx.reference?.slice(0, 12) || "—"}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="col-span-2 flex items-center justify-end">
                                            <p
                                                className={`font-black text-lg md:text-xl tracking-tight ${tx.type === "DEPOSIT" ? "text-emerald-600" : ""
                                                    }`}
                                            >
                                                {tx.type === "DEPOSIT" ? "+" : "-"}
                                                {showAmounts ? formatCurrency(tx.amount) : "***"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                        {filteredTransactions.length} transactions
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === pageNum
                                            ? "bg-foreground text-background"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl border border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
