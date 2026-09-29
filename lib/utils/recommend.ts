import type { Need } from "../data/options";
import {
  getCategoriesForNeed,
  type Playlist,
} from "../data/playlists";

export type Recommendation = {
  title: string;
  blurb: string;
  playlist: Playlist;
};

const BLURBS: Record<Need, string> = {
  Calm:
    "A playlist from your collection for a quieter pause.",
  Comfort:
    "Something you saved for a familiar and comforting moment.",
  Focus:
    "A personal pick to help clear your head.",
  Energy:
    "A playlist from your collection for a gentle lift.",
  Familiarity:
    "A saved favorite that already feels like home.",
  "Something New":
    "A different corner of the music space you created.",
};

export function getRecommendationsForNeed(
  playlists: Playlist[],
  need: Need,
  count = 3
): Playlist[] {
  const preferredCategories =
    getCategoriesForNeed(need);

  return playlists
    .map((playlist, originalIndex) => {
      const categoryIndex =
        preferredCategories.indexOf(
          playlist.category
        );

      return {
        playlist,
        score:
          categoryIndex < 0
            ? 0
            : preferredCategories.length -
              categoryIndex,
        originalIndex,
      };
    })
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.originalIndex -
          second.originalIndex
    )
    .slice(0, count)
    .map(({ playlist }) => playlist);
}

export function getRecommendation(
  playlists: Playlist[],
  need: Need
): Recommendation | null {
  const playlist =
    getRecommendationsForNeed(
      playlists,
      need,
      1
    )[0];

  if (!playlist) {
    return null;
  }

  return {
    title: `${playlist.category} · ${need}`,
    blurb: BLURBS[need],
    playlist,
  };
}

export function shufflePlaylists(
  list: Playlist[]
): Playlist[] {
  const result = [...list];

  for (
    let index = result.length - 1;
    index > 0;
    index -= 1
  ) {
    const swapIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [
      result[index],
      result[swapIndex],
    ] = [
      result[swapIndex],
      result[index],
    ];
  }

  return result;
}

const LAST_ID_KEY_PREFIX =
  "rhythms-of-relief:last-rec:";

export function getRotatingRecommendation(
  playlists: Playlist[],
  need: Need
): Recommendation | null {
  const candidates =
    getRecommendationsForNeed(
      playlists,
      need,
      4
    );

  if (!candidates.length) {
    return null;
  }

  let pool = candidates;

  try {
    const key = `${LAST_ID_KEY_PREFIX}${need}`;
    const lastId =
      window.sessionStorage.getItem(key);

    const withoutLast = candidates.filter(
      (playlist) =>
        playlist.id !== lastId
    );

    if (withoutLast.length) {
      pool = withoutLast;
    }

    const playlist =
      pool[
        Math.floor(Math.random() * pool.length)
      ];

    window.sessionStorage.setItem(
      key,
      playlist.id
    );

    return {
      title: `${playlist.category} · ${need}`,
      blurb: BLURBS[need],
      playlist,
    };
  } catch {
    const playlist =
      pool[
        Math.floor(Math.random() * pool.length)
      ];

    return {
      title: `${playlist.category} · ${need}`,
      blurb: BLURBS[need],
      playlist,
    };
  }
}