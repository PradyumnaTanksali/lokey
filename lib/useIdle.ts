"use client";

import { useEffect, useState } from "react";

/** True once the pointer and keyboard have been quiet for `ms`.
 *
 *  Forecast uses it to fade its own chrome away: the video is the thing you
 *  came for, and controls you are not using are just something between you and
 *  it. Any input brings them straight back. */
export function useIdle(ms: number) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), ms);
    };

    wake();
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [ms]);

  return idle;
}
