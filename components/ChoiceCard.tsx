"use client";

import React from "react";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  subLabel?: string;
  icon?: LucideIcon;
  selected?: boolean;
  onClick: () => void;
  compact?: boolean;
};

export function ChoiceCard({ label, subLabel, icon: Icon, selected, onClick, compact }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      className={`press-scale relative text-left rounded-2xl border-[1.5px] ${
        compact ? "px-4 py-2.5" : "p-4 min-w-[110px]"
      } ${
        selected
          ? "border-plum bg-plum text-white shadow-elevated"
          : "border-line bg-surface text-ink hover:border-plum/50 hover:shadow-soft"
      } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25`}
    >
      {selected && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 animate-pop-in items-center justify-center rounded-full bg-white text-plum shadow-soft">
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      {Icon && !compact && (
        <span
          className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            selected ? "bg-white/20" : "bg-plum-soft"
          }`}
        >
          <Icon size={18} className={selected ? "text-white" : "text-plum"} />
        </span>
      )}
      <div className={`font-semibold ${compact ? "text-sm" : "text-[15px]"}`}>{label}</div>
      {subLabel && (
        <div className={`mt-0.5 text-xs ${selected ? "text-white/80" : "text-inkSoft"}`}>
          {subLabel}
        </div>
      )}
    </button>
  );
}