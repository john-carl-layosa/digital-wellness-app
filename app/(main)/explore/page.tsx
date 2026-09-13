"use client";

import React, { useEffect, useState } from "react";
import {
  Music2,
  Sparkles,
  Waves,
  Zap,
  Wind,
  Piano,
  Star,
  Headphones,
  Dices,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GENRES, Genre } from "../../../lib/data/options";
import { Playlist, PLAYLISTS } from "../../../lib/data/playlists";
import { shufflePlaylists } from "../../../lib/utils/recommend";
import { PlaylistCard } from "../../../components/PlaylistCard";
import { PlaylistCardSkeleton } from "../../../components/Skeleton";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { Modal } from "../../../components/Modal";

const GENRE_TAGLINES: Partial<Record<Genre, string>> = {
  OPM: "Something familiar.",
  "R&B": "Slow things down.",
  Classical: "Try something different.",
  Rock: "Release some energy.",
  Jazz: "Take a quieter route.",
  "K-Pop": "Explore something new.",
  Instrumental: "Let the music speak.",
  Pop: "Feel-good and easy.",
};

const GENRE_ICONS: Partial<Record<Genre, LucideIcon>> = {
  OPM: Music2,
  Pop: Sparkles,
  "R&B": Waves,
  Rock: Zap,
  Jazz: Wind,
  Classical: Piano,
  "K-Pop": Star,
  Instrumental: Headphones,
};

const EXPLORABLE_GENRES = GENRES.filter((g) => GENRE_TAGLINES[g]);

export default function ExplorePage() {
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [displayPlaylists, setDisplayPlaylists] = useState<Playlist[]>([]);

  // Opening the popup (even for the same genre twice) re-shuffles the
  // results, so exploring never feels like a fixed, always-identical list.
  const openGenre = (g: Genre) => {
    setActiveGenre(g);
    setModalOpen(true);
    setIsFiltering(true);
  };

  useEffect(() => {
    if (!isFiltering || !activeGenre) return;
    const t = setTimeout(() => {
      const matches = PLAYLISTS.filter((p) => p.genre === activeGenre);
      setDisplayPlaylists(shufflePlaylists(matches));
      setIsFiltering(false);
    }, 350);
    return () => clearTimeout(t);
  }, [isFiltering, activeGenre]);

  const surpriseMe = () => {
    const pick = EXPLORABLE_GENRES[Math.floor(Math.random() * EXPLORABLE_GENRES.length)];
    openGenre(pick);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <ScreenHeader title="Explore a New Rhythm" subtitle="Step outside your usual playlist. Discover something new." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EXPLORABLE_GENRES.map((g, i) => {
          const Icon = GENRE_ICONS[g] ?? Music2;
          return (
            <div
              key={g}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-fade-in-up rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-plum/30"
            >
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-plum-soft text-plum">
                <Icon size={17} />
              </span>
              <div className="font-display text-base font-semibold text-ink">{g}</div>
              <div className="mt-1 text-xs text-inkSoft">{GENRE_TAGLINES[g]}</div>
              <button
                type="button"
                onClick={() => openGenre(g)}
                className="press-scale mt-3 w-full rounded-full bg-plum-soft px-3 py-1.5 text-xs font-semibold text-plum-deep hover:bg-plum-soft/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
              >
                Explore
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-line bg-canvasAlt p-4 sm:flex-row">
        <p className="text-sm text-inkSoft">Not sure what to try? Let us surprise you with a random pick.</p>
        <PrimaryButton onClick={surpriseMe} icon={<Dices size={16} />} className="w-full sm:w-auto">
          Surprise Me
        </PrimaryButton>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeGenre ?? ""}
        widthClassName="max-w-2xl"
      >
        {activeGenre && (
          <>
            <p className="mb-4 text-sm italic text-inkSoft">{GENRE_TAGLINES[activeGenre]}</p>

            {isFiltering ? (
              <div className="space-y-4">
                <PlaylistCardSkeleton />
                <PlaylistCardSkeleton />
              </div>
            ) : displayPlaylists.length === 0 ? (
              <p className="py-6 text-center text-sm text-inkSoft">
                No curated playlist for {activeGenre} yet — check back soon.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {displayPlaylists.map((p) => (
                  <PlaylistCard key={p.id} playlist={p} fillHeight />
                ))}
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}