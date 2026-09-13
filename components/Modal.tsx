"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
};

export function Modal({ open, onClose, title, children, widthClassName = "max-w-md" }: Props) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  // Mount immediately on open; on close, keep mounted briefly so the
  // exit animation can play before actually unmounting.
  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
      const t = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, 180);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape to close + lock background scroll while open.
  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const markup = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className={`absolute inset-0 bg-plum-deeper/50 backdrop-blur-sm ${
          closing ? "animate-fade-out" : "animate-fade-in"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal-panel relative mx-auto flex w-full flex-col overflow-hidden rounded-3xl bg-canvas shadow-elevated ${widthClassName} ${
          closing ? "animate-scale-out" : "animate-scale-in"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
          {title ? (
            <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="press-scale flex h-8 w-8 items-center justify-center rounded-full text-plum-deep hover:bg-plum-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );

  // Portal to document.body: any transform/animation on an ancestor (e.g. the
  // page's `animate-fade-in-up` wrapper) creates a new containing block for
  // `position: fixed` descendants, so a fixed modal nested inside one no
  // longer centers on the real viewport — it centers on that ancestor's box
  // instead, which is why it only looked "centered" after scrolling. Portaling
  // straight to <body> sidesteps that entirely.
  if (typeof document === "undefined") return null;
  return createPortal(markup, document.body);
}