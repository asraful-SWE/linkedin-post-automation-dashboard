"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Clock3,
  Settings,
  X,
  Menu,
  Linkedin,
  Circle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getPosts } from "@/lib/api";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pending-posts", label: "Pending", icon: Clock3 },
  { href: "/posts", label: "All Posts", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getPosts("pending")
      .then((posts) => setPendingCount(posts.length))
      .catch(() => {});
  }, [pathname]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-50 rounded-xl border border-zinc-200 bg-white p-2 shadow-md dark:border-zinc-800 dark:bg-zinc-900 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Linkedin size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Auto Poster
              </p>
              <p className="text-[10px] text-zinc-400">AI-powered</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/" || pathname === "/dashboard"
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={active ? "text-blue-600 dark:text-blue-400" : ""}
                  />
                  {label}
                </span>
                {label === "Pending" && pendingCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <Circle size={8} className="fill-emerald-500 text-emerald-500" />
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              System Online
            </p>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
            LinkedIn AI Poster v2.0
          </p>
        </div>
      </aside>
    </>
  );
}
