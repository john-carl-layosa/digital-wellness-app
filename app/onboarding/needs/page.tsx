"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NEEDS, Need, Genre } from "../../../lib/data/options";
import { ChoiceCard } from "../../../components/ChoiceCard";
import { PrimaryButton } from "../../../components/PrimaryButton";

function NeedsStepInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genres: Genre[] = (() => {
    try {
      return JSON.parse(searchParams.get("genres") ?? "[]");
    } catch {
      return [];
    }
  })();

  const [selected, setSelected] = useState<Need | null>(null);

  const continueNext = () => {
    const params = new URLSearchParams({
      genres: JSON.stringify(genres),
      need: selected ?? "",
    });
    router.push(`/onboarding/result?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="mx-auto w-full max-w-lg flex-1 px-6 py-10">
        <p className="text-sm font-semibold text-plum">Step 2 of 3</p>
        <h1 className="mt-2 font-display text-[28px] font-semibold text-ink">
          What are you looking for today?
        </h1>

        <div className="mt-8 flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <ChoiceCard key={n} label={n} selected={selected === n} onClick={() => setSelected(n)} />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-canvasAlt px-6 py-5">
        <div className="mx-auto w-full max-w-lg">
          <PrimaryButton onClick={continueNext} disabled={!selected} className="w-full">
            Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default function NeedsStep() {
  return (
    <Suspense fallback={null}>
      <NeedsStepInner />
    </Suspense>
  );
}