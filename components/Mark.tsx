/** The Lokey mark: a crescent, cut as one circle minus another.
 *
 *  Reads as a moon at any size and as a record label at large ones, which is
 *  the whole product in one shape. Single path, no strokes, so it survives
 *  being 16px in a browser tab. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 2a14 14 0 1 1 0 28 14 14 0 0 1 0-28zm5 3a11 11 0 1 0 0 22 11 11 0 0 0 0-22z"
        fill="currentColor"
      />
    </svg>
  );
}
