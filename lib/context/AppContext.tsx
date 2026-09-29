"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GENRES,
  NEEDS,
  Genre,
  Need,
} from "../data/options";
import {
  AVATAR_OPTIONS,
  DEFAULT_USER_PROFILE,
  PAUSE_FREQUENCY_OPTIONS,
  PAUSE_TIME_OPTIONS,
  WELLNESS_FOCUS_OPTIONS,
  UserProfile,
} from "../data/profileOptions";
import {
  PLAYLIST_CATEGORIES,
  Playlist,
  PlaylistCategory,
} from "../data/playlists";

export type PauseReflection = {
  id: string;
  createdAt: string;
  feeling: string;
  needFromBreak: string;
  noticed?: string;
  musicMadeMeFeel?: string;
  rightNowINeed?: string;
};

export type ResetEntry = {
  id: string;
  createdAt: string;
  takeaway: string;
  nextSmallAct: string;
  when?: string;
};

type AppState = {
  schemaVersion: 3;
  onboardingComplete: boolean;
  profile: UserProfile;
  favoriteGenres: Genre[];
  defaultNeed: Need | null;
  playlists: Playlist[];
  pauseReflections: PauseReflection[];
  resetEntries: ResetEntry[];
};

type AppContextValue = AppState & {
  loading: boolean;
  completeOnboarding: (
    genres: Genre[],
    need: Need
  ) => void;
  updatePreferences: (
    genres: Genre[],
    need: Need
  ) => void;
  updateProfile: (profile: UserProfile) => void;
  addPlaylist: (playlist: Playlist) => void;
  updatePlaylist: (
    id: string,
    updates: Pick<
      Playlist,
      "name" | "description" | "category"
    >
  ) => void;
  deletePlaylist: (id: string) => void;
  movePlaylist: (
    id: string,
    direction: "up" | "down"
  ) => void;
  addPauseReflection: (
    reflection: Omit<
      PauseReflection,
      "id" | "createdAt"
    >
  ) => void;
  addResetEntry: (
    entry: Omit<ResetEntry, "id" | "createdAt">
  ) => void;
  deletePauseReflection: (id: string) => void;
  deleteResetEntry: (id: string) => void;
  resetAllData: () => void;
};

const STORAGE_KEY = "rhythms-of-relief:v1";

const createDefaultState = (): AppState => ({
  schemaVersion: 3,
  onboardingComplete: false,
  profile: {
    ...DEFAULT_USER_PROFILE,
    wellnessFocus: [],
  },
  favoriteGenres: [],
  defaultNeed: null,
  playlists: [],
  pauseReflections: [],
  resetEntries: [],
});

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeProfile(value: unknown): UserProfile {
  const raw = isRecord(value) ? value : {};
  const avatarValues = AVATAR_OPTIONS.map(
    (option) => option.value
  );
  const focusValues = WELLNESS_FOCUS_OPTIONS.map(
    (option) => option.value
  );
  const pauseTimeValues = PAUSE_TIME_OPTIONS.map(
    (option) => option.value
  );
  const pauseFrequencyValues =
    PAUSE_FREQUENCY_OPTIONS.map(
      (option) => option.value
    );

  return {
    fullName:
      typeof raw.fullName === "string"
        ? raw.fullName
        : "",
    preferredName:
      typeof raw.preferredName === "string"
        ? raw.preferredName
        : "",
    avatar:
      typeof raw.avatar === "string" &&
      avatarValues.includes(
        raw.avatar as UserProfile["avatar"]
      )
        ? (raw.avatar as UserProfile["avatar"])
        : DEFAULT_USER_PROFILE.avatar,
    avatarImage:
      typeof raw.avatarImage === "string" &&
      raw.avatarImage.startsWith("data:image/")
        ? raw.avatarImage
        : null,
    wellnessFocus: Array.isArray(
      raw.wellnessFocus
    )
      ? raw.wellnessFocus.filter(
          (
            value
          ): value is UserProfile["wellnessFocus"][number] =>
            typeof value === "string" &&
            focusValues.includes(
              value as UserProfile["wellnessFocus"][number]
            )
        )
      : [],
    pauseTime:
      typeof raw.pauseTime === "string" &&
      pauseTimeValues.includes(
        raw.pauseTime as NonNullable<
          UserProfile["pauseTime"]
        >
      )
        ? (raw.pauseTime as NonNullable<
            UserProfile["pauseTime"]
          >)
        : null,
    pauseFrequency:
      typeof raw.pauseFrequency === "string" &&
      pauseFrequencyValues.includes(
        raw.pauseFrequency as NonNullable<
          UserProfile["pauseFrequency"]
        >
      )
        ? (raw.pauseFrequency as NonNullable<
            UserProfile["pauseFrequency"]
          >)
        : null,
    pauseIntention:
      typeof raw.pauseIntention === "string"
        ? raw.pauseIntention
        : "",
  };
}

