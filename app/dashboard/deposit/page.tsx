"use client";

import { useState, useEffect } from "react";
import { paymentService } from "../../../services";
import { 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function DepositPage() {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Local state for user info from storage
  const [user, setUser] = useState({ id: "", email: "" });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    if (userId && userEmail) {
      setUser({ id: userId, email: userEmail });
    }
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nairaAmount = parseFloat(amount);
    if (isNaN(nairaAmount) || nairaAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        userId: user.id,
        email: user.email,
        amountInNaira: nairaAmount,
        callbackUrl: `${window.location.origin}/dashboard/deposit/verify`,
        idempotencyKey: crypto.randomUUID(),
      };

      const response = await paymentService.initializeDeposit(payload);
      
      // Paystack returns an authorizationUrl
      const { authorizationUrl } = response.data.data;

      if (authorizationUrl) {
        // Redirect user to Paystack Checkout
        window.location.href = authorizationUrl;
      } else {
        throw new Error("Could not get payment link.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Initialization failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
          Secure Payment
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Fund Wallet</h1>
        <p className="text-muted-foreground font-bold">Top up your balance instantly via Paystack</p>
      </div>

      {/* Main Deposit Card */}
      <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-foreground/5">
        <form onSubmit={handleDeposit} className="space-y-10">
          
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">
              Enter Amount (NGN)
            </label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-muted-foreground/50 group-focus-within:text-emerald-500 transition-colors">
                ₦
              </span>
              <input
                type="number"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-[2rem] pl-16 pr-8 py-8 text-4xl font-black focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-muted-foreground/20 text-foreground"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-xs font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <button
              disabled={isLoading || !amount}
              className="w-full glass-button text-foreground py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <>
                  Continue to Paystack
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-8 pt-4">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Bank-grade Security</span>
               </div>
               <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Instant Funding</span>
               </div>
            </div>
          </div>
        </form>
      </div>

      {/* Info Notice */}
      <div className="p-6 bg-muted/50 rounded-3xl border border-border">
         <div className="flex gap-4">
            <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center shrink-0 border border-border shadow-sm">
               <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
               <p className="text-xs font-black uppercase tracking-tight text-foreground">Payment Information</p>
               <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Payments are processed securely via Paystack. Your financial data is encrypted and never stored on our servers. Funds will appear in your balance immediately after a successful checkout.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
