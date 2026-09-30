import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseDeezerId,
  readIdParam,
  describeOctaveTrack,
  resolveFullStream,
  OCTAVE_HOST,
  OCTAVE_AUDIO_PATH,
} from "../src/lib/music-resolve.js";

describe("parseDeezerId", () => {
  it("accepts plain numeric ids", () => {
    assert.equal(parseDeezerId("4109128241"), "4109128241");
    assert.equal(parseDeezerId("1"), "1");
  });
  it("accepts deezer: prefixed ids", () => {
    assert.equal(parseDeezerId("deezer:4109128241"), "4109128241");
  });
  it("rejects garbage", () => {
    assert.equal(parseDeezerId(""), null);
    assert.equal(parseDeezerId("abc"), null);
    assert.equal(parseDeezerId("12345678901234567"), null);
    assert.equal(parseDeezerId("0123"), null); // no leading zeros
    assert.equal(parseDeezerId(null), null);
    assert.equal(parseDeezerId(undefined), null);
    assert.equal(parseDeezerId("  4109128241  "), "4109128241");
  });
});

describe("readIdParam", () => {
  it("picks the first matching parameter", () => {
    const sp = new URLSearchParams("id=deezer:42&trackId=99");
    assert.equal(readIdParam(sp), "42");
  });
  it("falls back through id, trackId, track", () => {
    assert.equal(
      readIdParam(new URLSearchParams("track=3050380851")),
      "3050380851",
    );
    assert.equal(readIdParam(new URLSearchParams("")), null);
  });
});

describe("describeOctaveTrack", () => {
  it("normalizes track metadata", () => {
    const t = describeOctaveTrack({
      id: "4109128241",
      title: "Look at My Life",
      artist: { name: "Gracie Abrams" },
      album: { title: "Look at My Life", cover_medium: "https://x/cover.jpg" },
      duration: 190,
    });
    assert.equal(t.id, "deezer:4109128241");
    assert.equal(t.name, "Look at My Life");
    assert.equal(t.artist, "Gracie Abrams");
    assert.equal(t.album, "Look at My Life");
    assert.equal(t.durationSec, 190);
    assert.equal(t.source, "deezer");
  });
  it("returns null for missing id", () => {
    assert.equal(describeOctaveTrack({}), null);
    assert.equal(describeOctaveTrack(null), null);
  });
});

describe("resolveFullStream", () => {
  it("returns null for an invalid id without making a network call", async () => {
    const called = { count: 0 };
    const fakeFetch = () => {
      called.count += 1;
      return Promise.resolve(new Response("{}"));
    };
    const out = await resolveFullStream("not-an-id", { fetchImpl: fakeFetch });
    assert.equal(out, null);
    assert.equal(called.count, 0);
  });

  it("parses a successful Octave payload", async () => {
    const fakeJson = {
      id: "4109128241",
      url: `${OCTAVE_HOST}${OCTAVE_AUDIO_PATH}?track=4109128241&k=octk_fake`,
      preview: "https://example/preview.mp3",
      quality: "320",
    };
    const fakeFetch = () =>
      Promise.resolve(
        new Response(JSON.stringify(fakeJson), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    const out = await resolveFullStream("4109128241", { fetchImpl: fakeFetch });
    assert.ok(out, "expected a result");
    assert.equal(out.quality, "320");
    assert.ok(out.url.includes("track=4109128241"));
    assert.equal(out.track.id, "deezer:4109128241");
    assert.equal(out.track.source, "deezer");
  });

  it("returns null when upstream is not ok", async () => {
    const fakeFetch = () =>
      Promise.resolve(new Response("nope", { status: 500 }));
    const out = await resolveFullStream("4109128241", { fetchImpl: fakeFetch });
    assert.equal(out, null);
  });

  it("returns null when the payload has no url", async () => {
    const fakeFetch = () =>
      Promise.resolve(
        new Response(JSON.stringify({ id: "4109128241" }), { status: 200 }),
      );
    const out = await resolveFullStream("4109128241", { fetchImpl: fakeFetch });
    assert.equal(out, null);
  });
});

describe("constants", () => {
  it("uses the real Octave host", () => {
    assert.equal(OCTAVE_HOST, "https://api.octavestreaming.com");
    assert.equal(OCTAVE_AUDIO_PATH, "/audio/320");
  });
});
