"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 group">
              {/* LOGO INTEGRATION */}
              <div className="relative h-9 w-9 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                <Image 
                  src="/assets/logo.ico" 
                  alt="Spewpay Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">SPEWPAY</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Features</Link>
              <Link href="/#how" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">How it works</Link>
              <Link href="/login" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Sign in</Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/signup" className="hidden sm:inline-flex rounded-full px-5 py-2 text-sm font-bold glass-button text-foreground">Get started</Link>
              <button className="md:hidden p-2 text-foreground/70" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <nav className="md:hidden flex flex-col gap-4 pb-6 pt-2 border-t border-border bg-background animate-in slide-in-from-top-4 duration-200">
              <Link href="/#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Features</Link>
              <Link href="/#how" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">How it works</Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Sign in</Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold glass-button text-foreground">Get started</Link>
            </nav>
          )}
        </Container>
      </header>
  );
}
