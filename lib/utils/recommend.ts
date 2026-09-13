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

/**
 * Returns up to `count` playlists ranked by relevance to the given genres/need,
 * for surfaces that want to show a short list (e.g. My Rhythm) rather than a
 * single pick.
 */
export function getRecommendationsForNeed(
  favoriteGenres: Genre[],
  need: Need,
  count = 3
): Playlist[] {
  const primaryGenre = favoriteGenres[0] ?? "OPM";

  const scored = PLAYLISTS.map((p) => {
    let score = 0;
    if (p.genre === primaryGenre) score += 2;
    else if (favoriteGenres.includes(p.genre)) score += 1;
    if (p.needs.includes(need)) score += 2;
    return { playlist: p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.playlist);

  const rest = PLAYLISTS.filter((p) => !scored.includes(p));
  return [...scored, ...rest].slice(0, count);
}

/**
 * Fisher-Yates shuffle — returns a new array in randomized order without
 * mutating the input. Used so a genre's playlist list doesn't always render
 * in the same fixed order every time it's viewed.
 */
export function shufflePlaylists(list: Playlist[]): Playlist[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const LAST_INDEX_KEY_PREFIX = "rhythms-of-relief:last-rec:";

/**
 * Client-side "dynamic" recommendation: picks among the best-matching
 * playlists for the given genres/need, avoiding an immediate repeat within
 * the same browser session so Home doesn't always show the same card.
 */
export function getRotatingRecommendation(
  favoriteGenres: Genre[],
  need: Need
): Recommendation {
  const candidates = getRecommendationsForNeed(favoriteGenres, need, 4);
  const pool = candidates.length ? candidates : PLAYLISTS;

  let index = Math.floor(Math.random() * pool.length);
  try {
    const key = `${LAST_INDEX_KEY_PREFIX}${need}`;
    const last = window.sessionStorage.getItem(key);
    if (pool.length > 1 && last !== null && String(index) === last) {
      index = (index + 1) % pool.length;
    }
    window.sessionStorage.setItem(key, String(index));
  } catch {
    // sessionStorage unavailable — plain random pick is fine
  }

  const playlist = pool[index];
  return {
    title: `${playlist.genre} × ${need}`,
    blurb: BLURBS[need],
    playlist,
  };
}