import Link from "next/link";
import {
  Wallet,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Plus,
  TrendingUp,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="min-h-screen bg-background">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/90 backdrop-blur-md">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 font-bold transition-transform group-hover:scale-105">
                C
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">CLENJA</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how"
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
              >
                How it works
              </a>
              <Link
                href="/login"
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
              >
                Sign in
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/signup"
                className="hidden sm:inline-flex rounded-full bg-slate-900 dark:bg-slate-50 px-5 py-2 text-sm font-bold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md"
              >
                Get started
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32">
          <Container>
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Ready for Teams
                </div>

                <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-7xl text-foreground">
                  Allocate money with{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                    clarity
                  </span>
                  .
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl font-medium">
                  The financial operating system for modern teams. Create shared wallets, set spending limits, and manage allocations with ease.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-slate-50 px-8 py-4 text-base font-bold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-900/20"
                  >
                    Start for free <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#features"
                    className="flex items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-4 text-base font-bold text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    See Features
                  </a>
                </div>
              </div>

              {/* Preview Card */}
              <div className="relative group">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-transform group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Main Account</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">₦ 2,450,000.00</p>
                    </div>
                    <button className="p-2.5 rounded-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 hover:scale-105 transition-transform shadow-lg">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Engineering", icon: "🤖", amount: "₦ 350k", meta: "Surplus in use" },
                      { name: "Product Management", icon: "🚀", amount: "₦ 850k", meta: "7 Members" },
                      { name: "Sales & Operations", icon: "📣", amount: "₦ 400k", meta: "Reset in 4 days" }
                    ].map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-transparent"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{w.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{w.name}</p>
                            <p className="text-[11px] font-bold text-slate-500">{w.meta}</p>
                          </div>
                        </div>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{w.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800"
        >
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">
                Powering financial workflows
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-50">{f.title}</h3>
                  <p className="text-sm font-bold leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section id="how" className="py-24 bg-background">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">
                How it works in 3 simple steps
              </h2>
              <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 font-medium">
                Get started quickly and manage money with your team in minutes.
              </p>
            </div>

            <div className="grid gap-10 md:gap-12 lg:gap-16 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.n}
                  className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Step number badge */}
                  <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-lg shadow-lg">
                    {step.n}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                      {step.desc}
                    </p>
                  </div>

                  {/* Connector line between steps (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-emerald-500/30 to-indigo-500/30" />
                  )}
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div className="mt-16 text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-50 px-8 py-4 text-base font-bold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-900/20"
              >
                Get Started Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 pt-20 pb-10">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-20">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 font-bold">
                  C
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  CLENJA
                </span>
              </Link>
              <p className="text-sm font-bold leading-relaxed text-slate-600 dark:text-slate-400">
                Building the next generation of collaborative financial tools. Designed for speed.
              </p>
              <div className="flex gap-4">
                {[<Twitter key="t" className="h-4 w-4" />, <Github key="g" className="h-4 w-4" />, <Linkedin key="l" className="h-4 w-4" />].map(
                  (icon, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-slate-200 dark:border-transparent"
                    >
                      {icon}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-900 dark:text-slate-50">
                Product
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                    Shared Wallets
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                    Org Controls
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-900 dark:text-slate-50">
                Company
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-900 dark:text-slate-50">
                Legal
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-10 border-t border-slate-200 dark:border-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-black text-slate-500">
              © {new Date().getFullYear()} Joint Fintech Inc. Licensed Institution.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}