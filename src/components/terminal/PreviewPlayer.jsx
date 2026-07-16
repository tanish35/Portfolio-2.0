import { formatTime } from "./entries";

export function PreviewPlayer({
  track,
  playing,
  elapsed,
  duration,
  musicStatus,
  onToggle,
}) {
  if (!track) return null;
  const isFull = Boolean(track.isFull);
  return (
    <div className="border-t border-secondary-600 bg-[#141210]/95 shrink-0 px-3 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={onToggle}
          className="min-h-11 min-w-11 rounded border border-secondary-600 text-primary-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        {track.artwork ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.artwork}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded object-cover border border-secondary-600"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-xs text-teritiary-600 truncate">
            {track.name}{" "}
            <span className="text-teritiary-200">— {track.artist}</span>
          </div>
          <div className="h-1 mt-1 rounded bg-secondary-500 overflow-hidden">
            <div
              className="h-full bg-primary-200"
              style={{
                width: duration
                  ? `${Math.min(100, (elapsed / duration) * 100)}%`
                  : "0%",
              }}
            />
          </div>
          <div className="text-[10px] text-teritiary-200 mt-0.5 flex flex-wrap gap-x-2">
            <span>
              {musicStatus || (playing ? "playing" : "paused")}
              {duration
                ? ` · ${formatTime(elapsed)} / ${formatTime(duration)}`
                : ""}
            </span>
            <span className={isFull ? "text-primary-200" : ""}>
              {isFull ? "full track" : "30s preview"}
            </span>
            {track.externalUrl && (
              <a
                href={track.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-200 underline-offset-2 hover:underline"
              >
                {isFull ? "Open source" : "Open full track"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
