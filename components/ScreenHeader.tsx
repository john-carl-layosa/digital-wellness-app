"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
};

export function ScreenHeader({ title, subtitle, showBack, backHref = "/home" }: Props) {
  const router = useRouter();

  return (
    <div className="mb-6 animate-fade-in-up">
      {showBack && (
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="press-scale mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-plum-soft text-plum-deep hover:bg-plum-soft/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <h1 className="font-display text-[28px] font-semibold leading-tight text-ink">{title}</h1>
      {subtitle && <p className="mt-1 italic text-inkSoft">{subtitle}</p>}
    </div>
  );
}