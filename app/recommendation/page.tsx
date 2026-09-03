"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { Need } from "../../lib/data/options";
import { getRecommendation } from "../../lib/utils/recommend";
import { PlaylistCard } from "../../components/PlaylistCard";
import { useAppData } from "../../lib/context/AppContext";

function Pill({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
        active ? "bg-plum text-white" : "bg-plum-soft text-inkSoft"
      }`}
    >
      {label}
    </span>
  );
}

function RecommendationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { favoriteGenres } = useAppData();
  const need = (searchParams.get("need") as Need) || "Calm";

  const recommendation = getRecommendation(favoriteGenres.length ? favoriteGenres : ["OPM"], need);

  return (
    <div className="flex min-h-screen items-center justify-center bg-plum-deeper/40 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-canvas p-6 shadow-card">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/home")}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-plum-soft text-plum-deep hover:opacity-80"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-2">
            <Pill label="Listen" active />
            <ArrowRight size={14} className="text-inkSoft" />
            <Pill label="Reflect" />
            <ArrowRight size={14} className="text-inkSoft" />
            <Pill label="Reset" />
          </div>

          <h2 className="text-lg font-semibold text-inkSoft">Your Rhythm for Today</h2>
          <p className="mt-1 font-display text-3xl font-semibold text-ink">{recommendation.title}</p>
          <p className="mb-6 mt-2 italic text-inkSoft">{recommendation.blurb}</p>

          <div className="w-full text-left">
            <PlaylistCard playlist={recommendation.playlist} />
          </div>

          <button
            type="button"
            onClick={() => router.push("/pause")}
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-plum hover:opacity-80"
          >
            When you&apos;re ready, reflect in My Pause
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationPage() {
  return (
    <Suspense fallback={null}>
      <RecommendationInner />
    </Suspense>
  );
}