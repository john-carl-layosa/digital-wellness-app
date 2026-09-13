"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, RotateCcw, TrendingUp, Sparkles, ArrowRight, Trash2 } from "lucide-react";
import { useAppData } from "../../../lib/context/AppContext";
import { FEELING_EMOJI } from "../../../lib/data/options";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ConfirmDialog } from "../../../components/ConfirmDialog";

type TimelineItem = {
  id: string;
  type: "pause" | "reset";
  createdAt: string;
  title: string;
  detail?: string;
};

export default function JourneyPage() {
  const { pauseReflections, resetEntries, deletePauseReflection, deleteResetEntry } = useAppData();

  const [pendingDelete, setPendingDelete] = useState<{ type: "pause" | "reset"; id: string } | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const timeline: TimelineItem[] = useMemo(() => {
    const pauses: TimelineItem[] = pauseReflections.map((r) => ({
      id: r.id,
      type: "pause",
      createdAt: r.createdAt,
      title: `Felt ${r.feeling.toLowerCase()}`,
      detail: r.noticed || r.needFromBreak || undefined,
    }));
    const resets: TimelineItem[] = resetEntries.map((r) => ({
      id: r.id,
      type: "reset",
      createdAt: r.createdAt,
      title: r.takeaway || "Saved a reset",
      detail: r.nextSmallAct || undefined,
    }));
    return [...pauses, ...resets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [pauseReflections, resetEntries]);

  const mostCommonFeeling = useMemo(() => {
    if (!pauseReflections.length) return null;
    const counts = new Map<string, number>();
    pauseReflections.forEach((r) => counts.set(r.feeling, (counts.get(r.feeling) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }, [pauseReflections]);

  const stats = [
    { label: "Total Pauses", value: pauseReflections.length, icon: Heart },
    { label: "Total Resets", value: resetEntries.length, icon: RotateCcw },
    {
      label: "Most Common Feeling",
      value: mostCommonFeeling
        ? `${FEELING_EMOJI[mostCommonFeeling as keyof typeof FEELING_EMOJI] ?? ""} ${mostCommonFeeling}`
        : "—",
      icon: TrendingUp,
    },
  ];

  const isEmpty = timeline.length === 0;

  const requestDelete = (type: "pause" | "reset", id: string) => setPendingDelete({ type, id });

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;
    setDeletingId(id);
    // Brief fade-out before it actually leaves the list, so the removal reads
    // as an intentional action rather than an abrupt disappearance.
    setTimeout(() => {
      if (type === "pause") deletePauseReflection(id);
      else deleteResetEntry(id);
      setDeletingId(null);
    }, 180);
    setPendingDelete(null);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <ScreenHeader title="My Journey" subtitle="Your progress, one pause at a time." />

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 60}ms` }}
              className="lift-hover animate-fade-in-up rounded-2xl border border-line bg-surface p-4 shadow-soft"
            >
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-plum-soft">
                <Icon size={16} className="text-plum" />
              </span>
              <p className="font-display text-2xl font-semibold text-plum-deep">{s.value}</p>
              <p className="mt-0.5 text-xs text-inkSoft">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 animate-fade-in-up font-display text-lg font-semibold text-ink">
          Recent Activity
        </h2>

        {isEmpty ? (
          <div className="flex animate-fade-in-up flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-canvasAlt p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-plum-soft">
              <Sparkles size={22} className="text-plum" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Your journey starts here.</p>
              <p className="mt-1 text-sm text-inkSoft">
                Save a pause reflection or a reset to see your progress build up over time.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/pause">
                <PrimaryButton icon={<Heart size={16} />}>Start a Pause</PrimaryButton>
              </Link>
              <Link href="/reset">
                <PrimaryButton variant="outline" icon={<RotateCcw size={16} />}>
                  Save a Reset
                </PrimaryButton>
              </Link>
            </div>
          </div>
        ) : (
          <ol className="relative space-y-4 border-l-2 border-line pl-6">
            {timeline.map((item, i) => {
              const Icon = item.type === "pause" ? Heart : RotateCcw;
              const isLeaving = deletingId === item.id;
              return (
                <li
                  key={`${item.type}-${item.id}`}
                  style={{ animationDelay: isLeaving ? undefined : `${i * 40}ms` }}
                  className={`transition-all duration-150 ${
                    isLeaving ? "scale-95 opacity-0" : "animate-fade-in-up opacity-100"
                  }`}
                >
                  <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-plum text-white">
                    <Icon size={11} />
                  </span>
                  <div className="lift-hover group flex items-start justify-between gap-3 rounded-xl border border-line bg-surface p-4 hover:border-plum/30">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-plum-deep">{item.title}</p>
                        <span className="text-xs uppercase tracking-wide text-inkSoft">{item.type}</span>
                      </div>
                      {item.detail && <p className="mt-1 italic text-inkSoft">&quot;{item.detail}&quot;</p>}
                      <p className="mt-2 text-xs text-inkSoft">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => requestDelete(item.type, item.id)}
                      aria-label="Delete this activity"
                      className="press-scale flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-inkSoft hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/20"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {!isEmpty && (
        <Link
          href="/my-rhythm"
          className="press-scale group mt-8 flex animate-fade-in-up items-center justify-between rounded-2xl border border-line bg-plum-soft p-4"
        >
          <p className="text-sm font-semibold text-plum-deeper">Keep the rhythm going — find your next playlist</p>
          <ArrowRight size={18} className="text-plum-deep transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this activity?"
        description="Are you sure you want to delete this activity? This can't be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}