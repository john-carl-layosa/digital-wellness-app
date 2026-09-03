import { Genre, Need } from "../data/options";
import { Playlist, PLAYLISTS } from "../data/playlists";

export type Recommendation = {
  title: string; // e.g. "OPM × Comfort"
  blurb: string;
  playlist: Playlist;
};

const BLURBS: Record<Need, string> = {
  Calm: "Because sometimes all you need is a quieter pause.",
  Comfort: "Because sometimes familiar music is exactly what you need for a pause.",
  Focus: "Something steady to help clear your head.",
  Energy: "A little lift for the rest of your day.",
  Familiarity: "The songs that already feel like home.",
  "Something New": "Want to step outside your usual playlist?",
};

/**
 * Simple, transparent preference-based matching:
 * 1) Prefer a playlist matching both the genre and the need.
 * 2) Fall back to matching the need only.
 * 3) Fall back to matching the genre only.
 * 4) Fall back to the first playlist.
 */
export function getRecommendation(
  favoriteGenres: Genre[],
  need: Need
): Recommendation {
  const genre = favoriteGenres[0] ?? "OPM";

  let playlist =
    PLAYLISTS.find((p) => p.genre === genre && p.needs.includes(need)) ??
    PLAYLISTS.find((p) => favoriteGenres.includes(p.genre) && p.needs.includes(need));

  if (!playlist) {
    playlist = PLAYLISTS.find((p) => p.needs.includes(need));
  }
  if (!playlist) {
    playlist = PLAYLISTS.find((p) => favoriteGenres.includes(p.genre));
  }
  if (!playlist) {
    playlist = PLAYLISTS[0];
  }

  return {
    title: `${playlist.genre} × ${need}`,
    blurb: BLURBS[need],
    playlist,
  };
}