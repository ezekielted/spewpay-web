"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image component
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowUpRight,
  PlusCircle,
  History,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  User,
  BookOpen
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Deposit", icon: PlusCircle, href: "/dashboard/deposit" },
    { label: "Send Money", icon: ArrowUpRight, href: "/dashboard/transfer" },
    { label: "History", icon: History, href: "/dashboard/history" },
    { label: "Ledger", icon: BookOpen, href: "/dashboard/ledger" },
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
      <aside className="hidden md:flex w-72 flex-col border-r border-border bg-card p-6 fixed h-full">
        <div className="flex items-center gap-3 px-2 mb-10">
          {/* LOGO INTEGRATION - DESKTOP */}
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

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${isActive
                  ? "bg-foreground text-background shadow-lg shadow-slate-200 dark:shadow-none"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full transition-colors text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <p className="text-[10px] font-black uppercase text-slate-400 leading-tight">
              Enterprise <br /> Protected
            </p>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* --- Mobile Header --- */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* LOGO INTEGRATION - MOBILE */}
          <div className="relative h-7 w-7 overflow-hidden rounded-md">
            <Image 
              src="/assets/logo.ico" 
              alt="Spewpay Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-black uppercase tracking-tighter text-foreground">Spewpay</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-20 p-6 flex flex-col">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-xl font-black uppercase tracking-tighter border-b border-border pb-4"
              >
                <item.icon className="h-6 w-6" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 text-xl font-black uppercase tracking-tighter text-red-500 pt-4"
            >
              <LogOut className="h-6 w-6" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}