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
    id: "pop-pick-me-up",
    name: "Pop Pick-Me-Up",
    genre: "Pop",
    needs: ["Energy", "Something New"],
    description: "Catchy, upbeat pop for a quick mood boost between rounds.",
    color: "#F9EFD1",
    spotifyUrl: "https://open.spotify.com/search/pop%20upbeat",
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
    id: "rnb-late-night",
    name: "Late Night R&B",
    genre: "R&B",
    needs: ["Calm", "Comfort"],
    description: "Warm, soulful tracks for a quiet moment to yourself.",
    color: "#F4E4DA",
    spotifyUrl: "https://open.spotify.com/search/late%20night%20r%26b",
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
    id: "classical-piano-focus",
    name: "Classical Piano for Focus",
    genre: "Classical",
    needs: ["Focus", "Something New"],
    description: "Try something different — solo piano to help you reset.",
    color: "#E3EEE4",
    spotifyUrl: "https://open.spotify.com/search/classical%20piano%20focus",
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
  {
    id: "kpop-upbeat",
    name: "K-Pop for a Lift",
    genre: "K-Pop",
    needs: ["Energy", "Something New"],
    description: "Explore something new with high-energy K-Pop favorites.",
    color: "#F6DCEA",
    spotifyUrl: "https://open.spotify.com/search/kpop%20upbeat",
  },
  {
    id: "jazz-quiet-route",
    name: "Quiet Jazz for a Slower Pace",
    genre: "Jazz",
    needs: ["Calm", "Focus"],
    description: "Take a quieter route with soft, unhurried jazz.",
    color: "#EFE3D3",
    spotifyUrl: "https://open.spotify.com/search/jazz%20chill",
  },
  {
    id: "jazz-late-night",
    name: "Late Night Jazz",
    genre: "Jazz",
    needs: ["Calm", "Comfort"],
    description: "Smooth, unhurried jazz for winding down at the end of a shift.",
    color: "#F0E6D6",
    spotifyUrl: "https://open.spotify.com/search/late%20night%20jazz",
  },
  {
    id: "rock-release-energy",
    name: "Rock to Release Some Energy",
    genre: "Rock",
    needs: ["Energy", "Something New"],
    description: "Let a little rock help you shake off the day.",
    color: "#E8D6D6",
    spotifyUrl: "https://open.spotify.com/search/rock%20energy",
  },
  {
    id: "rock-classics",
    name: "Rock Classics",
    genre: "Rock",
    needs: ["Energy", "Familiarity"],
    description: "Familiar rock anthems to help you power through.",
    color: "#EAD9D0",
    spotifyUrl: "https://open.spotify.com/search/classic%20rock",
  },
];

export function getPlaylistById(id: string): Playlist | undefined {
  return PLAYLISTS.find((p) => p.id === id);
}