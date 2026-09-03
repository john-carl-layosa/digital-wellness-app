import React from "react";
import { Music2, Play } from "lucide-react";
import type { Playlist } from "../lib/data/playlists";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: playlist.color }}
      >
        <Music2 size={22} className="text-plum-deep" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {playlist.name}
        </h3>

        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-plum">
          {playlist.genre}
        </p>

        <p className="mt-1 text-sm text-inkSoft">
          {playlist.description}
        </p>

        <a
          href={playlist.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          <Play size={14} fill="currentColor" />
          Listen on Spotify
        </a>
      </div>
    </div>
  );
}