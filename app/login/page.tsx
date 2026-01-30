"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
// Image import removed as it is in SimpleHeader
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Mail, Lock, Eye, EyeOff, ChevronLeft, Loader2, CheckCircle2, Fingerprint } from "lucide-react";
// ThemeToggle removed as it is in SimpleHeader
import { authService } from "../../services";
import { SimpleHeader } from "@/components/layout/SimpleHeader";

type AuthView = "login" | "forgot" | "reset" | "verify";

// 1. Move the actual logic into a separate component
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const isVerified = searchParams.get("verified") === "true";

  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState(searchParams.get("email") || "");

  useEffect(() => {
    if (searchParams.get("verify") === "true") {
      setView("verify");
    }
  }, [searchParams]);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const message = err.response?.data?.message || "Invalid email or password";
      setError(message);
      if (message.toLowerCase().includes("verify") || message.toLowerCase().includes("email")) {
        setView("verify");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.forgotPassword(email);
      setSuccess("OTP sent to your email!");
      setView("reset");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({ token: otp, password: newPassword });
      setSuccess("Password reset successfully! Please log in.");
      setView("login");
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Check your OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.verifyEmail({ email, token: otp });
      setSuccess("Email verified successfully! Please log in.");
      setView("login");
      setOtp("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Check your OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTitle = () => {
    switch(view) {
      case "forgot": return "Reset password";
      case "reset": return "Verify OTP";
      case "verify": return "Verify email";
      default: return "Welcome back";
    }
  };

  const renderSubtitle = () => {
    switch(view) {
      case "forgot": return "Enter your email to receive a reset OTP.";
      case "reset": return "Enter the OTP sent to your email and your new password.";
      case "verify": return "Enter the 6-digit code sent to your email.";
      default: return "Enter your details to access your account.";
    }
  };

  return (
    <div className="w-full max-w-md">
      <button 
        onClick={() => view === "login" ? router.push("/") : setView("login")}
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-emerald-600 mb-8 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> {view === "login" ? "Back to home" : "Back to login"}
      </button>

      {isRegistered && view === "login" && !error && !success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-bold">Registration successful! Please sign in.</p>
        </div>
      )}

      {isVerified && view === "login" && !error && !success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-bold">Email verified successfully! Please sign in.</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-bold">{success}</p>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">{renderTitle()}</h1>
          <p className="text-muted-foreground font-medium mt-2">
            {renderSubtitle()}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
            {error}
          </div>
        )}

        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-1">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold opacity-80">Password</label>
                <button 
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-full glass-button text-foreground px-8 py-4 font-bold disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-1">Email address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-full glass-button text-foreground px-8 py-4 font-bold disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        {view === "reset" && (
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-1">Reset OTP</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-1">New Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-full glass-button text-foreground px-8 py-4 font-bold disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        {view === "verify" && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-1">Verification OTP</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-full glass-button text-foreground px-8 py-4 font-bold disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Verify Email <ArrowRight className="h-4 w-4" /></>}
            </button>

            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                setSuccess(null);
                try {
                  await authService.resendVerificationEmail(email);
                  setSuccess("Verification code resent to your email.");
                } catch (err: any) {
                  setError(err.response?.data?.message || "Failed to resend verification code.");
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full text-center text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors disabled:opacity-70"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-500 font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

// 2. The main Page component
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <SimpleHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<Loader2 className="animate-spin h-10 w-10 text-emerald-500" />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
