"use client";

import type { RefObject } from "react";

/** The visible YouTube player.
 *
 *  This is a compliance boundary, not a design choice. YouTube's Required
 *  Minimum Functionality sets a 200x200 floor on the player viewport, the
 *  Developer Policies (III.I.9) forbid playing from "a player that is not
 *  displayed in the page, tab, or screen that the user is viewing", and the RMF
 *  forbids drawing overlays "in front of any part of a YouTube embedded player".
 *
 *  So: never hide this, never shrink it below 200px in either axis, never lay
 *  anything over it, and never fade it out with the rest of the page chrome.
 *  16:9 gets us past 200 tall on any viewport wider than ~356px; `min-h` covers
 *  the narrow phones where it wouldn't. */
export function YouTubePlayer({
  hostRef,
  className = "",
}: {
  hostRef: RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div
      // z-[110] clears the grain overlay's z-[100]. The overlay is decorative;
      // the RMF prohibition on covering the player is not.
      className={`relative z-[110] aspect-video min-h-[200px] w-full overflow-hidden rounded-xl bg-black shadow-[0_20px_60px_rgba(0,0,0,0.55)] [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full ${className}`}
    >
      <div ref={hostRef} />
    </div>
  );
}
