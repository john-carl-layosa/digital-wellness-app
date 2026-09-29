"use client";

import React, {
  useEffect,
  useState,
} from "react";
import {
  Download,
  MonitorDown,
  Share,
  SquarePlus,
} from "lucide-react";
import { Modal } from "./Modal";

interface BeforeInstallPromptEvent
  extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

let sharedInstallPrompt:
  | BeforeInstallPromptEvent
  | null = null;

type Props = {
  variant?: "sidebar" | "mobile";
  onAction?: () => void;
};

function isStandalone() {
  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    Boolean(
      (
        navigator as Navigator & {
          standalone?: boolean;
        }
      ).standalone
    )
  );
}

export function InstallAppButton({
  variant = "sidebar",
  onAction,
}: Props) {
  const [
    installPrompt,
    setInstallPrompt,
  ] =
    useState<BeforeInstallPromptEvent | null>(
      sharedInstallPrompt
    );

  const [installed, setInstalled] =
    useState(false);

  const [
    instructionsOpen,
    setInstructionsOpen,
  ] = useState(false);

  const [isIOS, setIsIOS] =
    useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    setIsIOS(
      /iphone|ipad|ipod/i.test(
        navigator.userAgent
      )
    );

    const handleBeforeInstall = (
      event: Event
    ) => {
      event.preventDefault();

      sharedInstallPrompt =
        event as BeforeInstallPromptEvent;

      setInstallPrompt(
        sharedInstallPrompt
      );
    };

    const handleInstalled = () => {
      setInstalled(true);
      sharedInstallPrompt = null;
      setInstallPrompt(null);
      setInstructionsOpen(false);
    };

    const displayMode =
      window.matchMedia(
        "(display-mode: standalone)"
      );

    const handleDisplayMode = () => {
      setInstalled(isStandalone());
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    displayMode.addEventListener?.(
      "change",
      handleDisplayMode
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );

      displayMode.removeEventListener?.(
        "change",
        handleDisplayMode
      );
    };
  }, []);

  if (installed) {
    return null;
  }

  const install = async () => {
    if (!installPrompt) {
      setInstructionsOpen(true);
      return;
    }

    onAction?.();

    await installPrompt.prompt();

    const choice =
      await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      sharedInstallPrompt = null;
      setInstallPrompt(null);
    }
  };

  const buttonClass =
    variant === "sidebar"
      ? "press-scale mt-5 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
      : "press-scale flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-plum-soft/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25";

  return (
    <>
      <button
        type="button"
        onClick={install}
        className={buttonClass}
      >
        <span
          className={
            variant === "sidebar"
              ? "flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-plum-soft"
              : "flex h-8 w-8 items-center justify-center rounded-full bg-plum-soft text-plum"
          }
        >
          <Download size={16} />
        </span>

        Install App
      </button>

      <Modal
        open={instructionsOpen}
        onClose={() =>
          setInstructionsOpen(false)
        }
        title="Install Rhythms of Relief"
        widthClassName="max-w-md"
      >
        {isIOS ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-inkSoft">
              Install this app from Safari
              using these steps:
            </p>

            <ol className="space-y-3 text-sm text-ink">
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-soft text-plum">
                  <Share size={16} />
                </span>

                <span className="pt-1.5">
                  Tap the{" "}
                  <strong>Share</strong>{" "}
                  button in Safari.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-soft text-plum">
                  <SquarePlus size={16} />
                </span>

                <span className="pt-1.5">
                  Choose{" "}
                  <strong>
                    Add to Home Screen
                  </strong>
                  .
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum text-sm font-bold text-white">
                  3
                </span>

                <span className="pt-1.5">
                  Tap{" "}
                  <strong>Add</strong> to
                  finish.
                </span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-plum-soft text-plum">
              <MonitorDown size={22} />
            </span>

            <div className="text-center">
              <p className="font-semibold text-ink">
                Use your browser&apos;s
                install option
              </p>

              <p className="mt-2 text-sm leading-relaxed text-inkSoft">
                Open the browser menu and
                choose{" "}
                <strong>
                  Install Rhythms of Relief
                </strong>
                ,{" "}
                <strong>
                  Install app
                </strong>
                , or{" "}
                <strong>
                  Add to Home Screen
                </strong>
                .
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}