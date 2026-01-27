"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { allocationService } from "../../../../services";
import {
    Wallet,
    Loader2,
    ArrowLeft,
    Plus,
    Snowflake,
    Sun,
    DollarSign,
    Shield,
    Trash2,
    Edit3,
    AlertCircle,
} from "lucide-react";

interface Allocation {
    id: string;
    name: string;
    description?: string;
    balance: number;
    status: "ACTIVE" | "FROZEN";
    organizationId: string;
    organization?: {
        id: string;
        name: string;
    };
    assignedUser?: {
        id: string;
        email: string;
        displayName?: string;
    };
    createdAt: string;
}

interface Rule {
    id: string;
    type: string;
    value: any;
    description?: string;
    createdAt: string;
}

export default function AllocationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const allocationId = params.allocationId as string;

    const [allocation, setAllocation] = useState<Allocation | null>(null);
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals and forms
    const [showFundModal, setShowFundModal] = useState(false);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [fundAmount, setFundAmount] = useState("");
    const [ruleForm, setRuleForm] = useState({ type: "DAILY_LIMIT", value: "", description: "" });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (allocationId) fetchData();
    }, [allocationId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const allocRes = await allocationService.getAllocationById(allocationId);
            const allocData = allocRes.data?.data || allocRes.data;
            setAllocation(allocData);

            const rulesRes = await allocationService.getRules(allocationId);
            const rulesData = rulesRes.data?.data || rulesRes.data || [];
            setRules(Array.isArray(rulesData) ? rulesData : []);
        } catch (err) {
            console.error("Error fetching allocation:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFund = async () => {
        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) return;

        try {
            setProcessing(true);
            await allocationService.fundAllocation(allocationId, { amountInNaira: amount });
            setShowFundModal(false);
            setFundAmount("");
            fetchData();
        } catch (err) {
            console.error("Error funding allocation:", err);
        } finally {
            setProcessing(false);
        }
    };

    const handleFreeze = async () => {
        try {
            setProcessing(true);
            await allocationService.freezeAllocation(allocationId);
            fetchData();
        } catch (err) {
            console.error("Error freezing allocation:", err);
        } finally {
            setProcessing(false);
        }
    };

    const handleUnfreeze = async () => {
        try {
            setProcessing(true);
            await allocationService.unfreezeAllocation(allocationId);
            fetchData();
        } catch (err) {
            console.error("Error unfreezing allocation:", err);
        } finally {
            setProcessing(false);
        }
    };

    const handleAddRule = async () => {
        if (!ruleForm.value) return;

        try {
            setProcessing(true);
            await allocationService.addRule(allocationId, {
                type: ruleForm.type,
                value: parseFloat(ruleForm.value) || ruleForm.value,
                description: ruleForm.description,
            });
            setShowRuleModal(false);
            setRuleForm({ type: "DAILY_LIMIT", value: "", description: "" });
            fetchData();
        } catch (err) {
            console.error("Error adding rule:", err);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteRule = async (ruleId: string) => {
        if (!confirm("Delete this spending rule?")) return;
        try {
            await allocationService.deleteRule(ruleId);
            fetchData();
        } catch (err) {
            console.error("Error deleting rule:", err);
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

    const getRuleTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            DAILY_LIMIT: "Daily Spending Limit",
            WEEKLY_LIMIT: "Weekly Spending Limit",
            MONTHLY_LIMIT: "Monthly Spending Limit",
            SINGLE_TX_LIMIT: "Single Transaction Limit",
            CATEGORY_RESTRICTION: "Category Restriction",
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    Loading Allocation...
                </p>
            </div>
        );
    }

    if (!allocation) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <p className="text-slate-500 font-bold">Allocation not found</p>
                <button
                    onClick={() => router.back()}
                    className="text-emerald-500 font-bold hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() =>
                        router.push(`/dashboard/organizations/${allocation.organizationId}`)
                    }
                    className="flex items-center gap-2 text-slate-500 hover:text-foreground font-bold text-sm w-fit transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {allocation.organization?.name || "Organization"}
                </button>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div
                            className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${allocation.status === "FROZEN"
                                    ? "bg-blue-500 text-white"
                                    : "bg-emerald-500 text-white"
                                }`}
                        >
                            {allocation.status === "FROZEN" ? (
                                <Snowflake className="h-8 w-8" />
                            ) : (
                                <Wallet className="h-8 w-8" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                                {allocation.name}
                            </h1>
                            {allocation.description && (
                                <p className="text-slate-500 font-medium">
                                    {allocation.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFundModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
                        >
                            <DollarSign className="h-4 w-4" />
                            Fund
                        </button>
                        {allocation.status === "ACTIVE" ? (
                            <button
                                onClick={handleFreeze}
                                disabled={processing}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                                <Snowflake className="h-4 w-4" />
                                Freeze
                            </button>
                        ) : (
                            <button
                                onClick={handleUnfreeze}
                                disabled={processing}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                                <Sun className="h-4 w-4" />
                                Unfreeze
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Balance Card */}
            <div className="grid md:grid-cols-2 gap-4">
                <div
                    className={`rounded-2xl p-8 ${allocation.status === "FROZEN"
                            ? "bg-blue-500 text-white"
                            : "bg-foreground text-background"
                        }`}
                >
                    <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">
                        Available Balance
                    </p>
                    <p className="text-4xl font-black tracking-tight">
                        {formatCurrency(allocation.balance)}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${allocation.status === "FROZEN"
                                    ? "bg-white/20"
                                    : "bg-background/20"
                                }`}
                        >
                            {allocation.status}
                        </span>
                    </div>
                </div>

                {allocation.assignedUser && (
                    <div className="rounded-2xl bg-card border border-border p-8">
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Assigned To
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xl text-slate-500">
                                {allocation.assignedUser.displayName?.charAt(0).toUpperCase() ||
                                    allocation.assignedUser.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-lg">
                                    {allocation.assignedUser.displayName || allocation.assignedUser.email}
                                </p>
                                <p className="text-sm text-slate-500">{allocation.assignedUser.email}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Spending Rules */}
            <div className="rounded-3xl bg-card border border-border overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-lg font-black flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-500" />
                        Spending Rules
                    </h2>
                    <button
                        onClick={() => setShowRuleModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Rule
                    </button>
                </div>
                {rules.length === 0 ? (
                    <div className="py-16 text-center">
                        <Shield className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold">No spending rules</p>
                        <p className="text-sm text-slate-400">
                            Add rules to control how this budget can be spent
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {rules.map((rule) => (
                            <div
                                key={rule.id}
                                className="flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                            >
                                <div>
                                    <p className="font-bold">{getRuleTypeLabel(rule.type)}</p>
                                    <p className="text-sm text-slate-500">
                                        {typeof rule.value === "number"
                                            ? formatCurrency(rule.value)
                                            : rule.value}
                                    </p>
                                    {rule.description && (
                                        <p className="text-xs text-slate-400 mt-1">{rule.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteRule(rule.id)}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Fund Modal */}
            {showFundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6">Fund Allocation</h2>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2">
                                Amount (₦)
                            </label>
                            <input
                                type="number"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>

                        <div className="flex items-center gap-3 mt-8">
                            <button
                                onClick={() => setShowFundModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFund}
                                disabled={processing || !fundAmount || parseFloat(fundAmount) <= 0}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <DollarSign className="h-4 w-4" />
                                )}
                                Fund
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Rule Modal */}
            {showRuleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6">Add Spending Rule</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Rule Type
                                </label>
                                <select
                                    value={ruleForm.type}
                                    onChange={(e) =>
                                        setRuleForm((prev) => ({ ...prev, type: e.target.value }))
                                    }
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                >
                                    <option value="DAILY_LIMIT">Daily Spending Limit</option>
                                    <option value="WEEKLY_LIMIT">Weekly Spending Limit</option>
                                    <option value="MONTHLY_LIMIT">Monthly Spending Limit</option>
                                    <option value="SINGLE_TX_LIMIT">Single Transaction Limit</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Limit Amount (₦)
                                </label>
                                <input
                                    type="number"
                                    value={ruleForm.value}
                                    onChange={(e) =>
                                        setRuleForm((prev) => ({ ...prev, value: e.target.value }))
                                    }
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={ruleForm.description}
                                    onChange={(e) =>
                                        setRuleForm((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    placeholder="e.g., Daily max for office supplies"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-8">
                            <button
                                onClick={() => setShowRuleModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRule}
                                disabled={processing || !ruleForm.value}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 disabled:opacity-50 transition-colors"
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                Add Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
