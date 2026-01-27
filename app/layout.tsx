import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { BalanceVisibilityProvider } from "@/components/providers/balance-visibility-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spewpay | Allocate money with clarity",
  description: "The financial operating system for modern individuals and organizations.",
  manifest: "/manifest.json",
  // FAVICON INTEGRATION
  icons: {
    icon: "/assets/logo.ico",
    shortcut: "/assets/logo.ico",
    apple: "/assets/logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <BalanceVisibilityProvider>
            {children}
          </BalanceVisibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}