function normalizeStoredState(
  value: unknown
): AppState {
  const raw = isRecord(value) ? value : {};

  const favoriteGenres = Array.isArray(
    raw.favoriteGenres
  )
    ? raw.favoriteGenres.filter(
        (value): value is Genre =>
          typeof value === "string" &&
          GENRES.includes(value as Genre)
      )
    : [];

  const defaultNeed =
    typeof raw.defaultNeed === "string" &&
    NEEDS.includes(raw.defaultNeed as Need)
      ? (raw.defaultNeed as Need)
      : null;

  const playlists = Array.isArray(raw.playlists)
    ? raw.playlists.flatMap(
        (value): Playlist[] => {
          if (!isRecord(value)) {
            return [];
          }

          const category = value.category;

          if (
            typeof value.id !== "string" ||
            typeof value.spotifyId !== "string" ||
            typeof value.spotifyUrl !== "string" ||
            typeof value.name !== "string" ||
            typeof category !== "string" ||
            !PLAYLIST_CATEGORIES.includes(
              category as PlaylistCategory
            )
          ) {
            return [];
          }

          return [
            {
              id: value.id,
              spotifyId: value.spotifyId,
              spotifyUrl: value.spotifyUrl,
              name: value.name,
              originalName:
                typeof value.originalName === "string"
                  ? value.originalName
                  : value.name,
              description:
                typeof value.description === "string"
                  ? value.description
                  : "",
              category:
                category as PlaylistCategory,
              coverImage:
                typeof value.coverImage === "string"
                  ? value.coverImage
                  : null,
              trackCount:
                typeof value.trackCount === "number"
                  ? value.trackCount
                  : null,
              ownerName:
                typeof value.ownerName === "string"
                  ? value.ownerName
                  : null,
              addedAt:
                typeof value.addedAt === "string"
                  ? value.addedAt
                  : new Date().toISOString(),
            },
          ];
        }
      )
    : [];

  return {
    ...createDefaultState(),
    onboardingComplete:
      raw.onboardingComplete === true,
    profile: normalizeProfile(raw.profile),
    favoriteGenres,
    defaultNeed,
    playlists,
    pauseReflections: Array.isArray(
      raw.pauseReflections
    )
      ? (raw.pauseReflections as PauseReflection[])
      : [],
    resetEntries: Array.isArray(raw.resetEntries)
      ? (raw.resetEntries as ResetEntry[])
      : [],
  };
}

const AppContext =
  createContext<AppContextValue | undefined>(
    undefined
  );

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] =
    useState<AppState>(createDefaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setState(
          normalizeStoredState(JSON.parse(raw))
        );
      }
    } catch (error) {
      console.warn(
        "Failed to load stored data",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateState = (
    updater: (current: AppState) => AppState
  ) => {
    setState((current) => {
      const next = updater(current);

      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(next)
        );
      } catch (error) {
        console.warn(
          "Failed to save data",
          error
        );
      }

      return next;
    });
  };

  const completeOnboarding = (
    genres: Genre[],
    need: Need
  ) => {
    updateState((current) => ({
      ...current,
      onboardingComplete: true,
      favoriteGenres: genres,
      defaultNeed: need,
    }));
  };

  const updatePreferences = (
    genres: Genre[],
    need: Need
  ) => {
    updateState((current) => ({
      ...current,
      favoriteGenres: genres,
      defaultNeed: need,
    }));
  };

  const updateProfile = (
    profile: UserProfile
  ) => {
    updateState((current) => ({
      ...current,
      profile,
    }));
  };

  const addPlaylist = (playlist: Playlist) => {
    updateState((current) => ({
      ...current,
      playlists: [
        ...current.playlists,
        playlist,
      ],
    }));
  };

  const updatePlaylist = (
    id: string,
    updates: Pick<
      Playlist,
      "name" | "description" | "category"
    >
  ) => {
    updateState((current) => ({
      ...current,
      playlists: current.playlists.map(
        (playlist) =>
          playlist.id === id
            ? {
                ...playlist,
                ...updates,
              }
            : playlist
      ),
    }));
  };

  const deletePlaylist = (id: string) => {
    updateState((current) => ({
      ...current,
      playlists: current.playlists.filter(
        (playlist) => playlist.id !== id
      ),
    }));
  };

  const movePlaylist = (
    id: string,
    direction: "up" | "down"
  ) => {
    updateState((current) => {
      const index = current.playlists.findIndex(
        (playlist) => playlist.id === id
      );

      const nextIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        index < 0 ||
        nextIndex < 0 ||
        nextIndex >= current.playlists.length
      ) {
        return current;
      }

      const playlists = [
        ...current.playlists,
      ];

      [playlists[index], playlists[nextIndex]] = [
        playlists[nextIndex],
        playlists[index],
      ];

      return {
        ...current,
        playlists,
      };
    });
  };

  const addPauseReflection = (
    reflection: Omit<
      PauseReflection,
      "id" | "createdAt"
    >
  ) => {
    const entry: PauseReflection = {
      ...reflection,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    updateState((current) => ({
      ...current,
      pauseReflections: [
        entry,
        ...current.pauseReflections,
      ],
    }));
  };

  const addResetEntry = (
    resetEntry: Omit<
      ResetEntry,
      "id" | "createdAt"
    >
  ) => {
    const entry: ResetEntry = {
      ...resetEntry,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    updateState((current) => ({
      ...current,
      resetEntries: [
        entry,
        ...current.resetEntries,
      ],
    }));
  };

  const deletePauseReflection = (
    id: string
  ) => {
    updateState((current) => ({
      ...current,
      pauseReflections:
        current.pauseReflections.filter(
          (reflection) =>
            reflection.id !== id
        ),
    }));
  };

  const deleteResetEntry = (id: string) => {
    updateState((current) => ({
      ...current,
      resetEntries:
        current.resetEntries.filter(
          (entry) => entry.id !== id
        ),
    }));
  };

  const resetAllData = () => {
    updateState(() => createDefaultState());
  };

  const value = useMemo(
    () => ({
      ...state,
      loading,
      completeOnboarding,
      updatePreferences,
      updateProfile,
      addPlaylist,
      updatePlaylist,
      deletePlaylist,
      movePlaylist,
      addPauseReflection,
      addResetEntry,
      deletePauseReflection,
      deleteResetEntry,
      resetAllData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, loading]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppData must be used within AppProvider"
    );
  }

  return context;
}