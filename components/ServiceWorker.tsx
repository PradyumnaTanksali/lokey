"use client";

import { useEffect } from "react";

/** Registers the service worker, which is what makes the app installable —
 *  a manifest alone is not enough for Chrome to offer "Install".
 *
 *  Skipped in development: a stale worker serving cached pages is a genuinely
 *  confusing way to lose an afternoon. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failing costs installability, nothing else. The site works.
    });
  }, []);

  return null;
}
