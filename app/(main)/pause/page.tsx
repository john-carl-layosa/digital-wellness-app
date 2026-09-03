"use client";

import React, { useState } from "react";
import { Check, Headphones } from "lucide-react";
import {
  BEFORE_PAUSE_FEELINGS,
  BEFORE_PAUSE_NEEDS_FROM_BREAK,
} from "../../../lib/data/options";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useAppData } from "../../../lib/context/AppContext";

type Stage = "before" | "after" | "done";

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        selected ? "border-plum bg-plum text-white" : "border-line bg-surface text-ink hover:border-plum/50"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-inkSoft">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional"
        rows={2}
        className="w-full rounded-xl border border-line bg-surface p-3 text-[15px] text-ink placeholder:text-inkSoft/70 focus:border-plum focus:outline-none"
      />
    </div>
  );
}

export default function PausePage() {
  const { addPauseReflection, pauseReflections } = useAppData();
  const [stage, setStage] = useState<Stage>("before");

  const [feeling, setFeeling] = useState<string | null>(null);
  const [needFromBreak, setNeedFromBreak] = useState<string | null>(null);
  const [noticed, setNoticed] = useState("");
  const [musicMadeMeFeel, setMusicMadeMeFeel] = useState("");
  const [rightNowINeed, setRightNowINeed] = useState("");

  const resetForm = () => {
    setFeeling(null);
    setNeedFromBreak(null);
    setNoticed("");
    setMusicMadeMeFeel("");
    setRightNowINeed("");
    setStage("before");
  };

  const saveReflection = () => {
    addPauseReflection({
      feeling: feeling ?? "Okay",
      needFromBreak: needFromBreak ?? "",
      noticed,
      musicMadeMeFeel,
      rightNowINeed,
    });
    setStage("done");
  };

  return (
    <div>
      <ScreenHeader title="My Pause" subtitle="A moment for you." />

      {stage === "before" && (
        <>
          <p className="mb-2 mt-4 font-semibold text-ink">Right now, I feel…</p>
          <div className="flex flex-wrap gap-2">
            {BEFORE_PAUSE_FEELINGS.map((f) => (
              <Chip key={f} label={f} selected={feeling === f} onClick={() => setFeeling(f)} />
            ))}
          </div>

          <p className="mb-2 mt-6 font-semibold text-ink">What do I need from this break?</p>
          <div className="flex flex-wrap gap-2">
            {BEFORE_PAUSE_NEEDS_FROM_BREAK.map((n) => (
              <Chip
                key={n}
                label={n}
                selected={needFromBreak === n}
                onClick={() => setNeedFromBreak(n)}
              />
            ))}
          </div>

          <PrimaryButton
            onClick={() => setStage("after")}
            disabled={!feeling}
            className="mt-8 w-full"
          >
            Begin My Pause
          </PrimaryButton>
        </>
      )}

      {stage === "after" && (
        <>
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-plum-soft p-4">
            <Headphones size={18} className="mt-0.5 shrink-0 text-plum-deep" />
            <p className="text-sm text-plum-deep">
              Take your time. When you&apos;re ready, come back and reflect — this stays private.
            </p>
          </div>

          <h2 className="mb-4 font-display text-lg font-semibold text-ink">After My Pause</h2>

          <Field label="I noticed that…" value={noticed} onChange={setNoticed} />
          <Field
            label="The music made me think / feel…"
            value={musicMadeMeFeel}
            onChange={setMusicMadeMeFeel}
          />
          <Field label="Right now, I need…" value={rightNowINeed} onChange={setRightNowINeed} />

          <PrimaryButton onClick={saveReflection} className="mt-2 w-full">
            Save Reflection
          </PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => setStage("done")} className="mt-3 w-full">
            Skip
          </PrimaryButton>
        </>
      )}

      {stage === "done" && (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sage">
            <Check size={26} className="text-white" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">Your pause is complete.</h2>
          <p className="mt-1 italic text-inkSoft">You&apos;re still doing great.</p>
          <PrimaryButton onClick={resetForm} className="mt-6">
            Start Another Pause
          </PrimaryButton>
        </div>
      )}

      {pauseReflections.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Previous Reflections</h2>
          <div className="space-y-2">
            {pauseReflections.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-semibold text-plum-deep">{r.feeling}</p>
                {!!r.noticed && <p className="mt-1 italic text-inkSoft">&quot;{r.noticed}&quot;</p>}
                <p className="mt-2 text-xs text-inkSoft">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}