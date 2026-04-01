import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "LinkedIn Dashboard", template: "%s | LinkedIn Dashboard" },
  description: "AI-powered LinkedIn automation dashboard",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        <main className="min-h-screen bg-zinc-50 pb-20 sm:pb-24 pt-16 sm:pt-20 dark:bg-zinc-950 lg:pb-0 lg:pl-64 lg:pt-0">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
