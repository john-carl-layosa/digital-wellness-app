export type Genre =
  | "OPM"
  | "Pop"
  | "Rock"
  | "R&B"
  | "Classical"
  | "Jazz"
  | "Hip-Hop"
  | "Gospel"
  | "Instrumental"
  | "K-Pop"
  | "Other";

export type Need =
  | "Calm"
  | "Comfort"
  | "Focus"
  | "Energy"
  | "Familiarity"
  | "Something New";

export const GENRES: Genre[] = [
  "OPM",
  "Pop",
  "Rock",
  "R&B",
  "Classical",
  "Jazz",
  "Hip-Hop",
  "Gospel",
  "Instrumental",
  "K-Pop",
  "Other",
];

export const NEEDS: Need[] = [
  "Calm",
  "Comfort",
  "Focus",
  "Energy",
  "Familiarity",
  "Something New",
];

// "What do you need from this pause?" — Home's signature quick-pick choices
export type PauseNeed =
  | "To calm"
  | "To clear my head"
  | "To feel comforted"
  | "To lift my mood"
  | "To explore something new";

export const PAUSE_NEEDS: { key: PauseNeed; icon: string; label: string }[] = [
  { key: "To calm", icon: "leaf", label: "Calm Down" },
  { key: "To clear my head", icon: "cloud", label: "Clear My Mind" },
  { key: "To feel comforted", icon: "home", label: "Feel at Home" },
  { key: "To lift my mood", icon: "sun", label: "Lift My Mood" },
  { key: "To explore something new", icon: "headphones", label: "Unwind" },
];

export const PAUSE_NEED_TO_NEED: Record<PauseNeed, Need> = {
  "To calm": "Calm",
  "To clear my head": "Focus",
  "To feel comforted": "Comfort",
  "To lift my mood": "Energy",
  "To explore something new": "Something New",
};

export const BEFORE_PAUSE_FEELINGS = [
  "Drained",
  "Overloaded",
  "Tired",
  "Okay",
  "Good",
  "Other",
] as const;

export const BEFORE_PAUSE_NEEDS_FROM_BREAK = [
  "A few minutes of quiet",
  "Something to distract me",
  "A reminder that I'm doing okay",
  "Space to just breathe",
  "Music that feels familiar",
] as const;

export const RESET_TAKEAWAYS = [
  "I need to make time for rest.",
  "I should give myself permission to pause.",
  "I want to listen to music more intentionally.",
  "I want to explore new music.",
  "I want to be more aware of how I'm feeling.",
] as const;
