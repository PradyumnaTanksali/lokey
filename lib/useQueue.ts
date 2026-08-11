"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "./queue";
import { step } from "./player";
import { useYouTube } from "./useYouTube";

/** Queue state, keyboard, and the dead-track recovery — the part both layouts
 *  share. The markup is where Room Service and Forecast actually differ. */
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

  const { ready, playing, load, play, pause } = yt;
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

  return { ...yt, index, track, notice, skip, toggle, pick };
}
