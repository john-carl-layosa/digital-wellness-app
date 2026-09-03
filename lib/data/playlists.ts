import { Genre, Need } from "./options";

export type Playlist = {
  id: string;
  name: string;
  genre: Genre;
  needs: Need[];
  description: string;
  color: string;
  spotifyUrl: string;
};

// NOTE: spotifyUrl values are placeholder Spotify search links.
// Replace with your organization's real curated playlist links before shipping.
export const PLAYLISTS: Playlist[] = [
  {
    id: "opm-unwind",
    name: "OPM for Unwinding",
    genre: "OPM",
    needs: ["Calm", "Familiarity"],
    description: "Soft, familiar Filipino tracks for winding down after a shift.",
    color: "#E9E0F8",
    spotifyUrl: "https://open.spotify.com/search/OPM%20chill",
  },
  {
    id: "opm-comfort",
    name: "OPM for Comfort",
    genre: "OPM",
    needs: ["Comfort", "Familiarity"],
    description: "Familiar songs to comfort your heart and give you a gentle pause.",
    color: "#F3D9EA",
    spotifyUrl: "https://open.spotify.com/search/OPM%20acoustic",
  },
  {
    id: "instrumental-focus",
    name: "Instrumental for Focus",
    genre: "Instrumental",
    needs: ["Focus"],
    description: "Gentle instrumentals to help clear your head between tasks.",
    color: "#D9E7F2",
    spotifyUrl: "https://open.spotify.com/search/instrumental%20focus",
  },
  {
    id: "feel-good-pop",
    name: "Feel-Good Pop",
    genre: "Pop",
    needs: ["Energy", "Comfort"],
    description: "Bright, easy pop to lift your mood on a heavy day.",
    color: "#F7E9C2",
    spotifyUrl: "https://open.spotify.com/search/feel%20good%20pop",
  },
  {
    id: "slow-rnb",
    name: "Slow R&B",
    genre: "R&B",
    needs: ["Calm", "Something New"],
    description: "Slow things down with mellow, soulful R&B.",
    color: "#F1DECB",
    spotifyUrl: "https://open.spotify.com/search/slow%20r%26b",
  },
  {
    id: "calm-classical",
    name: "Calm Classical",
    genre: "Classical",
    needs: ["Calm", "Focus"],
    description: "Quiet classical pieces for a slower, steadier pause.",
    color: "#DCEBDD",
    spotifyUrl: "https://open.spotify.com/search/calm%20classical",
  },
  {
    id: "familiar-filipino",
    name: "Familiar Filipino Favorites",
    genre: "OPM",
    needs: ["Familiarity", "Comfort"],
    description: "The songs everyone knows the words to.",
    color: "#E9E0F8",
    spotifyUrl: "https://open.spotify.com/search/OPM%20throwback",
  },
  {
    id: "something-different",
    name: "A Little Something Different",
    genre: "K-Pop",
    needs: ["Something New", "Energy"],
    description: "Step outside your usual playlist for a fresh change of pace.",
    color: "#F3D9EA",
    spotifyUrl: "https://open.spotify.com/search/kpop%20chill",
  },
];

export function getPlaylistById(id: string): Playlist | undefined {
  return PLAYLISTS.find((p) => p.id === id);
}