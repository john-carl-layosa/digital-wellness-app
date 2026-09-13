"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Genre, Need } from "../../../lib/data/options";
import { getRecommendation } from "../../../lib/utils/recommend";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { PlaylistCard } from "../../../components/PlaylistCard";
import { useAppData } from "../../../lib/context/AppContext";

function ResultStepInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOnboarding } = useAppData();
  const [starting, setStarting] = useState(false);

  const genres: Genre[] = (() => {
    try {
      return JSON.parse(searchParams.get("genres") ?? "[]");
    } catch {
      return [];
    }
  })();
  const need = (searchParams.get("need") as Need) || "Calm";

  const recommendation = getRecommendation(genres, need);

  const finish = () => {
    setStarting(true);
    setTimeout(() => {
      completeOnboarding(genres, need);
      router.replace("/home");
    }, 350);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-6 py-10 text-center">
        <div className="mb-6 flex w-full items-center gap-1.5" aria-hidden="true">
          <div className="h-1.5 flex-1 rounded-full bg-plum" />
          <div className="h-1.5 flex-1 rounded-full bg-plum" />
          <div className="h-1.5 flex-1 rounded-full bg-plum" />
        </div>

        <p className="animate-fade-in-up text-sm font-semibold text-plum">Step 3 of 3</p>

        <div className="mb-3 mt-6 flex h-14 w-14 animate-pop-in items-center justify-center rounded-full bg-plum-soft shadow-soft">
          <Sparkles size={26} className="text-plum" />
        </div>

        <h2 className="animate-fade-in-up stagger-1 text-lg font-semibold text-inkSoft">
          Your Rhythm Today
        </h2>
        <p className="mt-1 animate-fade-in-up stagger-2 font-display text-3xl font-semibold text-ink">
          {recommendation.title}
        </p>
        <p className="mb-8 mt-2 animate-fade-in-up stagger-2 italic text-inkSoft">
          {recommendation.blurb}
        </p>

        <div className="w-full animate-fade-in-up stagger-3 text-left">
          <PlaylistCard playlist={recommendation.playlist} />
        </div>
      </div>

      <div className="glass-surface sticky bottom-0 border-t border-line px-6 py-5">
        <div className="mx-auto w-full max-w-lg">
          <PrimaryButton onClick={finish} loading={starting} className="w-full">
            Start My Journey
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default function ResultStep() {
  return (
    <Suspense fallback={null}>
      <ResultStepInner />
    </Suspense>
  );
}