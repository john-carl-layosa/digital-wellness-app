"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    const registerServiceWorker =
      async () => {
        try {
          const registration =
            await navigator.serviceWorker.register(
              "/sw.js",
              {
                scope: "/",
              }
            );

          if (registration.waiting) {
            registration.waiting.postMessage({
              type: "SKIP_WAITING",
            });
          }

          registration.addEventListener(
            "updatefound",
            () => {
              const worker =
                registration.installing;

              if (!worker) {
                return;
              }

              worker.addEventListener(
                "statechange",
                () => {
                  if (
                    worker.state ===
                      "installed" &&
                    navigator.serviceWorker
                      .controller
                  ) {
                    worker.postMessage({
                      type: "SKIP_WAITING",
                    });
                  }
                }
              );
            }
          );
        } catch (error) {
          console.warn(
            "Service worker registration failed",
            error
          );
        }
      };

    window.addEventListener(
      "load",
      registerServiceWorker
    );

    return () => {
      window.removeEventListener(
        "load",
        registerServiceWorker
      );
    };
  }, []);

  return null;
}