"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, Clock3, FileText, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/content", label: "Feed", icon: Newspaper },
  { href: "/pending-posts", label: "Pending", icon: Clock3 },
  { href: "/posts", label: "Posts", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-900/80 lg:hidden">
      <div className="flex items-center justify-around h-16 sm:h-14 safe-bottom">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/" || pathname === "/dashboard"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 sm:py-1.5 px-2 sm:px-3 min-h-14 ${
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <Icon size={24} className="sm:size-[20px]" />
              <span className="text-[9px] sm:text-[10px] font-medium text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
