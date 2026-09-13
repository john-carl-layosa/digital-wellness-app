"use client";

import React from "react";
import { Leaf, Cloud, Home as HomeIcon, Sun, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PAUSE_NEEDS, PauseNeed } from "../lib/data/options";

const ICONS: Record<string, LucideIcon> = {
  leaf: Leaf,
  cloud: Cloud,
  home: HomeIcon,
  sun: Sun,
  headphones: Headphones,
};

type Props = {
  selected?: PauseNeed | null;
  onSelect: (need: PauseNeed) => void;
  className?: string;
};

export function MoodPicker({ selected, onSelect, className = "" }: Props) {
  return (
    <div className={`grid grid-cols-3 gap-3 sm:grid-cols-5 ${className}`}>
      {PAUSE_NEEDS.map((item, i) => {
        const Icon = ICONS[item.icon];
        const active = selected === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-pressed={active}
            style={{ animationDelay: `${i * 50}ms` }}
            className={`press-scale group flex animate-scale-in flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25 ${
              active
                ? "border-plum bg-plum text-white shadow-elevated"
                : "border-line bg-surface text-ink hover:border-plum/50 hover:shadow-soft"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${
                active ? "bg-white/20" : "bg-plum-soft"
              }`}
            >
              <Icon size={20} className={active ? "text-white" : "text-plum"} />
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}