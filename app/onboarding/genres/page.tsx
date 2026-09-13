"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GENRES, Genre } from "../../../lib/data/options";
import { ChoiceCard } from "../../../components/ChoiceCard";
import { PrimaryButton } from "../../../components/PrimaryButton";

export default function GenresStep() {
  const router = useRouter();
  const [selected, setSelected] = useState<Genre[]>([]);

  const toggle = (g: Genre) => {
    setSelected((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const continueNext = () => {
    const params = new URLSearchParams({ genres: JSON.stringify(selected) });
    router.push(`/onboarding/needs?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="mx-auto w-full max-w-lg flex-1 px-6 py-10">
        <div className="mb-6 flex items-center gap-1.5" aria-hidden="true">
          <div className="h-1.5 flex-1 rounded-full bg-plum" />
          <div className="h-1.5 flex-1 rounded-full bg-line" />
          <div className="h-1.5 flex-1 rounded-full bg-line" />
        </div>

        <p className="animate-fade-in-up text-sm font-semibold text-plum">Step 1 of 3</p>
        <h1 className="mt-2 animate-fade-in-up stagger-1 font-display text-[28px] font-semibold text-ink">
          Tell us your rhythm.
        </h1>
        <p className="mt-1 animate-fade-in-up stagger-1 text-inkSoft">What music do you usually enjoy?</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {GENRES.map((g, i) => (
            <div key={g} style={{ animationDelay: `${i * 35 + 100}ms` }} className="animate-scale-in">
              <ChoiceCard label={g} compact selected={selected.includes(g)} onClick={() => toggle(g)} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-surface sticky bottom-0 border-t border-line px-6 py-5">
        <div className="mx-auto w-full max-w-lg">
          <PrimaryButton
            onClick={continueNext}
            disabled={selected.length === 0}
            className="w-full"
          >
            Continue{selected.length > 0 ? ` (${selected.length} selected)` : ""}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}