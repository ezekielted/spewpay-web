"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { orgService, allocationService } from "../../../../services";
import {
    Building2,
    Users,
    Wallet,
    Plus,
    Mail,
    Loader2,
    ArrowLeft,
    Edit3,
    Trash2,
    Shield,
    ChevronRight,
    Snowflake,
    DollarSign,
    MoreVertical,
} from "lucide-react";

interface Organization {
    id: string;
    name: string;
    description?: string;
    walletId?: string;
    walletBalance?: number;
    createdAt: string;
}

interface Member {
    id: string;
    userId: string;
    user: {
        id: string;
        email: string;
        displayName?: string;
    };
    role: "OWNER" | "ADMIN" | "MEMBER";
    createdAt: string;
}

interface Allocation {
    id: string;
    name: string;
    description?: string;
    balance: number;
    status: "ACTIVE" | "FROZEN";
    assignedUser?: {
        id: string;
        email: string;
        displayName?: string;
    };
    createdAt: string;
}

export default function OrganizationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orgId = params.orgId as string;

    const [org, setOrg] = useState<Organization | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showAllocationModal, setShowAllocationModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("MEMBER");
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [allocationForm, setAllocationForm] = useState({ name: "", description: "" });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (orgId) fetchData();
    }, [orgId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch org details
            const orgRes = await orgService.getOrgById(orgId);
            const orgData = orgRes.data?.data || orgRes.data;
            setOrg(orgData);

            // Fetch members
            const membersRes = await orgService.getMembers(orgId);
            const membersData = membersRes.data?.data || membersRes.data || [];
            setMembers(Array.isArray(membersData) ? membersData : []);

            // Fetch allocations
            const allocRes = await allocationService.getOrgAllocations(orgId);
            const allocData = allocRes.data?.data || allocRes.data || [];
            setAllocations(Array.isArray(allocData) ? allocData : []);
        } catch (err) {
            console.error("Error fetching organization:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail.trim()) return;
        try {
            setProcessing(true);
            setInviteError(null);
            await orgService.createInvite(orgId, { email: inviteEmail, role: inviteRole });
            setShowInviteModal(false);
            setInviteEmail("");
            // Optionally refresh data to show pending invites
            fetchData();
        } catch (err: any) {
            const message = err?.response?.data?.message || "Failed to send invite";
            setInviteError(message);
            console.error("Error sending invite:", err);
        } finally {
            setProcessing(false);
        }
    };

    const handleCreateAllocation = async () => {
        if (!allocationForm.name.trim()) return;
        try {
            setProcessing(true);
            await allocationService.createAllocation(orgId, allocationForm);
            setShowAllocationModal(false);
            setAllocationForm({ name: "", description: "" });
            fetchData();
        } catch (err) {
            console.error("Error creating allocation:", err);
        } finally {
            setProcessing(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm("Remove this member from the organization?")) return;
        try {
            await orgService.removeMember(orgId, memberId);
            fetchData();
        } catch (err) {
            console.error("Error removing member:", err);
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

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "OWNER":
                return "bg-purple-500/10 text-purple-600";
            case "ADMIN":
                return "bg-blue-500/10 text-blue-600";
            default:
                return "bg-slate-100 dark:bg-slate-800 text-slate-500";
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    Loading Organization...
                </p>
            </div>
        );
    }

    if (!org) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <p className="text-slate-500 font-bold">Organization not found</p>
                <button
                    onClick={() => router.push("/dashboard/organizations")}
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
                    onClick={() => router.push("/dashboard/organizations")}
                    className="flex items-center gap-2 text-slate-500 hover:text-foreground font-bold text-sm w-fit transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Organizations
                </button>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                            {org.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                                {org.name}
                            </h1>
                            {org.description && (
                                <p className="text-slate-500 font-medium">{org.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-foreground text-background p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-widest opacity-70">
                            Org Wallet
                        </span>
                    </div>
                    <p className="text-3xl font-black tracking-tight">
                        {formatCurrency(org.walletBalance)}
                    </p>
                </div>
                <div className="rounded-2xl bg-card border border-border p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            Members
                        </span>
                    </div>
                    <p className="text-3xl font-black tracking-tight">{members.length}</p>
                </div>
                <div className="rounded-2xl bg-card border border-border p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            Allocations
                        </span>
                    </div>
                    <p className="text-3xl font-black tracking-tight">{allocations.length}</p>
                </div>
            </div>

            {/* Members Section */}
            <div className="rounded-3xl bg-card border border-border overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-lg font-black flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Team Members
                    </h2>
                    <button
                        onClick={() => { setInviteError(null); setShowInviteModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                        <Mail className="h-4 w-4" />
                        Invite
                    </button>
                </div>
                <div className="divide-y divide-border">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                    {member.user?.displayName?.charAt(0).toUpperCase() ||
                                        member.user?.email?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-bold">
                                        {member.user?.displayName || member.user?.email || "Unknown User"}
                                    </p>
                                    <p className="text-sm text-slate-500">{member.user?.email || member.userId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor(
                                        member.role
                                    )}`}
                                >
                                    {member.role}
                                </span>
                                {member.role !== "OWNER" && (
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Allocations Section */}
            <div className="rounded-3xl bg-card border border-border overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-lg font-black flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                        Budget Allocations
                    </h2>
                    <button
                        onClick={() => setShowAllocationModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Create Allocation
                    </button>
                </div>
                {allocations.length === 0 ? (
                    <div className="py-16 text-center">
                        <DollarSign className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold">No allocations yet</p>
                        <p className="text-sm text-slate-400">
                            Create budget allocations for team members
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {allocations.map((allocation) => (
                            <div
                                key={allocation.id}
                                onClick={() =>
                                    router.push(`/dashboard/allocations/${allocation.id}`)
                                }
                                className="flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`h-10 w-10 rounded-xl flex items-center justify-center ${allocation.status === "FROZEN"
                                            ? "bg-blue-500/10 text-blue-500"
                                            : "bg-emerald-500/10 text-emerald-500"
                                            }`}
                                    >
                                        {allocation.status === "FROZEN" ? (
                                            <Snowflake className="h-5 w-5" />
                                        ) : (
                                            <Wallet className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold">{allocation.name}</p>
                                        {allocation.assignedUser && (
                                            <p className="text-sm text-slate-500">
                                                Assigned to {allocation.assignedUser.displayName || allocation.assignedUser.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-black text-lg">
                                            {formatCurrency(allocation.balance)}
                                        </p>
                                        <span
                                            className={`text-xs font-bold uppercase ${allocation.status === "FROZEN"
                                                ? "text-blue-500"
                                                : "text-emerald-500"
                                                }`}
                                        >
                                            {allocation.status}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6">Invite Member</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Role
                                </label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                >
                                    <option value="MEMBER">Member</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            {inviteError && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-bold">
                                    {inviteError}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-8">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInvite}
                                disabled={processing || !inviteEmail.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-foreground text-background font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Mail className="h-4 w-4" />
                                )}
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Allocation Modal */}
            {showAllocationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6">Create Allocation</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Allocation Name
                                </label>
                                <input
                                    type="text"
                                    value={allocationForm.name}
                                    onChange={(e) =>
                                        setAllocationForm((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="e.g., Marketing Budget"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={allocationForm.description}
                                    onChange={(e) =>
                                        setAllocationForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Brief description..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-8">
                            <button
                                onClick={() => setShowAllocationModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAllocation}
                                disabled={processing || !allocationForm.name.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
