"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Wallet,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  Plus
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    title: "Multi-wallets",
    desc: "Create separate wallets for projects, teams, or personal goals — all in one place.",
    icon: <Wallet className="h-6 w-6" />,
  },
  {
    title: "Smart allocations",
    desc: "Split funds by amount or percentage, and set recurring allocations effortlessly.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    title: "Teams & circles",
    desc: "Assign wallets to teams in an organization or to friends and family personally.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Controls & approvals",
    desc: "Set spending limits and approval flows so every transaction stays accountable.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
];

const steps = [
  {
    n: "01",
    title: "Create an account",
    desc: "Choose Individual or Organization setup in seconds.",
  },
  {
    n: "02",
    title: "Add wallets",
    desc: "Create dedicated buckets for teams, goals, or loved ones.",
  },
  {
    n: "03",
    title: "Allocate funds",
    desc: "Move money with rules, limits, and full transparency.",
  },
];

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/landing-page-stock-image.jpg"
              alt="SPEWPAY Background"
              fill
              priority
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-background" />
          </div>

          <Container className="relative z-10">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  For Work & Family ❤️
                </div>

                <h1 className="mt-8 text-5xl font-black uppercase tracking-tighter sm:text-7xl leading-[0.9] text-white">
                  Allocate money with{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">clarity</span>.
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl font-medium">
                  The financial operating system for modern teams. Create shared wallets, set spending limits, and manage allocations with ease.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link href="/signup" className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-950 hover:bg-slate-200 transition-all shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40">
                    Start for free <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="#features" className="flex items-center justify-center rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-all shadow-xl shadow-black/40">
                    See Features
                  </a>
                </div>
              </div>

              {/* Preview Card */}
              <div className="relative group">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl transition-transform group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs font-black text-foreground/50 uppercase tracking-widest">Main Account</p>
                      <p className="text-3xl font-bold text-foreground">₦ 2,450,000.00</p>
                    </div>
                    <button className="p-2.5 rounded-full bg-foreground text-background hover:scale-105 transition-transform shadow-lg">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Engineering", icon: "🤖", amount: "₦ 350k", meta: "Surplus in use" },
                      { name: "Product Management", icon: "🚀", amount: "₦ 850k", meta: "7 Members" },
                      { name: "Sales & Operations", icon: "📣", amount: "₦ 400k", meta: "Reset in 4 days" }
                    ].map((w, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-background/50 border border-border">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{w.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-foreground">{w.name}</p>
                            <p className="text-[11px] font-bold text-foreground/50">{w.meta}</p>
                          </div>
                        </div>
                        <p className="font-bold text-sm text-foreground">{w.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-card border-y border-border">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">Powering financial workflows</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title} className="group rounded-2xl border border-border bg-background p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-foreground">{f.title}</h3>
                  <p className="text-sm font-bold leading-relaxed text-foreground/70">{f.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section id="how" className="py-24 bg-background">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">How it works in 3 simple steps</h2>
              <p className="mt-5 text-lg text-foreground/70 font-medium">Get started quickly and manage money with your team in minutes.</p>
            </div>
            <div className="grid gap-10 md:gap-12 lg:gap-16 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.n} className="relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-lg shadow-lg">{step.n}</div>
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4 text-foreground">{step.title}</h3>
                    <p className="text-base leading-relaxed text-foreground/70 font-medium">{step.desc}</p>
                  </div>
                  {index < steps.length - 1 && <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-emerald-500/30 to-indigo-500/30" />}
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background hover:opacity-90 transition-all shadow-xl shadow-foreground/10">Get Started Now <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}