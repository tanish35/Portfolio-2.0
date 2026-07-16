import { formatTime } from "./entries";

export function MusicResults({ results, query }) {
  if (!results?.length) return null;
  const anyFull = results.some((t) => t.isFull);
  return (
    <div className="music-results">
      <div className="music-results-head">
        Results{query ? ` for “${query}”` : ""}
        {anyFull ? " · full tracks + previews" : " · 30s previews"}
      </div>
      <ol className="music-results-list">
        {results.map((t, i) => (
          <li key={t.id}>
            <span className="text-primary-200">{i + 1}.</span>{" "}
            <span className="text-teritiary-600">{t.name}</span>
            <span className="text-teritiary-300"> — {t.artist}</span>
            {t.album ? (
              <span className="text-teritiary-200 text-xs"> · {t.album}</span>
            ) : null}{" "}
            {t.isFull ? (
              <span className="music-badge music-badge-full">
                full{t.durationSec ? ` · ${formatTime(t.durationSec)}` : ""}
              </span>
            ) : (
              <span className="music-badge music-badge-preview">30s</span>
            )}
          </li>
        ))}
      </ol>
      <div className="text-teritiary-200 text-xs mt-1">
        Enter track &lt;n&gt; to play (e.g. track 1)
      </div>
    </div>
  );
}
