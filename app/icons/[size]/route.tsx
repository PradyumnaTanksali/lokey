import { ImageResponse } from "next/og";
import { markImage } from "@/lib/markImage";

/** PWA icons, generated rather than committed as binaries — the mark is two
 *  rectangles, so a PNG in the repo would be a build artifact pretending to be
 *  a source file. Prerendered at build time by `generateStaticParams`. */
const SIZES = [192, 512] as const;

export function generateStaticParams() {
  return SIZES.map((size) => ({ size: String(size) }));
}

export const dynamicParams = false;

export async function GET(_req: Request, ctx: { params: Promise<{ size: string }> }) {
  const { size: raw } = await ctx.params;
  const size = Number(raw);
  if (!SIZES.includes(size as (typeof SIZES)[number])) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(markImage(size), { width: size, height: size });
}
