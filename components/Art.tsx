"use client";

// Prefer the clean 16:9 thumbs — hqdefault is 4:3 with letterbox bars baked in,
// so a square crop keeps the bars. Older uploads (Sade '92, some long mixes)
// have neither maxres nor hq720, so it stays as the last resort.
const SIZES = ["maxresdefault", "hq720", "hqdefault"] as const;

type Props = { videoId: string; alt: string; className?: string };

export function Art({ videoId, alt, className }: Props) {
  const src = (stepIndex: number) => `https://i.ytimg.com/vi/${videoId}/${SIZES[stepIndex]}.jpg`;

  return (
    // ponytail: plain <img> — i.ytimg.com is already the right size, and
    // next/image would only buy us a remotePatterns entry.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={videoId}
      src={src(0)}
      onError={(e) => {
        const img = e.currentTarget;
        const next = Number(img.dataset.step ?? 0) + 1;
        if (next < SIZES.length) {
          img.dataset.step = String(next);
          img.src = src(next);
        }
      }}
      alt={alt}
      width={1280}
      height={720}
      className={className}
    />
  );
}
