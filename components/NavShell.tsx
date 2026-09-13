"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Compass, Heart, RotateCcw, Map, Music2, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/my-rhythm", label: "My Rhythm", icon: Sparkles },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/pause", label: "My Pause", icon: Heart },
  { href: "/reset", label: "My Reset", icon: RotateCcw },
  { href: "/journey", label: "My Journey", icon: Map },
];

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Music2 size={18} className="text-plum-soft" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold uppercase leading-tight tracking-wide text-white">
          Rhythms of Relief
        </p>
        <p className="mt-0.5 text-xs text-white/50">Your space to pause.</p>
      </div>
    </div>
  );
}

function DesktopNavList() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`press-scale group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-plum-soft text-plum-deeper shadow-soft"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon
              size={18}
              className={`transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside tap and on Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Close whenever the route changes (i.e. right after a nav item is picked).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="fixed inset-x-0 top-0 z-30 md:hidden">
      <div className="glass-surface flex items-center justify-between border-b border-line px-4 py-3">
        <Link
          href="/home"
          className="press-scale flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
          aria-label="Go to Home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plum-deeper">
            <Music2 size={15} className="text-plum-soft" />
          </span>
          <p className="font-display text-sm font-semibold text-plum-deep">Rhythms of Relief</p>
        </Link>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          className="press-scale flex h-10 w-10 items-center justify-center rounded-full text-plum-deep hover:bg-plum-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Menu
              size={20}
              className={`absolute transition-all duration-200 ${
                menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              }`}
            />
            <X
              size={20}
              className={`absolute transition-all duration-200 ${
                menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-4 top-[calc(100%+8px)] w-64 origin-top-right animate-scale-in overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-elevated"
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className={`press-scale flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-plum-soft text-plum-deeper"
                    : "text-ink hover:bg-plum-soft/50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    active ? "bg-plum text-white" : "bg-plum-soft text-plum"
                  }`}
                >
                  <Icon size={16} />
                </span>
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-plum" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar — unchanged, always visible on md+ */}
      <aside className="sidebar-surface hidden w-64 shrink-0 md:block lg:w-72">
        <div className="sticky top-0 flex h-screen flex-col px-4 py-7">
          <div className="mb-9">
            <Brand />
          </div>
          <DesktopNavList />
          <p className="mt-6 px-2 text-xs italic leading-relaxed text-white/45">
            You can&apos;t pour from an empty cup.
            <br />
            Take a pause. You matter.
          </p>
        </div>
      </aside>

      {/* Mobile header + dropdown menu (replaces the old bottom tab bar) */}
      <MobileHeader />

      {/* Main content */}
      <main
        key={pathname}
        className="mx-auto w-full flex-1 animate-fade-in-up px-5 pb-10 pt-20 md:px-8 md:pb-10 md:pt-8 lg:px-10"
      >
        {children}
      </main>
    </div>
  );
}