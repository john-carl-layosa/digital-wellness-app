import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} aria-hidden="true" />;
}

export function PlaylistCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-line bg-surface p-4 shadow-soft">
      <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-2 h-8 w-36 rounded-full" />
      </div>
    </div>
  );
}