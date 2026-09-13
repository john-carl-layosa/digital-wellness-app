"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// Replace with your real landing-page / app link before printing physical cards.
const ACCESS_URL = "https://rhythmsofrelief.app";

export default function QrAccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="flex justify-end px-6 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close"
          className="press-scale flex h-9 w-9 items-center justify-center rounded-full bg-plum-soft text-plum-deep hover:bg-plum-soft/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="animate-fade-in-up font-semibold text-plum">🎧 YOUR RHYTHM AWAITS</p>
        <h1 className="max-w-sm animate-fade-in-up stagger-1 font-display text-2xl font-semibold text-ink">
          Scan to explore your personalized music space.
        </h1>

        <div className="lift-hover my-6 animate-scale-in rounded-2xl border border-line bg-surface p-6 shadow-soft">
          <QRCodeSVG value={ACCESS_URL} size={180} fgColor="#2A1B47" bgColor="#FFFFFF" />
        </div>

        <p className="max-w-xs animate-fade-in-up stagger-2 text-sm text-inkSoft">
          This card is only an access point — the web app remains your main space to pause, listen,
          reflect, and reset.
        </p>
      </div>
    </div>
  );
}