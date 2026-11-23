import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbConfigured } from "@/lib/db";
import { deletePlaylist, getPlaylist, updatePlaylist } from "@/lib/store";
import { isShareCode, normalizeTitle, parseStoredTracks, type StoredTrack } from "@/lib/playlists";

export const runtime = "nodejs";

/** Identical response for "no such code", "malformed code", and "wrong token".
 *  Scanning then yields no signal about which codes exist. */
const notFound = () => NextResponse.json({ error: "not found" }, { status: 404 });

export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!dbConfigured || !isShareCode(code)) return notFound();

  const playlist = await getPlaylist(code);
  return playlist ? NextResponse.json(playlist) : notFound();
}

export async function PATCH(request: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!dbConfigured || !isShareCode(code)) return notFound();

  const token = request.headers.get("x-edit-token");
  if (!token) return notFound();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "expected json" }, { status: 400 });
  }
  const {
    title: rawTitle,
    tracks: rawTracks,
    public: rawPublic,
  } = (body ?? {}) as Record<string, unknown>;

  const patch: { title?: string; tracks?: StoredTrack[]; public?: boolean } = {};

  if (rawTitle !== undefined) {
    const title = typeof rawTitle === "string" ? normalizeTitle(rawTitle) : null;
    if (!title) return NextResponse.json({ error: "bad title" }, { status: 400 });
    patch.title = title;
  }
  if (rawTracks !== undefined) {
    const tracks = parseStoredTracks(rawTracks);
    if (!tracks) return NextResponse.json({ error: "bad tracks" }, { status: 400 });
    patch.tracks = tracks;
  }
  if (rawPublic !== undefined) {
    if (typeof rawPublic !== "boolean") return NextResponse.json({ error: "bad public" }, { status: 400 });
    patch.public = rawPublic;
  }
  if (patch.title === undefined && patch.tracks === undefined && patch.public === undefined) {
    return NextResponse.json({ error: "nothing to change" }, { status: 400 });
  }

  if (!(await updatePlaylist(code, token, patch))) return notFound();
  // ponytail: always revalidate — cheaper than reading the old flag to decide.
  revalidatePath("/global");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!dbConfigured || !isShareCode(code)) return notFound();

  const token = request.headers.get("x-edit-token");
  if (!token) return notFound();

  if (!(await deletePlaylist(code, token))) return notFound();
  revalidatePath("/global");
  return NextResponse.json({ ok: true });
}
