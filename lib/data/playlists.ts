import type { Need } from "./options";

export const PLAYLIST_CATEGORIES = [
  "Relax",
  "Focus",
  "Motivation",
  "Sleep",
  "Workout",
  "Recovery",
  "Personal Favorites",
] as const;

export type PlaylistCategory = (typeof PLAYLIST_CATEGORIES)[number];

export type Playlist = {
  id: string;
  spotifyId: string;
  spotifyUrl: string;
  name: string;
  originalName: string;
  description: string;
  category: PlaylistCategory;
  coverImage: string | null;
  trackCount: number | null;
  ownerName: string | null;
  addedAt: string;
};

export type SpotifyPlaylistMetadata = {
  spotifyId: string;
  spotifyUrl: string;
  name: string;
  description: string;
  coverImage: string | null;
  trackCount: number | null;
  ownerName: string | null;
};

export const CATEGORY_DESCRIPTIONS: Record<PlaylistCategory, string> = {
  Relax: "Gentle playlists for slowing down and taking a quiet pause.",
  Focus: "Steady sounds for clearing your mind and staying present.",
  Motivation: "Music that helps lift your mood and renew your energy.",
  Sleep: "Soft listening for resting and preparing to sleep.",
  Workout: "Higher-energy playlists for movement and active breaks.",
  Recovery: "Comforting music for decompressing after a demanding day.",
  "Personal Favorites": "The playlists that feel most like you.",
};

const NEED_CATEGORY_ORDER: Record<Need, PlaylistCategory[]> = {
  Calm: ["Relax", "Recovery", "Sleep", "Personal Favorites"],
  Comfort: ["Recovery", "Personal Favorites", "Relax", "Sleep"],
  Focus: ["Focus", "Relax", "Personal Favorites"],
  Energy: ["Motivation", "Workout", "Personal Favorites"],
  Familiarity: ["Personal Favorites", "Recovery", "Relax"],
  "Something New": [
    "Motivation",
    "Workout",
    "Focus",
    "Relax",
    "Recovery",
    "Sleep",
    "Personal Favorites",
  ],
};

export function getCategoriesForNeed(
  need: Need
): PlaylistCategory[] {
  return NEED_CATEGORY_ORDER[need];
}

export function extractSpotifyPlaylistId(
  value: string
): string | null {
  const input = value.trim();

  const uriMatch = input.match(
    /^spotify:playlist:([A-Za-z0-9]{10,})$/i
  );

  if (uriMatch) {
    return uriMatch[1];
  }

  try {
    const url = new URL(input);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "open.spotify.com"
    ) {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const playlistIndex = parts.indexOf("playlist");
    const id =
      playlistIndex >= 0
        ? parts[playlistIndex + 1]
        : undefined;

    return id && /^[A-Za-z0-9]{10,}$/.test(id)
      ? id
      : null;
  } catch {
    return null;
  }
}

export function normalizeSpotifyPlaylistUrl(
  value: string
): string | null {
  const id = extractSpotifyPlaylistId(value);

  return id
    ? `https://open.spotify.com/playlist/${id}`
    : null;
}