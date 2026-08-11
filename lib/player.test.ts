// node --test
import test from "node:test";
import assert from "node:assert/strict";
import { fmt, step, cleanTitle, cleanArtist } from "./player.ts";

test("fmt pads and survives garbage", () => {
  assert.equal(fmt(0), "0:00");
  assert.equal(fmt(9), "0:09");
  assert.equal(fmt(61.9), "1:01");
  assert.equal(fmt(3600), "60:00");
  assert.equal(fmt(NaN), "–:––");
  assert.equal(fmt(-1), "–:––");
});

test("step wraps both ways", () => {
  assert.equal(step(0, 5, 1), 1);
  assert.equal(step(4, 5, 1), 0);
  assert.equal(step(0, 5, -1), 4);
  assert.equal(step(0, 0, 1), 0);
});

test("cleanTitle strips YouTube dressing, keeps the song", () => {
  assert.equal(cleanTitle("SZA - Good Days (Official Video)"), "SZA - Good Days");
  assert.equal(cleanTitle("Sade - No Ordinary Love [Official Music Video]"), "Sade - No Ordinary Love");
  assert.equal(cleanTitle("Giveon - Heartbreak Anniversary (Official Audio)"), "Giveon - Heartbreak Anniversary");
  assert.equal(cleanTitle("Frank Ocean - Pink + White"), "Frank Ocean - Pink + White");
  // a bracket that is part of the title survives
  assert.equal(cleanTitle("dvsn - Too Deep (feat. Ty Dolla)"), "dvsn - Too Deep (feat. Ty Dolla)");
  assert.equal(
    cleanTitle("Maxwell - Ascension (Don't Ever Wonder) (Official 4K Video)"),
    "Maxwell - Ascension (Don't Ever Wonder)",
  );
});

test("cleanTitle peels the lofi mix tail", () => {
  assert.equal(
    cleanTitle("Rainy Days In Tokyo [Lofi Hip Hop / Jazzhop / Chillhop Mix] - Beats to chill/study/relax"),
    "Rainy Days In Tokyo",
  );
  assert.equal(cleanTitle("Rainy day • lofi ambient music | chill beats to relax/study to"), "Rainy day");
  assert.equal(cleanTitle("Sunny (no copyright) - lo-fi hip-hop/jazzhop beat"), "Sunny");
  assert.equal(cleanTitle("1 A.M Study Session 📚 [lofi hip hop]"), "1 A.M Study Session 📚");
  assert.equal(cleanTitle("midnight studying. [lofi / jazzhop / chill mix]"), "midnight studying.");
  assert.equal(
    cleanTitle("Whispers in the Fog - Relaxing Ambient Lofi Chillhop | Free Background Music"),
    "Whispers in the Fog",
  );
  assert.equal(cleanTitle("Sunny  Morning  [lo-fi hip hop mix]"), "Sunny Morning");
});

test("cleanTitle does not eat one-word song titles", () => {
  // "Free" and "Focus" are songs; the tail list must stay narrower than the
  // bracket list or these lose everything after the dash.
  assert.equal(cleanTitle("6LACK - Free [Lyric Video]"), "6LACK - Free");
  assert.equal(cleanTitle("H.E.R. - Focus (Official Video)"), "H.E.R. - Focus");
  // an unspaced hyphen is part of a word, not a separator
  assert.equal(cleanTitle('[FREE] Lo-Fi x Piano Type Beat "Midnight"'), 'Lo-Fi x Piano Type Beat "Midnight"');
  assert.equal(cleanTitle("Rain"), "Rain");
});

test("cleanArtist drops channel suffixes", () => {
  assert.equal(cleanArtist("SZAVEVO"), "SZA");
  assert.equal(cleanArtist("Daniel Caesar - Topic"), "Daniel Caesar");
  assert.equal(cleanArtist("Cleo Sol"), "Cleo Sol");
});
