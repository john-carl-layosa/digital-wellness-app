"use client";

import React from "react";
import {
  Headphones,
  Plus,
} from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";

type Props = {
  onAdd?: () => void;
  compact?: boolean;
};

export function PlaylistEmptyState({
  onAdd,
  compact = false,
}: Props) {
  return (
    <div
      className={`rounded-3xl border border-dashed border-plum/35 bg-surface text-center ${
        compact ? "p-6" : "px-6 py-10"
      }`}
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-plum-soft text-plum">
        <Headphones size={22} />
      </span>

      <h3 className="mt-3 font-display text-xl font-semibold text-ink">
        Build your music space
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-inkSoft">
        Add any accessible Spotify playlist and
        organize it around the moments when you
        need it.
      </p>

      {onAdd && (
        <PrimaryButton
          onClick={onAdd}
          icon={<Plus size={16} />}
          className="mt-5"
        >
          Add from Spotify
        </PrimaryButton>
      )}
    </div>
  );
}