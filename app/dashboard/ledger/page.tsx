"use client";

import { useEffect, useState } from "react";
import { walletService } from "../../../services";
import {
    BookOpen,
    Loader2,
    RefreshCw,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronLeft,
    ChevronRight,
    Calendar,
} from "lucide-react";

interface LedgerEntry {
    id: string;
    walletId: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description: string;
    reference: string;
    createdAt: string;
}

export default function LedgerPage() {
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState<any>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
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

                    // Fetch ledger entries
                    const ledgerRes = await walletService.getLedger(walletData.id);
                    const ledgerData = ledgerRes.data?.data || ledgerRes.data || [];
                    setLedgerEntries(Array.isArray(ledgerData) ? ledgerData : []);
                }
            } catch (e) {
                console.log("Error fetching ledger:", e);
            }
        } catch (err) {
            console.error("Ledger Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(ledgerEntries.length / itemsPerPage) || 1;
    const paginatedEntries = ledgerEntries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return "₦0.00";
        }
        const normalizedAmount = amount > 100000 ? amount / 100 : amount;
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(normalizedAmount);
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

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    Loading Ledger...
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-emerald-500" />
                        Double-Entry Ledger
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Full audit trail with debit/credit entries
                    </p>
                </div>
                <button
                    onClick={fetchLedger}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-fit"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Current Balance Card */}
            {wallet && (
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-card border border-border p-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Current Balance
                        </p>
                        <p className="text-2xl font-black text-foreground mt-1">
                            {formatCurrency(wallet.cachedBalance)}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                            Total Credits
                        </p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">
                            {formatCurrency(
                                ledgerEntries
                                    .filter((e) => e.type === "CREDIT")
                                    .reduce((sum, e) => sum + (e.amount || 0), 0)
                            )}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-6">
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                            Total Debits
                        </p>
                        <p className="text-2xl font-black text-orange-600 mt-1">
                            {formatCurrency(
                                ledgerEntries
                                    .filter((e) => e.type === "DEBIT")
                                    .reduce((sum, e) => sum + (e.amount || 0), 0)
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Ledger Table */}
            <div className="rounded-3xl bg-card border border-border overflow-hidden">
                {paginatedEntries.length === 0 ? (
                    <div className="py-24 text-center space-y-5">
                        <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
                            <BookOpen className="text-slate-300 h-10 w-10" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-500 font-black text-lg">
                                No ledger entries yet
                            </p>
                            <p className="text-xs text-slate-400 font-bold max-w-[280px] mx-auto">
                                Your ledger will show detailed accounting entries once you make transactions.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-border text-xs font-black uppercase tracking-widest text-slate-400">
                            <div className="col-span-2">Date</div>
                            <div className="col-span-3">Description</div>
                            <div className="col-span-2">Reference</div>
                            <div className="col-span-2 text-right text-emerald-600">Credit</div>
                            <div className="col-span-2 text-right text-orange-600">Debit</div>
                            <div className="col-span-1 text-right">Balance</div>
                        </div>

                        {/* Ledger Rows */}
                        <div className="divide-y divide-border">
                            {paginatedEntries.map((entry) => {
                                const { date, time } = formatDate(entry.createdAt);
                                return (
                                    <div
                                        key={entry.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        {/* Date */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-3 md:block">
                                                <div
                                                    className={`md:hidden h-10 w-10 rounded-xl flex items-center justify-center ${entry.type === "CREDIT"
                                                            ? "bg-emerald-500/10 text-emerald-600"
                                                            : "bg-orange-500/10 text-orange-600"
                                                        }`}
                                                >
                                                    {entry.type === "CREDIT" ? (
                                                        <ArrowDownLeft className="h-5 w-5" />
                                                    ) : (
                                                        <ArrowUpRight className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{date}</p>
                                                    <p className="text-xs text-slate-500">{time}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="col-span-3 flex items-center">
                                            <p className="font-bold text-sm truncate">
                                                {entry.description || entry.type}
                                            </p>
                                        </div>

                                        {/* Reference */}
                                        <div className="hidden md:flex col-span-2 items-center">
                                            <p className="text-xs font-mono text-slate-500 truncate">
                                                {entry.reference?.slice(0, 12) || "—"}
                                            </p>
                                        </div>

                                        {/* Credit */}
                                        <div className="col-span-2 flex items-center justify-end">
                                            <p className="font-bold text-sm text-emerald-600">
                                                {entry.type === "CREDIT" ? formatCurrency(entry.amount) : "—"}
                                            </p>
                                        </div>

                                        {/* Debit */}
                                        <div className="col-span-2 flex items-center justify-end">
                                            <p className="font-bold text-sm text-orange-600">
                                                {entry.type === "DEBIT" ? formatCurrency(entry.amount) : "—"}
                                            </p>
                                        </div>

                                        {/* Balance After */}
                                        <div className="col-span-1 flex items-center justify-end">
                                            <p className="font-black text-sm">
                                                {formatCurrency(entry.balanceAfter)}
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
                        {Math.min(currentPage * itemsPerPage, ledgerEntries.length)} of{" "}
                        {ledgerEntries.length} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="px-4 py-2 font-bold text-sm">
                            {currentPage} / {totalPages}
                        </span>
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
