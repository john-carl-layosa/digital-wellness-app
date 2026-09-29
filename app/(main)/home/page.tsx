"use client";

import React, {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  Leaf,
  QrCode,
  ArrowRight,
  Compass,
  Headphones,
  Play,
  PenLine,
  Sprout,
  Heart,
  Info,
  Plus,
} from "lucide-react";
import { useAppData } from "../../../lib/context/AppContext";
import {
  PauseNeed,
  PAUSE_NEED_TO_NEED,
} from "../../../lib/data/options";
import {
  getRotatingRecommendation,
  Recommendation,
} from "../../../lib/utils/recommend";
import { pickReminder } from "../../../lib/data/reminders";
import { MoodPicker } from "../../../components/MoodPicker";
import { PlaylistCard } from "../../../components/PlaylistCard";
import { Skeleton } from "../../../components/Skeleton";
import { Modal } from "../../../components/Modal";
import { ProfileAvatar } from "../../../components/ProfileAvatar";
import { getDisplayName } from "../../../lib/utils/profile";

const HOW_IT_WORKS = [
  {
    icon: Heart,
    text: "Choose how you feel or what you need.",
  },
  {
    icon: Headphones,
    text: "Get a recommended playlist on Spotify.",
  },
  {
    icon: Play,
    text: "Listen during your break or downtime.",
  },
  {
    icon: PenLine,
    text: "Reflect on your experience.",
  },
  {
    icon: Sprout,
    text: "Take your rhythm with you.",
  },
];

