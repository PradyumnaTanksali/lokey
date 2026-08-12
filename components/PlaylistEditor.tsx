"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TITLE_MAX, TRACKS_MAX, type StoredTrack } from "@/lib/playlists";
import { tracksFromLink } from "@/lib/addTracks";
import { useSavedPlaylists } from "@/lib/savedPlaylists";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";
const field =
  "w-full rounded-lg border border-line bg-white/[0.04] px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none";
const button = `${label} rounded-full px-4 py-2.5 transition-colors disabled:opacity-40`;

type Props = { code: string; title: string; tracks: StoredTrack[] };

/** Renders only for whoever holds the edit token for this playlist — which is
 *  to say, only in the browser that created it. Everyone else, including anyone
 *  with the share code, sees nothing at all.
 *
 *  The token is sent in a header rather than the url: query strings leak into
 *  `Referer`, server logs and analytics, and a capability that leaks is a
 *  capability you have given away. */
export function PlaylistEditor({ code, title: initialTitle, tracks: initialTracks }: Props) {
  const saved = useSavedPlaylists();
  const token = saved.find((p) => p.code === code)?.editToken;

  const router = useRouter();
  const [tracks, setTracks] = useState(initialTracks);
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  if (!token) return null;

  const dirty =
    title !== initialTitle || JSON.stringify(tracks) !== JSON.stringify(initialTracks);

  async function add() {
    setNote(null);
    setBusy(true);
    try {
      const { tracks: found } = await tracksFromLink(url);
      const room = TRACKS_MAX - tracks.length;
      if (room <= 0) throw new Error(`${TRACKS_MAX} tracks is the limit.`);
      if (found.length > room) setNote(`Only the first ${room} fit.`);
      setTracks((t) => [...t, ...found.slice(0, room)]);
      setUrl("");
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Could not add that.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setNote(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/playlists/${code}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-edit-token": token! },
        body: JSON.stringify({ title, tracks }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Save failed.");
      setNote("Saved.");
      router.refresh();
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="mt-4 border-t border-line-soft pt-4">
      <summary
        className={`${label} cursor-pointer list-none text-ink-faint transition-colors hover:text-ink [&::-webkit-details-marker]:hidden`}
      >
        Edit · yours
      </summary>

      <div className="mt-4 flex gap-2">
        <input
          className={field}
          placeholder="Add a song or playlist link"
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

      <input
        className={`${field} mt-2`}
        value={title}
        maxLength={TITLE_MAX}
        onChange={(e) => setTitle(e.target.value)}
      />

      <ol className="mt-4 border-t border-line-soft">
        {tracks.map((t, i) => (
          <li
            key={`${t.v}-${i}`}
            className="flex items-baseline gap-3 border-b border-line-soft py-2.5"
          >
            <span className={`${label} w-5 shrink-0 text-ink-faint`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-ink-muted">{t.t}</span>
            <button
              type="button"
              onClick={() => setTracks((list) => list.filter((_, j) => j !== i))}
              className={`${label} shrink-0 text-ink-faint transition-colors hover:text-ink`}
            >
              Remove
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !dirty || tracks.length === 0 || !title.trim()}
          className={`${button} bg-ink text-floor hover:opacity-85`}
        >
          Save changes
        </button>
        <span className={`${label} text-ink-faint`}>{note}</span>
      </div>
    </details>
  );
}
