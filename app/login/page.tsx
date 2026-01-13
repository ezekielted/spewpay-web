"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <header className="p-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Using bg-foreground and text-background ensures the logo 
                always flips perfectly with the theme */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-bold transition-transform group-hover:scale-105">
              C
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              CLENJA
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 mb-8">
            <ChevronLeft className="h-4 w-4" /> Back to home
          </Link>

          {/* bg-card is defined in our CSS variables now */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-foreground">Welcome back</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                Enter your details to access your account.
              </p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-80 ml-1">Email or Phone</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-background text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-4 font-bold hover:opacity-90 transition-all shadow-lg">
                Sign in <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}