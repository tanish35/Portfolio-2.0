/**
 * Free music search — no API key, no subscription.
 *
 *  - Audius   → full-length streamable tracks (open, decentralized catalog)
 *  - iTunes   → ~30s previews (broad mainstream catalog)
 *  - Deezer   → ~30s previews (fallback only)
 *
 * Results are merged: full tracks first, previews after. Each track carries
 * `isFull` + `durationSec` so the client can label full vs preview.
 *
 * GET /api/music/search?q=<query>
 */

export const runtime = "nodejs";

const AUDIUS_HOST = "https://discoveryprovider.audius.co";
const AUDIUS_APP = "tanish-portfolio";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function validateQuery(q) {
  if (typeof q !== "string") return null;
  const trimmed = q.trim();
  if (trimmed.length < 1 || trimmed.length > 80) return null;
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return null;
  return trimmed;
}

async function fetchWithTimeout(url, ms = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
  } finally {
    clearTimeout(timer);
  }
}

function sanitizeAudius(results) {
  if (!Array.isArray(results)) return [];
  const out = [];
  for (const t of results) {
    if (!t?.id || !t?.title || !t?.user?.name) continue;
    if (t.is_streamable === false) continue;
    out.push({
      id: `audius:${t.id}`,
      uri: `audius:track:${t.id}`,
      name: t.title,
      artist: t.user.name,
      album: "",
      artwork:
        t.artwork?.["150x150"] || t.artwork?.["480x480"] || t.artwork?.["1000x1000"] || null,
      previewUrl: `${AUDIUS_HOST}/v1/tracks/${t.id}/stream?app_name=${AUDIUS_APP}`,
      externalUrl: t.permalink ? `https://audius.co${t.permalink}` : null,
      source: "audius",
      isFull: true,
      durationSec: Number.isFinite(t.duration) ? t.duration : null,
    });
    if (out.length >= 10) break;
  }
  return out;
}

function sanitizeItunes(results) {
  if (!Array.isArray(results)) return [];
  const out = [];
  for (const t of results) {
    if (!t?.trackId || !t?.trackName || !t?.artistName) continue;
    if (!t.previewUrl) continue; // need playable preview
    out.push({
      id: `itunes:${t.trackId}`,
      uri: `itunes:track:${t.trackId}`,
      name: t.trackName,
      artist: t.artistName,
      album: t.collectionName || "",
      artwork: t.artworkUrl100 || t.artworkUrl60 || null,
      previewUrl: t.previewUrl,
      externalUrl: t.trackViewUrl || t.collectionViewUrl || null,
      source: "itunes",
      isFull: false,
      durationSec: 30,
    });
    if (out.length >= 10) break;
  }
  return out;
}

function sanitizeDeezer(data) {
  if (!Array.isArray(data)) return [];
  const out = [];
  for (const t of data) {
    if (!t?.id || !t?.title || !t?.artist?.name) continue;
    if (!t.preview) continue;
    out.push({
      id: `deezer:${t.id}`,
      uri: `deezer:track:${t.id}`,
      name: t.title,
      artist: t.artist.name,
      album: t.album?.title || "",
      artwork: t.album?.cover_medium || t.album?.cover_small || null,
      previewUrl: t.preview,
      externalUrl: t.link || null,
      source: "deezer",
      isFull: false,
      durationSec: 30,
    });
    if (out.length >= 10) break;
  }
  return out;
}

async function searchAudius(query) {
  const url = new URL(`${AUDIUS_HOST}/v1/tracks/search`);
  url.searchParams.set("query", query);
  url.searchParams.set("app_name", AUDIUS_APP);

  const res = await fetchWithTimeout(url.toString());
  if (!res.ok) throw new Error(`audius_${res.status}`);
  const data = await res.json();
  return sanitizeAudius(data.data);
}

async function searchItunes(query) {
  const country = process.env.MUSIC_MARKET || process.env.SPOTIFY_MARKET || "IN";
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", query);
  url.searchParams.set("media", "music");
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "15");
  url.searchParams.set("country", country.length === 2 ? country : "US");

  const res = await fetchWithTimeout(url.toString());
  if (!res.ok) throw new Error(`itunes_${res.status}`);
  const data = await res.json();
  return sanitizeItunes(data.results);
}

async function searchDeezer(query) {
  const url = new URL("https://api.deezer.com/search");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "15");

  const res = await fetchWithTimeout(url.toString());
  if (!res.ok) throw new Error(`deezer_${res.status}`);
  const data = await res.json();
  return sanitizeDeezer(data.data);
}

const norm = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Merge sources: full tracks first, drop preview duplicates of a full track. */
function mergeTracks(full, previews) {
  const seen = new Set(full.map((t) => `${norm(t.name)}|${norm(t.artist)}`));
  const merged = [...full];
  for (const t of previews) {
    const key = `${norm(t.name)}|${norm(t.artist)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(t);
    if (merged.length >= 12) break;
  }
  return merged.slice(0, 12);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = validateQuery(searchParams.get("q") || "");
    if (!query) {
      return json({ error: "Invalid query. Provide 1–80 characters." }, 400);
    }

    // Query Audius (full tracks) and iTunes (previews) in parallel.
    const [audiusRes, itunesRes] = await Promise.allSettled([
      searchAudius(query),
      searchItunes(query),
    ]);

    const full = audiusRes.status === "fulfilled" ? audiusRes.value : [];
    const previews = itunesRes.status === "fulfilled" ? itunesRes.value : [];

    let tracks = mergeTracks(full, previews);
    let source = full.length
      ? previews.length
        ? "audius+itunes"
        : "audius"
      : "itunes";

    // Nothing from either primary source → try Deezer previews.
    if (!tracks.length) {
      try {
        const deezer = await searchDeezer(query);
        if (deezer.length) {
          tracks = deezer;
          source = "deezer";
        }
      } catch {
        /* ignore */
      }
    }

    const anyFull = tracks.some((t) => t.isFull);

    return json({
      query,
      tracks,
      source,
      note: anyFull
        ? "full tracks (Audius) + 30s previews · free, no subscription"
        : "30-second previews only · free catalog search (no subscription)",
    });
  } catch (e) {
    if (e?.name === "AbortError") {
      return json({ error: "Music search timed out" }, 504);
    }
    return json({ error: "Music search is temporarily unavailable" }, 502);
  }
}
