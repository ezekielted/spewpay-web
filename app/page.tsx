import Link from "next/link";

const features = [
  {
    title: "Multi-wallets",
    desc: "Create separate wallets for projects, teams, or personal goals — all in one place.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5v-9Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M7 9h10M7 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Smart allocations",
    desc: "Split funds by amount or percentage, and set recurring allocations effortlessly.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M4 18V6m0 12h16M8 14l3-3 3 2 5-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Teams & circles",
    desc: "Assign wallets to teams in an organization or to friends and family personally.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M16 11a4 4 0 1 0-8 0m12 8a6 6 0 0 0-12 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Controls & approvals",
    desc: "Set spending limits and approval flows so every transaction stays accountable.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M12 3l7 4v6c0 5-3 8-7 8s-7-3-7-8V7l7-4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12.5l1.8 1.8 3.8-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const steps = [
  { n: "01", title: "Create an account", desc: "Choose Individual or Organization." },
  { n: "02", title: "Add wallets", desc: "Create wallets for teams, goals, or loved ones." },
  { n: "03", title: "Allocate funds", desc: "Move money with rules, limits, and visibility." },
];

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Soft color background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <Container>
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white font-semibold">
                JF
              </span>
              <span className="text-lg font-semibold">joint-fintech</span>
            </Link>

            <nav className="flex items-center gap-3">
              <a href="#features" className="hidden sm:block text-sm text-zinc-700 hover:text-zinc-900">
                Features
              </a>
              <a href="#how" className="hidden sm:block text-sm text-zinc-700 hover:text-zinc-900">
                How it works
              </a>
              <Link href="/login" className="text-sm text-zinc-700 hover:text-zinc-900">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Get started
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-12 sm:pt-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800">
                  For Individuals & Organizations
                </p>

                <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">
                  Allocate money with{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                    clarity & control
                  </span>
                  .
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
                  Create wallets, assign them to teams or loved ones, and manage spending with limits, approvals,
                  and visibility.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/signup"
                    className="rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-800"
                  >
                    Create account
                  </Link>
                  <a
                    href="#features"
                    className="rounded-lg border border-zinc-200 bg-white px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-50"
                  >
                    See features
                  </a>
                </div>

                <ul className="mt-8 space-y-3 text-base text-zinc-600">
                  {[
                    "Role-based access for organizations",
                    "Shared wallets for family & friends",
                    "Built-in limits, approvals, and audit trails",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Restored richer Preview Card */}
              <div className="relative">
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Overview</p>
                      <p className="text-xs text-zinc-500">Today</p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800"
                    >
                      <span className="text-sm leading-none">+</span>
                      Wallet
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs text-emerald-800">Primary Wallet</p>
                      <p className="mt-1 text-2xl font-semibold">₦ 2,450,000</p>
                      <p className="mt-2 text-xs text-emerald-900/70">+12% this month</p>
                    </div>
                    <div className="rounded-xl bg-indigo-50 p-4">
                      <p className="text-xs text-indigo-800">Allocations</p>
                      <p className="mt-1 text-2xl font-semibold">7 active</p>
                      <p className="mt-2 text-xs text-indigo-900/70">Teams • Family • Projects</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Wallets</p>
                      <p className="text-xs text-zinc-500">Last 7 days</p>
                    </div>

                    <div className="mt-3 space-y-3">
                      {[
                        { name: "Marketing Team", meta: "Org • Spend limit", amount: "₦ 350,000" },
                        { name: "Operations", meta: "Org • Approval required", amount: "₦ 500,000" },
                        { name: "Family Essentials", meta: "Individual • Shared", amount: "₦ 120,000" },
                      ].map((w) => (
                        <div
                          key={w.name}
                          className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{w.name}</p>
                            <p className="truncate text-xs text-zinc-500">{w.meta}</p>
                          </div>
                          <p className="ml-4 text-sm font-semibold">{w.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs font-semibold text-emerald-800">Suggested</p>
                      <p className="mt-1 text-sm font-semibold">Enable approvals for Ops</p>
                      <p className="mt-1 text-xs text-emerald-900/70">
                        Reduce risk with manager approval on large spends.
                      </p>
                    </div>
                    <div className="rounded-xl bg-indigo-50 p-4">
                      <p className="text-xs font-semibold text-indigo-800">Insight</p>
                      <p className="mt-1 text-sm font-semibold">Recurring allocations</p>
                      <p className="mt-1 text-xs text-indigo-900/70">
                        Automate monthly funding to teams & family wallets.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-r from-emerald-200/50 to-indigo-200/50 blur-2xl"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Features */}
        <section id="features" className="py-16 sm:py-24">
          <Container>
            <h2 className="text-3xl font-semibold sm:text-4xl">Core features</h2>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600">
              A simple structure that scales from personal finance to organizations.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white">
                    {f.icon}
                  </div>
                  <p className="mt-4 text-lg font-semibold">{f.title}</p>
                  <p className="mt-2 text-base text-zinc-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section id="how" className="pb-16 sm:pb-24">
          <Container>
            <h2 className="text-3xl font-semibold sm:text-4xl">How it works</h2>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-emerald-600">{s.n}</p>
                  <p className="mt-2 text-xl font-semibold">{s.title}</p>
                  <p className="mt-2 text-base text-zinc-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200 py-8">
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-600">© {new Date().getFullYear()} joint-fintech</p>
              <div className="flex gap-3 text-sm">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </Container>
        </footer>
      </main>
    </div>
  );
}