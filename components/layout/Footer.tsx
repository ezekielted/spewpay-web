import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-20 pb-10">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-20">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 group">
                {/* FOOTER LOGO INTEGRATION */}
                <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                  <Image 
                    src="/assets/logo.ico" 
                    alt="Spewpay Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">SPEWPAY</span>
              </Link>
              <p className="text-sm font-bold leading-relaxed text-foreground/70">Building the next generation of collaborative financial tools. Designed for speed.</p>
              <div className="flex gap-4">
                {[<Twitter key="t" className="h-4 w-4" />, <Github key="g" className="h-4 w-4" />, <Linkedin key="l" className="h-4 w-4" />].map((icon, idx) => (
                  <Link key={idx} href="#" className="p-2.5 rounded-full bg-card text-foreground hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-border">{icon}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-foreground">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Shared Wallets</Link></li>
                <li><Link href="#" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Org Controls</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-foreground">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-foreground">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-foreground/70 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6 pt-10 border-t border-border sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-black text-foreground/50">© {new Date().getFullYear()} SPEWPAY Inc. Licensed Institution.</p>
          </div>
        </Container>
      </footer>
  );
}
