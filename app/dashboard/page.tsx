"use client";

import { useEffect, useState } from "react";
import { walletService } from "../../services";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  RefreshCw 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingWallet, setCreatingWallet] = useState(false);

  // 1. Robust Currency Formatter
  const formatCurrency = (amount: any) => {
    // Extract numeric value regardless of format (Object, String, or Number)
    let value = 0;
    if (typeof amount === 'object' && amount !== null) {
      value = parseFloat(amount.kobo || amount.amount || 0);
    } else {
      value = parseFloat(amount || 0);
    }

    // If the value is still invalid (NaN), return ₦0.00
    if (isNaN(value)) return "₦0.00";

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value / 100); // Dividing by 100 to convert Kobo to Naira
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const walletRes = await walletService.getWalletByUserId(userId);
        const walletData = walletRes.data?.data || walletRes.data;
        
        if (walletData && (walletData.id || walletData.uuid)) {
          setWallet(walletData);
          
          // Fetch transactions only if wallet exists
          const walletId = walletData.id || walletData.uuid;
          const txRes = await walletService.getTransactions(walletId, 1, 5);
          const txData = txRes.data?.data || txRes.data || [];
          setTransactions(Array.isArray(txData) ? txData : []);
        } else {
          setWallet(null);
        }
      } catch (walletErr: any) {
        console.log("Wallet Status:", walletErr.response?.status || "Not found");
        setWallet(null);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWallet = async () => {
    setCreatingWallet(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      await walletService.createWallet(userId);
      await fetchData();
    } catch (err: any) {
      alert("Note: The 'Create Wallet' endpoint is still being finalized on the backend.");
    } finally {
      setCreatingWallet(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Syncing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-10 animate-in fade-in duration-700">
      
      {/* 1. HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Card (Balance or Setup) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[3rem] bg-foreground p-8 md:p-12 text-background shadow-2xl flex flex-col justify-center min-h-[320px]">
          
          {!wallet ? (
            /* CREATE WALLET CTA */
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30">
                <Zap className="h-3 w-3 fill-current" /> Action Required
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                  Activate your <br />Spewpay Wallet
                </h2>
                <p className="text-slate-400 font-medium max-w-sm text-sm md:text-base">
                  Unlock instant deposits, double-entry security, and zero-fee internal transfers.
                </p>
              </div>
              <button 
                onClick={handleCreateWallet}
                disabled={creatingWallet}
                className="group flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50"
              >
                {creatingWallet ? <Loader2 className="animate-spin h-5 w-5" /> : <>Create My Wallet <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          ) : (
            /* BALANCE DISPLAY */
            <div className="relative z-10 space-y-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2 opacity-60">
                  <span className="text-sm font-bold uppercase tracking-[0.2em]">Total Balance</span>
                  <button onClick={fetchData} className="hover:rotate-180 transition-transform duration-500">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                  {/* Supports both snake_case and camelCase from backend */}
                  {formatCurrency(wallet.cached_balance ?? wallet.cachedBalance ?? 0)}
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-5 py-2.5 rounded-2xl bg-white/10 text-xs font-black uppercase tracking-widest border border-white/5 backdrop-blur-xl">
                  {wallet.currency || 'NGN'}
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5 backdrop-blur-xl opacity-60">
                  REF: {(wallet.id || wallet.uuid || "").slice(0, 8)}
                </div>
              </div>
            </div>
          )}

          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] -mr-48 -mt-48 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -ml-32 -mb-32 rounded-full" />
        </div>

        {/* Info/Quick Actions Card */}
        <div className="rounded-[3rem] border border-border bg-card p-8 flex flex-col justify-between shadow-sm">
          {!wallet ? (
            <div className="space-y-8">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h3 className="font-black text-xl tracking-tight">Enterprise Trust</h3>
                <ul className="space-y-4">
                  {['Double-entry ledger precision', 'Pessimistic row-level locking', 'HMAC Webhook security'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-bold leading-tight">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Quick Access</span>
              <nav className="space-y-3">
                <Link href="/dashboard/deposit" className="w-full flex items-center justify-between p-5 bg-background border border-border rounded-[1.5rem] hover:border-emerald-500/50 transition-all group font-bold">
                  <span className="flex items-center gap-4"><Plus className="h-5 w-5 text-emerald-500" /> Fund</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
                <Link href="/dashboard/transfer" className="w-full flex items-center justify-between p-5 bg-background border border-border rounded-[1.5rem] hover:border-emerald-500/50 transition-all group font-bold">
                  <span className="flex items-center gap-4"><ArrowUpRight className="h-5 w-5 text-indigo-500" /> Send</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </nav>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ledger Status</p>
                 <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Synchronized
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. ACTIVITY HISTORY */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-2xl font-black tracking-tighter uppercase italic">Activity</h3>
          {wallet && (
            <Link href="/dashboard/history" className="text-[10px] font-black uppercase text-emerald-600">
              View All History
            </Link>
          )}
        </div>
        
        <div className="bg-card border border-border rounded-[3rem] overflow-hidden">
          {!wallet || transactions.length === 0 ? (
            <div className="py-24 text-center space-y-5">
               <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
                  <History className="text-slate-300 h-10 w-10" />
               </div>
               <div className="space-y-1">
                 <p className="text-slate-500 font-black text-lg">No movements yet</p>
                 <p className="text-xs text-slate-400 font-bold max-w-[240px] mx-auto">
                   Setup your wallet and start transacting to see your activity here.
                 </p>
               </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-6 md:p-8 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                      {tx.type === 'DEPOSIT' ? <ArrowDownLeft className="h-7 w-7" /> : <ArrowUpRight className="h-7 w-7" />}
                    </div>
                    <div>
                      <p className="font-black text-sm md:text-lg">{tx.type}</p>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">
                        {new Date(tx.createdAt || tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-xl md:text-2xl tracking-tighter ${tx.type === 'DEPOSIT' ? 'text-emerald-600' : ''}`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tx.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}