export default function HomePage() {
  const {
    defaultNeed,
    profile,
    playlists,
  } = useAppData();

  const [selectedMood, setSelectedMood] =
    useState<PauseNeed | null>(null);

  const [reminder, setReminder] =
    useState<string | null>(null);

  const [
    recommendation,
    setRecommendation,
  ] = useState<Recommendation | null>(null);

  const [
    recommendationReady,
    setRecommendationReady,
  ] = useState(false);

  const [infoOpen, setInfoOpen] =
    useState(false);

  const displayName =
    getDisplayName(profile);

  // Pick a reminder once per visit.
  // This runs only in the browser to avoid
  // a server/client random-value mismatch.
  useEffect(() => {
    setReminder(pickReminder());
  }, []);

  // Use the playlists added by the user.
  // The assigned mood/category determines
  // which playlist is recommended.
  useEffect(() => {
    const activeNeed = selectedMood
      ? PAUSE_NEED_TO_NEED[selectedMood]
      : defaultNeed ?? "Comfort";

    setRecommendation(null);
    setRecommendationReady(false);

    const timeout = setTimeout(() => {
      setRecommendation(
        getRotatingRecommendation(
          playlists,
          activeNeed
        )
      );

      setRecommendationReady(true);
    }, 280);

    return () => clearTimeout(timeout);
  }, [
    selectedMood,
    playlists,
    defaultNeed,
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 xl:col-span-2">
          <div className="flex animate-fade-in-up items-start justify-between">
            <div className="flex items-center gap-2">
              <div>
                <p className="font-display text-lg font-semibold text-plum-deep">
                  Rhythms of Relief
                </p>

                <p className="text-xs text-inkSoft">
                  Your space to pause.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setInfoOpen(true)
                }
                aria-label="About Rhythms of Relief"
                className="press-scale flex h-7 w-7 items-center justify-center rounded-full bg-plum-soft text-plum-deep hover:bg-plum-soft/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25 xl:hidden"
              >
                <Info size={14} />
              </button>
            </div>

            <Link
              href="/qr-access"
              aria-label="Access card"
              className="press-scale flex h-10 w-10 items-center justify-center rounded-full text-plum-deep hover:bg-plum-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
            >
              <QrCode size={22} />
            </Link>
          </div>

          {/* Personalized hero */}
          <div className="hero-surface relative animate-fade-in-up stagger-1 overflow-hidden rounded-3xl border border-line p-6 shadow-soft md:p-8">
            <Leaf className="pointer-events-none absolute right-6 top-6 h-16 w-16 text-sage/25" />

            <div className="relative flex items-center gap-4 pr-14">
              <Link
                href="/profile"
                aria-label="Open profile settings"
                className="press-scale shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
              >
                <ProfileAvatar
                  fullName={
                    profile.fullName
                  }
                  preferredName={
                    profile.preferredName
                  }
                  avatar={profile.avatar}
                  avatarImage={
                    profile.avatarImage
                  }
                  size="lg"
                />
              </Link>

              <div className="min-w-0">
                <h1 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl md:text-4xl">
                  Good to see you
                  {displayName
                    ? `, ${displayName}`
                    : ""}
                  .
                </h1>

                <h2 className="mt-1 font-display text-base italic text-inkSoft sm:text-lg md:text-xl">
                  What do you need today?
                </h2>
              </div>
            </div>

            <MoodPicker
              selected={selectedMood}
              onSelect={(need) =>
                setSelectedMood(
                  (previous) =>
                    previous === need
                      ? null
                      : need
                )
              }
              className="mt-6 max-w-xl"
            />
          </div>

          {/* Recommendation and reminder */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="animate-fade-in-up stagger-2">
              <h2 className="font-display text-lg font-semibold text-ink">
                Recommended for You
              </h2>

              {recommendation ? (
                <>
                  <p className="mt-1 font-display text-xl font-semibold text-plum-deep">
                    {recommendation.title}
                  </p>

                  <p className="mb-3 mt-0.5 italic text-inkSoft">
                    {recommendation.blurb}
                  </p>

                  <PlaylistCard
                    playlist={
                      recommendation.playlist
                    }
                  />
                </>
              ) : !recommendationReady ? (
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />

                  <div className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                    <Skeleton className="h-16 w-16 shrink-0" />

                    <div className="flex-1 space-y-2 py-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="mt-2 h-8 w-36 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border border-dashed border-plum/35 bg-surface p-5 text-center">
                  <Headphones
                    size={22}
                    className="mx-auto text-plum"
                  />

                  <p className="mt-2 font-display text-lg font-semibold text-ink">
                    Add your first playlist
                  </p>

                  <p className="mt-1 text-sm text-inkSoft">
                    Your personal
                    recommendations will
                    appear here.
                  </p>

                  <Link
                    href="/my-rhythm"
                    className="press-scale mt-4 inline-flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white hover:bg-plum-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
                  >
                    <Plus size={14} />
                    Build My Collection
                  </Link>
                </div>
              )}
            </div>

            <div className="animate-fade-in-up stagger-3">
              <h2 className="font-display text-lg font-semibold text-ink">
                Today&apos;s Reminder
              </h2>

              <div className="mt-3 flex h-[calc(100%-2rem)] min-h-[9rem] flex-col justify-center gap-3 rounded-2xl border border-line bg-surface p-5 shadow-soft">
                {reminder ? (
                  <p
                    key={reminder}
                    className="animate-fade-in italic leading-relaxed text-plum-deep"
                  >
                    &quot;{reminder}&quot;
                  </p>
                ) : (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                )}

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/20">
                  <Sprout
                    size={16}
                    className="text-sage"
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Explore collection */}
          <div className="animate-fade-in-up stagger-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Explore Your Collection
            </h2>

            <p className="mb-3 mt-1 text-inkSoft">
              Find the right playlist from
              your personal music space.
            </p>

            <Link
              href="/explore"
              className="press-scale group flex w-full items-center justify-center gap-2 rounded-full bg-plum px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-plum-deep hover:shadow-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25 md:w-auto"
            >
              Explore playlists

              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Desktop information column */}
        <aside className="hidden animate-fade-in-up stagger-2 space-y-6 xl:block">
          <div className="rounded-3xl border border-line bg-plum-soft p-6">
            <div className="mb-3 flex items-center gap-2">
              <Sprout
                size={18}
                className="text-plum-deep"
              />

              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-plum-deeper">
                Rhythms of Relief
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-plum-deep">
              A digital wellness space for
              nurses to pause, listen,
              reflect, and reset through the
              power of music.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Compass
                size={16}
                className="text-plum"
              />

              <h3 className="text-sm font-semibold uppercase tracking-wide text-inkSoft">
                How it works
              </h3>
            </div>

            <ol className="space-y-4">
              {HOW_IT_WORKS.map(
                (step, index) => {
                  const Icon = step.icon;

                  return (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum-soft text-xs font-bold text-plum-deep">
                        {index + 1}
                      </span>

                      <div className="flex items-start gap-2">
                        <Icon
                          size={16}
                          className="mt-0.5 shrink-0 text-plum"
                        />

                        <p className="text-sm text-ink">
                          {step.text}
                        </p>
                      </div>
                    </li>
                  );
                }
              )}
            </ol>
          </div>
        </aside>
      </div>

      {/* Mobile information modal */}
      <Modal
        open={infoOpen}
        onClose={() =>
          setInfoOpen(false)
        }
        title="Rhythms of Relief"
        widthClassName="max-w-md"
      >
        <div className="mb-5 flex items-center gap-2">
          <Sprout
            size={18}
            className="text-plum-deep"
          />

          <p className="text-sm leading-relaxed text-ink">
            A digital wellness space for
            nurses to pause, listen, reflect,
            and reset through the power of
            music.
          </p>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Compass
            size={16}
            className="text-plum"
          />

          <h3 className="text-sm font-semibold uppercase tracking-wide text-inkSoft">
            How it works
          </h3>
        </div>

        <ol className="space-y-4">
          {HOW_IT_WORKS.map(
            (step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum-soft text-xs font-bold text-plum-deep">
                    {index + 1}
                  </span>

                  <div className="flex items-start gap-2">
                    <Icon
                      size={16}
                      className="mt-0.5 shrink-0 text-plum"
                    />

                    <p className="text-sm text-ink">
                      {step.text}
                    </p>
                  </div>
                </li>
              );
            }
          )}
        </ol>
      </Modal>
    </div>
  );
}