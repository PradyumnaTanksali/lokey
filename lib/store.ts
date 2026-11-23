import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { sql } from "./db";
import { shareCodeFrom, type StoredTrack } from "./playlists";

export type Playlist = {
  code: string;
  title: string;
  tracks: StoredTrack[];
  curated: boolean;
  /** Listed on /global. */
  public: boolean;
  /** True once the stored titles are past the 30-day retention window. */
  stale: boolean;
};

type Row = {
  share_code: string;
  title: string;
  tracks: StoredTrack[];
  curated: boolean;
  public: boolean;
  stale: boolean;
};

/** Tokens are compared as digests, never stored raw. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function newEditToken(): string {
  return randomUUID();
}

function toPlaylist(row: Row): Playlist {
  return {
    code: row.share_code,
    title: row.title,
    tracks: row.tracks,
    curated: row.curated,
    public: row.public,
    stale: row.stale,
  };
}

export async function getPlaylist(code: string): Promise<Playlist | null> {
  if (!sql) return null;
  const rows = (await sql`
    select share_code, title, tracks, curated, public,
           tracks_fetched_at < now() - interval '30 days' as stale
    from playlists
    where share_code = ${code} and not hidden
  `) as Row[];
  return rows[0] ? toPlaylist(rows[0]) : null;
}

export async function listCurated(): Promise<Playlist[]> {
  if (!sql) return [];
  const rows = (await sql`
    select share_code, title, tracks, curated, public,
           tracks_fetched_at < now() - interval '30 days' as stale
    from playlists
    where curated and not hidden
    order by created_at desc
    limit 24
  `) as Row[];
  return rows.map(toPlaylist);
}

/** Playlists people chose to list. Same shape as curated, different filter. */
export async function listGlobal(): Promise<Playlist[]> {
  if (!sql) return [];
  const rows = (await sql`
    select share_code, title, tracks, curated, public,
           tracks_fetched_at < now() - interval '30 days' as stale
    from playlists
    where public and not hidden and not curated
    order by created_at desc
    limit 60
  `) as Row[];
  return rows.map(toPlaylist);
}

/** Returns the code and the one-and-only copy of the edit token.
 *
 *  Retries once on a code collision — at 50 bits that is a formality, but the
 *  unique index is the guarantee and this is what makes it non-fatal. */
export async function createPlaylist(
  title: string,
  tracks: StoredTrack[],
  isPublic: boolean,
): Promise<{ code: string; editToken: string }> {
  if (!sql) throw new Error("database not configured");

  const editToken = newEditToken();
  const hash = hashToken(editToken);

  for (let attempt = 0; attempt < 2; attempt++) {
    const code = shareCodeFrom(randomBytes(10));
    const rows = (await sql`
      insert into playlists (share_code, title, edit_token_hash, tracks, public)
      values (${code}, ${title}, ${hash}, ${JSON.stringify(tracks)}::jsonb, ${isPublic})
      on conflict (share_code) do nothing
      returning share_code
    `) as { share_code: string }[];
    if (rows[0]) return { code: rows[0].share_code, editToken };
  }
  throw new Error("could not allocate a share code");
}

/** The token is part of the WHERE clause rather than fetched and compared, so
 *  an unauthorised caller and a missing playlist are indistinguishable — both
 *  affect zero rows, and both get the same 404 from the route. */
export async function updatePlaylist(
  code: string,
  token: string,
  patch: { title?: string; tracks?: StoredTrack[]; public?: boolean },
): Promise<boolean> {
  if (!sql) return false;
  const hash = hashToken(token);
  const rows = (await sql`
    update playlists set
      title  = coalesce(${patch.title ?? null}, title),
      public = coalesce(${patch.public ?? null}::boolean, public),
      tracks = coalesce(${patch.tracks ? JSON.stringify(patch.tracks) : null}::jsonb, tracks),
      tracks_fetched_at = case when ${patch.tracks ? 1 : 0} = 1 then now() else tracks_fetched_at end
    where share_code = ${code} and edit_token_hash = ${hash} and not curated
    returning share_code
  `) as { share_code: string }[];
  return rows.length > 0;
}

export async function deletePlaylist(code: string, token: string): Promise<boolean> {
  if (!sql) return false;
  const rows = (await sql`
    delete from playlists
    where share_code = ${code} and edit_token_hash = ${hashToken(token)} and not curated
    returning share_code
  `) as { share_code: string }[];
  return rows.length > 0;
}

/** Re-store refreshed titles and restart the 30-day clock.
 *
 *  III.E.4.d permits storing Non-Authorized Data provided it is deleted or
 *  refreshed within 30 calendar days. This is the refresh. It also satisfies
 *  III.E.4.e ("stored API Data is consistent with the current data available")
 *  for free: a video renamed on YouTube picks up its new title here.
 *
 *  Driven from the read path, so it costs one write per playlist per month
 *  instead of anything on a schedule. */
export async function markRefreshed(code: string, tracks: StoredTrack[]): Promise<void> {
  if (!sql) return;
  await sql`
    update playlists
    set tracks = ${JSON.stringify(tracks)}::jsonb, tracks_fetched_at = now()
    where share_code = ${code}
  `;
}
