"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ROOMS } from "@/lib/rooms";
import { cleanArtist, cleanTitle, fmt, step } from "@/lib/player";
import { useYouTube } from "@/lib/useYouTube";
import { Stage } from "./Stage";

const btn =
  "font-mono text-[11px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export function Baithak() {
  const [roomIndex, setRoomIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [source, setSource] = useState<"youtube" | "spotify">("youtube");
  const [volume, setVolume] = useState(70);
  const [notice, setNotice] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(0);

  // Flips the first time someone presses play. After that, changing track or
  // room keeps the music going instead of dumping you back to silence.
  const started = useRef(false);

  const room = ROOMS[roomIndex];
  const track = room.tracks[trackIndex];

  const skip = useCallback(
    (dir: number) => setTrackIndex((i) => step(i, room.tracks.length, dir)),
    [room.tracks.length],
  );

  const { hostRef, ready, playing, elapsed, duration, load, play, pause, seek, setVolume: applyVolume } =
    useYouTube({
      onEnded: () => skip(1),
      onError: () => {
        setNotice("Ye gaana embed nahi hone deta. Agla laga rahe hain.");
        skip(1);
      },
    });

  useEffect(() => {
    if (ready) load(track.yt, started.current);
  }, [ready, load, track.yt]);

  useEffect(() => {
    if (ready) applyVolume(volume);
  }, [ready, volume, applyVolume]);

  // Spotify has its own player. Two things playing at once is not a vibe.
  useEffect(() => {
    if (source === "spotify") pause();
  }, [source, pause]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(id);
  }, [notice]);

  // ponytail: an honest "who's here" needs a backend. This counts *your* sit
  // instead of inventing 47 strangers.
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
    if (source !== "youtube") return;
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
  }, [source, toggle, skip]);

  function pickRoom(index: number) {
    setRoomIndex(index);
    setTrackIndex(0);
    setNotice(null);
  }

  function pickTrack(index: number) {
    started.current = true;
    if (index === trackIndex) toggle();
    else setTrackIndex(index);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
      {/* The player itself. Audio only — the picture is the point of the stage. */}
      {/* `inert` keeps the iframe out of the tab order and the a11y tree; our own
          controls are the interface. Kept at a real size — browsers throttle
          1px media. */}
      <div inert aria-hidden="true" className="fixed -left-[9999px] top-0 h-[180px] w-[320px]">
        <div ref={hostRef} />
      </div>

      <header className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-sm lowercase tracking-[0.28em] text-ink">baithak</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint" lang="hi-Latn">
          {minutes === 0 ? "Abhi baithe ho" : `${minutes} min se baithe ho`}
        </span>
      </header>

      <section className="rise mt-14 md:mt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
          A listening room · R&amp;B only · No skip politics
        </p>
        <h1 className="mt-5 text-[clamp(3rem,10vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.04em] text-balance">
          Baitho.
          <br />
          <span className="text-ink-faint">Sun lo.</span>
        </h1>
        <p className="mt-6 max-w-lg text-xl leading-[1.4] tracking-[-0.01em] text-ink-muted text-balance">
          Four moods, slow R&amp;B, zero login. Pick a room, press play, and let the tab do the
          rest. <em lang="hi-Latn">Koi bakchodi nahi.</em>
        </p>
      </section>

      <main className="mt-16 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
        <div className="rise lg:col-span-6" style={{ animationDelay: "80ms" }}>
          <Stage
            roomId={room.id}
            videoId={track.yt}
            title={cleanTitle(track.title)}
            playing={playing}
          />
        </div>

        <div className="rise lg:col-span-6" style={{ animationDelay: "160ms" }}>
          {/* Rooms */}
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
            Rooms · {ROOMS.length}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {ROOMS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => pickRoom(i)}
                aria-pressed={i === roomIndex}
                className={`group px-5 py-4 text-left transition-colors ${
                  i === roomIndex ? "bg-ink text-bg" : "bg-bg-elevated hover:bg-bg-subtle"
                }`}
              >
                <span className="block text-base tracking-[-0.01em]">{r.name}</span>
                <span
                  lang="hi-Latn"
                  className={`mt-1 block text-xs ${i === roomIndex ? "text-bg/60" : "text-ink-faint"}`}
                >
                  {r.tagline}
                </span>
              </button>
            ))}
          </div>

          {/* Source */}
          <div className="mt-8 flex items-center gap-6 border-b border-border pb-3">
            {(["youtube", "spotify"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSource(s)}
                aria-pressed={source === s}
                className={`${btn} ${source === s ? "text-ink" : "text-ink-faint hover:text-ink-muted"}`}
              >
                {s === "youtube" ? "YouTube" : "Spotify"}
              </button>
            ))}
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {source === "youtube" ? "Hamara player" : "Unka player"}
            </span>
          </div>

          {source === "youtube" ? (
            <>
              <div className="mt-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                  {playing ? "Ab baj raha hai" : "Queue mein"}
                </p>
                <h2 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.02em] text-balance md:text-3xl">
                  {cleanTitle(track.title)}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{cleanArtist(track.artist)}</p>
              </div>

              <div className="mt-7">
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
                <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.14em] text-ink-faint">
                  <span>{fmt(elapsed)}</span>
                  <span>{duration ? fmt(duration) : "–:––"}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button
                  type="button"
                  onClick={() => skip(-1)}
                  className={`${btn} text-ink-muted hover:text-ink`}
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={toggle}
                  disabled={!ready}
                  className={`${btn} rounded-full bg-ink px-8 py-3 text-bg hover:bg-ink/85 disabled:opacity-40`}
                >
                  <span lang="hi-Latn">{playing ? "Ruko" : "Chalao"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => skip(1)}
                  className={`${btn} text-ink-muted hover:text-ink`}
                >
                  Next
                </button>

                <div className="ml-auto flex items-center gap-3">
                  <label
                    htmlFor="vol"
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint"
                  >
                    Vol
                  </label>
                  <input
                    id="vol"
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>

              <p role="status" aria-live="polite" className="mt-4 min-h-5 text-xs text-ink-faint" lang="hi-Latn">
                {notice}
              </p>

              <ol className="mt-6 border-t border-border">
                {room.tracks.map((t, i) => (
                  <li key={t.yt}>
                    <button
                      type="button"
                      onClick={() => pickTrack(i)}
                      aria-current={i === trackIndex ? "true" : undefined}
                      className="group flex w-full items-baseline gap-4 border-b border-border py-3 text-left"
                    >
                      <span
                        className={`w-5 shrink-0 font-mono text-[10px] tracking-[0.14em] ${
                          i === trackIndex ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {i === trackIndex && playing ? "▸" : String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 truncate text-sm ${
                          i === trackIndex ? "text-ink" : "text-ink-muted group-hover:text-ink"
                        }`}
                      >
                        {cleanTitle(t.title)}
                      </span>
                      <span className="hidden shrink-0 text-xs text-ink-faint sm:block">
                        {cleanArtist(t.artist)}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="mt-8">
              {room.spotify ? (
                <>
                  <p className="mb-4 text-sm text-ink-muted" lang="hi-Latn">
                    Spotify ka player, Spotify ke rules. Full tracks tab chalenge jab aap Spotify
                    mein logged in ho.
                  </p>
                  <iframe
                    key={room.spotify.id}
                    title={`${room.name} on Spotify`}
                    src={`https://open.spotify.com/embed/${room.spotify.kind}/${room.spotify.id}?theme=0`}
                    width="100%"
                    height="420"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="rounded-xl border border-border"
                  />
                </>
              ) : (
                <p className="text-sm text-ink-muted" lang="hi-Latn">
                  Is room ka Spotify version abhi nahi hai. YouTube pe sun lo — wahi tracks hain.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 flex flex-col gap-3 border-t border-border pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          A sample build by{" "}
          <a
            href="https://scenestudio.corsw.in"
            className="text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Scene
          </a>
          . No login, no algorithm, no <em lang="hi-Latn">bakchodi</em>.
        </p>
        <p className="font-mono uppercase tracking-[0.18em]">Space · play &nbsp; ← → · skip</p>
      </footer>
    </div>
  );
}
