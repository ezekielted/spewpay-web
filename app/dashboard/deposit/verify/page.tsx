"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentService } from "@/services";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowRight, 
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your transaction with the bank...");

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        setStatus("error");
        setMessage("No transaction reference found.");
        return;
      }

      try {
        // Call the verification endpoint
        const response = await paymentService.verifyDeposit(reference);
        
        if (response.data.success) {
          setStatus("success");
          setMessage("Your wallet has been credited successfully.");
        } else {
          throw new Error("Verification failed on the server.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "We couldn't verify this payment. Please contact support.");
      }
    };

    verify();
  }, [reference]);

  return (
    <div className="max-w-md mx-auto p-6 md:p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Icon State */}
      <div className="flex justify-center">
        {status === "loading" && (
          <div className="relative">
             <Loader2 className="h-24 w-24 text-emerald-500 animate-spin" />
             <RefreshCw className="h-8 w-8 text-emerald-500/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
        {status === "success" && (
          <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="h-16 w-16" />
          </div>
        )}
        {status === "error" && (
          <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
            <XCircle className="h-16 w-16" />
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="space-y-3">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          {status === "loading" ? "Verifying..." : status === "success" ? "Success!" : "Payment Error"}
        </h1>
        <p className="text-slate-500 font-bold leading-relaxed">
          {message}
        </p>
        {reference && (
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
            Ref: {reference}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4">
        {status !== "loading" && (
          <Link 
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl group"
          >
            Go to Dashboard 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Trust Footer */}
      <div className="flex items-center justify-center gap-2 pt-6 opacity-30">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Spewpay Ledger Verified</span>
      </div>
    </div>
  );
}

// Wrapping in Suspense for Vercel build compatibility (due to useSearchParams)
export default function VerifyPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Suspense fallback={<Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}