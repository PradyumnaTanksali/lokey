"use client";

import { useState } from "react";
import Link from "next/link";
import { FORECAST } from "@/lib/forecast";
import { BACKDROPS, SCRIMS } from "@/lib/backdrops";
import { useQueue } from "@/lib/useQueue";
import { useIdle } from "@/lib/useIdle";
import { displayArtist, displayTitle } from "@/lib/player";
import { Backdrop } from "./Backdrop";
import { Seek, Controls } from "./Transport";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

export function Forecast() {
  const [roomIndex, setRoomIndex] = useState(0);
  const room = FORECAST[roomIndex];

  // The queue resets itself when the track list changes identity, so switching
  // weather starts that room from the top.
  const { hostRef, ready, playing, elapsed, duration, track, notice, skip, toggle, seek } =
    useQueue(room.tracks);

  // Once it's playing and you've stopped touching anything, the interface gets
  // out of the way. Any input brings it back. Chrome never hides before you've
  // pressed play — controls you can't find yet aren't calm, they're broken.
  const idle = useIdle(4000);
  const hidden = idle && playing;
  const chrome = `transition-opacity duration-1000 ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`;

  return (
    <>
      {/* Lighter scrim than the main room: here the footage is the thing you
          came to look at, not a backdrop for a wordmark. */}
      <Backdrop
        id={room.id}
        sources={BACKDROPS[room.id] ?? []}
        scrim={SCRIMS[room.id] ?? "from-black/40 via-transparent to-black/75"}
      />

      <div inert aria-hidden="true" className="fixed -left-[9999px] top-0 h-[180px] w-[320px]">
        <div ref={hostRef} />
      </div>

      <div className="relative flex min-h-dvh flex-col px-6 py-6 sm:px-10">
        <header className={`${label} ${chrome} flex items-center justify-between gap-4 text-ink-muted`}>
          <span className="text-ink">Forecast</span>
          <Link href="/" className="transition-colors hover:text-ink">
            ← Lokey
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-16">
          <h1
            className={`${chrome} text-center font-serif text-[clamp(2.75rem,9vw,6.5rem)] italic leading-[0.9] tracking-[-0.02em] text-ink/80 [text-shadow:0_2px_50px_rgba(0,0,0,0.6)]`}
          >
            {room.name}
          </h1>
        </div>

        <div className={`${chrome} mx-auto w-full max-w-3xl`}>
          {/* Weather as plain words. Pills would shout; this is the quiet page. */}
          <div className={`${label} flex flex-wrap justify-center gap-x-7 gap-y-2`}>
            {FORECAST.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoomIndex(i)}
                aria-pressed={i === roomIndex}
                className={`py-1 transition-colors ${
                  i === roomIndex ? "text-ink" : "text-ink-faint hover:text-ink-muted"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <p className="mt-10 truncate text-center text-[15px] leading-tight text-ink-muted">
            {displayTitle(track)}
          </p>
          <p className={`${label} mt-1.5 truncate text-center text-ink-faint`}>
            {displayArtist(track)}
          </p>

          <div className="mt-5">
            <Seek id="seek-forecast" elapsed={elapsed} duration={duration} onSeek={seek} />
          </div>

          <div className="mt-3 flex justify-center">
            <Controls
              playing={playing}
              ready={ready}
              onPrev={() => skip(-1)}
              onNext={() => skip(1)}
              onToggle={toggle}
            />
          </div>
        </div>

        <p role="status" aria-live="polite" className="mt-2 min-h-4 text-center text-xs text-ink-faint">
          {notice}
        </p>

        <footer className={`${label} ${chrome} mt-3 flex items-center justify-between gap-4 text-ink-faint`}>
          <span>{room.tagline}</span>
          <a href="https://scenestudio.corsw.in" className="transition-colors hover:text-ink">
            Scene
          </a>
        </footer>
      </div>
    </>
  );
}
