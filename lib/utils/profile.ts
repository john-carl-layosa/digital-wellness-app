import type { Genre, Need } from "../data/options";
import type { UserProfile } from "../data/profileOptions";

export type ProfileValidationErrors = Partial<
  Record<
    | "fullName"
    | "wellnessFocus"
    | "favoriteGenres"
    | "defaultNeed"
    | "pauseIntention",
    string
  >
>;

export function getDisplayName(profile: UserProfile): string {
  const preferredName = profile.preferredName.trim();

  if (preferredName) {
    return preferredName;
  }

  return profile.fullName.trim().split(/\s+/)[0] ?? "";
}

export function getInitials(
  fullName: string,
  preferredName = ""
): string {
  const source = fullName.trim() || preferredName.trim();

  if (!source) {
    return "";
  }

  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function validateProfile(
  profile: UserProfile,
  favoriteGenres: Genre[],
  defaultNeed: Need | null
): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};
  const fullNameLength = profile.fullName.trim().length;

  if (!fullNameLength) {
    errors.fullName = "Enter your full name.";
  } else if (fullNameLength < 2 || fullNameLength > 80) {
    errors.fullName =
      "Full name must be between 2 and 80 characters.";
  }

  if (profile.wellnessFocus.length === 0) {
    errors.wellnessFocus =
      "Select at least one wellness focus.";
  } else if (profile.wellnessFocus.length > 3) {
    errors.wellnessFocus =
      "Select up to three wellness focus areas.";
  }

  if (favoriteGenres.length === 0) {
    errors.favoriteGenres =
      "Select at least one favorite genre.";
  }

  if (!defaultNeed) {
    errors.defaultNeed =
      "Select what you usually look for in a pause.";
  }

  if (profile.pauseIntention.trim().length > 120) {
    errors.pauseIntention =
      "Keep your pause intention within 120 characters.";
  }

  return errors;
}