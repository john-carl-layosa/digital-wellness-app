import type { Need } from "./options";

export type AvatarOption =
  | "plum"
  | "sage"
  | "gold"
  | "rose"
  | "sky";

export type WellnessFocus =
  | "reduce-stress"
  | "clear-my-mind"
  | "improve-focus"
  | "lift-my-mood"
  | "feel-comforted"
  | "build-pause-habit"
  | "emotional-awareness";

export type PauseTime =
  | "before-shift"
  | "during-break"
  | "after-shift"
  | "before-sleep"
  | "when-overwhelmed";

export type PauseFrequency =
  | "daily"
  | "weekdays"
  | "after-shift"
  | "flexible";

export type UserProfile = {
  fullName: string;
  preferredName: string;
  avatar: AvatarOption;
  avatarImage: string | null;
  wellnessFocus: WellnessFocus[];
  pauseTime: PauseTime | null;
  pauseFrequency: PauseFrequency | null;
  pauseIntention: string;
};

export const AVATAR_OPTIONS: {
  value: AvatarOption;
  label: string;
}[] = [
  {
    value: "plum",
    label: "Plum",
  },
  {
    value: "sage",
    label: "Sage",
  },
  {
    value: "gold",
    label: "Gold",
  },
  {
    value: "rose",
    label: "Rose",
  },
  {
    value: "sky",
    label: "Sky",
  },
];

export const WELLNESS_FOCUS_OPTIONS: {
  value: WellnessFocus;
  label: string;
  description: string;
  mappedNeed: Need;
}[] = [
  {
    value: "reduce-stress",
    label: "Reduce stress",
    description:
      "Find quieter moments during a demanding day.",
    mappedNeed: "Calm",
  },
  {
    value: "clear-my-mind",
    label: "Clear my mind",
    description:
      "Create space to slow down and think clearly.",
    mappedNeed: "Focus",
  },
  {
    value: "improve-focus",
    label: "Improve focus",
    description:
      "Use steady music to return to the task at hand.",
    mappedNeed: "Focus",
  },
  {
    value: "lift-my-mood",
    label: "Lift my mood",
    description:
      "Choose music that brings back some energy.",
    mappedNeed: "Energy",
  },
  {
    value: "feel-comforted",
    label: "Feel comforted",
    description:
      "Return to music that feels safe and familiar.",
    mappedNeed: "Comfort",
  },
  {
    value: "build-pause-habit",
    label: "Build a pause habit",
    description:
      "Make short restorative breaks more consistent.",
    mappedNeed: "Calm",
  },
  {
    value: "emotional-awareness",
    label: "Notice how I feel",
    description:
      "Reflect more intentionally before and after listening.",
    mappedNeed: "Comfort",
  },
];

export const PAUSE_TIME_OPTIONS: {
  value: PauseTime;
  label: string;
}[] = [
  {
    value: "before-shift",
    label: "Before my shift",
  },
  {
    value: "during-break",
    label: "During a break",
  },
  {
    value: "after-shift",
    label: "After my shift",
  },
  {
    value: "before-sleep",
    label: "Before sleep",
  },
  {
    value: "when-overwhelmed",
    label: "When I feel overwhelmed",
  },
];

export const PAUSE_FREQUENCY_OPTIONS: {
  value: PauseFrequency;
  label: string;
}[] = [
  {
    value: "daily",
    label: "Every day",
  },
  {
    value: "weekdays",
    label: "On workdays",
  },
  {
    value: "after-shift",
    label: "After every shift",
  },
  {
    value: "flexible",
    label: "Keep it flexible",
  },
];

export const DEFAULT_USER_PROFILE: UserProfile =
  {
    fullName: "",
    preferredName: "",
    avatar: "plum",
    avatarImage: null,
    wellnessFocus: [],
    pauseTime: null,
    pauseFrequency: null,
    pauseIntention: "",
  };