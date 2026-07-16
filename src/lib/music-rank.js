import Fuse from "fuse.js";

/**
 * Rank Spotify track candidates with Fuse.js.
 * Falls back to Spotify order when Fuse finds nothing.
 */
export function rankTracks(tracks, query) {
  if (!Array.isArray(tracks) || !tracks.length) return [];
  const q = (query || "").trim();
  if (!q) return [...tracks];

  const fuse = new Fuse(tracks, {
    keys: [
      { name: "name", weight: 0.65 },
      { name: "artist", weight: 0.25 },
      { name: "album", weight: 0.1 },
    ],
    includeScore: true,
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });

  const ranked = fuse.search(q);
  if (!ranked.length) return [...tracks];
  const seen = new Set(ranked.map((r) => r.item.id));
  const rest = tracks.filter((t) => !seen.has(t.id));
  return [...ranked.map((r) => r.item), ...rest];
}

export function parsePlayQuery(raw) {
  const m = (raw || "").trim().match(/^(?:spotify\s+)?play\s+(.+)$/i);
  return m ? m[1].trim() : "";
}

export function parseSearchQuery(raw) {
  const m = (raw || "").trim().match(/^search\s+(.+)$/i);
  return m ? m[1].trim() : "";
}

export function parseTrackQuery(raw) {
  const m = (raw || "").trim().match(/^track\s+(.+)$/i);
  return m ? m[1].trim() : "";
}

export function isPlayIndex(query) {
  return /^\d+$/.test((query || "").trim());
}
