"use client";

import React, {
  useMemo,
  useState,
} from "react";
import {
  Plus,
  Search,
} from "lucide-react";
import { useAppData } from "../../../lib/context/AppContext";
import {
  CATEGORY_DESCRIPTIONS,
  PLAYLIST_CATEGORIES,
  PlaylistCategory,
} from "../../../lib/data/playlists";
import { PlaylistCard } from "../../../components/PlaylistCard";
import { PlaylistEmptyState } from "../../../components/PlaylistEmptyState";
import { PlaylistEditorModal } from "../../../components/PlaylistEditorModal";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { PrimaryButton } from "../../../components/PrimaryButton";

type Filter =
  | "All"
  | PlaylistCategory;

export default function ExplorePage() {
  const {
    playlists,
    addPlaylist,
    updatePlaylist,
  } = useAppData();

  const [activeFilter, setActiveFilter] =
    useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] =
    useState(false);

  const visiblePlaylists = useMemo(() => {
    const cleanQuery = query
      .trim()
      .toLowerCase();

    return playlists.filter((playlist) => {
      const matchesCategory =
        activeFilter === "All" ||
        playlist.category === activeFilter;

      const matchesQuery =
        !cleanQuery ||
        `${playlist.name} ${playlist.description} ${playlist.category}`
          .toLowerCase()
          .includes(cleanQuery);

      return (
        matchesCategory && matchesQuery
      );
    });
  }, [playlists, activeFilter, query]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ScreenHeader
          title="Explore Your Collection"
          subtitle="Find the right playlist from the music space you created."
        />

        <PrimaryButton
          onClick={() =>
            setEditorOpen(true)
          }
          icon={<Plus size={16} />}
          className="w-full sm:mt-1 sm:w-auto"
        >
          Add from Spotify
        </PrimaryButton>
      </div>

      {playlists.length === 0 ? (
        <PlaylistEmptyState
          onAdd={() =>
            setEditorOpen(true)
          }
        />
      ) : (
        <>
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
            <label
              htmlFor="playlist-search"
              className="sr-only"
            >
              Search your playlists
            </label>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-inkSoft"
              />

              <input
                id="playlist-search"
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search your playlists"
                className="w-full rounded-full border border-line bg-canvasAlt py-3 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-plum/10"
              />
            </div>

            <div
              className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1"
              aria-label="Filter playlists by category"
            >
              {(
                [
                  "All",
                  ...PLAYLIST_CATEGORIES,
                ] as Filter[]
              ).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter
                    )
                  }
                  aria-pressed={
                    activeFilter === filter
                  }
                  className={`press-scale shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                    activeFilter === filter
                      ? "bg-plum text-white shadow-soft"
                      : "bg-plum-soft text-plum-deep hover:bg-plum-soft/70"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {activeFilter === "All"
                  ? "All Playlists"
                  : activeFilter}
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                {activeFilter === "All"
                  ? `${
                      visiblePlaylists.length
                    } playlist${
                      visiblePlaylists.length ===
                      1
                        ? ""
                        : "s"
                    } in your collection.`
                  : CATEGORY_DESCRIPTIONS[
                      activeFilter
                    ]}
              </p>
            </div>

            {visiblePlaylists.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePlaylists.map(
                  (playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      fillHeight
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-line bg-surface px-6 py-10 text-center">
                <p className="font-display text-lg font-semibold text-ink">
                  No matching playlists
                </p>

                <p className="mt-1 text-sm text-inkSoft">
                  Try another search or
                  category.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <PlaylistEditorModal
        open={editorOpen}
        onClose={() =>
          setEditorOpen(false)
        }
        onAdd={addPlaylist}
        onUpdate={updatePlaylist}
        existingSpotifyIds={playlists.map(
          (playlist) =>
            playlist.spotifyId
        )}
      />
    </div>
  );
}