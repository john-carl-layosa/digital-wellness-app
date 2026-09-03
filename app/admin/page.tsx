"use client";

import React from "react";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppData } from "../../lib/context/AppContext";

const DEMO_METRICS = [
  { label: "App Visits", value: "284" },
  { label: "Unique Visitors", value: "196" },
  { label: "Playlist Clicks", value: "612" },
  { label: "Reflections Saved", value: "158" },
  { label: "My Reset Saved", value: "132" },
  { label: "QR Scans", value: "217" },
];

const DEMO_ACTIVITY = [
  "10:04 AM — Opened Home — Web",
  "10:25 AM — Selected Unwind — Web",
  "10:35 AM — Played OPM Unwind — Web",
  "10:57 AM — Saved My Pause — Web",
  "10:58 AM — Saved My Reset — Web",
];

export default function AdminPage() {
  const { pauseReflections, resetEntries } = useAppData();

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl bg-canvas px-6 py-10">
      <ScreenHeader
        title="RHYTHMS OF RELIEF"
        subtitle="Program Overview — Researcher / Admin"
        showBack
        backHref="/home"
      />

      <span className="mb-6 inline-block rounded-full bg-gold/25 px-3.5 py-1.5 text-xs font-bold text-plum-deeper">
        DEMO / PROTOTYPE DATA
      </span>

      <div className="grid grid-cols-2 gap-3">
        {DEMO_METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-line bg-surface p-4">
            <p className="font-display text-2xl font-semibold text-plum-deep">{m.value}</p>
            <p className="mt-0.5 text-xs text-inkSoft">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">Most Popular Playlist</h2>
        <p className="font-semibold text-plum-deep">OPM Unwind — 42%</p>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">Recent Activity (Demo)</h2>
        {DEMO_ACTIVITY.map((line) => (
          <p key={line} className="mb-1 text-sm text-inkSoft">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-line bg-surface p-4">
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">
          This Browser (Real, Local Only)
        </h2>
        <p className="mb-1 text-sm text-inkSoft">
          Pause reflections saved: {pauseReflections.length}
        </p>
        <p className="mb-1 text-sm text-inkSoft">Reset entries saved: {resetEntries.length}</p>
        <p className="mt-2 text-xs text-inkSoft">
          Data on this screen is stored locally in this browser only, for prototype purposes.
        </p>
      </div>
    </div>
  );
}