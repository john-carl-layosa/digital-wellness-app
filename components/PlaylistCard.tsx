import React from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ListMusic,
  Music2,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Playlist } from "../lib/data/playlists";

type Props = {
  playlist: Playlist;
  fillHeight?: boolean;
  manageable?: boolean;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export function PlaylistCard({
  playlist,
  fillHeight = false,
  manageable = false,
  disableMoveUp = false,
  disableMoveDown = false,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const metadata = [
    playlist.trackCount !== null
      ? `${playlist.trackCount} ${
          playlist.trackCount === 1
            ? "track"
            : "tracks"
        }`
      : null,
    playlist.ownerName
      ? `by ${playlist.ownerName}`
      : null,
  ].filter(Boolean);

  return (
    <article
      className={`lift-hover group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft hover:border-plum/30 hover:shadow-elevated ${
        fillHeight ? "h-full" : ""
      }`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-plum-soft sm:aspect-[2/1]">
        {playlist.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={playlist.coverImage}
            alt={`${playlist.name} cover`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-plum-soft to-canvasAlt">
            <Music2
              size={34}
              className="text-plum"
            />
          </div>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-plum-deep shadow-soft backdrop-blur-sm">
          {playlist.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {playlist.name}
        </h3>

        {metadata.length > 0 && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-inkSoft">
            <ListMusic size={13} />
            {metadata.join(" · ")}
          </p>
        )}

        <p className="mb-4 mt-2 text-sm leading-relaxed text-inkSoft">
          {playlist.description ||
            "A playlist saved in your personal music space."}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <a
            href={playlist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press-scale inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-[#169c46] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1DB954]/25"
          >
            <ExternalLink size={14} />
            Open Spotify
          </a>

          {manageable && (
            <div
              className="ml-auto flex items-center gap-1"
              aria-label="Playlist actions"
            >
              <button
                type="button"
                onClick={onMoveUp}
                disabled={disableMoveUp}
                aria-label={`Move ${playlist.name} up`}
                className="press-scale flex h-9 w-9 items-center justify-center rounded-full text-inkSoft hover:bg-plum-soft hover:text-plum-deep disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp size={16} />
              </button>

              <button
                type="button"
                onClick={onMoveDown}
                disabled={disableMoveDown}
                aria-label={`Move ${playlist.name} down`}
                className="press-scale flex h-9 w-9 items-center justify-center rounded-full text-inkSoft hover:bg-plum-soft hover:text-plum-deep disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowDown size={16} />
              </button>

              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit ${playlist.name}`}
                className="press-scale flex h-9 w-9 items-center justify-center rounded-full text-inkSoft hover:bg-plum-soft hover:text-plum-deep"
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${playlist.name}`}
                className="press-scale flex h-9 w-9 items-center justify-center rounded-full text-inkSoft hover:bg-red-50 hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}