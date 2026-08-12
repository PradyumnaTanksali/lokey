"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ponytail: hand-rolled minimal types instead of the @types/youtube dependency —
// this is every member we actually touch.
type YTPlayer = {
  loadVideoById(id: string): void;
  cueVideoById(id: string): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
};

type YTEvent = { target: YTPlayer; data: number };

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    options: {
      videoId?: string;
      host?: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady(e: YTEvent): void;
        onStateChange(e: YTEvent): void;
        onError(e: YTEvent): void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;

let apiPromise: Promise<YTNamespace> | null = null;

/** Load the IFrame API once per document, no matter how many mounts ask. */
function loadApi(): Promise<YTNamespace> {
  apiPromise ??= new Promise<YTNamespace>((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

type Options = {
  /** Track finished on its own. */
  onEnded: () => void;
  /** YouTube refused this video (embed disabled, removed, private). */
  onError: (code: number) => void;
};

export function useYouTube({ onEnded, onError }: Options) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  // Callbacks live in a ref so the player is built exactly once and never
  // reads a stale closure over the current track.
  const handlers = useRef({ onEnded, onError });
  useEffect(() => {
    handlers.current = { onEnded, onError };
  });

  useEffect(() => {
    let cancelled = false;
    loadApi().then((YT) => {
      if (cancelled || !hostRef.current || playerRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        host: "https://www.youtube-nocookie.com",
        // controls and keyboard stay ON. RMF forbids modifying player
        // functionality beyond the documented API, and stripping the controls
        // off a visible player is exactly what that is aimed at.
        playerVars: { playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            setPlaying(e.data === PLAYING);
            if (e.data === PLAYING || e.data === PAUSED) setDuration(e.target.getDuration());
            if (e.data === ENDED) handlers.current.onEnded();
          },
          onError: (e) => {
            setPlaying(false);
            handlers.current.onError(e.data);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  // ponytail: poll instead of chasing YT's timeupdate-less API. 4Hz is smooth
  // enough for a progress bar and costs nothing.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setElapsed(p.getCurrentTime());
      setDuration(p.getDuration());
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  const load = useCallback((videoId: string, autoplay: boolean) => {
    const p = playerRef.current;
    if (!p) return;
    setElapsed(0);
    setDuration(0);
    if (autoplay) p.loadVideoById(videoId);
    else p.cueVideoById(videoId);
  }, []);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setElapsed(seconds);
  }, []);
  const setVolume = useCallback((volume: number) => playerRef.current?.setVolume(volume), []);

  return { hostRef, ready, playing, elapsed, duration, load, play, pause, seek, setVolume };
}
