import { neon } from "@neondatabase/serverless";

/** Neon's HTTP driver: stateless fetch per query, so there is no pool to size,
 *  no connections to leak, and nothing to drain when the instance suspends.
 *  That costs about one extra round trip per query and deletes a whole category
 *  of bug — the right trade at this size. Swap to `pg` + `attachDatabasePool`
 *  only if that round trip is ever measured and found to matter.
 *
 *  Pooled `DATABASE_URL` for queries; `DATABASE_URL_UNPOOLED` is for migrations
 *  only, because PgBouncer runs in transaction mode and drops session state.
 *
 *  Node runtime only. `runtime = 'edge'` is unsupported from Next 16.3, and
 *  Fluid compute makes the old "Edge needs the HTTP driver" reasoning obsolete. */
const url = process.env.DATABASE_URL;

/** Null until a database is configured, so the app builds and the rest of the
 *  site works without one. Every caller must handle null rather than assume. */
export const sql = url ? neon(url) : null;

export const dbConfigured = Boolean(url);
