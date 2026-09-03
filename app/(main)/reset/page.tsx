"use client";

import React, { useState } from "react";
import { Music2 } from "lucide-react";
import { RESET_TAKEAWAYS } from "../../../lib/data/options";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useAppData } from "../../../lib/context/AppContext";

export default function ResetPage() {
  const { addResetEntry, resetEntries } = useAppData();
  const [takeaway, setTakeaway] = useState<string | null>(null);
  const [nextSmallAct, setNextSmallAct] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    addResetEntry({ takeaway: takeaway ?? "", nextSmallAct });
    setSaved(true);
  };

  const startOver = () => {
    setTakeaway(null);
    setNextSmallAct("");
    setSaved(false);
  };

  if (saved) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-plum">
          <Music2 size={26} className="text-white" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink">Your reset is saved.</h1>
        <p className="mt-1.5 italic text-inkSoft">&quot;Take your rhythm with you.&quot;</p>
        <PrimaryButton onClick={startOver} className="mt-8">
          Done
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="My Reset" subtitle="Take your rhythm with you." />

      <p className="mb-4 font-semibold text-ink">
        What would you like to remember from today&apos;s pause?
      </p>
      <div className="space-y-2">
        {RESET_TAKEAWAYS.map((t) => {
          const active = takeaway === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTakeaway(t)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                active ? "border-plum bg-plum-soft" : "border-line bg-surface hover:border-plum/50"
              }`}
            >
              <span
                className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 ${
                  active ? "border-plum bg-plum" : "border-line"
                }`}
              />
              <span className={`text-[15px] ${active ? "font-semibold text-plum-deep" : "text-ink"}`}>
                {t}
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-ink">Today&apos;s Rhythm</h2>
      <label className="mb-1.5 block text-xs font-medium text-inkSoft">
        My next small act of self-care is…
      </label>
      <textarea
        value={nextSmallAct}
        onChange={(e) => setNextSmallAct(e.target.value)}
        placeholder="e.g. Drinking water before my next round"
        rows={3}
        className="w-full rounded-xl border border-line bg-surface p-3 text-[15px] text-ink placeholder:text-inkSoft/70 focus:border-plum focus:outline-none"
      />

      <PrimaryButton onClick={save} disabled={!takeaway} className="mt-6 w-full">
        Save My Reset
      </PrimaryButton>

      {resetEntries.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 font-display text-lg font-semibold text-ink">Your Journey</h2>
          <p className="text-sm text-inkSoft">
            You&apos;ve saved {resetEntries.length} reset{resetEntries.length === 1 ? "" : "s"}. Small
            steps count.
          </p>
        </div>
      )}
    </div>
  );
}