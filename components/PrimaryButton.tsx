"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  icon,
  disabled,
  loading,
  className = "",
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    primary: "bg-plum text-white hover:opacity-90",
    secondary: "bg-plum-soft text-plum-deep hover:opacity-90",
    outline: "bg-transparent text-plum border-[1.5px] border-plum hover:bg-plum-soft/40",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
}