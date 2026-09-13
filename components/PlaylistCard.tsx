import React from "react";
import { Music2, Play } from "lucide-react";
import type { Playlist } from "../lib/data/playlists";

type Props = {
  playlist: Playlist;
  /**
   * Set this when the card sits inside a CSS grid alongside sibling cards
   * (e.g. My Rhythm's "Based on your choice" row, or the Explore popup's
   * results grid) so every card in the row matches height and the button
   * lines up at the same vertical position. Leave it off for a standalone
   * card (Home, onboarding, the recommendation modal) — without a grid to
   * stretch against, `h-full` has nothing to fill and pushes the button
   * far below the visible content instead.
   */
  fillHeight?: boolean;
};

export function PlaylistCard({ playlist, fillHeight = false }: Props) {
  return (
    <div
      className={`lift-hover group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-soft hover:border-plum/30 hover:shadow-elevated sm:flex-row ${
        fillHeight ? "h-full" : ""
      }`}
    >
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: playlist.color }}
      >
        <Music2 size={22} className="text-plum-deep" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {playlist.name}
        </h3>

        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-plum">
          {playlist.genre}
        </p>

        {/* No truncation — full description shows. mb-3 guarantees a minimum
            gap above the button even when a 3-line description leaves little
            room for mt-auto to push into; mt-auto still adds extra space on
            shorter cards so the button lines up at the same bottom position
            within a fillHeight grid row. */}
        <p className="mb-3 mt-1 text-sm text-inkSoft">
          {playlist.description}
        </p>

        <a
          href={playlist.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`press-scale inline-flex w-fit items-center gap-2 self-start rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-plum-deep hover:shadow-elevated focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25 ${
            fillHeight ? "mt-auto" : ""
          }`}
        >
          <Play size={14} fill="currentColor" />
          Listen on Spotify
        </a>
      </div>
    </div>
  );
}
