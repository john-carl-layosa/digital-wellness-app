"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Genre, Need } from "../data/options";

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
  onboardingComplete: boolean;
  favoriteGenres: Genre[];
  defaultNeed: Need | null;
  pauseReflections: PauseReflection[];
  resetEntries: ResetEntry[];
};

type AppContextValue = AppState & {
  loading: boolean;
  completeOnboarding: (genres: Genre[], need: Need) => void;
  updatePreferences: (genres: Genre[], need: Need) => void;
  addPauseReflection: (r: Omit<PauseReflection, "id" | "createdAt">) => void;
  addResetEntry: (r: Omit<ResetEntry, "id" | "createdAt">) => void;
  deletePauseReflection: (id: string) => void;
  deleteResetEntry: (id: string) => void;
  resetAllData: () => void;
};

const STORAGE_KEY = "rhythms-of-relief:v1";

const defaultState: AppState = {
  onboardingComplete: false,
  favoriteGenres: [],
  defaultNeed: null,
  pauseReflections: [],
  resetEntries: [],
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  // Load persisted state on mount (client only — localStorage isn't available during SSR)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState({ ...defaultState, ...JSON.parse(raw) });
      }
    } catch (e) {
      console.warn("Failed to load stored data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (next: AppState) => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to save data", e);
    }
  };

  const completeOnboarding = (genres: Genre[], need: Need) => {
    persist({ ...state, onboardingComplete: true, favoriteGenres: genres, defaultNeed: need });
  };

  const updatePreferences = (genres: Genre[], need: Need) => {
    persist({ ...state, favoriteGenres: genres, defaultNeed: need });
  };

  const addPauseReflection = (r: Omit<PauseReflection, "id" | "createdAt">) => {
    const entry: PauseReflection = {
      ...r,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    persist({ ...state, pauseReflections: [entry, ...state.pauseReflections] });
  };

  const addResetEntry = (r: Omit<ResetEntry, "id" | "createdAt">) => {
    const entry: ResetEntry = {
      ...r,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    persist({ ...state, resetEntries: [entry, ...state.resetEntries] });
  };

  const deletePauseReflection = (id: string) => {
    persist({ ...state, pauseReflections: state.pauseReflections.filter((r) => r.id !== id) });
  };

  const deleteResetEntry = (id: string) => {
    persist({ ...state, resetEntries: state.resetEntries.filter((r) => r.id !== id) });
  };

  const resetAllData = () => {
    persist(defaultState);
  };

  const value = useMemo(
    () => ({
      ...state,
      loading,
      completeOnboarding,
      updatePreferences,
      addPauseReflection,
      addResetEntry,
      deletePauseReflection,
      deleteResetEntry,
      resetAllData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppData must be used within AppProvider");
  return ctx;
}