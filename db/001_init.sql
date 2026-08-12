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

  -- The entire moderation feature. The tool is the Neon SQL editor:
  --   update playlists set hidden = true where share_code = '...';
  hidden          boolean     not null default false,

  created_at      timestamptz not null default now()
);

-- The caps above are CHECK constraints rather than handler-only validation on
-- purpose: they hold even when someone patches a route at 2am and forgets.

-- Curated rooms are the only thing ever listed, so index just those rows.
create index if not exists playlists_curated_idx
  on playlists (created_at desc)
  where curated and not hidden;
