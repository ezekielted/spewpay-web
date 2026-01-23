"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for redirection
import {
  ArrowRight,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  User,
  ShieldCheck,
  Loader2, // Added for loading state
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { authService } from "@/services"; // Relative path to services

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "", // This will be sent as 'email' to the backend
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // UPDATED PAYLOAD TO MATCH BACKEND EXPECTATIONS
      const payload = {
        displayName: formData.fullName, // Changed from fullName to displayName
        email: formData.identifier,
        password: formData.password,
      };

      const response = await authService.signup(payload);

      if (response.status === 201 || response.status === 200) {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      // Display the specific error from the backend if available
      const message = err.response?.data?.message || "Registration failed";
      // If the error is an array (common in NestJS/class-validator), join it
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
      </div>

      <header className="p-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-bold transition-transform group-hover:scale-105">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              SPEWPAY
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-foreground">
                Get started
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                Join Spewpay and secure your digital assets today.
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold opacity-80 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    disabled={isLoading}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-background text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold opacity-80 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="identifier"
                    required
                    disabled={isLoading}
                    placeholder="name@company.com"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-background text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold opacity-80 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      disabled={isLoading}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold opacity-80 ml-1">
                    Confirm
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      disabled={isLoading}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-4 text-base font-bold hover:opacity-90 transition-all shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Create account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-[11px] text-center text-slate-500 leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link href="#" className="underline hover:text-emerald-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-emerald-600">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm font-bold text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-widest">
              Enterprise Grade Security
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
