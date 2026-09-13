"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "md" | "lg";
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
  size = "md",
  icon,
  disabled,
  loading,
  className = "",
}: Props) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold press-scale " +
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const sizes: Record<string, string> = {
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-3.5 text-base",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-plum text-white shadow-soft hover:bg-plum-deep hover:shadow-elevated active:shadow-soft",
    secondary: "bg-plum-soft text-plum-deep hover:bg-plum-soft/70",
    outline: "bg-transparent text-plum border-[1.5px] border-plum hover:bg-plum-soft/40",
    ghost: "bg-transparent text-plum-deep hover:bg-plum-soft/50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span className={loading ? "opacity-90" : ""}>{children}</span>
    </button>
  );
}