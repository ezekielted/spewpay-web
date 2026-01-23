"use client";

import { useState, Suspense } from "react"; // Added Suspense
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, Lock, Eye, EyeOff, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { authService } from "../../services";

// 1. Move the actual logic into a separate component
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      const { accessToken, user } = response.data;
      
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 mb-8">
        <ChevronLeft className="h-4 w-4" /> Back to home
      </Link>

      {isRegistered && !error && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-bold">Registration successful! Please sign in.</p>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            Enter your details to access your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-80 ml-1">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold opacity-80 ml-1">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-4 font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. The main Page component wraps the form in Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <header className="p-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-bold transition-transform group-hover:scale-105">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground uppercase">
              SPEWPAY
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {/* THIS SUSPENSE BOUNDARY FIXES THE VERCEL BUILD ERROR */}
        <Suspense fallback={<Loader2 className="animate-spin h-10 w-10 text-emerald-500" />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}