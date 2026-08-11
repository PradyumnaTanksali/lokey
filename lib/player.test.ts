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
});

test("cleanArtist drops channel suffixes", () => {
  assert.equal(cleanArtist("SZAVEVO"), "SZA");
  assert.equal(cleanArtist("Daniel Caesar - Topic"), "Daniel Caesar");
  assert.equal(cleanArtist("Cleo Sol"), "Cleo Sol");
});
