"use client";

import React, { useState } from "react";
import { GENRES, Genre } from "../../../lib/data/options";
import { PLAYLISTS } from "../../../lib/data/playlists";
import { PlaylistCard } from "../../../components/PlaylistCard";
import { ScreenHeader } from "../../../components/ScreenHeader";

const GENRE_TAGLINES: Partial<Record<Genre, string>> = {
  OPM: "Something familiar.",
  "R&B": "Slow things down.",
  Classical: "Try something different.",
  Rock: "Release some energy.",
  Jazz: "Take a quieter route.",
  "K-Pop": "Explore something new.",
  Instrumental: "Let the music speak.",
  Pop: "Something easy to enjoy.",
};

const EXPLORABLE_GENRES = GENRES.filter((g) => GENRE_TAGLINES[g]);

export default function ExplorePage() {
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);
  const playlists = activeGenre ? PLAYLISTS.filter((p) => p.genre === activeGenre) : [];

  return (
    <div>
      <ScreenHeader title="Explore a New Rhythm" subtitle="Want to step outside your usual playlist?" />

      <div className="grid grid-cols-2 gap-3">
        {EXPLORABLE_GENRES.map((g) => {
          const active = activeGenre === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => setActiveGenre(g)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                active ? "border-plum bg-plum text-white" : "border-line bg-surface text-ink hover:border-plum/50"
              }`}
            >
              <div className="font-display text-lg font-semibold">{g}</div>
              <div className={`mt-1 text-xs ${active ? "text-white/80" : "text-inkSoft"}`}>
                {GENRE_TAGLINES[g]}
              </div>
            </button>
          );
        })}
      </div>

      {activeGenre && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">
            {playlists.length ? `${activeGenre} playlists` : "Coming soon"}
          </h2>
          {playlists.length === 0 && (
            <p className="mb-3 text-sm text-inkSoft">
              No curated playlist for {activeGenre} yet — check back soon.
            </p>
          )}
          <div className="space-y-4">
            {playlists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}