"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowUpRight,
  PlusCircle,
  History,
  LogOut,
  ShieldCheck,
  User,
  BookOpen,
  Building2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Deposit", icon: PlusCircle, href: "/dashboard/deposit" },
    { label: "Send", icon: ArrowUpRight, href: "/dashboard/transfer" },
    { label: "History", icon: History, href: "/dashboard/history" },
    { label: "Ledger", icon: BookOpen, href: "/dashboard/ledger" },
    { label: "Organizations", icon: Building2, href: "/dashboard/organizations" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* --- Sidebar - Desktop --- */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl p-6 fixed h-full z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          {/* LOGO INTEGRATION - DESKTOP */}
          <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-sm">
            <Image
              src="/assets/logo.ico"
              alt="Spewpay Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-black uppercase tracking-tighter text-xl text-foreground">Spewpay</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group ${isActive
                  ? "glass-active text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-destructive hover:bg-destructive/10 w-full transition-colors text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>

          <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-3 border border-border/50">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <p className="text-[10px] font-black uppercase text-muted-foreground leading-tight">
              Enterprise <br /> Protected
            </p>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* --- Mobile Header (Minimal) --- */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {/* LOGO INTEGRATION - MOBILE */}
          <div className="relative h-8 w-8 overflow-hidden rounded-lg">
            <Image
              src="/assets/logo.ico"
              alt="Spewpay Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-black uppercase tracking-tighter text-lg text-foreground">Spewpay</span>
        </div>
        <ThemeToggle />
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-72 min-h-screen pb-24 md:pb-0">
        {children}
      </main>

      {/* --- Mobile Bottom Navigation (Fixed) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border pb-safe">
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl transition-all ${isActive
                  ? "glass-active text-emerald-500"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <item.icon className={`h-6 w-6 ${isActive ? "fill-current" : ""}`} />
                {/* Optional: Add label if space permits, user requested ONLY icons but labels help accessibility. 
                    User said "Use only their icons". I will hide labels. 
                 */}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center p-3 text-destructive/70 hover:text-destructive"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </nav>
      </div>

    </div>
  );
}
