"use client";

import { useEffect, useState } from "react";
import { userService, walletService } from "../../../services";
import {
    User,
    Mail,
    Wallet,
    Calendar,
    Shield,
    Loader2,
    Edit3,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
    LogOut,
    Settings,
    BookOpen,
    ArrowUpRight,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
    id: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
    isVerified?: boolean;
}

interface WalletData {
    id: string;
    currency: string;
    cachedBalance: number;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteEmailInput, setDeleteEmailInput] = useState("");
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        router.push("/login");
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setError("No user session found");
                return;
            }

            // Fetch user details
            try {
                const userRes = await userService.getUserById(userId);
                const userData = userRes.data?.data || userRes.data;
                setUser(userData);
            } catch (e: any) {
                console.log("Error fetching user:", e);
                // Fallback to localStorage data
                setUser({
                    id: userId,
                    email: localStorage.getItem("userEmail") || "user@spewpay.com",
                    displayName: localStorage.getItem("userName") || "Spewpay User",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            }

            // Fetch wallet with fresh balance
            try {
                const walletRes = await walletService.getWalletByUserId(userId);
                const walletData = walletRes.data?.data || walletRes.data;

                if (walletData?.id || walletData?.uuid) {
                    const walletId = walletData.id || walletData.uuid;

                    // Fetch the fresh balance from balance endpoint
                    try {
                        const balanceRes = await walletService.getBalance(walletId);
                        const balanceData = balanceRes.data?.data || balanceRes.data;

                        // Priority: balanceData.balance > balanceData.cached_balance > walletData.cached_balance
                        const freshBalance =
                            balanceData?.balance ??
                            balanceData?.cached_balance ??
                            balanceData?.cachedBalance ??
                            walletData?.cached_balance ??
                            walletData?.cachedBalance ?? 0;

                        setWallet({
                            ...walletData,
                            cachedBalance: freshBalance
                        });
                    } catch (balanceErr) {
                        // Fallback to wallet's cached balance if balance endpoint fails
                        setWallet(walletData);
                    }
                }
            } catch (e) {
                console.log("No wallet found");
            }
        } catch (err: any) {
            setError(err.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };


 
    const handleDeleteAccount = async () => {
        if (!user || deleteEmailInput !== user.email) return;
        
        try {
            setIsDeleting(true);
            setError(null);
            await userService.deleteUser(user.id);
            
            // Clear session and redirect
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("userEmail");
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete account");
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(field);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
            }).format(0);
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
                    Loading Profile...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <p className="text-red-500 font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
                        My Profile
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        View and manage your account details
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Profile Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Info Card */}
                    <div className="rounded-3xl bg-card border border-border p-8">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">
                                        {user?.displayName || "Spewpay User"}
                                    </h2>
                                    <p className="text-slate-500 font-medium">{user?.email}</p>
                                    {user?.isVerified && (
                                        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Email Address
                                        </p>
                                        <p className="font-bold">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user?.email || "", "email")}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {copied === "email" ? (
                                        <Check className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-slate-400" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            User ID
                                        </p>
                                        <p className="font-mono text-sm">{user?.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user?.id || "", "userId")}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {copied === "userId" ? (
                                        <Check className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-slate-400" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Member Since
                                        </p>
                                        <p className="font-bold">
                                            {user?.createdAt ? formatDate(user.createdAt) : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences & Hub */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/dashboard/ledger" className="flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:border-emerald-500/30 transition-all group shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold">Ledger</p>
                                    <p className="text-xs text-slate-500">Transaction records and audits</p>
                                </div>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </Link>

                        <Link href="/dashboard/settings/appearance" className="flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:border-emerald-500/30 transition-all group shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Settings className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold">Appearance</p>
                                    <p className="text-xs text-slate-500">Theme and display settings</p>
                                </div>
                            </div>
                            <Check className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:border-red-500/30 transition-all group shadow-sm text-left md:col-span-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <LogOut className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-red-600">Sign Out</p>
                                    <p className="text-xs text-slate-500">Log out of your account</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-3xl bg-red-50/50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 p-8 space-y-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertCircle className="h-6 w-6" />
                            <h3 className="text-xl font-black">Danger Zone</h3>
                        </div>
                        
                        {!showDeleteConfirm ? (
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-red-600">Delete Account</p>
                                    <p className="text-sm text-slate-500 font-medium">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete My Account
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-500/20">
                                    <p className="text-sm font-bold mb-3">
                                        To confirm, please type your email address: <span className="text-red-600">{user?.email}</span>
                                    </p>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={deleteEmailInput}
                                        onChange={(e) => setDeleteEmailInput(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-background focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting || deleteEmailInput !== user?.email}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Permanently Delete Account"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setDeleteEmailInput("");
                                        }}
                                        disabled={isDeleting}
                                        className="flex-1 px-6 py-4 rounded-2xl bg-slate-200 dark:bg-slate-800 text-foreground font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all text-center"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Wallet Info Sidebar */}
                <div className="space-y-6">
                    {/* Wallet Card */}
                    <div className="rounded-3xl bg-foreground text-background p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-[80px] rounded-full -mr-20 -mt-20" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <Wallet className="h-6 w-6" />
                                <span className="text-sm font-bold uppercase tracking-widest opacity-70">
                                    Wallet
                                </span>
                            </div>

                            {wallet ? (
                                <>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest opacity-50">
                                            Balance
                                        </p>
                                        <p className="text-3xl font-black tracking-tight">
                                            {formatCurrency(wallet.cachedBalance)}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-50">Currency</span>
                                            <span className="font-bold">{wallet.currency || "NGN"}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-50">Wallet ID</span>
                                            <button
                                                onClick={() => copyToClipboard(wallet.id, "walletId")}
                                                className="font-mono text-xs flex items-center gap-1 hover:opacity-70"
                                            >
                                                {wallet.id.slice(0, 8)}...
                                                {copied === "walletId" ? (
                                                    <Check className="h-3 w-3" />
                                                ) : (
                                                    <Copy className="h-3 w-3" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-50">Created</span>
                                            <span className="font-bold">
                                                {wallet.createdAt ? formatDate(wallet.createdAt) : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="opacity-70 font-bold">No wallet yet</p>
                                    <p className="text-sm opacity-50 mt-1">
                                        Create a wallet from the dashboard
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="rounded-3xl bg-card border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">Security</h3>
                                <p className="text-xs text-slate-500">Account protection</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                                <span className="text-sm font-bold">Password</span>
                                <span className="text-xs text-emerald-600 font-bold">Set</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                                <span className="text-sm font-bold">2FA</span>
                                <span className="text-xs text-slate-400 font-bold">Not enabled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
