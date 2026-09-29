"use client";

import React, {
  useMemo,
  useState,
} from "react";
import {
  Check,
  Pencil,
  Plus,
  X,
} from "lucide-react";
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
import type { Playlist } from "../../../lib/data/playlists";
import { getRecommendationsForNeed } from "../../../lib/utils/recommend";
import { MoodPicker } from "../../../components/MoodPicker";
import { PlaylistCard } from "../../../components/PlaylistCard";
import { PlaylistEmptyState } from "../../../components/PlaylistEmptyState";
import { PlaylistEditorModal } from "../../../components/PlaylistEditorModal";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { ChoiceCard } from "../../../components/ChoiceCard";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ScreenHeader } from "../../../components/ScreenHeader";

function findPauseNeedForNeed(
  need: Need | null
): PauseNeed | null {
  if (!need) {
    return null;
  }

  return (
    PAUSE_NEEDS.find(
      (item) =>
        PAUSE_NEED_TO_NEED[item.key] === need
    )?.key ?? null
  );
}

export default function MyRhythmPage() {
  const {
    favoriteGenres,
    defaultNeed,
    updatePreferences,
    playlists,
    addPlaylist,
    updatePlaylist,
    deletePlaylist,
    movePlaylist,
  } = useAppData();

  const [selectedMood, setSelectedMood] =
    useState<PauseNeed | null>(
      () =>
        findPauseNeedForNeed(defaultNeed) ??
        "To feel comforted"
    );

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [
    editingPlaylist,
    setEditingPlaylist,
  ] = useState<Playlist | null>(null);

  const [
    removingPlaylist,
    setRemovingPlaylist,
  ] = useState<Playlist | null>(null);

  const [
    editingPreferences,
    setEditingPreferences,
  ] = useState(false);

  const [draftGenres, setDraftGenres] =
    useState<Genre[]>(favoriteGenres);

  const [draftNeed, setDraftNeed] =
    useState<Need | null>(defaultNeed);

  const activeNeed = selectedMood
    ? PAUSE_NEED_TO_NEED[selectedMood]
    : defaultNeed ?? "Comfort";

  const activeMoodLabel =
    PAUSE_NEEDS.find(
      (item) => item.key === selectedMood
    )?.label ?? "Comfort";

  const recommendations = useMemo(
    () =>
      getRecommendationsForNeed(
        playlists,
        activeNeed,
        3
      ),
    [playlists, activeNeed]
  );

  const openAdd = () => {
    setEditingPlaylist(null);
    setEditorOpen(true);
  };

  const openEdit = (
    playlist: Playlist
  ) => {
    setEditingPlaylist(playlist);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingPlaylist(null);
  };

  const startEditingPreferences = () => {
    setDraftGenres(favoriteGenres);
    setDraftNeed(defaultNeed);
    setEditingPreferences(true);
  };

  const toggleDraftGenre = (
    genre: Genre
  ) => {
    setDraftGenres((current) =>
      current.includes(genre)
        ? current.filter(
            (item) => item !== genre
          )
        : [...current, genre]
    );
  };

  const savePreferences = () => {
    updatePreferences(
      draftGenres,
      draftNeed ?? "Comfort"
    );

    setEditingPreferences(false);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ScreenHeader
          title="My Rhythm"
          subtitle="Your personal music space, shaped by you."
        />

        <PrimaryButton
          onClick={openAdd}
          icon={<Plus size={16} />}
          className="mb-6 w-full sm:mb-0 sm:mt-1 sm:w-auto"
        >
          Add Playlist
        </PrimaryButton>
      </div>

      <section aria-labelledby="right-now-heading">
        <h2
          id="right-now-heading"
          className="font-display text-lg font-semibold text-ink"
        >
          What do you need right now?
        </h2>

        <MoodPicker
          selected={selectedMood}
          onSelect={setSelectedMood}
          className="mt-3"
        />

        <div className="mt-6">
          <h3 className="mb-3 font-display text-lg font-semibold text-ink">
            From your collection:{" "}
            <span className="text-plum-deep">
              {activeMoodLabel}
            </span>
          </h3>

          {recommendations.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recommendations.map(
                (playlist, index) => (
                  <div
                    key={playlist.id}
                    style={{
                      animationDelay: `${
                        index * 60
                      }ms`,
                    }}
                    className="animate-fade-in-up"
                  >
                    <PlaylistCard
                      playlist={playlist}
                      fillHeight
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <PlaylistEmptyState
              onAdd={openAdd}
              compact
            />
          )}
        </div>
      </section>

      <section
        className="mt-10"
        aria-labelledby="collection-heading"
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="collection-heading"
              className="font-display text-2xl font-semibold text-ink"
            >
              My Playlist Collection
            </h2>

            <p className="mt-1 text-sm text-inkSoft">
              Edit the details or use the arrows
              to arrange your playlists.
            </p>
          </div>

          {playlists.length > 0 && (
            <span className="shrink-0 rounded-full bg-plum-soft px-3 py-1.5 text-xs font-semibold text-plum-deep">
              {playlists.length} saved
            </span>
          )}
        </div>

        {playlists.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {playlists.map(
              (playlist, index) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  fillHeight
                  manageable
                  disableMoveUp={
                    index === 0
                  }
                  disableMoveDown={
                    index ===
                    playlists.length - 1
                  }
                  onMoveUp={() =>
                    movePlaylist(
                      playlist.id,
                      "up"
                    )
                  }
                  onMoveDown={() =>
                    movePlaylist(
                      playlist.id,
                      "down"
                    )
                  }
                  onEdit={() =>
                    openEdit(playlist)
                  }
                  onRemove={() =>
                    setRemovingPlaylist(
                      playlist
                    )
                  }
                />
              )
            )}
          </div>
        ) : (
          <PlaylistEmptyState
            onAdd={openAdd}
          />
        )}
      </section>

      <section
        className="mt-10 rounded-2xl border border-line bg-surface p-5 shadow-soft"
        aria-labelledby="preferences-heading"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="preferences-heading"
            className="font-display text-lg font-semibold text-ink"
          >
            Your Listening Preferences
          </h2>

          {!editingPreferences && (
            <button
              type="button"
              onClick={
                startEditingPreferences
              }
              className="press-scale flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-plum hover:bg-plum-soft"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
        </div>

        {!editingPreferences ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-inkSoft">
                Favorite genres
              </p>

              <div className="flex flex-wrap gap-2">
                {favoriteGenres.length ? (
                  favoriteGenres.map(
                    (genre) => (
                      <span
                        key={genre}
                        className="rounded-full bg-plum-soft px-3 py-1.5 text-xs font-medium text-plum-deep"
                      >
                        {genre}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-inkSoft">
                    No genres saved yet.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-inkSoft">
                What you usually look for
              </p>

              <span className="rounded-full bg-plum-soft px-3 py-1.5 text-xs font-medium text-plum-deep">
                {defaultNeed ??
                  "Not set yet"}
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
                {GENRES.map((genre) => (
                  <ChoiceCard
                    key={genre}
                    label={genre}
                    compact
                    selected={draftGenres.includes(
                      genre
                    )}
                    onClick={() =>
                      toggleDraftGenre(
                        genre
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-inkSoft">
                What you usually look for
              </p>

              <div className="flex flex-wrap gap-2">
                {NEEDS.map((need) => (
                  <ChoiceCard
                    key={need}
                    label={need}
                    compact
                    selected={
                      draftNeed === need
                    }
                    onClick={() =>
                      setDraftNeed(need)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <PrimaryButton
                onClick={savePreferences}
                icon={<Check size={16} />}
              >
                Save Preferences
              </PrimaryButton>

              <PrimaryButton
                variant="outline"
                onClick={() =>
                  setEditingPreferences(
                    false
                  )
                }
                icon={<X size={16} />}
              >
                Cancel
              </PrimaryButton>
            </div>
          </div>
        )}
      </section>

      <PlaylistEditorModal
        open={editorOpen}
        onClose={closeEditor}
        onAdd={addPlaylist}
        onUpdate={updatePlaylist}
        existingSpotifyIds={playlists.map(
          (item) => item.spotifyId
        )}
        playlist={editingPlaylist}
      />

      <ConfirmDialog
        open={Boolean(removingPlaylist)}
        title="Remove playlist?"
        description={
          removingPlaylist
            ? `Remove “${removingPlaylist.name}” from your music space? This will not delete it from Spotify.`
            : ""
        }
        confirmLabel="Remove"
        onCancel={() =>
          setRemovingPlaylist(null)
        }
        onConfirm={() => {
          if (removingPlaylist) {
            deletePlaylist(
              removingPlaylist.id
            );
          }

          setRemovingPlaylist(null);
        }}
      />
    </div>
  );
}