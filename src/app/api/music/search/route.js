/**
 * Free music search via Apple iTunes Search API (no API key, no subscription).
 * Optional Deezer fallback. Returns ~30s preview URLs only.
 *
 * GET /api/music/search?q=<query>
 */

export const runtime = "nodejs";

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

function sanitizeItunes(results) {
  if (!Array.isArray(results)) return [];
  const out = [];
  for (const t of results) {
    if (!t?.trackId || !t?.trackName || !t?.artistName) continue;
    if (!t.previewUrl) continue; // need playable preview
    out.push({
      id: String(t.trackId),
      uri: `itunes:track:${t.trackId}`,
      name: t.trackName,
      artist: t.artistName,
      album: t.collectionName || "",
      artwork: t.artworkUrl100 || t.artworkUrl60 || null,
      previewUrl: t.previewUrl,
      externalUrl: t.trackViewUrl || t.collectionViewUrl || null,
      source: "itunes",
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
      id: String(t.id),
      uri: `deezer:track:${t.id}`,
      name: t.title,
      artist: t.artist.name,
      album: t.album?.title || "",
      artwork: t.album?.cover_medium || t.album?.cover_small || null,
      previewUrl: t.preview,
      externalUrl: t.link || null,
      source: "deezer",
    });
    if (out.length >= 10) break;
  }
  return out;
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = validateQuery(searchParams.get("q") || "");
    if (!query) {
      return json({ error: "Invalid query. Provide 1–80 characters." }, 400);
    }

    let tracks = [];
    let source = "itunes";
    let lastError = null;

    try {
      tracks = await searchItunes(query);
    } catch (e) {
      lastError = e;
    }

    if (!tracks.length) {
      try {
        tracks = await searchDeezer(query);
        if (tracks.length) source = "deezer";
      } catch (e) {
        lastError = e;
      }
    }

    if (!tracks.length && lastError?.name === "AbortError") {
      return json({ error: "Music search timed out" }, 504);
    }

    return json({
      query,
      tracks,
      source,
      note: "30-second previews only · free catalog search (no subscription)",
    });
  } catch (e) {
    if (e?.name === "AbortError") {
      return json({ error: "Music search timed out" }, 504);
    }
    return json({ error: "Music search is temporarily unavailable" }, 502);
  }
}
