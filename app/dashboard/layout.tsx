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
  Building2,
  Settings
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { userService } from "../../services";

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
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const [showLogout, setShowLogout] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    // Verify user exists and token is valid
    userService.getUserById(userId).then(res => {
      const userData = res.data?.data || res.data;
      setUserEmail(userData.email);
    }).catch(err => {
      // If unauthorized (401) or user not found (404), logout immediately
      if (err.response?.status === 401 || err.response?.status === 404) {
        handleLogout();
      }
    });
  }, [router]);

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

        <div className="mt-auto pt-6">
          <div 
            onClick={() => setShowLogout(!showLogout)}
            className="p-4 bg-muted/50 hover:bg-muted rounded-2xl transition-all border border-border/50 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-black uppercase text-foreground leading-tight truncate">
                  My Profile
                </p>
                <p className="text-[10px] text-muted-foreground font-medium truncate">
                  {userEmail}
                </p>
              </div>
            </div>
            
            {showLogout && (
              <div className="mt-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs text-destructive hover:bg-destructive/10 w-full transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* --- Mobile Header (Minimal) --- */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {/* LOGO INTEGRATION - MOBILE ONLY (Desktop has sidebar logo) */}
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
        <Link href="/dashboard/profile" className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            <User className="h-5 w-5" />
        </Link>
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-72 min-h-screen pb-24 md:pb-0">
        {children}
      </main>

      {/* --- Mobile Bottom Navigation (Fixed) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border pb-safe">
        <nav className="flex items-center justify-around p-2">
          {navItems.filter(item => 
            ["Overview", "Deposit", "Send", "History", "Organizations"].includes(item.label)
          ).map((item) => {
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
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
