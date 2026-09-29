"use client";

import React, {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Link2,
  Music2,
  Search,
} from "lucide-react";
import {
  PLAYLIST_CATEGORIES,
  Playlist,
  PlaylistCategory,
  SpotifyPlaylistMetadata,
  extractSpotifyPlaylistId,
} from "../lib/data/playlists";
import { Modal } from "./Modal";
import { PrimaryButton } from "./PrimaryButton";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (playlist: Playlist) => void;
  onUpdate: (
    id: string,
    updates: Pick<
      Playlist,
      "name" | "description" | "category"
    >
  ) => void;
  existingSpotifyIds: string[];
  playlist?: Playlist | null;
};

function createId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `playlist-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function PlaylistEditorModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  existingSpotifyIds,
  playlist = null,
}: Props) {
  const editing = Boolean(playlist);

  const [url, setUrl] = useState("");
  const [metadata, setMetadata] =
    useState<SpotifyPlaylistMetadata | null>(
      null
    );
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState<PlaylistCategory>(
      "Personal Favorites"
    );
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setUrl("");
    setMetadata(null);
    setName(playlist?.name ?? "");
    setDescription(
      playlist?.description ?? ""
    );
    setCategory(
      playlist?.category ??
        "Personal Favorites"
    );
    setLoading(false);
    setError("");
  }, [open, playlist]);

  const findPlaylist = async (
    event: FormEvent
  ) => {
    event.preventDefault();
    setError("");

    const spotifyId =
      extractSpotifyPlaylistId(url);

    if (!spotifyId) {
      setError(
        "Paste a valid Spotify playlist link."
      );
      return;
    }

    if (
      existingSpotifyIds.includes(spotifyId)
    ) {
      setError(
        "This playlist is already in your collection."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/spotify/playlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data =
        (await response.json()) as SpotifyPlaylistMetadata & {
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not read this playlist."
        );
      }

      setMetadata(data);
      setName(data.name);
      setDescription(data.description);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not read this playlist."
      );
    } finally {
      setLoading(false);
    }
  };

  const savePlaylist = (
    event: FormEvent
  ) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError(
        "Give your playlist a name."
      );
      return;
    }

    if (playlist) {
      onUpdate(playlist.id, {
        name: cleanName,
        description: description.trim(),
        category,
      });

      onClose();
      return;
    }

    if (!metadata) {
      return;
    }

    onAdd({
      id: createId(),
      spotifyId: metadata.spotifyId,
      spotifyUrl: metadata.spotifyUrl,
      name: cleanName,
      originalName: metadata.name,
      description: description.trim(),
      category,
      coverImage: metadata.coverImage,
      trackCount: metadata.trackCount,
      ownerName: metadata.ownerName,
      addedAt: new Date().toISOString(),
    });

    onClose();
  };

  const preview = playlist ?? metadata;
  const showDetails =
    editing || Boolean(metadata);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        editing
          ? "Edit Playlist"
          : "Add from Spotify"
      }
      widthClassName="max-w-xl"
    >
      {!showDetails ? (
        <form onSubmit={findPlaylist}>
          <div className="rounded-2xl bg-plum-soft/60 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-plum shadow-soft">
                <Link2 size={17} />
              </span>

              <div>
                <h3 className="font-semibold text-ink">
                  Paste a Spotify playlist link
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-inkSoft">
                  It can be yours or a playlist
                  shared by another Spotify user,
                  as long as Spotify can access it.
                </p>
              </div>
            </div>
          </div>

          <label
            htmlFor="spotify-playlist-url"
            className="mt-5 block text-sm font-semibold text-ink"
          >
            Spotify playlist link
          </label>

          <input
            id="spotify-playlist-url"
            type="url"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(event) =>
              setUrl(event.target.value)
            }
            placeholder="https://open.spotify.com/playlist/..."
            className="mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-plum/10"
            required
          />

          {error && (
            <p
              role="alert"
              className="mt-2 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <PrimaryButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </PrimaryButton>

            <PrimaryButton
              type="submit"
              loading={loading}
              icon={<Search size={16} />}
            >
              Find Playlist
            </PrimaryButton>
          </div>
        </form>
      ) : (
        <form onSubmit={savePlaylist}>
          <div className="flex items-center gap-4 rounded-2xl border border-line bg-canvasAlt p-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-plum-soft">
              {preview?.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-plum">
                  <Music2 size={25} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-plum">
                Found on Spotify
              </p>

              <p className="mt-1 truncate font-display text-lg font-semibold text-ink">
                {playlist?.originalName ??
                  metadata?.name}
              </p>

              {preview?.trackCount !== null &&
                preview?.trackCount !==
                  undefined && (
                  <p className="mt-1 text-xs text-inkSoft">
                    {preview.trackCount} tracks
                  </p>
                )}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div>
              <label
                htmlFor="playlist-name"
                className="text-sm font-semibold text-ink"
              >
                Display name
              </label>

              <input
                id="playlist-name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                maxLength={80}
                className="mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-plum/10"
                required
              />
            </div>

            <div>
              <label
                htmlFor="playlist-description"
                className="text-sm font-semibold text-ink"
              >
                Purpose or description{" "}
                <span className="font-normal text-inkSoft">
                  (optional)
                </span>
              </label>

              <textarea
                id="playlist-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                maxLength={180}
                rows={3}
                placeholder="When or why do you listen to this playlist?"
                className="mt-2 w-full resize-none rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-plum/10"
              />

              <p className="mt-1 text-right text-xs text-inkSoft">
                {description.length}/180
              </p>
            </div>

            <div>
              <label
                htmlFor="playlist-category"
                className="text-sm font-semibold text-ink"
              >
                Mood or category
              </label>

              <select
                id="playlist-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target
                      .value as PlaylistCategory
                  )
                }
                className="mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-plum/10"
              >
                {PLAYLIST_CATEGORIES.map(
                  (option) => (
                    <option key={option}>
                      {option}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            {!editing ? (
              <PrimaryButton
                type="button"
                variant="ghost"
                onClick={() => {
                  setMetadata(null);
                  setError("");
                }}
                icon={<ArrowLeft size={16} />}
              >
                Use another link
              </PrimaryButton>
            ) : (
              <span />
            )}

            <div className="flex justify-end gap-2">
              <PrimaryButton
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </PrimaryButton>

              <PrimaryButton
                type="submit"
                icon={<Check size={16} />}
              >
                {editing
                  ? "Save Changes"
                  : "Add Playlist"}
              </PrimaryButton>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}