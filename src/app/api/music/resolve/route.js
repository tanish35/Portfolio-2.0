import {
  OCTAVE_HOST,
  describeOctaveTrack,
  readIdParam,
  resolveFullStream,
} from "@/lib/music-resolve";

export const runtime = "nodejs";

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

async function lookupMetadata(id) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(
      `https://api.deezer.com/track/${encodeURIComponent(id)}`,
      {
        signal: ctrl.signal,
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) return null;
    const t = await res.json();
    if (!t?.id) return null;
    return {
      name: t.title || "Untitled",
      artist: t.artist?.name || "",
      album: t.album?.title || "",
      artwork:
        t.album?.cover_medium || t.album?.cover_small || t.album?.cover || null,
      durationSec: Number.isFinite(t.duration) ? t.duration : null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = readIdParam(searchParams);
  if (!id) {
    return json(
      { error: "Invalid id. Expected a Deezer track id, e.g. id=4109128241" },
      400,
    );
  }

  const resolved = await resolveFullStream(id);
  if (!resolved) {
    return json({ error: "Full stream is temporarily unavailable" }, 502);
  }

  const meta = await lookupMetadata(id);
  const track = describeOctaveTrack({
    id,
    title: meta?.name ?? resolved.track?.name,
    artist: { name: meta?.artist ?? resolved.track?.artist },
    album: { title: meta?.album ?? resolved.track?.album },
    duration: meta?.durationSec ?? resolved.track?.durationSec,
  });
  if (meta?.artwork && track) track.artwork = meta.artwork;

  return json(
    {
      id: `deezer:${id}`,
      source: "deezer",
      quality: resolved.quality,
      durationSec: track?.durationSec ?? meta?.durationSec ?? null,
      track,
      ...(process.env.NODE_ENV !== "production" ? { url: resolved.url } : {}),
      note: "Stream the actual bytes from /api/music/stream?id=" + id,
      upstream: OCTAVE_HOST,
    },
    200,
    { "Cache-Control": "public, max-age=60" },
  );
}
