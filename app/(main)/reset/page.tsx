"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Music2, ArrowRight, Map } from "lucide-react";
import { RESET_TAKEAWAYS, RESET_WHEN_OPTIONS } from "../../../lib/data/options";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useAppData } from "../../../lib/context/AppContext";

export default function ResetPage() {
  const { addResetEntry, resetEntries } = useAppData();
  const [takeaway, setTakeaway] = useState<string | null>(null);
  const [nextSmallAct, setNextSmallAct] = useState("");
  const [when, setWhen] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      addResetEntry({ takeaway: takeaway ?? "", nextSmallAct, when: when ?? undefined });
      setSaving(false);
      setSaved(true);
    }, 450);
  };

  const startOver = () => {
    setTakeaway(null);
    setNextSmallAct("");
    setWhen(null);
    setSaved(false);
  };

  if (saved) {
    return (
      <div className="mx-auto flex max-w-3xl min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 animate-pop-in items-center justify-center rounded-full bg-plum shadow-elevated">
          <Music2 size={26} className="text-white" />
        </div>
        <h1 className="animate-fade-in-up font-display text-3xl font-semibold text-ink">
          Your reset is saved.
        </h1>
        <p className="mt-1.5 animate-fade-in-up stagger-1 italic text-inkSoft">
          &quot;Take your rhythm with you.&quot;
        </p>
        <div className="mt-8 flex animate-fade-in-up stagger-2 flex-col gap-3 sm:flex-row">
          <PrimaryButton onClick={startOver}>Done</PrimaryButton>
          <Link href="/journey">
            <PrimaryButton variant="outline" icon={<Map size={16} />}>
              View My Journey
            </PrimaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ScreenHeader title="My Reset" subtitle="Take the lesson. Keep the rhythm." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="animate-fade-in-up rounded-2xl border border-line bg-surface p-5 shadow-soft">
          <p className="mb-4 font-semibold text-ink">Today, I will remember…</p>
          <div className="space-y-2">
            {RESET_TAKEAWAYS.map((t, i) => {
              const active = takeaway === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTakeaway(t)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={`press-scale flex w-full animate-fade-in-up items-center gap-3 rounded-xl border p-3.5 text-left ${
                    active
                      ? "border-plum bg-plum-soft shadow-soft"
                      : "border-line bg-canvasAlt hover:border-plum/50"
                  } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25`}
                >
                  <span
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      active ? "border-plum bg-plum" : "border-line"
                    }`}
                  >
                    {active && <span className="h-2 w-2 animate-scale-in rounded-sm bg-white" />}
                  </span>
                  <span className={`text-sm ${active ? "font-semibold text-plum-deep" : "text-ink"}`}>
                    {t}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="animate-fade-in-up stagger-1 rounded-2xl border border-line bg-surface p-5 shadow-soft">
          <p className="mb-2 font-semibold text-ink">My Next Small Act of Self-Care</p>
          <label className="mb-1.5 block text-xs font-medium text-inkSoft">I will…</label>
          <textarea
            value={nextSmallAct}
            onChange={(e) => setNextSmallAct(e.target.value)}
            placeholder="e.g. Drinking water before my next round"
            rows={3}
            className="w-full rounded-xl border border-line bg-canvasAlt p-3 text-[15px] text-ink outline-none transition-all placeholder:text-inkSoft/70 focus:border-plum focus:ring-4 focus:ring-plum/15"
          />

          <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-inkSoft">When?</p>
          <div className="space-y-2">
            {RESET_WHEN_OPTIONS.map((w) => {
              const active = when === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWhen(w)}
                  className={`press-scale flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                    active ? "border-plum bg-plum-soft" : "border-line bg-canvasAlt hover:border-plum/50"
                  } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25`}
                >
                  <span
                    className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-plum bg-plum" : "border-line"
                    }`}
                  >
                    {active && <span className="h-[6px] w-[6px] rounded-full bg-white" />}
                  </span>
                  <span className={`text-sm ${active ? "font-semibold text-plum-deep" : "text-ink"}`}>
                    {w}
                  </span>
                </button>
              );
            })}
          </div>

          <PrimaryButton onClick={save} disabled={!takeaway} loading={saving} className="mt-6 w-full">
            Save My Reset
          </PrimaryButton>
        </div>
      </div>

      <Link
        href="/journey"
        className="press-scale group mt-6 flex animate-fade-in-up items-center justify-between rounded-2xl border border-line bg-plum-soft p-4"
      >
        <div>
          <p className="font-display text-sm font-semibold text-plum-deeper">My Journey</p>
          <p className="mt-0.5 text-xs text-plum-deep">
            You&apos;ve saved {resetEntries.length} reset{resetEntries.length === 1 ? "" : "s"}. See your
            progress over time.
          </p>
        </div>
        <ArrowRight
          size={18}
          className="shrink-0 text-plum-deep transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}