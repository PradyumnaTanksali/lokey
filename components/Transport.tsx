"use client";

import { fmt } from "@/lib/player";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

type SeekProps = {
  elapsed: number;
  duration: number;
  onSeek: (seconds: number) => void;
  /** Unique per instance — two seek bars on one page would collide. */
  id: string;
};

/** Scrubber plus the two times. Long DJ sets and 3-minute singles both land in
 *  here, so the max comes from the player rather than anything hard-coded. */
export function Seek({ elapsed, duration, onSeek, id }: SeekProps) {
  return (
    <div className="w-full">
      <label className="sr-only" htmlFor={id}>
        Seek within track
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={Math.max(duration, 1)}
        step={1}
        value={Math.min(elapsed, duration || 0)}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full"
      />
      <div className={`${label} mt-1.5 flex justify-between text-ink-faint`}>
        <span>{fmt(elapsed)}</span>
        <span>{duration ? fmt(duration) : "–:––"}</span>
      </div>
    </div>
  );
}

type ControlsProps = {
  playing: boolean;
  ready: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
};

/** Prev, play, next. Text rather than an icon set — nothing here needs a
 *  dependency to say "next". */
export function Controls({ playing, ready, onPrev, onNext, onToggle }: ControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        className={`${label} rounded-full px-3 py-2 text-ink-faint transition-colors hover:text-ink`}
      >
        Prev
      </button>
      <button
        type="button"
        onClick={onToggle}
        disabled={!ready}
        aria-label={playing ? "Pause" : "Play"}
        className="grid size-12 place-items-center rounded-full bg-ink text-floor shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-opacity hover:opacity-85 disabled:opacity-40"
      >
        <span aria-hidden="true" className="text-sm leading-none">
          {playing ? "❚❚" : "▶"}
        </span>
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`${label} rounded-full px-3 py-2 text-ink-faint transition-colors hover:text-ink`}
      >
        Next
      </button>
    </div>
  );
}
