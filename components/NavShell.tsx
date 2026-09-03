"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, RotateCcw, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/pause", label: "My Pause", icon: Heart },
  { href: "/reset", label: "My Reset", icon: RotateCcw },
];

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface px-5 py-8 md:flex">
        <div className="mb-10 px-2">
          <p className="font-display text-lg font-semibold leading-tight text-plum-deep">
            Rhythms of Relief
          </p>
          <p className="mt-1 text-xs text-inkSoft">Your space to pause.</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-plum text-white" : "text-ink hover:bg-plum-soft"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/qr-access"
          className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-inkSoft hover:bg-plum-soft hover:text-ink"
        >
          <QrCode size={18} />
          Access card
        </Link>
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-24 pt-6 md:px-10 md:pb-10 md:pt-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium"
            >
              <Icon size={20} className={active ? "text-plum" : "text-inkSoft"} />
              <span className={active ? "text-plum" : "text-inkSoft"}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}