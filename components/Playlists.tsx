"use client";

import { useState } from "react";
import Link from "next/link";
import { Mark } from "./Mark";
import { Backdrop } from "./Backdrop";
import { isShareCode, TITLE_MAX, TRACKS_MAX, type StoredTrack } from "@/lib/playlists";
import { tracksFromLink } from "@/lib/addTracks";
import { rememberPlaylist, useSavedPlaylists, type Saved } from "@/lib/savedPlaylists";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";
const field =
  "w-full rounded-lg border border-line bg-white/[0.04] px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none";
const button = `${label} rounded-full px-4 py-2.5 transition-colors disabled:opacity-40`;

export function Playlists() {
  const mine = useSavedPlaylists();
  const [draft, setDraft] = useState<StoredTrack[]>([]);
  const [title, setTitle] = useState("");
  const [listed, setListed] = useState(false);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<(Saved & { listed: boolean }) | null>(null);

  async function add() {
    setError(null);
    setBusy(true);
    try {
      const { tracks, name } = await tracksFromLink(url);
      const room = TRACKS_MAX - draft.length;
      if (room <= 0) throw new Error(`${TRACKS_MAX} tracks is the limit.`);
      if (tracks.length > room) {
        setError(`Only the first ${room} fit — ${TRACKS_MAX} tracks is the limit.`);
      }
      setDraft((d) => [...d, ...tracks.slice(0, room)]);
      // A playlist brings its own name; don't overwrite one already typed.
      if (name && !title.trim()) setTitle(name.slice(0, TITLE_MAX));
      setUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add that.");
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, tracks: draft, public: listed }),
      });
      const data = (await res.json()) as { code?: string; editToken?: string; error?: string };
      if (!res.ok || !data.code) throw new Error(data.error ?? "");
      const entry: Saved = { code: data.code, title, editToken: data.editToken };
      rememberPlaylist(entry);
      setCreated({ ...entry, listed });
      setDraft([]);
      setTitle("");
      setListed(false);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Could not save that.");
    } finally {
      setBusy(false);
    }
  }

  async function importCode() {
    setError(null);
    const wanted = code.trim().toUpperCase();
    if (!isShareCode(wanted)) return setError("Codes are 10 characters.");

    setBusy(true);
    try {
      const res = await fetch(`/api/playlists/${wanted}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { title: string };
      rememberPlaylist({ code: wanted, title: data.title }); // no edit token: read-only
      setCode("");
    } catch {
      setError("No playlist with that code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Backdrop id="cover" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 py-6 sm:px-10">
        <header className={`${label} flex items-center justify-between gap-4 text-ink-muted`}>
          <Link href="/" className="flex items-center gap-2 text-ink transition-opacity hover:opacity-70">
            <Mark className="size-3.5" />
            Lokey
          </Link>
          <nav className="flex gap-5">
            <Link href="/global" className="transition-colors hover:text-ink">
              Global →
            </Link>
            <Link href="/curated" className="transition-colors hover:text-ink">
              Curated →
            </Link>
          </nav>
        </header>

        <div className="py-12">
          <h1 className="text-center font-serif text-[clamp(2.25rem,8vw,4.5rem)] leading-tight tracking-[-0.02em]">
            Playlists
          </h1>
          <p className={`${label} mt-4 text-center text-ink-faint`}>
            YouTube or Spotify links · get a code · send it on
          </p>
        </div>

        {created && (
          <div className="mb-10 rounded-xl border border-line bg-white/[0.04] p-5 text-center">
            <p className={`${label} text-ink-faint`}>Share this</p>
            <p className="mt-2 font-mono text-2xl tracking-[0.2em] text-ink">{created.code}</p>
            <div className="mt-4 flex justify-center gap-5">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(created.code)}
                className={`${button} bg-ink text-floor hover:opacity-85`}
              >
                Copy code
              </button>
              <Link href={`/p/${created.code}`} className={`${button} text-ink-muted hover:text-ink`}>
                Open it
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink-faint">
              Anyone with the code can listen{created.listed ? ", and it's listed in Global" : ""}. Editing rights live in this browser only — clear your
              site data and they are gone for good, because there is no account to recover them from.
            </p>
          </div>
        )}

        {/* Build */}
        <section>
          <h2 className={`${label} text-ink-faint`}>New playlist</h2>
          <div className="mt-3 flex gap-2">
            <input
              className={field}
              placeholder="Paste a YouTube or Spotify link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void add();
                }
              }}
            />
            <button
              type="button"
              onClick={() => void add()}
              disabled={busy || !url}
              className={`${button} shrink-0 bg-ink text-floor hover:opacity-85`}
            >
              Add
            </button>
          </div>

          {draft.length > 0 && (
            <>
              <ol className="mt-4 border-t border-line-soft">
                {draft.map((t, i) => (
                  <li
                    key={`${t.v}-${i}`}
                    className="flex items-baseline gap-3 border-b border-line-soft py-2.5"
                  >
                    <span className={`${label} w-5 shrink-0 text-ink-faint`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink-muted">{t.t}</span>
                      <span className={`${label} mt-1 block truncate text-ink-faint`}>{t.a}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setDraft((d) => d.filter((_, j) => j !== i))}
                      className={`${label} shrink-0 text-ink-faint transition-colors hover:text-ink`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex gap-2">
                <input
                  className={field}
                  placeholder="Name it"
                  maxLength={TITLE_MAX}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => void create()}
                  disabled={busy || !title.trim() || draft.length === 0}
                  className={`${button} shrink-0 bg-ink text-floor hover:opacity-85`}
                >
                  Create
                </button>
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={listed}
                  onChange={(e) => setListed(e.target.checked)}
                  className="accent-current"
                />
                Show in Global — anyone browsing Lokey can find it
              </label>
            </>
          )}
        </section>

        {/* Import */}
        <section className="mt-12">
          <h2 className={`${label} text-ink-faint`}>Have a code?</h2>
          <div className="mt-3 flex gap-2">
            <input
              className={`${field} font-mono uppercase tracking-[0.2em]`}
              placeholder="ABCDE12345"
              maxLength={10}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void importCode();
                }
              }}
            />
            <button
              type="button"
              onClick={() => void importCode()}
              disabled={busy || !code}
              className={`${button} shrink-0 text-ink-muted hover:text-ink`}
            >
              Import
            </button>
          </div>
        </section>

        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-ink-faint">
          {error}
        </p>

        {/* Yours */}
        {mine.length > 0 && (
          <section className="mt-8">
            <h2 className={`${label} text-ink-faint`}>Yours</h2>
            <ul className="mt-3 border-t border-line-soft">
              {mine.map((p) => (
                <li key={p.code}>
                  <Link
                    href={`/p/${p.code}`}
                    className="group flex items-baseline justify-between gap-4 border-b border-line-soft py-3"
                  >
                    <span className="truncate text-sm text-ink-muted group-hover:text-ink">
                      {p.title}
                    </span>
                    <span className={`${label} shrink-0 text-ink-faint`}>{p.code}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className={`${label} mt-auto pt-10 text-center text-ink-faint`}>
          Unlisted unless you tick Show in Global. Otherwise a playlist exists only at its code.
        </footer>
      </div>
    </>
  );
}
