"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Music2 } from "lucide-react";
import { useAppData } from "../lib/context/AppContext";

export default function RootPage() {
  const router = useRouter();
  const { loading, onboardingComplete } = useAppData();

  useEffect(() => {
    if (loading) return;
    router.replace(onboardingComplete ? "/home" : "/onboarding/genres");
  }, [loading, onboardingComplete, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-plum/20" />
        <span className="relative flex h-11 w-11 animate-pulse-soft items-center justify-center rounded-full bg-plum shadow-elevated">
          <Music2 size={20} className="text-white" />
        </span>
      </div>
      <p className="animate-fade-in-up font-display text-lg font-semibold text-plum-deep">
        Rhythms of Relief
      </p>
    </div>
  );
}