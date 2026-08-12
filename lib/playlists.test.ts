// node --test
import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import {
  shareCodeFrom,
  isShareCode,
  parseVideoId,
  normalizeTitle,
  parseStoredTracks,
  CODE_LENGTH,
} from "./playlists.ts";

test("share codes are the right shape", () => {
  const code = shareCodeFrom(randomBytes(10));
  assert.equal(code.length, CODE_LENGTH);
  assert.ok(isShareCode(code), `${code} should match the pattern`);
  assert.throws(() => shareCodeFrom(new Uint8Array(4)));
  // ambiguous glyphs are not in the alphabet at all
  assert.ok(!/[ILOU]/.test(shareCodeFrom(new Uint8Array(Array.from({ length: 10 }, (_, i) => i)))));
});

test("share code symbols are uniform — the modulo-bias check", () => {
  // The alphabet is exactly 32 symbols so `byte & 31` cannot skew. If someone
  // swaps in a 30-symbol "unambiguous" alphabet, this test is what catches it.
  const counts = new Map<string, number>();
  const rounds = 20_000;
  for (let i = 0; i < rounds; i++) {
    for (const ch of shareCodeFrom(randomBytes(10))) {
      counts.set(ch, (counts.get(ch) ?? 0) + 1);
    }
  }
  assert.equal(counts.size, 32, "every symbol should appear");
  const expected = (rounds * CODE_LENGTH) / 32;
  for (const [symbol, n] of counts) {
    const drift = Math.abs(n - expected) / expected;
    assert.ok(drift < 0.15, `${symbol} drifted ${(drift * 100).toFixed(1)}% from uniform`);
  }
});

test("parseVideoId accepts the url shapes people actually paste", () => {
  const id = "dHU8B76kR_s";
  assert.equal(parseVideoId(id), id);
  assert.equal(parseVideoId(`  ${id}  `), id);
  assert.equal(parseVideoId(`https://www.youtube.com/watch?v=${id}`), id);
  assert.equal(parseVideoId(`https://youtube.com/watch?v=${id}&t=42s`), id);
  assert.equal(parseVideoId(`https://music.youtube.com/watch?v=${id}`), id);
  assert.equal(parseVideoId(`https://m.youtube.com/watch?v=${id}`), id);
  assert.equal(parseVideoId(`https://youtu.be/${id}`), id);
  assert.equal(parseVideoId(`https://youtu.be/${id}?si=abc`), id);
  assert.equal(parseVideoId(`https://www.youtube.com/embed/${id}`), id);
  assert.equal(parseVideoId(`https://www.youtube.com/shorts/${id}`), id);
});

test("parseVideoId refuses everything else", () => {
  // other hosts — this is the SSRF guard, so it matters more than the rest
  assert.equal(parseVideoId("https://evil.example.com/watch?v=dHU8B76kR_s"), null);
  assert.equal(parseVideoId("https://youtube.com.evil.example/watch?v=dHU8B76kR_s"), null);
  assert.equal(parseVideoId("http://169.254.169.254/latest/meta-data/"), null);
  assert.equal(parseVideoId("file:///etc/passwd"), null);
  assert.equal(parseVideoId("javascript:alert(1)"), null);
  // right host, not a video
  assert.equal(parseVideoId("https://www.youtube.com/@somechannel"), null);
  assert.equal(parseVideoId("https://www.youtube.com/playlist?list=PLabcdefghij"), null);
  assert.equal(parseVideoId("https://www.youtube.com/"), null);
  // wrong id length
  assert.equal(parseVideoId("dHU8B76kR_"), null);
  assert.equal(parseVideoId("dHU8B76kR_sX"), null);
  assert.equal(parseVideoId(""), null);
});

test("normalizeTitle cleans, caps, and refuses links", () => {
  assert.equal(normalizeTitle("  late   night  "), "late night");
  assert.equal(normalizeTitle("a".repeat(80))?.length, 80);
  assert.equal(normalizeTitle("a".repeat(81)), null);
  assert.equal(normalizeTitle(""), null);
  assert.equal(normalizeTitle("   "), null);
  // link spam, which is most of what an anonymous text field attracts
  assert.equal(normalizeTitle("buy now http://spam.example"), null);
  assert.equal(normalizeTitle("www.spam.example"), null);
  assert.equal(normalizeTitle("spam://x"), null);
  // invisible characters stripped, not merely trimmed
  assert.equal(normalizeTitle("cle​an"), "clean");
  assert.equal(normalizeTitle("‮reversed"), "reversed");
  assert.equal(normalizeTitle("​​"), null);
  // NFKC runs first, so a fullwidth url can't sneak past the link check
  assert.equal(normalizeTitle("ｗｗｗ．spam．example"), null);
});

test("parseStoredTracks rejects anything off-shape", () => {
  const ok = [{ v: "dHU8B76kR_s", t: "Title", a: "Artist" }];
  assert.deepEqual(parseStoredTracks(ok), ok);
  assert.equal(parseStoredTracks([]), null);
  assert.equal(parseStoredTracks("nope"), null);
  assert.equal(parseStoredTracks([{ v: "short", t: "T", a: "A" }]), null);
  assert.equal(parseStoredTracks([{ v: "dHU8B76kR_s", t: 5, a: "A" }]), null);
  assert.equal(parseStoredTracks([null]), null);
  // the 100-track cap is enforced here as well as by a CHECK constraint
  const many = Array.from({ length: 101 }, () => ({ v: "dHU8B76kR_s", t: "T", a: "A" }));
  assert.equal(parseStoredTracks(many), null);
  // long strings are truncated rather than rejected
  const long = parseStoredTracks([{ v: "dHU8B76kR_s", t: "x".repeat(500), a: "y".repeat(500) }]);
  assert.equal(long?.[0].t.length, 200);
  assert.equal(long?.[0].a.length, 120);
});
