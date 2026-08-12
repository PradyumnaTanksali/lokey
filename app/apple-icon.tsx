import { ImageResponse } from "next/og";
import { markImage } from "@/lib/markImage";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS ignores the manifest icons for "Add to Home Screen" and uses this one.
 *  Slightly larger scale than the PWA icons: iOS applies its own rounded mask
 *  with a generous safe area, so the extra maskable padding just wastes space. */
export default function AppleIcon() {
  return new ImageResponse(markImage(180, 0.62), size);
}
