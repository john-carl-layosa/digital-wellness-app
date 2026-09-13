"use client";

import React, { useState } from "react";
import { Check, Lock, ChevronDown, ChevronUp } from "lucide-react";
import {
  BEFORE_PAUSE_FEELINGS,
  BEFORE_PAUSE_NEEDS_FROM_BREAK,
  FEELING_EMOJI,
} from "../../../lib/data/options";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useAppData } from "../../../lib/context/AppContext";

type Stage = "before" | "after" | "done";

function EmojiChip({
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
      aria-pressed={selected}
      className={`press-scale flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-medium ${
        selected
          ? "border-plum bg-plum text-white shadow-soft"
          : "border-line bg-surface text-ink hover:border-plum/50"
      } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25`}
    >
      <span className="text-xl leading-none">{FEELING_EMOJI[label as keyof typeof FEELING_EMOJI]}</span>
      {label}
    </button>
  );
}

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
      aria-pressed={selected}
      className={`press-scale rounded-full border px-3.5 py-2 text-sm font-medium ${
        selected
          ? "border-plum bg-plum text-white shadow-soft"
          : "border-line bg-surface text-ink hover:border-plum/50"
      } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25`}
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
        className="w-full rounded-xl border border-line bg-canvasAlt p-3 text-[15px] text-ink outline-none transition-all placeholder:text-inkSoft/70 focus:border-plum focus:ring-4 focus:ring-plum/15"
      />
    </div>
  );
}

export default function PausePage() {
  const { addPauseReflection, pauseReflections } = useAppData();
  const [stage, setStage] = useState<Stage>("before");
  const [saving, setSaving] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [feeling, setFeeling] = useState<string | null>(null);
  const [needFromBreak, setNeedFromBreak] = useState<string | null>(null);
  const [noticed, setNoticed] = useState("");
  const [musicMadeMeFeel, setMusicMadeMeFeel] = useState("");
  const [rightNowINeed, setRightNowINeed] = useState("");

  const beforeComplete = stage !== "before";

  const resetForm = () => {
    setFeeling(null);
    setNeedFromBreak(null);
    setNoticed("");
    setMusicMadeMeFeel("");
    setRightNowINeed("");
    setStage("before");
  };

  const saveReflection = () => {
    setSaving(true);
    setTimeout(() => {
      addPauseReflection({
        feeling: feeling ?? "Okay",
        needFromBreak: needFromBreak ?? "",
        noticed,
        musicMadeMeFeel,
        rightNowINeed,
      });
      setSaving(false);
      setStage("done");
    }, 450);
  };

  const visibleReflections = showAll ? pauseReflections : pauseReflections.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl">
      <ScreenHeader title="My Pause" subtitle="Your space to be honest with yourself." />

      {stage === "done" ? (
        <div className="flex flex-col items-center rounded-2xl border border-line bg-surface py-14 text-center shadow-soft">
          <div className="mb-4 flex h-14 w-14 animate-pop-in items-center justify-center rounded-full bg-success shadow-soft">
            <Check size={26} className="text-white" />
          </div>
          <h2 className="animate-fade-in-up font-display text-2xl font-semibold text-ink">
            Your pause is complete.
          </h2>
          <p className="mt-1 animate-fade-in-up stagger-1 italic text-inkSoft">
            You&apos;re still doing great.
          </p>
          <PrimaryButton onClick={resetForm} className="mt-6 animate-fade-in-up stagger-2">
            Start Another Pause
          </PrimaryButton>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Before I Listen */}
          <div
            className={`animate-fade-in-up rounded-2xl border p-5 shadow-soft transition-colors ${
              beforeComplete ? "border-success/40 bg-success/5" : "border-line bg-surface"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Before I Listen</h2>
              {beforeComplete && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
                  <Check size={13} />
                </span>
              )}
            </div>

            {!beforeComplete ? (
              <>
                <p className="mb-2 text-sm font-semibold text-ink">Right now, I feel…</p>
                <div className="grid grid-cols-3 gap-2">
                  {BEFORE_PAUSE_FEELINGS.map((f) => (
                    <EmojiChip key={f} label={f} selected={feeling === f} onClick={() => setFeeling(f)} />
                  ))}
                </div>

                <p className="mb-2 mt-5 text-sm font-semibold text-ink">What do I need from this break?</p>
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
                  className="mt-6 w-full"
                >
                  Begin My Pause
                </PrimaryButton>
              </>
            ) : (
              <div className="space-y-2 text-sm text-inkSoft">
                <p>
                  Feeling: <span className="font-semibold text-plum-deep">{feeling}</span>
                </p>
                {needFromBreak && (
                  <p>
                    Needed: <span className="font-semibold text-plum-deep">{needFromBreak}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* After Listening */}
          <div
            className={`animate-fade-in-up stagger-1 rounded-2xl border p-5 shadow-soft transition-opacity ${
              beforeComplete ? "border-line bg-surface" : "border-line bg-canvasAlt opacity-60"
            }`}
          >
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">After Listening</h2>

            {!beforeComplete ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-inkSoft">
                <Lock size={20} />
                <p className="text-sm">Complete &quot;Before I Listen&quot; first.</p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-inkSoft">
                  Take your time. When you&apos;re ready, come back and reflect — this stays private.
                </p>

                <Field label="I noticed that…" value={noticed} onChange={setNoticed} />
                <Field
                  label="The music made me think / feel…"
                  value={musicMadeMeFeel}
                  onChange={setMusicMadeMeFeel}
                />
                <Field label="Right now, I need…" value={rightNowINeed} onChange={setRightNowINeed} />

                <PrimaryButton onClick={saveReflection} loading={saving} className="mt-2 w-full">
                  Save Reflection
                </PrimaryButton>
                <PrimaryButton
                  variant="outline"
                  onClick={() => setStage("done")}
                  disabled={saving}
                  className="mt-3 w-full"
                >
                  Skip
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      )}

      {pauseReflections.length > 0 && (
        <div className="mt-10 animate-fade-in-up">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Previous Reflections</h2>
            {pauseReflections.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="press-scale flex items-center gap-1 rounded-full bg-plum px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-plum-deep"
              >
                {showAll ? "Show Less" : "View All"}
                {showAll ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {visibleReflections.map((r) => (
              <div
                key={r.id}
                className="lift-hover rounded-xl border border-line bg-surface p-4 hover:border-plum/30"
              >
                <p className="font-semibold text-plum-deep">
                  {FEELING_EMOJI[r.feeling as keyof typeof FEELING_EMOJI] ?? ""} {r.feeling}
                </p>
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