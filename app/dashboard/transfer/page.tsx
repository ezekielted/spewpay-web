"use client";

import { useEffect, useState } from "react";
import { transferService, walletService } from "../../../services";
import {
    ArrowUpRight,
    Building2,
    User,
    Wallet,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Plus,
    Search,
    ArrowRight,
} from "lucide-react";

interface Bank {
    id: string;
    name: string;
    code: string;
}

interface Recipient {
    id: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
    isDefault: boolean;
}

type TabType = "withdraw" | "internal";

export default function TransferPage() {
    const [activeTab, setActiveTab] = useState<TabType>("withdraw");
    const [wallet, setWallet] = useState<any>(null);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(true);
    const [banksLoading, setBanksLoading] = useState(false);

    // Withdraw form state
    const [selectedBank, setSelectedBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [resolvedAccount, setResolvedAccount] = useState<string | null>(null);
    const [resolving, setResolving] = useState(false);
    const [resolveError, setResolveError] = useState<string | null>(null);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawReason, setWithdrawReason] = useState("");
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);

    // Add recipient state
    const [showAddRecipient, setShowAddRecipient] = useState(false);
    const [addingRecipient, setAddingRecipient] = useState(false);

    // Internal transfer state
    const [destinationUserId, setDestinationUserId] = useState(""); 
    const [internalAmount, setInternalAmount] = useState("");
    const [internalReason, setInternalReason] = useState("");
    const [transferring, setTransferring] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState(false);
    const [transferError, setTransferError] = useState<string | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            try {
                const walletRes = await walletService.getWalletByUserId(userId);
                const walletData = walletRes.data?.data || walletRes.data;
                if (walletData?.id) setWallet(walletData);
            } catch (e) {
                console.log("No wallet found");
            }

            await fetchBanks();
            await fetchRecipients();
        } catch (err) {
            console.error("Error loading data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBanks = async () => {
        setBanksLoading(true);
        try {
            const res = await transferService.getBanks();
            const banksData = res.data?.data || res.data || [];
            setBanks(Array.isArray(banksData) ? banksData : []);
        } catch (e) {
            console.log("Error fetching banks:", e);
        } finally {
            setBanksLoading(false);
        }
    };

    const fetchRecipients = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const res = await transferService.getRecipients(userId);
            const recipientsData = res.data?.data || res.data || [];
            setRecipients(Array.isArray(recipientsData) ? recipientsData : []);
        } catch (e) {
            console.log("Error fetching recipients:", e);
        }
    };

    const handleResolveAccount = async () => {
        if (!accountNumber || accountNumber.length !== 10 || !selectedBank) return;

        setResolving(true);
        setResolveError(null);
        setResolvedAccount(null);

        try {
            const res = await transferService.resolveAccount(accountNumber, selectedBank);
            const data = res.data?.data || res.data;
            setResolvedAccount(data?.account_name || data?.accountName || "Account Found");
        } catch (err: any) {
            setResolveError(err.response?.data?.message || "Could not resolve account");
        } finally {
            setResolving(false);
        }
    };

    const handleAddRecipient = async () => {
        if (!resolvedAccount || !accountNumber || !selectedBank) return;

        setAddingRecipient(true);
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            await transferService.addRecipient({
                userId,
                accountNumber,
                bankCode: selectedBank,
                isDefault: recipients.length === 0,
            });

            await fetchRecipients();
            setShowAddRecipient(false);
            setAccountNumber("");
            setSelectedBank("");
            setResolvedAccount(null);
        } catch (err: any) {
            setResolveError(err.response?.data?.message || "Failed to add recipient");
        } finally {
            setAddingRecipient(false);
        }
    };

    const handleDeleteRecipient = async (recipientId: string) => {
        if (!confirm("Are you sure you want to remove this recipient?")) return;

        try {
            await transferService.deleteRecipient(recipientId);
            await fetchRecipients();
            if (selectedRecipient === recipientId) {
                setSelectedRecipient(null);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete recipient");
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecipient || !withdrawAmount) return;

        setWithdrawing(true);
        setWithdrawError(null);
        setWithdrawSuccess(false);

        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            await transferService.withdraw({
                userId,
                recipientId: selectedRecipient,
                amountInNaira: parseFloat(withdrawAmount),
                reason: withdrawReason || undefined,
                idempotencyKey: `withdraw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            });

            setWithdrawSuccess(true);
            setWithdrawAmount("");
            setWithdrawReason("");
            setSelectedRecipient(null);

            const walletRes = await walletService.getWalletByUserId(userId);
            setWallet(walletRes.data?.data || walletRes.data);
        } catch (err: any) {
            setWithdrawError(err.response?.data?.message || "Withdrawal failed");
        } finally {
            setWithdrawing(false);
        }
    };

    // --- FIXED: Updated to use 'description' instead of 'reason' ---
    const handleInternalTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!destinationUserId || !internalAmount) return;

        setTransferring(true);
        setTransferError(null);
        setTransferSuccess(false);

        try {
            const sourceUserId = localStorage.getItem("userId");
            if (!sourceUserId) throw new Error("User session not found");

            await transferService.internalTransfer({
                sourceUserId,
                destinationUserId: destinationUserId,
                amountInNaira: parseFloat(internalAmount),
                description: internalReason || "Internal transfer", // Mapped internalReason to description
            });

            setTransferSuccess(true);
            setDestinationUserId("");
            setInternalAmount("");
            setInternalReason("");

            // Refresh wallet balance
            const walletRes = await walletService.getWalletByUserId(sourceUserId);
            setWallet(walletRes.data?.data || walletRes.data);
        } catch (err: any) {
            setTransferError(err.response?.data?.message || "Transfer failed");
        } finally {
            setTransferring(false);
        }
    };

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

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    Loading...
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
                        Send Money
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Withdraw to bank or transfer to another Spewpay user
                    </p>
                </div>
                {wallet && (
                    <div className="px-6 py-3 rounded-2xl bg-card border border-border">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Available Balance
                        </p>
                        <p className="text-2xl font-black text-foreground">
                            {formatCurrency(wallet.cachedBalance || 0)}
                        </p>
                    </div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-card rounded-2xl border border-border w-fit">
                <button
                    onClick={() => setActiveTab("withdraw")}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "withdraw"
                        ? "bg-foreground text-background shadow-lg"
                        : "text-slate-500 hover:text-foreground"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Withdraw to Bank
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("internal")}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "internal"
                        ? "bg-foreground text-background shadow-lg"
                        : "text-slate-500 hover:text-foreground"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Internal Transfer
                    </span>
                </button>
            </div>

            {/* Withdraw to Bank Tab */}
            {activeTab === "withdraw" && (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Recipients List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black">Saved Recipients</h2>
                            <button
                                onClick={() => setShowAddRecipient(!showAddRecipient)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add New
                            </button>
                        </div>

                        {/* Add Recipient Form */}
                        {showAddRecipient && (
                            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 animate-in slide-in-from-top-4">
                                <h3 className="font-bold text-sm text-slate-500">
                                    Add New Recipient
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">
                                        Select Bank
                                    </label>
                                    <select
                                        value={selectedBank}
                                        onChange={(e) => {
                                            setSelectedBank(e.target.value);
                                            setResolvedAccount(null);
                                        }}
                                        className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="">Choose a bank...</option>
                                        {banks.map((bank) => (
                                            <option key={bank.code} value={bank.code}>
                                                {bank.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-80">
                                        Account Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength={10}
                                            value={accountNumber}
                                            onChange={(e) => {
                                                setAccountNumber(e.target.value.replace(/\D/g, ""));
                                                setResolvedAccount(null);
                                            }}
                                            placeholder="0123456789"
                                            className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        />
                                        {accountNumber.length === 10 && selectedBank && (
                                            <button
                                                onClick={handleResolveAccount}
                                                disabled={resolving}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-50"
                                            >
                                                {resolving ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Search className="h-4 w-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {resolvedAccount && (
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                                                Account Name
                                            </p>
                                            <p className="font-bold">{resolvedAccount}</p>
                                        </div>
                                    </div>
                                )}

                                {resolveError && (
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600">
                                        <AlertCircle className="h-5 w-5" />
                                        <p className="font-bold text-sm">{resolveError}</p>
                                    </div>
                                )}

                                {resolvedAccount && (
                                    <button
                                        onClick={handleAddRecipient}
                                        disabled={addingRecipient}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {addingRecipient ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                Save Recipient <Plus className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Recipients List */}
                        <div className="space-y-3">
                            {recipients.length === 0 ? (
                                <div className="p-8 rounded-3xl bg-card border border-border text-center">
                                    <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <p className="font-bold text-slate-500">No saved recipients</p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Add a bank account to send money
                                    </p>
                                </div>
                            ) : (
                                recipients.map((recipient) => (
                                    <div
                                        key={recipient.id}
                                        onClick={() => setSelectedRecipient(recipient.id)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedRecipient === recipient.id
                                            ? "bg-emerald-500/10 border-emerald-500"
                                            : "bg-card border-border hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${selectedRecipient === recipient.id
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                                        }`}
                                                >
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        {recipient.accountName || "Account Holder"}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {recipient.bankName} • {recipient.accountNumber}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRecipient(recipient.id);
                                                }}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Withdrawal Form */}
                    <div className="rounded-3xl bg-card border border-border p-8">
                        <h2 className="text-xl font-black mb-6">Withdrawal Details</h2>

                        {withdrawSuccess && (
                            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <p className="font-bold">Withdrawal initiated successfully!</p>
                            </div>
                        )}

                        {withdrawError && (
                            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <p className="font-bold text-sm">{withdrawError}</p>
                            </div>
                        )}

                        <form onSubmit={handleWithdraw} className="space-y-6">
                            {selectedRecipient ? (
                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                        Sending to
                                    </p>
                                    <p className="font-bold mt-1">
                                        {recipients.find((r) => r.id === selectedRecipient)?.accountName}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {recipients.find((r) => r.id === selectedRecipient)?.bankName} •{" "}
                                        {recipients.find((r) => r.id === selectedRecipient)?.accountNumber}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-border text-center">
                                    <p className="text-sm text-slate-500 font-bold">
                                        ← Select a recipient from the list
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">
                                    Amount (₦)
                                </label>
                                <input
                                    type="number"
                                    min="100"
                                    step="0.01"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="5,000"
                                    className="w-full px-4 py-4 rounded-2xl border border-border bg-background text-foreground text-2xl font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">
                                    Reason (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={withdrawReason}
                                    onChange={(e) => setWithdrawReason(e.target.value)}
                                    placeholder="e.g., Salary payment"
                                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedRecipient || !withdrawAmount || withdrawing}
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {withdrawing ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Withdraw Funds <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Internal Transfer Tab */}
            {activeTab === "internal" && (
                <div className="max-w-xl mx-auto">
                    <div className="rounded-3xl bg-card border border-border p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <Wallet className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black">Internal Transfer</h2>
                                <p className="text-sm text-slate-500">
                                    Send money instantly to another Spewpay user
                                </p>
                            </div>
                        </div>

                        {transferSuccess && (
                            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <p className="font-bold">Transfer completed successfully!</p>
                            </div>
                        )}

                        {transferError && (
                            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <p className="font-bold text-sm">{transferError}</p>
                            </div>
                        )}

                        <form onSubmit={handleInternalTransfer} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">
                                    Recipient User ID
                                </label>
                                <input
                                    type="text"
                                    value={destinationUserId}
                                    onChange={(e) => setDestinationUserId(e.target.value)}
                                    placeholder="Enter User ID (UUID)"
                                    className="w-full px-4 py-4 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">
                                    Amount (₦)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={internalAmount}
                                    onChange={(e) => setInternalAmount(e.target.value)}
                                    placeholder="1,000"
                                    className="w-full px-4 py-4 rounded-2xl border border-border bg-background text-foreground text-2xl font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80">
                                    Note (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={internalReason}
                                    onChange={(e) => setInternalReason(e.target.value)}
                                    placeholder="What's this for?"
                                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!destinationUserId || !internalAmount || transferring}
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {transferring ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Send Money <ArrowUpRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}