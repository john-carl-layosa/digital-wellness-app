import { GENRES, type Genre } from "./options";
import type { Playlist, PlaylistCategory } from "./playlists";

const SPOTIFY_PLAYLISTS: Record<
  Genre,
  { id: string; name: string; category: PlaylistCategory }
> = {
  OPM: {
    id: "37i9dQZF1DWSVQreDCvFMf",
    name: "OPM Rising",
    category: "Recovery",
  },
  Pop: {
    id: "37i9dQZF1DXcBWIGoYBM5M",
    name: "Today’s Top Hits",
    category: "Motivation",
  },
  Rock: {
    id: "37i9dQZF1DWXRqgorJj26U",
    name: "Rock Classics",
    category: "Motivation",
  },
  "R&B": {
    id: "37i9dQZF1DWUFAJPVM3HTX",
    name: "Fresh Finds R&B",
    category: "Relax",
  },
  Classical: {
    id: "37i9dQZF1DWWEJlAGA9gs0",
    name: "Classical Essentials",
    category: "Relax",
  },
  Jazz: {
    id: "37i9dQZF1DXbITWG1ZJKYt",
    name: "Jazz Classics",
    category: "Relax",
  },
  "Hip-Hop": {
    id: "37i9dQZF1DX0XUsuxWHRQd",
    name: "RapCaviar",
    category: "Workout",
  },
  Gospel: {
    id: "37i9dQZF1DX7OIddoQVdRt",
    name: "Gospel Hits",
    category: "Recovery",
  },
  Instrumental: {
    id: "37i9dQZF1DX9sIqqvKsjG8",
    name: "Instrumental Study",
    category: "Focus",
  },
  "K-Pop": {
    id: "37i9dQZF1DX9tPFwDMOaN1",
    name: "K-Pop ON! (온)",
    category: "Motivation",
  },
  Other: {
    id: "37i9dQZF1DWVjrTQlvqTHF",
    name: "New Music Friday Philippines",
    category: "Personal Favorites",
  },
};

export function createDefaultPlaylists(): Playlist[] {
  const addedAt = new Date().toISOString();

  return GENRES.map((genre) => {
    const { id, name, category } = SPOTIFY_PLAYLISTS[genre];

    return {
      id: `default-spotify-${id}`,
      spotifyId: id,
      spotifyUrl: `https://open.spotify.com/playlist/${id}`,
      name,
      originalName: name,
      description: "",
      category,
      genre,
      coverImage: null,
      trackCount: null,
      ownerName: "Spotify",
      addedAt,
    };
  });
}
