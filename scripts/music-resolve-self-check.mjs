import assert from "node:assert/strict";
import { test } from "node:test";
import { readIdParam, streamUrl } from "../src/lib/music-resolve.js";

test("Monochrome stream URLs accept only track IDs", () => {
  const id = readIdParam(new URLSearchParams("id=monochrome:153941337660461056"));
  assert.equal(streamUrl(id), "https://tracks.monochrome.st/track/153941337660461056");
  assert.equal(readIdParam(new URLSearchParams("id=../search")), null);
  assert.equal(readIdParam(new URLSearchParams("id=other:3284976751")), null);
});
