"use client";

import { useSyncExternalStore } from "react";

/** What we keep locally about a playlist. The edit token is the only copy that
 *  will ever exist — unrecoverable by design, because there is no account to
 *  recover it against. Absent means we imported it and can only read. */
export type Saved = { code: string; title: string; editToken?: string };

const KEY = "lokey:playlists";
const EMPTY: Saved[] = [];

// localStorage is an external store, so it gets read through
// useSyncExternalStore rather than copied into state by an effect. That is not
// pedantry: it removes a render-then-correct flash, and it makes the list stay
// honest across two open tabs for free.
const listeners = new Set<() => void>();

// getSnapshot must return a stable reference or React re-renders forever, so
// the parsed value is cached against the raw string it came from.
let cachedRaw: string | null = null;
let cached: Saved[] = EMPTY;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Saved[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY; // storage disabled (private mode, blocked cookies)
  }
  if (raw === cachedRaw) return cached;

  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed)
      ? parsed.filter(
          (p): p is Saved =>
            typeof p === "object" && p !== null && typeof (p as Saved).code === "string",
        )
      : EMPTY;
  } catch {
    cached = EMPTY; // corrupt storage reads as empty rather than throwing
  }
  return cached;
}

/** The server has no localStorage, so it renders the empty list and the client
 *  agrees on first paint. No hydration mismatch. */
function getServerSnapshot(): Saved[] {
  return EMPTY;
}

export function useSavedPlaylists(): Saved[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function rememberPlaylist(entry: Saved) {
  const kept = getSnapshot().filter((p) => p.code !== entry.code);
  try {
    localStorage.setItem(KEY, JSON.stringify([entry, ...kept].slice(0, 50)));
  } catch {
    return; // out of quota or storage disabled — nothing else to do
  }
  // `storage` only fires in *other* tabs, so this tab is told directly.
  for (const listener of listeners) listener();
}
