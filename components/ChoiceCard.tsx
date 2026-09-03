"use client";

import React from "react";
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
      className={`text-left rounded-2xl border-[1.5px] transition-colors ${
        compact ? "px-4 py-2.5" : "p-4 min-w-[110px]"
      } ${
        selected
          ? "bg-plum border-plum text-white"
          : "bg-surface border-line text-ink hover:border-plum/50"
      }`}
    >
      {Icon && !compact && (
        <span
          className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${
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