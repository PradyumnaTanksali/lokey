"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Room } from "@/lib/rooms";
import { cleanArtist, cleanTitle, fmt, step } from "@/lib/player";
import { useYouTube } from "@/lib/useYouTube";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

type Props = {
  rooms: Room[];
  /** Wordmark, top left. */
  name: string;
  tagline: string;
  /** The other room. One link, no nav. */
  sibling: { href: string; label: string };
  /** Turns on the weather layer, keyed on room id. Forecast only. */
  weather?: boolean;
};

export function Player({ rooms, name, tagline, sibling, weather = false }: Props) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(0);

  // Flips on first play, so switching room or track keeps the music going.
  const started = useRef(false);

  const room = rooms[roomIndex];
  const track = room.tracks[trackIndex];

  const skip = useCallback(
    (dir: number) => setTrackIndex((i) => step(i, room.tracks.length, dir)),
    [room.tracks.length],
  );

  const { hostRef, ready, playing, elapsed, duration, load, play, pause, seek } = useYouTube({
    onEnded: () => skip(1),
    onError: () => {
      setNotice("That one won't embed. Skipping.");
      skip(1);
    },
  });

  useEffect(() => {
    if (ready) load(track.yt, started.current);
  }, [ready, load, track.yt]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(id);
  }, [notice]);

  // ponytail: an honest listener count needs a backend. This counts your stay.
  useEffect(() => {
    const id = setInterval(() => setMinutes((m) => m + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const toggle = useCallback(() => {
    started.current = true;
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

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

  // hqdefault is 4:3 with letterbox bars baked in, so a square crop keeps the
  // bars. maxres is a clean 16:9; hq720 is the fallback when it isn't there.
  const art = `https://i.ytimg.com/vi/${track.yt}/maxresdefault.jpg`;
  const artFallback = `https://i.ytimg.com/vi/${track.yt}/hq720.jpg`;

  return (
    <>
      {/* Audio only — the artwork is the interface. */}
      <div inert aria-hidden="true" className="fixed -left-[9999px] top-0 h-[180px] w-[320px]">
        <div ref={hostRef} />
      </div>

      {/* The background is the cover art, blown up and blurred out. */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-floor">
        {/* ponytail: plain <img> — i.ytimg.com is already the right size and
            next/image would only buy us a remotePatterns entry. */}
        {/* It ends up behind a 3xl blur, so the 320px thumb is plenty. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={track.yt}
          src={`https://i.ytimg.com/vi/${track.yt}/mqdefault.jpg`}
          alt=""
          className="art-in size-full scale-150 object-cover opacity-70 blur-3xl saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        {/* Weather goes on top of the scrim, or the scrim just mutes it away. */}
        {weather && <div className="fx" data-weather={room.id} />}
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-7">
        <header className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink">{name}</span>
          <a
            href={sibling.href}
            className={`${label} text-ink-faint underline decoration-line underline-offset-4 transition-colors hover:text-ink`}
          >
            {sibling.label}
          </a>
        </header>

        <main className="rise mt-8 rounded-2xl border border-line bg-glass p-5 backdrop-blur-2xl backdrop-saturate-150">
          {/* Rooms as tabs */}
          <div className="-mx-1 flex gap-1 overflow-x-auto pb-3">
            {rooms.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRoomIndex(i);
                  setTrackIndex(0);
                  setNotice(null);
                }}
                aria-pressed={i === roomIndex}
                className={`${label} shrink-0 whitespace-nowrap rounded-full px-3 py-2 transition-colors ${
                  i === roomIndex ? "bg-ink text-floor" : "text-ink-faint hover:text-ink"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={track.yt}
            src={art}
            onError={(e) => {
              if (e.currentTarget.src !== artFallback) e.currentTarget.src = artFallback;
            }}
            alt={`Cover art for ${cleanTitle(track.title)}`}
            width={1280}
            height={720}
            className="art-in mt-1 aspect-square w-full rounded-xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          />

          <p className={`${label} mt-5 text-ink-faint`}>{room.tagline}</p>
          <h1 className="mt-2 text-xl font-medium leading-snug tracking-[-0.02em] text-balance">
            {cleanTitle(track.title)}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{cleanArtist(track.artist)}</p>

          <div className="mt-5">
            <label className="sr-only" htmlFor="seek">
              Seek within track
            </label>
            <input
              id="seek"
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={1}
              value={Math.min(elapsed, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full"
            />
            <div className={`${label} mt-2 flex justify-between text-ink-faint`}>
              <span>{fmt(elapsed)}</span>
              <span>{duration ? fmt(duration) : "–:––"}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => skip(-1)}
              className={`${label} text-ink-faint transition-colors hover:text-ink`}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={toggle}
              disabled={!ready}
              className={`${label} rounded-full bg-ink px-8 py-3 text-floor transition-opacity hover:opacity-85 disabled:opacity-40`}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => skip(1)}
              className={`${label} text-ink-faint transition-colors hover:text-ink`}
            >
              Next
            </button>
          </div>

          <p role="status" aria-live="polite" className="mt-3 min-h-4 text-center text-xs text-ink-faint">
            {notice}
          </p>

          {/* saloon.wtf's move: don't rebuild their players, just hand off. */}
          <div className={`${label} mt-3 flex justify-center gap-5 text-ink-faint`}>
            <a
              href={`https://www.youtube.com/watch?v=${track.yt}`}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              YouTube
            </a>
            {room.spotify && (
              <a
                href={`https://open.spotify.com/${room.spotify.kind}/${room.spotify.id}`}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
              >
                Spotify
              </a>
            )}
          </div>

          {/* <details> is a disclosure widget already. No state, no library. */}
          <details className="mt-5 border-t border-line-soft pt-4">
            <summary
              className={`${label} cursor-pointer list-none text-ink-faint transition-colors hover:text-ink [&::-webkit-details-marker]:hidden`}
            >
              Tracklist · {room.tracks.length}
            </summary>
            <ol className="mt-3">
              {room.tracks.map((t, i) => (
                <li key={t.yt}>
                  <button
                    type="button"
                    onClick={() => {
                      started.current = true;
                      if (i === trackIndex) toggle();
                      else setTrackIndex(i);
                    }}
                    aria-current={i === trackIndex ? "true" : undefined}
                    className="group flex w-full items-baseline gap-3 py-2 text-left"
                  >
                    <span
                      className={`${label} w-4 shrink-0 ${i === trackIndex ? "text-ink" : "text-ink-faint"}`}
                    >
                      {i === trackIndex && playing ? "▸" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 truncate text-sm transition-colors ${
                        i === trackIndex ? "text-ink" : "text-ink-muted group-hover:text-ink"
                      }`}
                    >
                      {cleanTitle(t.title)}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </details>
        </main>

        <footer className={`${label} mt-auto flex items-baseline justify-between gap-4 pt-8 text-ink-faint`}>
          <span>{tagline}</span>
          <span>{minutes === 0 ? "just sat down" : `${minutes} min in`}</span>
        </footer>

        <p className="mt-3 text-center text-[11px] text-ink-faint">
          A sample build by{" "}
          <a
            href="https://scenestudio.corsw.in"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Scene
          </a>
          . Space to play, arrows to skip.
        </p>
      </div>
    </>
  );
}
