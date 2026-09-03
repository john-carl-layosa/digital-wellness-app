"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Cloud, Home as HomeIcon, Sun, Headphones, ArrowRight, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppData } from "../../../lib/context/AppContext";
import { PAUSE_NEEDS, PAUSE_NEED_TO_NEED, PauseNeed } from "../../../lib/data/options";
import { getRecommendation } from "../../../lib/utils/recommend";
import { PlaylistCard } from "../../../components/PlaylistCard";

const ICONS: Record<string, LucideIcon> = {
  leaf: Leaf,
  cloud: Cloud,
  home: HomeIcon,
  sun: Sun,
  headphones: Headphones,
};

export default function HomePage() {
  const router = useRouter();
  const { favoriteGenres, defaultNeed } = useAppData();

  const need = defaultNeed ?? "Comfort";
  const recommendation = getRecommendation(favoriteGenres.length ? favoriteGenres : ["OPM"], need);

  const choosePauseNeed = (pauseNeed: PauseNeed) => {
    router.push(`/recommendation?need=${encodeURIComponent(PAUSE_NEED_TO_NEED[pauseNeed])}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-plum-deep">Rhythms of Relief</p>
          <p className="text-xs text-inkSoft">Your space to pause.</p>
        </div>
        <Link href="/qr-access" aria-label="Access card" className="text-plum-deep hover:opacity-70">
          <QrCode size={22} />
        </Link>
      </div>

      <div className="rounded-3xl border border-line bg-gradient-to-br from-plum-soft to-canvasAlt p-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Good to see you.</h1>
        <h2 className="mt-1 text-lg text-inkSoft">What do you need today?</h2>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {PAUSE_NEEDS.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => choosePauseNeed(item.key)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-2 py-4 text-center hover:border-plum/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-plum-soft">
                  <Icon size={20} className="text-plum" />
                </span>
                <span className="text-xs font-medium text-ink">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Recommended for You</h2>
        <p className="mt-1 font-display text-xl font-semibold text-plum-deep">
          {recommendation.title}
        </p>
        <p className="mb-3 mt-0.5 italic text-inkSoft">{recommendation.blurb}</p>
        <PlaylistCard playlist={recommendation.playlist} />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Explore a New Rhythm</h2>
        <p className="mb-3 mt-1 text-inkSoft">Want to step outside your usual playlist?</p>
        <Link
          href="/explore"
          className="flex items-center justify-center gap-2 rounded-full bg-plum px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Explore genres
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-plum-soft p-4">
        <Leaf size={18} className="shrink-0 text-plum-deep" />
        <p className="text-sm text-plum-deep">
          You can&apos;t pour from an empty cup. Take a pause. You matter.
        </p>
      </div>
    </div>
  );
}