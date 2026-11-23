-- Lokey v0.0.4 — anonymous playlists.
--
-- Apply by hand, once, against the UNPOOLED url:
--   psql "$DATABASE_URL_UNPOOLED" -f db/001_init.sql
--
-- There is no migration tool on purpose. This schema will change perhaps five
-- times in its life; drizzle-kit would be more machinery than the thing it
-- manages. Neon branching is the safety net — try it on a branch, then main.

create table if not exists playlists (
  -- The public code IS the id. With tracks stored inline there is no foreign
  -- key graph, so a surrogate key would be a second identifier earning nothing.
  share_code      text        primary key
                              check (share_code ~ '^[0-9A-HJKMNP-TV-Z]{10}$'),

  title           text        not null
                              check (length(title) between 1 and 80),

  -- sha256 hex of the edit token, never the token itself: a database leak then
  -- hands out nothing. Authorisation is `where share_code = $1 and
  -- edit_token_hash = $2`, so zero rows means unauthorised.
  edit_token_hash text        not null,

  -- Tracks live here rather than in a child table. Playlists are read whole and
  -- reordered wholesale, and the client already sends the full array, so
  -- normalising would buy a position column and renumber-on-reorder logic to
  -- solve problems this shape does not have.
  tracks          jsonb       not null default '[]'::jsonb
                              check (jsonb_array_length(tracks) <= 100),

  -- Dev-curated rooms are ordinary playlists with this set.
  curated         boolean     not null default false,

  -- Opt-in listing on /global. Off by default: a code-only playlist was
  -- promised to stay unlisted, so nothing becomes public without a tick.
  public          boolean     not null default false,

  -- The entire moderation feature. The tool is the Neon SQL editor:
  --   update playlists set hidden = true where share_code = '...';
  hidden          boolean     not null default false,

  created_at      timestamptz not null default now(),

  -- When the titles in `tracks` were last fetched from YouTube.
  --
  -- Developer Policies III.E.4.d: an API Client "may temporarily store limited
  -- amounts of Non-Authorized Data ... but not longer than 30 calendar days.
  -- ... after 30 calendar days, the API Client must either delete or refresh
  -- the stored data." Titles and channel names came from YouTube, so they are
  -- on a clock. This column is that clock; the read path does the refreshing.
  --
  -- There is NO exemption for identifiers -- that widespread belief has no
  -- basis in the policy text. The video ids are kept because the user pasted
  -- them, so they were never "provided through the YouTube API services",
  -- which is what III.E.4 actually governs.
  tracks_fetched_at timestamptz not null default now()
);

-- The caps above are CHECK constraints rather than handler-only validation on
-- purpose: they hold even when someone patches a route at 2am and forgets.

-- Curated rooms and opted-in public playlists are the only things ever
-- listed, so index just those rows.
create index if not exists playlists_curated_idx
  on playlists (created_at desc)
  where curated and not hidden;

-- v0.1: for a table created before `public` existed. No-op on a fresh one.
alter table playlists add column if not exists public boolean not null default false;

create index if not exists playlists_public_idx
  on playlists (created_at desc)
  where public and not hidden and not curated;
