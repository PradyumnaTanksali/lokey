"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "./queue";
import { displayArtist, displayTitle, step } from "./player";
import { useYouTube } from "./useYouTube";

/** Queue state, keyboard, Media Session, and dead-track recovery — everything
 *  every page shares. The markup is where the pages actually differ. */
export function useQueue(tracks: Track[]) {
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  // Flips on first play, so moving through the queue keeps the music going.
  const started = useRef(false);

  const skip = useCallback(
    (dir: number) => setIndex((i) => step(i, tracks.length, dir)),
    [tracks.length],
  );

  const yt = useYouTube({
    onEnded: () => skip(1),
    onError: () => {
      setNotice("That one won't embed. Skipping.");
      skip(1);
    },
  });

  const { ready, playing, elapsed, duration, load, play, pause, seek } = yt;
  const track = tracks[index];

  // A new list is a new queue. Adjusted during render rather than in an effect
  // so the first paint is already on track 0 — no flash of the old room's song.
  const [seenTracks, setSeenTracks] = useState(tracks);
  if (seenTracks !== tracks) {
    setSeenTracks(tracks);
    setIndex(0);
  }

  useEffect(() => {
    if (ready) load(track.yt, started.current);
  }, [ready, load, track.yt]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(id);
  }, [notice]);

  const toggle = useCallback(() => {
    started.current = true;
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  const pick = useCallback(
    (next: number) => {
      started.current = true;
      if (next === index) toggle();
      else setIndex(next);
    },
    [index, toggle],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowRight") skip(1);
      else if (e.key === "ArrowLeft") skip(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, skip]);

  // ─── Media Session ────────────────────────────────────────────────────────
  // Worth being straight about what this buys: it does NOT survive backgrounding
  // on mobile, because YouTube stops playback there regardless. It earns its
  // keep on desktop, where it makes the hardware media keys work, and in the
  // notification card while the tab is in front.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: displayTitle(track),
      artist: displayArtist(track),
      album: "Lokey",
      artwork: [
        { src: `https://i.ytimg.com/vi/${track.yt}/maxresdefault.jpg`, sizes: "1280x720", type: "image/jpeg" },
        { src: `https://i.ytimg.com/vi/${track.yt}/hqdefault.jpg`, sizes: "480x360", type: "image/jpeg" },
      ],
    });
  }, [track]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => { started.current = true; play(); }],
      ["pause", () => pause()],
      ["previoustrack", () => skip(-1)],
      ["nexttrack", () => skip(1)],
      ["seekto", (d) => { if (d.seekTime != null) seek(d.seekTime); }],
    ];
    for (const [action, handler] of handlers) {
      // Older engines throw on actions they don't implement rather than ignoring.
      try { ms.setActionHandler(action, handler); } catch { /* unsupported action */ }
    }
    return () => {
      for (const [action] of handlers) {
        try { ms.setActionHandler(action, null); } catch { /* unsupported action */ }
      }
    };
  }, [play, pause, skip, seek]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [playing]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
    if (!Number.isFinite(duration) || duration <= 0) return;
    // Throws if position exceeds duration, which the 4Hz poll can briefly do.
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(Math.max(elapsed, 0), duration),
        playbackRate: 1,
      });
    } catch { /* position raced past duration between polls */ }
  }, [elapsed, duration]);

  return { ...yt, index, track, notice, skip, toggle, pick };
}
