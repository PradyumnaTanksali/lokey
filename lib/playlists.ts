import type { Track } from "./queue";

/** Crockford base32. Exactly 32 symbols, which is the whole point: `byte & 31`
 *  is then perfectly uniform. A "no ambiguous letters" alphabet of 23 or 30
 *  symbols would need rejection sampling or it skews toward the low letters.
 *  Also drops I/L/O/U, so it survives being read aloud or typed from a photo. */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export const CODE_LENGTH = 10;

/** Takes its randomness as an argument so this file stays free of `node:crypto`
 *  and can be imported by client components. The server passes `randomBytes`. */
export function shareCodeFrom(bytes: Uint8Array): string {
  if (bytes.length < CODE_LENGTH) throw new Error("need at least 10 bytes");
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += ALPHABET[bytes[i] & 31];
  return out;
}

export const CODE_PATTERN = /^[0-9A-HJKMNP-TV-Z]{10}$/;

export function isShareCode(value: string): boolean {
  return CODE_PATTERN.test(value);
}

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Playlist ids are longer and more varied than video ids: PL…, OLAK5uy_…,
 *  RD…, UU…, FL…. Deliberately only ever read out of a url's `list=` param —
 *  a bare 11-character video id would match this pattern too, so accepting
 *  bare list ids would make "is this a video or a playlist" ambiguous. */
const LIST_ID = /^[A-Za-z0-9_-]{12,64}$/;

/** Personal lists. They resolve for their owner and nobody else, so importing
 *  one silently yields an empty playlist — better to say why. */
const PRIVATE_LISTS = new Set(["LM", "WL", "LL"]);

function isYouTubeHost(url: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  return /^(?:(?:www|music|m)\.)?youtube\.com$|^youtu\.be$/.test(url.hostname);
}

/** Paths whose last segment is a handle or list id, not a video. Without this,
 *  `youtube.com/@someuser11` parses as a video id and we'd store nonsense. */
const NOT_VIDEO = new Set(["playlist", "results", "channel", "user", "c", "feed", "hashtag"]);

/** Pull the 11-character video id out of whatever the user pasted.
 *
 *  We store the id and never the url, and we never fetch the url — a
 *  user-supplied url that the server requests is how an app that has no
 *  business having an SSRF acquires one. Everything downstream builds its own
 *  urls from this id. */
export function parseVideoId(input: string): string | null {
  const s = input.trim();
  if (VIDEO_ID.test(s)) return s;

  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return null;
  }
  if (!isYouTubeHost(url)) return null;

  const v = url.searchParams.get("v");
  if (v && VIDEO_ID.test(v)) return v;

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  if (segments[0].startsWith("@") || NOT_VIDEO.has(segments[0])) return null;

  const last = segments[segments.length - 1];
  return VIDEO_ID.test(last) ? last : null;
}

// Zero-width, bidi overrides, and the BOM. Homoglyph and RTL-override tricks
// live here, and NFKC alone does not remove them.
const INVISIBLE =
  /[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

export const TITLE_MAX = 80;

/** Returns the cleaned title, or null if it fails the rules.
 *
 *  Rejecting urls outright is the cheapest anti-spam measure that exists here:
 *  real playlist titles do not contain links, and link spam is most of what
 *  anonymous text fields attract. NFKC runs first so homoglyphs can't sneak a
 *  url past the check. */
export function normalizeTitle(raw: string): string | null {
  const t = raw.normalize("NFKC").replace(INVISIBLE, "").replace(/\s+/g, " ").trim();
  if (t.length === 0 || t.length > TITLE_MAX) return null;
  if (/https?:|:\/\/|www\./i.test(t)) return null;
  return t;
}

/** Stored shape. Short keys because they repeat on every row: at 100 tracks
 *  `v/t/a` is roughly a quarter smaller than `videoId/title/artist`. */
export type StoredTrack = { v: string; t: string; a: string };

export const TRACKS_MAX = 100;

export function toTrack(stored: StoredTrack): Track {
  return { yt: stored.v, title: stored.t, artist: stored.a };
}

export function fromTrack(track: Track): StoredTrack {
  return { v: track.yt, t: track.title, a: track.artist };
}

/** Validates a decoded JSON payload from the wire. Anything that isn't exactly
 *  the expected shape is dropped rather than coerced. */
export function parseStoredTracks(value: unknown): StoredTrack[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > TRACKS_MAX) return null;
  const out: StoredTrack[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) return null;
    const { v, t, a } = item as Record<string, unknown>;
    if (typeof v !== "string" || !VIDEO_ID.test(v)) return null;
    if (typeof t !== "string" || typeof a !== "string") return null;
    out.push({ v, t: t.slice(0, 200), a: a.slice(0, 120) });
  }
  return out;
}

/** The playlist id from a url, or null. YouTube Music playlist links carry the
 *  same `list=` param as youtube.com, so both work without special-casing. */
export function parseListId(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (!isYouTubeHost(url)) return null;

  const list = url.searchParams.get("list");
  if (!list || !LIST_ID.test(list) || PRIVATE_LISTS.has(list)) return null;
  return list;
}

export type PastedLink = { kind: "video"; id: string } | { kind: "list"; id: string };

/** What did the user actually paste?
 *
 *  A `/watch?v=X&list=Y` url is both. It resolves to the video, because that is
 *  the thing the user was looking at when they copied it — importing the whole
 *  list stays a separate, explicit action in the UI. */
export function classifyLink(input: string): PastedLink | null {
  const video = parseVideoId(input);
  if (video) return { kind: "video", id: video };

  const list = parseListId(input);
  if (list) return { kind: "list", id: list };

  return null;
}
