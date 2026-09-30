import { HelpCard } from "./HelpCard";
import { MusicResults } from "./MusicResults";
import { SystemCard, TanishAscii } from "./SystemCard";
import { WhoamiReport } from "./WhoamiReport";

export function TranscriptEntry({ entry, editorProps }) {
  if (entry.type === "command") {
    return (
      <div className="flex gap-x-2">
        <span className="shrink-0">
          <span className="text-primary-200">tanish</span>
          <span className="text-teritiary-300"> ~ </span>
          <span className="text-primary-300">❯</span>
        </span>
        <span className="text-teritiary-600 break-all">{entry.command}</span>
      </div>
    );
  }

  if (entry.type === "system") {
    return (
      <div className="grid grid-cols-1 min-[480px]:grid-cols-[auto_minmax(0,1fr)] gap-3 sm:gap-5 items-start">
        <TanishAscii />
        <SystemCard />
      </div>
    );
  }

  if (entry.type === "help") {
    return <HelpCard />;
  }

  if (entry.type === "whoami") {
    return <WhoamiReport report={entry.report} />;
  }

  if (entry.type === "music-results") {
    return <MusicResults results={entry.results} query={entry.query} />;
  }

  if (entry.type === "anim") {
    return (
      <pre
        className={`terminal-anim font-ipa-gothic text-[11px] sm:text-xs leading-snug whitespace-pre-wrap select-none ${
          entry.variant === "matrix"
            ? "terminal-anim-matrix"
            : "terminal-anim-accent"
        }`}
        aria-live="polite"
      >
        {entry.frame}
      </pre>
    );
  }

  if (entry.type === "sudo-anim") {
    return (
      <pre
        className="sudo-anim text-primary-200 font-ipa-gothic text-[11px] sm:text-xs leading-snug whitespace-pre-wrap select-none"
        aria-live="polite"
      >
        {entry.frame}
      </pre>
    );
  }

  if (entry.type === "list") {
    return (
      <ul className="list-none pl-0 space-y-0.5 text-teritiary-500">
        {entry.items.map((item) => (
          <li key={item} className="break-words">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (entry.type === "editor" && editorProps) {
    return (
      <div className="border border-secondary-600 rounded-lg overflow-hidden bg-[#141210]">
        <div className="px-2 py-1 text-xs text-teritiary-300 border-b border-secondary-600 flex justify-between gap-2">
          <span>
            {entry.path} <span className="text-primary-200">[portfolio-vim]</span>
          </span>
          <span
            className={
              editorProps.dirty ? "text-primary-300" : "text-teritiary-200"
            }
          >
            {editorProps.dirty ? "modified" : "saved"}
          </span>
        </div>
        <textarea
          value={editorProps.value}
          onChange={(e) => editorProps.onChange(e.target.value)}
          onKeyDown={editorProps.onKeyDown}
          className="w-full min-h-[140px] bg-transparent text-teritiary-600 font-ipa-gothic text-base p-2 outline-none resize-y"
          spellCheck={false}
          aria-label={`Editing ${entry.path}`}
        />
        <div className="px-2 py-1 text-[11px] text-teritiary-200 border-t border-secondary-600">
          Ctrl/Cmd+S save · Esc exit
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 text-teritiary-500">
      {(entry.lines || []).map((line, i) => (
        <div key={`${entry.id}-${i}`} className="whitespace-pre-wrap break-words">
          {line}
        </div>
      ))}
    </div>
  );
}
