export const OCTAVE_HOST = "https://api.octavestreaming.com";
export const OCTAVE_AUDIO_PATH = "/audio/320";

export function parseDeezerId(input) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();

  const m = trimmed.match(/^(?:deezer:)?(\d{1,10})$/);
  if (!m) return null;
  const n = m[1];
  if (n.length > 1 && n.startsWith("0")) return null;
  return n;
}

/** Allow `?id=deezer:NNN` or `?id=NNN`. */
export function readIdParam(searchParams) {
  const raw =
    searchParams.get("id") ||
    searchParams.get("trackId") ||
    searchParams.get("track") ||
    "";
  return parseDeezerId(raw);
}

export function describeOctaveTrack(track) {
  if (!track || !track.id) return null;
  return {
    id: `deezer:${track.id}`,
    uri: `deezer:track:${track.id}`,
    name: track.title || track.name || "Untitled",
    artist: track.artist?.name || track.artist || "",
    album: track.album?.title || track.album || "",
    artwork:
      track.album?.cover_medium ||
      track.album?.cover_small ||
      track.artwork ||
      null,
    durationSec: Number.isFinite(track.duration)
      ? track.duration
      : Number.isFinite(track.durationSec)
        ? track.durationSec
        : null,
    source: "deezer",
  };
}

export async function resolveFullStream(deezerId, { fetchImpl = fetch } = {}) {
  const id = parseDeezerId(deezerId);
  if (!id) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetchImpl(`${OCTAVE_HOST}/api/track/${id}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.url) return null;

    return {
      url: data.url,
      quality: data.quality || "320",
      track: describeOctaveTrack({ ...data, id }),
      headers: {
        "User-Agent": "tanish-portfolio/1.0 (+music-stream)",
        Accept: "audio/mpeg, audio/*;q=0.9, */*;q=0.5",
      },
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
