"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAppData } from "../../../lib/context/AppContext";
import {
  GENRES,
  NEEDS,
  Genre,
  Need,
  PauseNeed,
  PAUSE_NEEDS,
  PAUSE_NEED_TO_NEED,
} from "../../../lib/data/options";
import { getRecommendationsForNeed } from "../../../lib/utils/recommend";
import { MoodPicker } from "../../../components/MoodPicker";
import { PlaylistCard } from "../../../components/PlaylistCard";
import { PlaylistCardSkeleton } from "../../../components/Skeleton";
import { ChoiceCard } from "../../../components/ChoiceCard";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScreenHeader } from "../../../components/ScreenHeader";

function findPauseNeedForNeed(need: Need | null): PauseNeed | null {
  if (!need) return null;
  const match = PAUSE_NEEDS.find((p) => PAUSE_NEED_TO_NEED[p.key] === need);
  return match?.key ?? null;
}

export default function MyRhythmPage() {
  const { favoriteGenres, defaultNeed, updatePreferences } = useAppData();

  const [selectedMood, setSelectedMood] = useState<PauseNeed | null>(
    () => findPauseNeedForNeed(defaultNeed) ?? "To feel comforted"
  );
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [draftGenres, setDraftGenres] = useState<Genre[]>(favoriteGenres);
  const [draftNeed, setDraftNeed] = useState<Need | null>(defaultNeed);

  const activeNeed = selectedMood ? PAUSE_NEED_TO_NEED[selectedMood] : defaultNeed ?? "Comfort";
  const activeMoodLabel = PAUSE_NEEDS.find((p) => p.key === selectedMood)?.label ?? "Comfort";

  const playlists = useMemo(
    () => getRecommendationsForNeed(favoriteGenres.length ? favoriteGenres : ["OPM"], activeNeed, 3),
    [favoriteGenres, activeNeed]
  );

  // Brief loading state whenever the active mood changes.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [activeNeed]);

  const startEditing = () => {
    setDraftGenres(favoriteGenres);
    setDraftNeed(defaultNeed);
    setEditing(true);
  };

  const toggleDraftGenre = (g: Genre) => {
    setDraftGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const savePreferences = () => {
    updatePreferences(draftGenres, draftNeed ?? "Comfort");
    setEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <ScreenHeader title="My Rhythm" subtitle="Choose what you need right now." />

      <MoodPicker selected={selectedMood} onSelect={setSelectedMood} />

      <div className="mt-8 animate-fade-in-up">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          Based on your choice: <span className="text-plum-deep">{activeMoodLabel}</span>
        </h2>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <PlaylistCardSkeleton />
            <PlaylistCardSkeleton />
            <PlaylistCardSkeleton />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {playlists.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in-up">
                <PlaylistCard playlist={p} fillHeight />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 animate-fade-in-up rounded-2xl border border-line bg-surface p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Your Listening Preferences</h2>
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="press-scale flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-plum hover:bg-plum-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-inkSoft">
                Favorite genres
              </p>
              <div className="flex flex-wrap gap-2">
                {favoriteGenres.length ? (
                  favoriteGenres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-plum-soft px-3 py-1.5 text-xs font-medium text-plum-deep"
                    >
                      {g}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-inkSoft">No genres saved yet.</p>
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-inkSoft">
                What you usually look for
              </p>
              <span className="rounded-full bg-plum-soft px-3 py-1.5 text-xs font-medium text-plum-deep">
                {defaultNeed ?? "Not set yet"}
              </span>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-inkSoft">
                Favorite genres
              </p>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <ChoiceCard
                    key={g}
                    label={g}
                    compact
                    selected={draftGenres.includes(g)}
                    onClick={() => toggleDraftGenre(g)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-inkSoft">
                What you usually look for
              </p>
              <div className="flex flex-wrap gap-2">
                {NEEDS.map((n) => (
                  <ChoiceCard
                    key={n}
                    label={n}
                    compact
                    selected={draftNeed === n}
                    onClick={() => setDraftNeed(n)}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <PrimaryButton onClick={savePreferences} icon={<Check size={16} />}>
                Save Preferences
              </PrimaryButton>
              <PrimaryButton variant="outline" onClick={() => setEditing(false)} icon={<X size={16} />}>
                Cancel
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}