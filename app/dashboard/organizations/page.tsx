"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { orgService } from "../../../services";
import {
    Building2,
    Plus,
    Users,
    Mail,
    Check,
    X,
    Loader2,
    ChevronRight,
    Wallet,
} from "lucide-react";

interface Organization {
    id: string;
    name: string;
    description?: string;
    role: string;
    memberCount?: number;
    walletBalance?: number;
    createdAt: string;
}

interface Invite {
    id: string;
    organization: {
        id: string;
        name: string;
    };
    role: string;
    invitedBy?: string;
    createdAt: string;
}

export default function OrganizationsPage() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({ name: "", type: "COMPANY" });
    const [creating, setCreating] = useState(false);
    const [processingInvite, setProcessingInvite] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch organizations
            const orgsRes = await orgService.getMyOrgs();
            const orgsData = orgsRes.data?.data || orgsRes.data || [];
            setOrganizations(Array.isArray(orgsData) ? orgsData : []);

            // Fetch pending invites
            const invitesRes = await orgService.getMyInvites();
            const invitesData = invitesRes.data?.data || invitesRes.data || [];
            setInvites(Array.isArray(invitesData) ? invitesData : []);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrg = async () => {
        if (!createForm.name.trim()) return;

        try {
            setCreating(true);
            await orgService.createOrg({ name: createForm.name, type: createForm.type });
            setShowCreateModal(false);
            setCreateForm({ name: "", type: "COMPANY" });
            fetchData();
        } catch (err) {
            console.error("Error creating organization:", err);
        } finally {
            setCreating(false);
        }
    };

    const handleAcceptInvite = async (inviteId: string) => {
        try {
            setProcessingInvite(inviteId);
            await orgService.acceptInvite(inviteId);
            fetchData();
        } catch (err) {
            console.error("Error accepting invite:", err);
        } finally {
            setProcessingInvite(null);
        }
    };

    const handleDeclineInvite = async (inviteId: string) => {
        try {
            setProcessingInvite(inviteId);
            await orgService.declineInvite(inviteId);
            setInvites((prev) => prev.filter((i) => i.id !== inviteId));
        } catch (err) {
            console.error("Error declining invite:", err);
        } finally {
            setProcessingInvite(null);
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
                    Loading Organizations...
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
                        <Building2 className="h-8 w-8 text-emerald-500" />
                        Organizations
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Manage your teams and allocate budgets
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-button text-foreground font-bold text-sm w-fit"
                >
                    <Plus className="h-4 w-4" />
                    Create Organization
                </button>
            </div>

            {/* Pending Invites */}
            {invites.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-black flex items-center gap-2">
                        <Mail className="h-5 w-5 text-orange-500" />
                        Pending Invites
                    </h2>
                    <div className="grid gap-4">
                        {invites.map((invite) => (
                            <div
                                key={invite.id}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20"
                            >
                                <div>
                                    <p className="font-bold text-lg">{invite.organization.name}</p>
                                    <p className="text-sm text-slate-500">
                                        Invited as <span className="font-bold capitalize">{invite.role}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleAcceptInvite(invite.id)}
                                        disabled={processingInvite === invite.id}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-emerald-600 dark:text-emerald-400 font-bold text-sm disabled:opacity-50"
                                    >
                                        {processingInvite === invite.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDeclineInvite(invite.id)}
                                        disabled={processingInvite === invite.id}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-red-500 font-bold text-sm disabled:opacity-50"
                                    >
                                        <X className="h-4 w-4" />
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Organizations Grid */}
            {organizations.length === 0 ? (
                <div className="rounded-3xl bg-card border border-border py-24 text-center space-y-5">
                    <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
                        <Building2 className="text-slate-300 h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 font-black text-lg">
                            No organizations yet
                        </p>
                        <p className="text-xs text-slate-400 font-bold max-w-[280px] mx-auto">
                            Create your first organization to manage team budgets and allocations.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl glass-button text-foreground font-bold text-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Create Organization
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                        <div
                            key={org.id}
                            onClick={() => router.push(`/dashboard/organizations/${org.id}`)}
                            className="group rounded-3xl bg-card border border-border p-6 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                    {org.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {org.role}
                                </span>
                            </div>

                            <h3 className="text-xl font-black mb-1 group-hover:text-emerald-500 transition-colors">
                                {org.name}
                            </h3>
                            {org.description && (
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                    {org.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Users className="h-4 w-4" />
                                    <span>{org.memberCount || 1} members</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <Wallet className="h-4 w-4 text-emerald-500" />
                                    <span>{formatCurrency(org.walletBalance)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-bold">View Details</span>
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Organization Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-card border border-border p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6">Create Organization</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    value={createForm.name}
                                    onChange={(e) =>
                                        setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="e.g., Acme Corp"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">
                                    Organization Type
                                </label>
                                <select
                                    value={createForm.type}
                                    onChange={(e) =>
                                        setCreateForm((prev) => ({ ...prev, type: e.target.value }))
                                    }
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                >
                                    <option value="COMPANY">Company</option>
                                    <option value="UNIVERSITY">University</option>
                                    <option value="FAMILY">Family</option>
                                    <option value="COUPLE">Couple</option>
                                    <option value="GROUP">Group</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-8">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl glass-button border border-border font-bold text-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOrg}
                                disabled={creating || !createForm.name.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-button text-foreground font-bold disabled:opacity-50"
                            >
                                {creating ? (
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
