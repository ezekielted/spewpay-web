import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function SimpleHeader() {
  return (
    <header className="p-6 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
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
            <span className="text-lg font-bold tracking-tight text-foreground uppercase">
              SPEWPAY
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
  );
}
