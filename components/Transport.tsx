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

/** A hairline and two numbers. No track chrome, no panel: the scrubber is the
 *  only horizontal line on the page, so it doesn't need decoration to be found.
 *  A 3-minute single and a 4-hour set both land here, so the max comes from the
 *  player rather than anything hard-coded. */
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
      <div className={`${label} mt-2 flex justify-between text-ink-faint tabular-nums`}>
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

/** Three words. No icon set, no filled circle — at this size a word is both
 *  smaller and less ambiguous than a glyph. */
export function Controls({ playing, ready, onPrev, onNext, onToggle }: ControlsProps) {
  const item = `${label} py-2 transition-colors`;
  return (
    <div className="flex items-center gap-6">
      <button type="button" onClick={onPrev} className={`${item} text-ink-faint hover:text-ink`}>
        Prev
      </button>
      <button
        type="button"
        onClick={onToggle}
        disabled={!ready}
        className={`${item} w-12 text-center text-ink hover:opacity-70 disabled:opacity-30`}
      >
        {playing ? "Pause" : "Play"}
      </button>
      <button type="button" onClick={onNext} className={`${item} text-ink-faint hover:text-ink`}>
        Next
      </button>
    </div>
  );
}
