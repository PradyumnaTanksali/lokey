import { NextResponse } from "next/server";
import { dbConfigured } from "@/lib/db";
import { createPlaylist } from "@/lib/store";
import { normalizeTitle, parseStoredTracks } from "@/lib/playlists";

/** Creation lives in a Route Handler rather than a Server Action for one
 *  specific reason: Server Actions POST to the page url, and Vercel's Hobby
 *  plan allows exactly ONE WAF rate-limit rule. A stable, distinctive path is
 *  what that rule can be keyed on. This is the only endpoint that needs it.
 *
 *  CSRF is a non-issue here — there is no cookie, no session, no ambient
 *  authority for a forged request to ride on. */
export const runtime = "nodejs";

const BODY_MAX = 32 * 1024;

export async function POST(request: Request) {
  if (!dbConfigured) {
    return NextResponse.json({ error: "playlists are not configured yet" }, { status: 503 });
  }

  // Reject on the declared length before reading the body at all.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > BODY_MAX) {
    return NextResponse.json({ error: "too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "expected json" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "expected an object" }, { status: 400 });
  }

  const { title: rawTitle, tracks: rawTracks } = body as Record<string, unknown>;

  const title = typeof rawTitle === "string" ? normalizeTitle(rawTitle) : null;
  if (!title) {
    return NextResponse.json(
      { error: "titles are 1-80 characters and cannot contain links" },
      { status: 400 },
    );
  }

  const tracks = parseStoredTracks(rawTracks);
  if (!tracks) {
    return NextResponse.json({ error: "between 1 and 100 valid tracks" }, { status: 400 });
  }

  try {
    const { code, editToken } = await createPlaylist(title, tracks);
    return NextResponse.json({ code, editToken }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "could not save that" }, { status: 500 });
  }
}
