"use client";

import { useEffect, useState } from "react";
import { walletService, userService } from "../../services";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  RefreshCw,
  Calendar,
  Loader2,
  User,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingWallet, setCreatingWallet] = useState(false);

  // Helper: Get current date string
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const [userRes, walletRes] = await Promise.allSettled([
        userService.getUserById(userId),
        walletService.getWalletByUserId(userId)
      ]);

      if (userRes.status === 'fulfilled') {
        const userData = userRes.value.data?.data || userRes.value.data;
        setUser(userData);
      }

      if (walletRes.status === 'fulfilled') {
        const walletData = walletRes.value.data?.data || walletRes.value.data;
        
        if (walletData && (walletData.id || walletData.uuid)) {
          const walletId = walletData.id || walletData.uuid;

          const balanceRes = await walletService.getBalance(walletId);
          const balanceData = balanceRes.data?.data || balanceRes.data;

          const freshBalance = 
            balanceData?.balance ?? 
            balanceData?.cached_balance ?? 
            balanceData?.cachedBalance ?? 
            walletData?.cached_balance ?? 0;

          setWallet({ ...walletData, displayBalance: freshBalance });
          
          const txRes = await walletService.getTransactions(walletId, 1, 5);
          const txData = txRes.data?.data || txRes.data || [];
          setTransactions(Array.isArray(txData) ? txData : []);
        } else {
          setWallet(null);
        }
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
      alert("Note: Create Wallet logic triggered.");
    } finally {
      setCreatingWallet(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 animate-pulse">
        <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Zap className="h-8 w-8 text-emerald-500 animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
            <p className="text-lg font-black tracking-tight text-foreground">Spewpay</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Securing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 md:space-y-12 animate-in fade-in duration-700">
      
      {/* 0. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
        
        {/* Left: Greeting */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <Calendar className="h-3 w-3" />
              {currentDate}
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
              Hello, <span className="text-emerald-500">{user?.displayName?.split(' ')[0] || 'User'}</span>
          </h1>
        </div>

        {/* Right: Profile & Status Button */}
        <Link 
            href="/dashboard/profile"
            className="flex items-center gap-4 bg-background border border-border p-2 pr-6 rounded-full hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
            {/* FIXED CONTRAST: Added text-slate-600 so it's visible in light mode */}
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-200 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <User className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                    My Profile
                </p>
                <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${user?.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {user?.status || 'Offline'}
                    </p>
                </div>
            </div>
        </Link>
      </div>

      {/* 1. HERO SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <div className="xl:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-foreground p-8 md:p-12 text-background shadow-2xl flex flex-col justify-center min-h-[320px] group">
          
          {!wallet ? (
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30">
                <Zap className="h-3 w-3 fill-current" /> Action Required
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter">
                  Activate your <br />Spewpay Wallet
                </h2>
                <button 
                  onClick={handleCreateWallet}
                  disabled={creatingWallet}
                  className="mt-4 flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50"
                >
                  {creatingWallet ? <Loader2 className="animate-spin h-5 w-5" /> : <>Create My Wallet <ArrowRight className="h-5 w-5" /></>}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 space-y-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2 opacity-60">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em]">Total Balance</span>
                  <button onClick={fetchData} className="hover:rotate-180 transition-transform duration-500 p-1">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter break-all">
                  {formatCurrency(wallet.displayBalance)}
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-5 py-2.5 rounded-2xl bg-white/10 text-xs font-black uppercase tracking-widest border border-white/5 backdrop-blur-xl">
                  {wallet.currency || 'NGN'}
                </div>
                <div className="px-5 py-2.5 rounded-2xl bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5 backdrop-blur-xl opacity-60">
                  ID: {(wallet.id || wallet.uuid || "").slice(0, 8)}
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] -mr-48 -mt-48 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -ml-32 -mb-32 rounded-full pointer-events-none" />
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-[2.5rem] border border-border bg-card p-8 flex flex-col justify-between shadow-sm h-full min-h-[300px]">
          {!wallet ? (
            <div className="space-y-8 my-auto">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-xl tracking-tight">Enterprise Security</h3>
                <p className="text-sm font-bold text-slate-500">Your funds are protected by double-entry ledger protocols.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Quick Actions</span>
                <nav className="space-y-3">
                  <Link href="/dashboard/deposit" className="w-full flex items-center justify-between p-5 bg-background border border-border rounded-[2rem] hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1 transition-all group font-bold">
                    <span className="flex items-center gap-4 font-black uppercase text-xs md:text-sm tracking-wide">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-emerald-500" />
                        </div>
                        Fund Wallet
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                  <Link href="/dashboard/transfer" className="w-full flex items-center justify-between p-5 bg-background border border-border rounded-[2rem] hover:border-indigo-500/50 hover:shadow-lg hover:-translate-y-1 transition-all group font-bold">
                    <span className="flex items-center gap-4 font-black uppercase text-xs md:text-sm tracking-wide">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                            <ArrowUpRight className="h-4 w-4 text-indigo-500" />
                        </div>
                        Send Money
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                </nav>
              </div>
              
              <div className="mt-6 p-4 bg-background border border-border rounded-2xl flex items-center justify-between">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Status</p>
                 <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wide">Live</span>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. ACTIVITY HISTORY */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black tracking-tighter uppercase italic px-2">Recent Activity</h3>
        
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          {!wallet || transactions.length === 0 ? (
            <div className="py-24 text-center space-y-6">
               <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center">
                  <History className="text-slate-300 h-10 w-10" />
               </div>
               <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="group flex items-center justify-between p-6 md:p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
                  <div className="flex items-center gap-5">
                    <div className={`h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                      {tx.type === 'DEPOSIT' ? <ArrowDownLeft className="h-6 w-6 md:h-7 md:w-7" /> : <ArrowUpRight className="h-6 w-6 md:h-7 md:w-7" />}
                    </div>
                    <div>
                      <p className="font-black text-sm md:text-base uppercase tracking-tight">{tx.type}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-1">
                        {new Date(tx.createdAt || tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg md:text-2xl tracking-tighter ${tx.type === 'DEPOSIT' ? 'text-emerald-600' : ''}`}>
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