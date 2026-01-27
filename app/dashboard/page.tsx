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
  TrendingUp,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

// Helper: Format Currency
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
        <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Zap className="h-8 w-8 text-primary animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
            <p className="text-lg font-black tracking-tight text-foreground">Spewpay</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Securing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* 0. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/50">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest">
              <Calendar className="h-3 w-3" />
              {currentDate}
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
              Hello, <span className="text-primary">{user?.displayName?.split(' ')[0] || 'User'}</span>
          </h1>
        </div>
      </div>

      {/* 1. HERO SECTION - Compact Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Balance Card - Redesigned to be less obstructive */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl p-6 md:p-8 flex flex-col justify-between min-h-[200px] group">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] -mr-20 -mt-20 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 blur-[60px] -ml-10 -mb-10 rounded-full pointer-events-none" />

          {!wallet ? (
             <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30 w-fit">
                  <Zap className="h-3 w-3 fill-current" /> Action Required
                </div>
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Activate your Wallet</h2>
                  <button 
                    onClick={handleCreateWallet}
                    disabled={creatingWallet}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50 text-sm"
                  >
                    {creatingWallet ? <Loader2 className="animate-spin h-4 w-4" /> : <>Create <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </div>
             </div>
          ) : (
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
               <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Balance</p>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
                        {formatCurrency(wallet.displayBalance)}
                      </h2>
                      <button onClick={fetchData} className="text-slate-500 hover:text-white transition-colors p-1">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <CreditCard className="h-5 w-5 text-emerald-400" />
                  </div>
               </div>

               <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                 <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active Wallet
                 </div>
                 <span className="text-slate-600">|</span>
                 <p className="text-xs font-mono text-slate-400 tracking-wider">
                   ID: {(wallet.id || wallet.uuid || "").slice(0, 8)}...
                 </p>
               </div>
            </div>
          )}
        </div>

        {/* Quick Actions - Card Style */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Quick Actions</span>
          </div>
          
          <div className="grid gap-3 flex-1 content-start">
             <Link href="/dashboard/deposit" className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent transition-all group">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                      <Plus className="h-5 w-5" />
                   </div>
                   <div className="text-left">
                      <p className="font-bold text-sm text-foreground">Fund Wallet</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Add money instantly</p>
                   </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
             </Link>

             <Link href="/dashboard/transfer" className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-indigo-500/10 hover:border-indigo-500/20 border border-transparent transition-all group">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="h-5 w-5" />
                   </div>
                   <div className="text-left">
                      <p className="font-bold text-sm text-foreground">Send Money</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Transfer to anyone</p>
                   </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
             </Link>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITY HISTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
             <History className="h-4 w-4 text-muted-foreground" />
             Recent Activity
           </h3>
           <Link href="/dashboard/history" className="text-xs font-bold text-primary hover:underline">View All</Link>
        </div>
        
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {!wallet || transactions.length === 0 ? (
            <div className="py-20 text-center space-y-4">
               <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <TrendingUp className="text-muted-foreground h-8 w-8" />
               </div>
               <p className="text-muted-foreground font-medium text-sm">No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="group flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                      {tx.type === 'DEPOSIT' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground uppercase tracking-wide">{tx.type}</p>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mt-0.5">
                        {new Date(tx.createdAt || tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm md:text-base tracking-tight ${tx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-foreground'}`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{tx.status}</span>
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
