"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppData } from "../lib/context/AppContext";

export default function RootPage() {
  const router = useRouter();
  const { loading, onboardingComplete } = useAppData();

  useEffect(() => {
    if (loading) return;
    router.replace(onboardingComplete ? "/home" : "/onboarding/genres");
  }, [loading, onboardingComplete, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas">
      <Loader2 className="h-8 w-8 animate-spin text-plum" />
      <p className="font-display text-lg font-semibold text-plum-deep">Rhythms of Relief</p>
    </div>
  );
}