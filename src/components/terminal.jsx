"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { experienceData } from "@/data/experience";
import { AUTHOR, ROLE, SITE_HOST } from "@/lib/site";
import {
  isPlayIndex,
  parsePlayQuery,
  parseSearchQuery,
  parseTrackQuery,
  rankTracks,
} from "@/lib/music-rank";
import {
  backflipFrames,
  bannerLines,
  containsBlockedWord,
  cowsay,
  diceResult,
  flipResult,
  fortuneText,
  hackFrames,
  hireLines,
  jokeText,
  manPage,
  matrixFrames,
  pingLines,
  skillsLines,
  trainFrames,
} from "@/lib/terminal-fun";
import {
  ALLOWLISTED_APPS,
  COMMAND_NAMES,
  FS_STORAGE_KEY,
  NMAP_HOSTS,
  NOTE_MAX_BYTES,
  NOTES_STORE_MAX_BYTES,
  SPOTIFY_SUBCOMMANDS,
  UI_STORAGE_KEY,
  VIRTUAL_ROOT,
  basename,
  buildProjectTargets,
  buildVfs,
  clampTerminalPosition,
  clampTerminalSize,
  completeToken,
  defaultTerminalPosition,
  defaultTerminalSize,
  expandGlob,
  formatSize,
  getNode,
  isUnderNotes,
  listDir,
  normalizePath,
  parseCommandLine,
  parseRm,
  resolveProject,
  suggestProjects,
} from "@/lib/terminal-core";

const RESUME_URL = "/files/resume.pdf";

const SYSTEM_INFO = [
  { label: "Role", value: ROLE },
  { label: "Location", value: "Mumbai, India" },
  { label: "Site", value: SITE_HOST },
  { label: "Shell", value: "portfolio-sh" },
  { label: "UI", value: "Next.js + React" },
  { label: "GitHub", value: "tanish35" },
  { label: "LinkedIn", value: "tanish34" },
  { label: "Theme", value: "one line at a time" },
];

const THEME_SWATCHES = ["#e63718", "#100f0d", "#fafafa", "#999999", "#e94b30"];

const ABOUT_BIO = `${AUTHOR} — ${ROLE} based in Mumbai. Building software one line at a time.`;

const HELP_LINES = [
  "Available commands:",
  "  help                 Show this command list",
  "  ls [-al] [path]      List virtual filesystem entries",
  "  cd <path|project>    Change directory or open project link",
  "  cat <path|*>         Print virtual text file(s)",
  "  rm [-rf] <path>      Remove browser-local notes only",
  "  open <app|file|proj> Open allowlisted app, file, or project",
  "  vim <file>           Edit a notes file inline",
  "  neofetch             Portfolio system card",
  "  pwd                  Print virtual working directory",
  "  whoami / about       Short bio",
  "  whoamireally         Full browser fingerprint + public IP",
  "  clear                Clear transcript",
  "  ifconfig             Browser connectivity snapshot",
  "  nmap <host>          Simulated scan (portfolio hosts + labeled sim)",
  "  projects             List projects and scroll",
  "  experience           Scroll to experience",
  "  contact              Scroll to contact",
  "  resume               Open resume PDF",
  "  play <song>          Search catalog (shows results)",
  "  search <query>       Same as play — list matches only",
  "  track <n>            Play result # from last search",
  "  results              Reprint last music search results",
  "  pause / continue     Control preview playback",
  "  stop / now           Stop preview or show now-playing",
  "",
  "Fun / easter eggs:",
  "  fortune · joke · cowsay [msg] · skills · hire",
  "  matrix · sl · hack · ping [host] · weather",
  "  flip · dice · coffee · banner · history · exit",
  "  man <cmd> · hello · please · sudo <anything>",
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function text(lines, extra = {}) {
  return {
    id: makeId(),
    type: "text",
    lines: Array.isArray(lines) ? lines : [lines],
    ...extra,
  };
}

function list(items) {
  return { id: makeId(), type: "list", items };
}

function systemEntry() {
  return { id: makeId(), type: "system" };
}

function commandEntry(cmd) {
  return { id: makeId(), type: "command", command: cmd };
}

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    history.pushState(null, "", hash);
  }
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(FS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    /* quota */
  }
}

function loadUiPrefs() {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUiPrefs(prefs) {
  try {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

function simulatedNmap(host) {
  const h = (host || "").trim() || "unknown";
  const lower = h.toLowerCase();
  const portfolioish =
    NMAP_HOSTS.includes(lower) ||
    lower.includes("tanish") ||
    lower === "127.0.0.1" ||
    lower === "localhost";

  const ports = portfolioish
    ? [
        "PORT     STATE    SERVICE",
        "22/tcp   closed   ssh",
        "80/tcp   open     http",
        "443/tcp  open     https",
        "3000/tcp filtered next-dev",
      ]
    : [
        "PORT     STATE    SERVICE",
        "22/tcp   filtered ssh",
        "80/tcp   filtered http",
        "443/tcp  filtered https",
      ];

  return [
    `Starting simulated Nmap 7.94 ( portfolio-sh ) at ${new Date().toISOString()}`,
    `Nmap scan report for ${h}`,
    "Host is up (0.0042s latency) — simulated.",
    ...ports,
    "",
    "NOTE: Simulated browser-local output only. No real network scan was performed.",
  ];
}

const TANISH_ASCII = `
████████╗ █████╗ ███╗   ██╗██╗███████╗██╗  ██╗
╚══██╔══╝██╔══██╗████╗  ██║██║██╔════╝██║  ██║
   ██║   ███████║██╔██╗ ██║██║███████╗███████║
   ██║   ██╔══██║██║╚██╗██║██║╚════██║██╔══██║
   ██║   ██║  ██║██║ ╚████║██║███████║██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝
`.trim();

function TanishAscii() {
  return (
    <pre
      className="text-primary-200 font-ipa-gothic text-[8px] sm:text-[9px] md:text-[10px] leading-[1.15] select-none whitespace-pre overflow-hidden shrink-0"
      aria-hidden="true"
    >
      {TANISH_ASCII}
    </pre>
  );
}

function SystemCard() {
  return (
    <div className="min-w-0">
      <div className="text-teritiary-700 font-medium">tanish@portfolio</div>
      <div className="text-teritiary-200 mb-2">----------------</div>
      <div className="space-y-0.5">
        {SYSTEM_INFO.map((row) => (
          <div
            key={row.label}
            className="flex gap-x-2 min-w-0 text-[13px] sm:text-sm"
          >
            <span className="text-primary-200 w-[4.8rem] shrink-0">
              {row.label}
            </span>
            <span className="text-teritiary-600 truncate">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {THEME_SWATCHES.map((c) => (
          <span
            key={c}
            className="size-2.5 rounded-sm border border-secondary-600"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

function WhoamiReport({ report }) {
  if (!report) return null;
  return (
    <div className="whoami-report">
      <div className="whoami-hero">
        <div className="whoami-hero-mark" aria-hidden="true">
          ?
        </div>
        <div className="min-w-0">
          <div className="whoami-title">{report.title || "whoamireally"}</div>
          <div className="whoami-subtitle">
            {report.subtitle || "Browser session probe"}
          </div>
        </div>
      </div>

      {report.summary?.length > 0 && (
        <div className="whoami-summary">
          {report.summary.map((item) => (
            <div key={item.label} className="whoami-chip">
              <span className="whoami-chip-label">{item.label}</span>
              <span className="whoami-chip-value">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="whoami-grid">
        {(report.sections || []).map((sec) => (
          <section key={sec.id || sec.title} className="whoami-card">
            <header className="whoami-card-head">
              <span className="whoami-card-icon" aria-hidden="true">
                {sec.icon || "·"}
              </span>
              <h3 className="whoami-card-title">{sec.title}</h3>
            </header>
            <dl className="whoami-rows">
              {(sec.rows || []).map((row) => (
                <div key={`${sec.title}-${row.label}`} className="whoami-row">
                  <dt>{row.label}</dt>
                  <dd title={row.value}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {report.footer && <p className="whoami-footer">{report.footer}</p>}
      {report.loading && (
        <p className="whoami-loading">Gathering extended signals…</p>
      )}
    </div>
  );
}

function MusicResults({ results, query }) {
  if (!results?.length) return null;
  return (
    <div className="music-results">
      <div className="music-results-head">
        Results{query ? ` for “${query}”` : ""} · 30s previews
      </div>
      <ol className="music-results-list">
        {results.map((t, i) => (
          <li key={t.id}>
            <span className="text-primary-200">{i + 1}.</span>{" "}
            <span className="text-teritiary-600">{t.name}</span>
            <span className="text-teritiary-300"> — {t.artist}</span>
            {t.album ? (
              <span className="text-teritiary-200 text-xs"> · {t.album}</span>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="text-teritiary-200 text-xs mt-1">
        Enter track &lt;n&gt; to play a preview (e.g. track 1)
      </div>
    </div>
  );
}

function TranscriptEntry({ entry, editorProps }) {
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
          entry.variant === "matrix" ? "terminal-anim-matrix" : "terminal-anim-accent"
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
            {entry.path}{" "}
            <span className="text-primary-200">[portfolio-vim]</span>
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
        <div
          key={`${entry.id}-${i}`}
          className="whitespace-pre-wrap break-words"
        >
          {line}
        </div>
      ))}
    </div>
  );
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Terminal() {
  const projectTargets = useMemo(() => buildProjectTargets(projects), []);
  const projectSlugs = useMemo(() => projects.map((p) => p.slug), []);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [size, setSize] = useState({ width: 640, height: 520 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [sizeOpen, setSizeOpen] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [cwd, setCwd] = useState(VIRTUAL_ROOT);
  const [notes, setNotes] = useState({});
  const [transcript, setTranscript] = useState(() => [
    systemEntry(),
    text(
      "type help · try projects · play hello · fortune · matrix · sudo rm -rf /",
      { muted: true },
    ),
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [liveMessage, setLiveMessage] = useState("");
  const [completionMsg, setCompletionMsg] = useState("");
  const [tabState, setTabState] = useState({ key: "", shown: false });

  const [pendingRm, setPendingRm] = useState(null);
  const [editor, setEditor] = useState(null);

  const [track, setTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicStatus, setMusicStatus] = useState("");
  const [lastMusicResults, setLastMusicResults] = useState([]);
  const [lastMusicQuery, setLastMusicQuery] = useState("");
  const [musicSearching, setMusicSearching] = useState(false);
  const [sudoBusy, setSudoBusy] = useState(false);

  const inputRef = useRef(null);
  const sudoTimersRef = useRef([]);
  const animTimersRef = useRef([]);
  const sessionStartRef = useRef(Date.now());
  const scrollRef = useRef(null);
  const windowRef = useRef(null);
  const audioRef = useRef(null);
  const musicAbortRef = useRef(null);
  const musicReqIdRef = useRef(0);
  const dragRef = useRef(null);
  const lastMusicResultsRef = useRef([]);
  lastMusicResultsRef.current = lastMusicResults;
  const sizeRef = useRef(size);
  const positionRef = useRef(position);
  sizeRef.current = size;
  positionRef.current = position;

  const vfs = useMemo(
    () => buildVfs({ projects, experience: experienceData, notes }),
    [notes],
  );

  const persistNotes = useCallback((next) => {
    setNotes(next);
    saveNotes(next);
  }, []);

  // mount + responsive + prefs
  useEffect(() => {
    setMounted(true);
    const prefs = loadUiPrefs();
    const mobile = window.innerWidth < 768;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setIsMobile(mobile);
    setNotes(loadNotes());

    if (mobile) {
      if (prefs?.minimized === false) setMinimized(false);
      else setMinimized(true);
    } else {
      const defaults = defaultTerminalSize(vw, vh);
      // Prefer fresh larger defaults over older compact saved sizes
      const savedW = prefs?.width;
      const savedH = prefs?.height;
      const useSavedSize =
        Number.isFinite(savedW) &&
        Number.isFinite(savedH) &&
        savedW >= vw * 0.45;
      const clamped = useSavedSize
        ? clampTerminalSize(savedW, savedH, vw, vh)
        : defaults;
      setSize(clamped);

      if (
        Number.isFinite(prefs?.x) &&
        Number.isFinite(prefs?.y) &&
        useSavedSize
      ) {
        setPosition(
          clampTerminalPosition(
            prefs.x,
            prefs.y,
            clamped.width,
            clamped.height,
            vw,
            vh,
          ),
        );
      } else {
        setPosition(
          defaultTerminalPosition(vw, vh, clamped.width, clamped.height),
        );
      }
      setMinimized(Boolean(prefs?.minimized));
    }

    const onResize = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      const nextSize = clampTerminalSize(
        sizeRef.current.width,
        sizeRef.current.height,
        window.innerWidth,
        window.innerHeight,
      );
      setSize(nextSize);
      setPosition((prev) =>
        clampTerminalPosition(
          prev.x,
          prev.y,
          nextSize.width,
          nextSize.height,
          window.innerWidth,
          window.innerHeight,
        ),
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // persist UI
  useEffect(() => {
    if (!mounted) return;
    saveUiPrefs({
      width: size.width,
      height: size.height,
      x: position.x,
      y: position.y,
      minimized,
    });
  }, [size, position, minimized, mounted]);

  // Pointer move (title bar) + resize (bottom-right grip)
  useEffect(() => {
    const onMove = (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (drag.mode === "move") {
        setPosition(
          clampTerminalPosition(
            drag.startX + (e.clientX - drag.pointerX),
            drag.startY + (e.clientY - drag.pointerY),
            sizeRef.current.width,
            sizeRef.current.height,
            window.innerWidth,
            window.innerHeight,
          ),
        );
        return;
      }
      if (drag.mode === "resize") {
        setSize(
          clampTerminalSize(
            drag.startW + (e.clientX - drag.pointerX),
            drag.startH + (e.clientY - drag.pointerY),
            window.innerWidth,
            window.innerHeight,
          ),
        );
      }
    };
    const onUp = () => {
      if (!dragRef.current) return;
      // Keep on-screen after size change
      if (dragRef.current.mode === "resize") {
        setPosition((prev) =>
          clampTerminalPosition(
            prev.x,
            prev.y,
            sizeRef.current.width,
            sizeRef.current.height,
            window.innerWidth,
            window.innerHeight,
          ),
        );
      }
      dragRef.current = null;
      setResizing(false);
      setDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, editor, completionMsg]);

  const append = useCallback((entries, live) => {
    setTranscript((prev) => [...prev, ...entries]);
    if (live) setLiveMessage(live);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setElapsed(audio.currentTime || 0);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => {
      setPlaying(true);
      setMusicStatus("playing");
    };
    const onPause = () => {
      setPlaying(false);
      if (
        audio.currentTime > 0 &&
        audio.currentTime < (audio.duration || 0) - 0.25
      ) {
        setMusicStatus("paused");
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setMusicStatus("ended");
      setElapsed(0);
    };
    const onError = () => {
      setPlaying(false);
      setMusicStatus("error");
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    return () => {
      musicAbortRef.current?.abort();
      sudoTimersRef.current.forEach(clearTimeout);
      sudoTimersRef.current = [];
      animTimersRef.current.forEach(clearTimeout);
      animTimersRef.current = [];
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, []);

  const playAnimFrames = useCallback((frames, { variant = "accent", interval = 120 } = {}) => {
    const entryId = makeId();
    const list = Array.isArray(frames) ? frames : [String(frames)];
    append(
      [{ id: entryId, type: "anim", variant, frame: list[0] }],
      "animation",
    );
    animTimersRef.current.forEach(clearTimeout);
    animTimersRef.current = [];
    list.forEach((frame, i) => {
      if (i === 0) return;
      const t = setTimeout(() => {
        setTranscript((prev) =>
          prev.map((e) =>
            e.id === entryId && e.type === "anim" ? { ...e, frame } : e,
          ),
        );
      }, i * interval);
      animTimersRef.current.push(t);
    });
  }, [append]);

  const runSudoPrank = useCallback(
    (raw) => {
      if (sudoBusy) return;
      setSudoBusy(true);

      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      setTrack(null);
      setPlaying(false);
      setElapsed(0);
      setDuration(0);
      setMusicStatus("");

      const entryId = makeId();
      const frames = [
        `tanish ~ ❯ ${raw}\n\n[sudo] password for visitor: ********\n`,
        `tanish ~ ❯ ${raw}\n\n[sudo] password for visitor: ********\n\nInitializing packet forge…\n`,
        `tanish ~ ❯ ${raw}\n\n[sudo] password for visitor: ********\n\nInitializing packet forge…\nResolving target: tanish.site\n`,
        `
 ██████╗ ██████╗  ██████╗ ███████╗
 ██╔══██╗██╔══██╗██╔═══██╗██╔════╝
 ██║  ██║██║  ██║██║   ██║███████╗
 ██║  ██║██║  ██║██║   ██║╚════██║
 ██████╔╝██████╔╝╚██████╔╝███████║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝

 >>> DDOSING THIS PORTFOLIO <<<
 target   tanish.site
 mode     theatrical / fake / 0 harm
`,
        `
 ██████╗ ██████╗  ██████╗ ███████╗
 ██╔══██╗██╔══██╗██╔═══██╗██╔════╝
 ██║  ██║██║  ██║██║   ██║███████╗
 ██║  ██║██║  ██║██║   ██║╚════██║
 ██████╔╝██████╔╝╚██████╔╝███████║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝

 >>> DDOSING THIS PORTFOLIO <<<
 [████░░░░░░░░░░░░░░░░]  22%
 flooding /about with compliments…
`,
        `
 ██████╗ ██████╗  ██████╗ ███████╗
 ██╔══██╗██╔══██╗██╔═══██╗██╔════╝
 ██║  ██║██║  ██║██║   ██║███████╗
 ██║  ██║██║  ██║██║   ██║╚════██║
 ██████╔╝██████╔╝╚██████╔╝███████║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝

 >>> DDOSING THIS PORTFOLIO <<<
 [████████████░░░░░░░░]  61%
 saturating /projects with star reactions…
`,
        `
 ██████╗ ██████╗  ██████╗ ███████╗
 ██╔══██╗██╔══██╗██╔═══██╗██╔════╝
 ██║  ██║██║  ██║██║   ██║███████╗
 ██║  ██║██║  ██║██║   ██║╚════██║
 ██████╔╝██████╔╝╚██████╔╝███████║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝

 >>> DDOSING THIS PORTFOLIO <<<
 [██████████████████░░]  91%
 last hit: one line at a time…
`,
        `
 ██████╗ ██████╗  ██████╗ ███████╗
 ██╔══██╗██╔══██╗██╔═══██╗██╔════╝
 ██║  ██║██║  ██║██║   ██║███████╗
 ██║  ██║██║  ██║██║   ██║╚════██║
 ██████╔╝██████╔╝╚██████╔╝███████║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝

 ★★★  DDOS SUCCESSFUL  ★★★
 shutting down terminal…
`,
      ];

      setTranscript([
        {
          id: entryId,
          type: "sudo-anim",
          frame: frames[0],
        },
      ]);
      setLiveMessage("sudo");

      sudoTimersRef.current.forEach(clearTimeout);
      sudoTimersRef.current = [];

      frames.forEach((frame, i) => {
        if (i === 0) return;
        const t = setTimeout(() => {
          setTranscript((prev) =>
            prev.map((e) =>
              e.id === entryId && e.type === "sudo-anim" ? { ...e, frame } : e,
            ),
          );
        }, i * 480);
        sudoTimersRef.current.push(t);
      });

      const closeT = setTimeout(() => {
        setTranscript([]);
        setHistory([]);
        setHistoryIndex(-1);
        setInput("");
        setSudoBusy(false);
        setMinimized(true);
        setLiveMessage("Terminal closed");
      }, frames.length * 480 + 700);
      sudoTimersRef.current.push(closeT);
    },
    [sudoBusy],
  );

  const loadAndPlayTrack = useCallback(
    (nextTrack, queryLabel) => {
      if (!nextTrack?.previewUrl) {
        return text(
          `No preview available for ${nextTrack?.name || "track"} — ${nextTrack?.artist || ""}`.trim(),
        );
      }

      setTrack(nextTrack);
      setMusicStatus("loading");
      setPlaying(false);
      setElapsed(0);
      setDuration(0);

      requestAnimationFrame(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.src = nextTrack.previewUrl;
        audio.load();
        audio
          .play()
          .then(() => {
            setPlaying(true);
            setMusicStatus("playing");
          })
          .catch(() => {
            setPlaying(false);
            setMusicStatus("press-play");
            append(
              [
                text(
                  "Preview loaded — press ▶ in the player if autoplay was blocked.",
                ),
              ],
              "Press play",
            );
          });
      });

      return text([
        queryLabel ? `search match for: ${queryLabel}` : "loading preview…",
        `preview ${nextTrack.name} — ${nextTrack.artist}`,
        "[30s free preview · not full track]",
      ]);
    },
    [append],
  );

  const searchMusic = useCallback(
    async (query) => {
      const q = (query || "").trim();
      if (!q) {
        append([text("usage: play <song or artist>")], "usage");
        return;
      }

      musicAbortRef.current?.abort();
      const ctrl = new AbortController();
      musicAbortRef.current = ctrl;
      const reqId = ++musicReqIdRef.current;
      setMusicSearching(true);
      append([text(`searching free catalog for “${q}”…`)], "searching music");

      try {
        const res = await fetch(
          `/api/music/search?q=${encodeURIComponent(q)}`,
          { signal: ctrl.signal },
        );
        if (reqId !== musicReqIdRef.current) return;

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          append(
            [text(data.error || "Music search is temporarily unavailable")],
            "music search failed",
          );
          return;
        }

        const ranked = rankTracks(data.tracks || [], q);
        setLastMusicResults(ranked);
        setLastMusicQuery(q);

        if (!ranked.length) {
          append(
            [text(`No tracks with previews found for “${q}”.`)],
            "no tracks",
          );
          return;
        }

        append(
          [
            {
              id: makeId(),
              type: "music-results",
              results: ranked,
              query: q,
            },
            text([
              data.source
                ? `source: ${data.source} · 30s previews`
                : "30s previews",
              `Enter track <n> to play (e.g. track 1 … track ${ranked.length})`,
            ]),
          ],
          "results ready — use track <n>",
        );
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (reqId !== musicReqIdRef.current) return;
        append(
          [text("Music search failed (offline or blocked).")],
          "music error",
        );
      } finally {
        if (reqId === musicReqIdRef.current) setMusicSearching(false);
      }
    },
    [append],
  );

  const playTrackByNumber = useCallback(
    (rawIndex) => {
      const n = Number(String(rawIndex || "").trim());
      const list = lastMusicResultsRef.current;
      if (!list.length) {
        return [text("No search results yet. Try: play closer")];
      }
      if (!Number.isFinite(n) || n < 1 || n > list.length) {
        return [text(`usage: track <1–${list.length}>  (from last search)`)];
      }
      const chosen = list[n - 1];
      return [
        loadAndPlayTrack(
          chosen,
          lastMusicQuery ? `${lastMusicQuery} #${n}` : `#${n}`,
        ),
      ];
    },
    [loadAndPlayTrack, lastMusicQuery],
  );

  const vfsPaths = useCallback(() => {
    const dirs = [];
    const files = [];
    for (const [p, n] of vfs.entries()) {
      const rel = p === VIRTUAL_ROOT ? "." : p.replace(`${VIRTUAL_ROOT}/`, "");
      if (n.type === "dir") dirs.push(rel === "." ? rel : rel);
      else files.push(rel);
    }
    return { dirs, files };
  }, [vfs]);

  const MUSIC_COMMANDS = useMemo(
    () =>
      new Set([
        "play",
        "search",
        "track",
        "results",
        "pause",
        "continue",
        "stop",
        "now",
        "spotify",
      ]),
    [],
  );

  const dismissMusicPlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setTrack(null);
    setPlaying(false);
    setElapsed(0);
    setDuration(0);
    setMusicStatus("");
  }, []);

  const controlMusic = useCallback(
    (action) => {
      const audio = audioRef.current;
      if (action === "pause") {
        audio?.pause();
        setPlaying(false);
        setMusicStatus("paused");
        return [text("Paused.")];
      }
      if (action === "continue") {
        if (!track) return [text("Nothing to continue. Try: play <song>")];
        audio
          ?.play()
          .then(() => {
            setPlaying(true);
            setMusicStatus("playing");
          })
          .catch(() => setMusicStatus("press-play"));
        return [text(`Continuing ${track.name} — ${track.artist}`)];
      }
      if (action === "stop") {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setPlaying(false);
        setElapsed(0);
        setMusicStatus("stopped");
        setTrack(null);
        return [text("Stopped.")];
      }
      if (action === "now") {
        if (!track) return [text("Nothing playing.")];
        return [
          text(
            [
              `${track.name} — ${track.artist}`,
              `${musicStatus || (playing ? "playing" : "paused")}  ${formatTime(elapsed)} / ${formatTime(duration)}`,
              "[30s free preview]",
              track.externalUrl || "",
            ].filter(Boolean),
          ),
        ];
      }
      return [text("unknown music action")];
    },
    [track, playing, elapsed, duration, musicStatus],
  );

  const runWhoamiReallyProbe = useCallback(async (entryId) => {
    try {
      const { collectAsyncProbe } = await import("@/lib/whoami-probe");
      const extra = await collectAsyncProbe();
      setTranscript((prev) =>
        prev.map((e) => {
          if (e.id !== entryId || e.type !== "whoami") return e;
          return {
            ...e,
            report: {
              ...e.report,
              sections: [
                ...(e.report.sections || []),
                ...(extra.sections || []),
              ],
              footer: extra.footer,
              loading: false,
            },
          };
        }),
      );
      setLiveMessage("whoamireally probe complete");
    } catch {
      setTranscript((prev) =>
        prev.map((e) => {
          if (e.id !== entryId || e.type !== "whoami") return e;
          return {
            ...e,
            report: {
              ...e.report,
              loading: false,
              footer:
                "Extended probe failed — local snapshot above still applies.",
            },
          };
        }),
      );
      setLiveMessage("whoamireally probe failed");
    }
  }, []);

  const execute = useCallback(
    (rawInput) => {
      const raw = rawInput.trim();
      if (!raw || sudoBusy) return;

      // Whole-word language filter (grass ≠ ass; "cowsay ass" triggers)
      if (containsBlockedWord(raw)) {
        setHistory((h) => [...h, raw]);
        setHistoryIndex(-1);
        setInput("");
        setTabState({ key: "", shown: false });
        setCompletionMsg("");
        append([commandEntry(raw)], "language filter");
        playAnimFrames(backflipFrames(), { variant: "accent", interval: 220 });
        return;
      }

      // Easter egg: any `sudo ...` triggers fake DDOS animation then closes
      if (/^sudo(\s|$)/i.test(raw)) {
        setHistory((h) => [...h, raw]);
        setHistoryIndex(-1);
        setInput("");
        setTabState({ key: "", shown: false });
        setCompletionMsg("");
        runSudoPrank(raw);
        return;
      }

      if (pendingRm && !raw.startsWith("rm")) {
        if (/^y(es)?$/i.test(raw)) {
          const path = pendingRm;
          setPendingRm(null);
          if (!isUnderNotes(path) || path === `${VIRTUAL_ROOT}/notes`) {
            append(
              [
                commandEntry(raw),
                text("refusing: only notes/* can be removed"),
              ],
              "Remove refused",
            );
            return;
          }
          const name = basename(path);
          const next = { ...notes };
          delete next[name];
          persistNotes(next);
          append(
            [commandEntry(raw), text(`removed ${path} (browser-local only)`)],
            "File removed",
          );
          return;
        }
        if (/^n(o)?$/i.test(raw)) {
          setPendingRm(null);
          append([commandEntry(raw), text("rm cancelled")], "rm cancelled");
          return;
        }
      }

      const parsed = parseCommandLine(raw);
      if (!parsed) return;

      const { name, args, flags } = parsed;
      // Hide preview player when leaving music commands
      if (!MUSIC_COMMANDS.has(name)) {
        dismissMusicPlayer();
      }

      const out = [commandEntry(raw)];
      let live = "";

      const usage = (msg) => {
        out.push(text(msg));
        live = msg;
      };

      switch (name) {
        case "help": {
          out.push(text(HELP_LINES));
          live = "Help listed";
          break;
        }
        case "clear": {
          setTranscript([]);
          setLiveMessage("Terminal cleared");
          setInput("");
          setHistoryIndex(-1);
          return;
        }
        case "pwd": {
          out.push(text(cwd));
          live = cwd;
          break;
        }
        case "whoami":
        case "about": {
          out.push(text([`tanish`, ABOUT_BIO]));
          live = "About";
          break;
        }
        case "neofetch": {
          out.push(systemEntry());
          live = "neofetch";
          break;
        }
        case "projects": {
          scrollToHash("#project-1");
          out.push(
            list(projects.map((p, i) => `${i + 1}. ${p.title} — ${p.caption}`)),
          );
          live = "Projects";
          break;
        }
        case "experience": {
          scrollToHash("#experience");
          out.push(text("Scrolling to experience…"));
          live = "Experience";
          break;
        }
        case "contact": {
          scrollToHash("#contact");
          out.push(text("Scrolling to contact…"));
          live = "Contact";
          break;
        }
        case "resume": {
          openExternal(RESUME_URL);
          out.push(text("Opening resume…"));
          live = "Resume";
          break;
        }
        case "ls": {
          const pathArg = args[0] || ".";
          const target = normalizePath(pathArg, cwd);
          const entries = listDir(vfs, target, {
            all: flags.includes("a"),
          });
          if (!entries) {
            usage(`ls: ${pathArg}: no such directory`);
            break;
          }
          if (flags.includes("l")) {
            out.push(
              text(
                entries.map((e) => {
                  const kind = e.type === "dir" ? "d" : "-";
                  const size = e.type === "file" ? formatSize(e.content) : "-";
                  const m = e.mtime
                    ? new Date(e.mtime)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")
                    : "-";
                  return `${kind}  ${size.padStart(6)}  ${m}  ${e.name}${e.type === "dir" ? "/" : ""}`;
                }),
              ),
            );
          } else {
            out.push(
              text(
                entries
                  .map((e) => `${e.name}${e.type === "dir" ? "/" : ""}`)
                  .join("  ") || "(empty)",
              ),
            );
          }
          live = "ls";
          break;
        }
        case "cd": {
          if (!args[0]) {
            setCwd(VIRTUAL_ROOT);
            out.push(text(VIRTUAL_ROOT));
            live = VIRTUAL_ROOT;
            break;
          }
          // fuzzy basename: res → resume.pdf
          let argPath = args[0];
          const { files: allFiles } = (() => {
            const files = [];
            for (const [p, n] of vfs.entries()) {
              if (n.type === "file") {
                files.push(
                  p === VIRTUAL_ROOT ? "." : p.replace(`${VIRTUAL_ROOT}/`, ""),
                );
              }
            }
            return { files };
          })();
          if (
            !argPath.includes("/") &&
            !getNode(vfs, normalizePath(argPath, cwd))
          ) {
            const fuzzy = allFiles.filter((f) => {
              const base = f.includes("/")
                ? f.slice(f.lastIndexOf("/") + 1)
                : f;
              return (
                base.toLowerCase().startsWith(argPath.toLowerCase()) ||
                base.toLowerCase().includes(argPath.toLowerCase())
              );
            });
            if (fuzzy.length === 1) argPath = fuzzy[0];
          }
          const target = normalizePath(argPath, cwd);
          const node = getNode(vfs, target);
          if (node?.type === "dir") {
            setCwd(target);
            out.push(text(target));
            live = target;
            break;
          }
          if (node?.type === "file") {
            if (node.binary || target.endsWith("resume.pdf")) {
              openExternal(RESUME_URL);
              out.push(text(`Opening ${basename(target)}…`));
              live = "open file";
              break;
            }
            out.push(text(node.content.replace(/\n$/, "")));
            live = "read file";
            break;
          }
          const appKey = argPath.toLowerCase();
          if (ALLOWLISTED_APPS[appKey]) {
            openExternal(ALLOWLISTED_APPS[appKey]);
            out.push(text(`Opening ${appKey}…`));
            live = `Open ${appKey}`;
            break;
          }
          const proj = resolveProject(argPath, projectTargets);
          if (proj) {
            openExternal(proj.buttonLink);
            out.push(text(`Opening project ${proj.slug}…`));
            live = `Open ${proj.slug}`;
            break;
          }
          const suggestions = suggestProjects(argPath, projectTargets);
          if (suggestions.length) {
            usage(
              `cd: ${args[0]}: not found. Did you mean: ${suggestions.map((s) => s.slug).join(", ")}?`,
            );
          } else {
            usage(`cd: ${args[0]}: no such file or directory`);
          }
          break;
        }
        case "cat": {
          if (!args[0]) {
            usage("usage: cat <path|*>");
            break;
          }
          const paths = expandGlob(vfs, cwd, args[0]);
          if (!paths.length) {
            usage(`cat: ${args[0]}: no such file`);
            break;
          }
          const lines = [];
          for (const p of paths) {
            const node = getNode(vfs, p);
            if (!node || node.type !== "file") {
              lines.push(`cat: ${p}: not a file`);
              continue;
            }
            if (node.binary) {
              lines.push(`cat: ${p}: binary file`);
              continue;
            }
            if (paths.length > 1) lines.push(`==> ${p} <==`);
            lines.push(node.content.replace(/\n$/, ""));
          }
          out.push(text(lines));
          live = "cat";
          break;
        }
        case "rm": {
          const rm = parseRm(raw);
          if (!rm?.path) {
            usage("usage: rm [-rf] <path>");
            break;
          }
          // Classic prank paths
          if (
            rm.path === "/" ||
            rm.path === "/*" ||
            rm.path === "~" ||
            rm.path === "/*.*" ||
            /^\/?\*$/.test(rm.path)
          ) {
            out.push(
              text([
                "rm: it is not a good idea to wipe the internet today.",
                "permission denied: universe.readOnly = true",
                "tip: try `sudo rm -rf /` for the theatrical version",
              ]),
            );
            live = "rm denied";
            break;
          }
          const target = normalizePath(rm.path, cwd);
          if (!isUnderNotes(target) || target === `${VIRTUAL_ROOT}/notes`) {
            usage("rm: only browser-local files under notes/ can be removed");
            break;
          }
          const node = getNode(vfs, target);
          if (!node) {
            usage(`rm: ${rm.path}: no such file`);
            break;
          }
          if (node.type === "dir" && !rm.recursive) {
            usage(`rm: ${rm.path}: is a directory (use -r)`);
            break;
          }
          if (!rm.force) {
            setPendingRm(target);
            out.push(text(`remove ${target} (browser-local only)? [y/N]`));
            live = "Confirm rm";
            break;
          }
          const name = basename(target);
          const next = { ...notes };
          delete next[name];
          persistNotes(next);
          out.push(text(`removed ${target} (browser-local only)`));
          live = "removed";
          break;
        }
        case "open": {
          if (!args[0]) {
            usage("usage: open <app|file|project>");
            break;
          }
          const key = args[0].toLowerCase();
          if (ALLOWLISTED_APPS[key]) {
            openExternal(ALLOWLISTED_APPS[key]);
            out.push(text(`Opening ${key}…`));
            live = `Open ${key}`;
            break;
          }
          const filePath = normalizePath(args[0], cwd);
          const fileNode = getNode(vfs, filePath);
          if (fileNode?.type === "file") {
            if (fileNode.binary || filePath.endsWith("resume.pdf")) {
              openExternal(RESUME_URL);
              out.push(text("Opening resume…"));
            } else {
              out.push(text(fileNode.content.replace(/\n$/, "")));
            }
            live = "open file";
            break;
          }
          const proj = resolveProject(args[0], projectTargets);
          if (proj) {
            openExternal(proj.buttonLink);
            out.push(text(`Opening project ${proj.slug}…`));
            live = `Open ${proj.slug}`;
            break;
          }
          const suggestions = suggestProjects(args[0], projectTargets);
          usage(
            suggestions.length
              ? `open: not found. Did you mean: ${suggestions.map((s) => s.slug).join(", ")}?`
              : `open: ${args[0]}: not found`,
          );
          break;
        }
        case "vim": {
          if (!args[0]) {
            usage("usage: vim <file>");
            break;
          }
          let target = normalizePath(args[0], cwd);
          if (!target.includes("/notes/") && !args[0].includes("/")) {
            target = normalizePath(`notes/${args[0]}`, VIRTUAL_ROOT);
          }
          if (!isUnderNotes(target) || target === `${VIRTUAL_ROOT}/notes`) {
            usage("vim: only notes/* are editable (browser-local)");
            break;
          }
          if (!target.endsWith(".txt")) {
            // allow any note name; default .txt if no extension
            if (!basename(target).includes(".")) {
              target = `${target}.txt`;
            }
          }
          const existing = getNode(vfs, target);
          if (existing?.readonly) {
            usage("vim: file is read-only");
            break;
          }
          const name = basename(target);
          const content = existing?.content ?? notes[name]?.content ?? "";
          out.push({ id: makeId(), type: "editor", path: target });
          setEditor({
            path: target,
            name,
            value: content,
            original: content,
            dirty: false,
          });
          live = "Editor open";
          break;
        }
        case "whoamireally": {
          const run = async () => {
            const { collectLocalProbe } = await import("@/lib/whoami-probe");
            const local = collectLocalProbe();
            const entryId = makeId();
            append(
              [
                commandEntry(raw),
                {
                  id: entryId,
                  type: "whoami",
                  report: {
                    ...local,
                    loading: true,
                    footer:
                      "Fetching FingerprintJS, battery, media, storage, IP…",
                  },
                },
              ],
              "whoamireally",
            );
            setHistory((h) => [...h, raw]);
            setHistoryIndex(-1);
            setInput("");
            setTabState({ key: "", shown: false });
            setCompletionMsg("");
            runWhoamiReallyProbe(entryId);
          };
          run();
          return;
        }
        case "play":
        case "search": {
          if (musicSearching) {
            out.push(text("Search already in progress…"));
            live = "busy";
            break;
          }
          const q =
            (name === "play" ? parsePlayQuery(raw) : parseSearchQuery(raw)) ||
            args.join(" ");
          if (!q) {
            usage(
              name === "play"
                ? "usage: play <song or artist>  then  track <n>"
                : "usage: search <song or artist>  then  track <n>",
            );
            break;
          }
          // Bare number on play → treat as track selection shortcut
          if (name === "play" && isPlayIndex(q)) {
            out.push(...playTrackByNumber(q));
            live = "track";
            break;
          }
          append(out, name);
          setHistory((h) => [...h, raw]);
          setHistoryIndex(-1);
          setInput("");
          setTabState({ key: "", shown: false });
          setCompletionMsg("");
          searchMusic(q);
          return;
        }
        case "track": {
          const q = parseTrackQuery(raw) || args[0] || "";
          if (!q) {
            usage("usage: track <n>  (from last search results)");
            break;
          }
          out.push(...playTrackByNumber(q));
          live = "track";
          break;
        }
        case "results": {
          if (!lastMusicResultsRef.current.length) {
            out.push(text("No recent music results. Try: search hello"));
            live = "no results";
            break;
          }
          out.push({
            id: makeId(),
            type: "music-results",
            results: lastMusicResultsRef.current,
            query: lastMusicQuery,
          });
          live = "results";
          break;
        }
        case "pause": {
          out.push(...controlMusic("pause"));
          live = "pause";
          break;
        }
        case "continue": {
          out.push(...controlMusic("continue"));
          live = "continue";
          break;
        }
        case "stop": {
          out.push(...controlMusic("stop"));
          live = "stop";
          break;
        }
        case "now": {
          out.push(...controlMusic("now"));
          live = "now";
          break;
        }
        case "fortune": {
          out.push(text(fortuneText()));
          live = "fortune";
          break;
        }
        case "joke": {
          out.push(text(jokeText()));
          live = "joke";
          break;
        }
        case "cowsay": {
          out.push(text(cowsay(args.join(" ") || "one line at a time")));
          live = "cowsay";
          break;
        }
        case "skills": {
          out.push(text(skillsLines()));
          live = "skills";
          break;
        }
        case "hire":
        case "status": {
          out.push(text(hireLines()));
          live = "hire";
          break;
        }
        case "echo": {
          out.push(text(args.join(" ") || ""));
          live = "echo";
          break;
        }
        case "history": {
          if (!history.length) {
            out.push(text("history is empty — make some mistakes first"));
          } else {
            out.push(
              text(
                history.map(
                  (h, i) => `  ${String(i + 1).padStart(3)}  ${h}`,
                ),
              ),
            );
          }
          live = "history";
          break;
        }
        case "exit":
        case "logout": {
          out.push(text("logout — terminal minimized. click >_ to reopen."));
          live = "exit";
          append([...out], live);
          setHistory((h) => [...h, raw]);
          setHistoryIndex(-1);
          setInput("");
          setTimeout(() => setMinimized(true), 280);
          return;
        }
        case "ping": {
          out.push(text(pingLines(args[0] || "tanish.site")));
          live = "ping";
          break;
        }
        case "weather": {
          append(out, "weather");
          setHistory((h) => [...h, raw]);
          setHistoryIndex(-1);
          setInput("");
          (async () => {
            try {
              const place = args.join(" ") || "Mumbai";
              const res = await fetch(
                `/api/weather?q=${encodeURIComponent(place)}`,
              );
              const data = await res.json().catch(() => ({}));
              if (!res.ok) {
                append(
                  [text(data.error || `weather unavailable for ${place}`)],
                  "weather failed",
                );
                return;
              }
              append([text(data.line || `weather unavailable for ${place}`)], "weather");
            } catch {
              append(
                [text("weather fetch failed (offline or blocked)")],
                "weather failed",
              );
            }
          })();
          return;
        }
        case "coffee": {
          out.push(
            text([
              "   ( (",
              "    ) )",
              "  ........",
              "  |      |]",
              "  \\      /",
              "   `----'",
              "",
              "brewing… done. productivity +10 (temporary).",
            ]),
          );
          live = "coffee";
          break;
        }
        case "tea": {
          out.push(
            text([
              "   )  (",
              "  (   ) )",
              "   ) ( (",
              "   _)\\_)_",
              "  |      |",
              "  | TEA  |",
              "  |______|",
              "",
              "calm mode enabled. bugs will wait.",
            ]),
          );
          live = "tea";
          break;
        }
        case "flip": {
          out.push(text(`🪙  ${flipResult()}`));
          live = "flip";
          break;
        }
        case "dice":
        case "roll": {
          const sides = args[0] || "6";
          out.push(text(`🎲  d${sides} → ${diceResult(sides)}`));
          live = "dice";
          break;
        }
        case "banner": {
          out.push(text(bannerLines(args.join(" ") || "TANISH")));
          live = "banner";
          break;
        }
        case "hello":
        case "hi": {
          const hour = new Date().getHours();
          const greets =
            hour < 12
              ? "Good morning"
              : hour < 18
                ? "Good afternoon"
                : "Good evening";
          out.push(
            text([
              `${greets}, visitor.`,
              "I'm Tanish's portfolio shell.",
              "Try: projects · play hello · fortune · whoamireally · hire",
            ]),
          );
          live = "hello";
          break;
        }
        case "id":
        case "who": {
          out.push(
            text([
              "uid=1000(visitor) gid=1000(curious)",
              "groups=1000(curious),20(recruiters),27(sudo?)",
              "shell=/bin/portfolio-sh",
            ]),
          );
          live = "id";
          break;
        }
        case "man": {
          out.push(text(manPage((args[0] || "").toLowerCase())));
          live = "man";
          break;
        }
        case "please": {
          out.push(
            text(
              args.length
                ? `since you asked nicely: ${(args.join(" ") || "").slice(0, 80)}`
                : "manners detected. +1 karma. (commands still need real names though)",
            ),
          );
          live = "please";
          break;
        }
        case "date": {
          out.push(text(new Date().toString()));
          live = "date";
          break;
        }
        case "uptime": {
          const sec = Math.floor((Date.now() - sessionStartRef.current) / 1000);
          const m = Math.floor(sec / 60);
          const s = sec % 60;
          out.push(
            text(
              `portfolio-sh up ${m}m ${s}s · load average: curious, caffeinated, shipping`,
            ),
          );
          live = "uptime";
          break;
        }
        case "sl": {
          append(out, "sl");
          setHistory((h) => [...h, raw]);
          setHistoryIndex(-1);
          setInput("");
          playAnimFrames(trainFrames(), { variant: "accent", interval: 90 });
          return;
        }
        case "matrix": {
          append(out, "matrix");
          setHistory((h) => [...h, raw]);
          setHistoryIndex(-1);
          setInput("");
          playAnimFrames(matrixFrames(), { variant: "matrix", interval: 100 });
          return;
        }
        case "hack": {
          append(out, "hack");
          setHistory((h) => [...h, raw]);
          setHistoryIndex(-1);
          setInput("");
          playAnimFrames(hackFrames(args[0] || "portfolio"), {
            variant: "accent",
            interval: 350,
          });
          return;
        }
        case "ifconfig": {
          const nav = navigator;
          const conn =
            nav.connection || nav.mozConnection || nav.webkitConnection;
          out.push(
            text([
              `status       ${nav.onLine ? "online" : "offline"}`,
              `connection   ${conn?.effectiveType || "unknown"}`,
              `downlink     ${conn?.downlink != null ? `${conn.downlink} Mbps (approx)` : "unavailable"}`,
              `save-data    ${conn?.saveData ? "on" : conn ? "off" : "unavailable"}`,
              "interfaces   unavailable in browser sandbox",
            ]),
          );
          live = "ifconfig";
          break;
        }
        case "nmap": {
          if (!args[0]) {
            usage("usage: nmap <host>  (try: nmap portfolio)");
            break;
          }
          out.push(text(simulatedNmap(args.join(" "))));
          live = "nmap simulated";
          break;
        }
        case "spotify": {
          const sub = (args[0] || "").toLowerCase();
          if (sub === "play") {
            if (musicSearching) {
              out.push(text("Search already in progress…"));
              break;
            }
            const q = parsePlayQuery(raw);
            if (!q) {
              usage("usage: spotify play <song>  then  track <n>");
              break;
            }
            if (isPlayIndex(q)) {
              out.push(...playTrackByNumber(q));
              live = "track";
              break;
            }
            append(out, "spotify play");
            setHistory((h) => [...h, raw]);
            setHistoryIndex(-1);
            setInput("");
            setTabState({ key: "", shown: false });
            setCompletionMsg("");
            searchMusic(q);
            return;
          }
          if (sub === "pause") out.push(...controlMusic("pause"));
          else if (sub === "resume" || sub === "continue")
            out.push(...controlMusic("continue"));
          else if (sub === "stop") out.push(...controlMusic("stop"));
          else if (sub === "now") out.push(...controlMusic("now"));
          else usage("usage: spotify play|pause|resume|stop|now");
          live = "spotify";
          break;
        }
        default: {
          usage(`command not found: ${name}. Type help.`);
        }
      }

      append(out, live);
      setHistory((h) => [...h, raw]);
      setHistoryIndex(-1);
      setInput("");
      setTabState({ key: "", shown: false });
      setCompletionMsg("");
    },
    [
      MUSIC_COMMANDS,
      append,
      controlMusic,
      cwd,
      dismissMusicPlayer,
      history,
      musicSearching,
      notes,
      pendingRm,
      persistNotes,
      playAnimFrames,
      playTrackByNumber,
      projectTargets,
      runSudoPrank,
      runWhoamiReallyProbe,
      searchMusic,
      sudoBusy,
      vfs,
    ],
  );

  const onSubmit = (e) => {
    e.preventDefault();
    if (editor) return;
    execute(input);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const applyCompletion = () => {
    const caret = inputRef.current?.selectionStart ?? input.length;
    const { dirs, files } = vfsPaths();
    const result = completeToken(input, caret, {
      commands: COMMAND_NAMES,
      directories: dirs,
      files,
      projectSlugs,
      apps: Object.keys(ALLOWLISTED_APPS),
      nmapHosts: NMAP_HOSTS,
      tracks: [],
      spotifySubs: SPOTIFY_SUBCOMMANDS,
      playIndexes: lastMusicResults.map((_, i) => String(i + 1)),
    });

    const key = `${input}|${caret}`;
    if (result.message === "no completion") {
      setCompletionMsg("no completion");
      setTimeout(() => setCompletionMsg(""), 1200);
      return;
    }

    if (result.candidates && result.candidates.length > 1) {
      if (tabState.key === key && tabState.shown && result.value === input) {
        append([text(result.candidates.join("  "))], "Completions listed");
        return;
      }
      setInput(result.value);
      setTabState({
        key: `${result.value}|${result.value.length}`,
        shown: true,
      });
      if (result.value === input) {
        // only LCP empty — show candidates on this or next tab
        setTabState({ key, shown: true });
      }
      return;
    }

    setInput(result.value);
    setTabState({ key: "", shown: false });
    setCompletionMsg("");
  };

  const onKeyDown = (e) => {
    if (editor) return;

    if (e.key === "Tab") {
      e.preventDefault();
      applyCompletion();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setTranscript([]);
      setLiveMessage("Terminal cleared");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next =
        historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      setTabState({ key: "", shown: false });
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < 0) return;
      if (historyIndex >= history.length - 1) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setInput(history[next]);
      setTabState({ key: "", shown: false });
    }
  };

  const saveEditor = () => {
    if (!editor) return;
    const bytes = new TextEncoder().encode(editor.value).length;
    if (bytes > NOTE_MAX_BYTES) {
      setLiveMessage("Note exceeds 20KB limit");
      append([text("save failed: note exceeds 20KB limit")], "Save failed");
      return;
    }
    const next = {
      ...notes,
      [editor.name]: { content: editor.value, mtime: Date.now() },
    };
    const total = Object.values(next).reduce(
      (sum, n) => sum + new TextEncoder().encode(n.content || "").length,
      0,
    );
    if (total > NOTES_STORE_MAX_BYTES) {
      append([text("save failed: notes store exceeds 100KB")], "Save failed");
      return;
    }
    persistNotes(next);
    setEditor((ed) =>
      ed ? { ...ed, original: ed.value, dirty: false } : null,
    );
    setLiveMessage("Saved");
  };

  const exitEditor = () => {
    if (!editor) return;
    if (editor.dirty) {
      const ok = window.confirm("Unsaved changes — discard and exit?");
      if (!ok) return;
    }
    setEditor(null);
    append([text(`(exited ${editor.path})`)], "Editor closed");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onEditorKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveEditor();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      exitEditor();
    }
  };

  const fit = () => {
    dragRef.current = null;
    setResizing(false);
    setDragging(false);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const next = defaultTerminalSize(vw, vh);
    setSize(next);
    setPosition(defaultTerminalPosition(vw, vh, next.width, next.height));
    setSizeOpen(false);
  };

  const onTitlePointerDown = (e) => {
    if (isMobile) return;
    if (e.button != null && e.button !== 0) return;
    // Don't start drag from chrome buttons / inputs
    if (e.target.closest("button, input, a, label")) return;
    e.preventDefault();
    dragRef.current = {
      mode: "move",
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
    setDragging(true);
  };

  const onResizeGripPointerDown = (e) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      mode: "resize",
      pointerX: e.clientX,
      pointerY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
    setResizing(true);
  };

  const togglePreview = () => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setMusicStatus("press-play"));
    }
  };

  if (!mounted) return null;

  const windowStyle = isMobile
    ? {
        left: 12,
        right: 12,
        bottom: "max(12px, env(safe-area-inset-bottom))",
        height: "min(62dvh, 520px)",
        top: "auto",
        width: "auto",
      }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      };

  return (
    <>
      <audio ref={audioRef} preload="none" />
      {minimized && (
        <button
          type="button"
          aria-label={
            track
              ? `Open terminal — ${playing ? "playing" : "paused"} ${track.name}`
              : "Open terminal"
          }
          onClick={() => setMinimized(false)}
          className="terminal-launcher fixed z-[4500] right-4 bottom-5 min-h-12 min-w-12 rounded-full border border-secondary-600 bg-[#100f0d] text-primary-200 custom-shadow-200 flex items-center justify-center font-ipa-gothic text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
          style={{ bottom: "max(20px, env(safe-area-inset-bottom))" }}
        >
          {playing ? "♪" : ">_"}
        </button>
      )}
      <div
        ref={windowRef}
        className={`terminal-float fixed z-[4500] flex flex-col rounded-[18px] border border-secondary-600 overflow-hidden custom-shadow-200 font-ipa-gothic ${
          resizing || dragging
            ? "terminal-no-transition"
            : "terminal-size-transition"
        } ${minimized ? "pointer-events-none" : ""}`}
        style={{
          ...windowStyle,
          background:
            "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(230,55,24,0.07), transparent 55%), #100f0d",
          minWidth: isMobile ? undefined : 320,
          minHeight: isMobile ? undefined : 220,
          maxWidth: isMobile ? undefined : "calc(100vw - 16px)",
          maxHeight: isMobile ? undefined : "calc(100dvh - 16px)",
          // Keep mounted while minimized so preview audio keeps playing
          visibility: minimized ? "hidden" : "visible",
          opacity: minimized ? 0 : 1,
        }}
      >
        <div
          className={`terminal-titlebar flex items-center gap-2 px-3 py-2 border-b border-secondary-500/80 shrink-0 bg-[#141210]/90 ${
            dragging ? "terminal-dragging" : ""
          }`}
          onPointerDown={onTitlePointerDown}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary-200 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M4 17l6-5-6-5M12 19h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-xs text-teritiary-400 flex-1 truncate">
            tanish@portfolio: ~
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Customize terminal size"
              aria-expanded={sizeOpen}
              onClick={() => setSizeOpen((v) => !v)}
              className="text-[11px] px-2 min-h-8 rounded border border-secondary-600 text-teritiary-400 hover:text-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
            >
              size
            </button>
            <button
              type="button"
              aria-label="Fit terminal to viewport"
              onClick={fit}
              className="text-[11px] px-2 min-h-8 rounded border border-secondary-600 text-teritiary-400 hover:text-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
            >
              fit
            </button>
            <button
              type="button"
              aria-label="Minimize terminal"
              onClick={() => setMinimized(true)}
              className="text-[11px] px-2 min-h-8 rounded border border-secondary-600 text-teritiary-400 hover:text-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
            >
              ▁
            </button>
          </div>
        </div>

        {sizeOpen && !isMobile && (
          <div className="px-3 py-2 border-b border-secondary-600 bg-[#141210] space-y-2">
            <label className="flex items-center gap-2 text-xs text-teritiary-400">
              <span className="w-14">Width</span>
              <input
                type="range"
                min={320}
                max={
                  typeof window !== "undefined"
                    ? Math.max(320, window.innerWidth - 24)
                    : 900
                }
                value={size.width}
                onChange={(e) => {
                  const next = clampTerminalSize(
                    Number(e.target.value),
                    size.height,
                    window.innerWidth,
                    window.innerHeight,
                  );
                  setSize(next);
                  setPosition((prev) =>
                    clampTerminalPosition(
                      prev.x,
                      prev.y,
                      next.width,
                      next.height,
                      window.innerWidth,
                      window.innerHeight,
                    ),
                  );
                }}
                className="terminal-range flex-1"
                aria-valuetext={`${size.width} pixels`}
              />
              <span className="w-12 text-right text-teritiary-500">
                {size.width}px
              </span>
            </label>
            <label className="flex items-center gap-2 text-xs text-teritiary-400">
              <span className="w-14">Height</span>
              <input
                type="range"
                min={220}
                max={
                  typeof window !== "undefined"
                    ? Math.max(220, window.innerHeight - 24)
                    : 800
                }
                value={size.height}
                onChange={(e) => {
                  const next = clampTerminalSize(
                    size.width,
                    Number(e.target.value),
                    window.innerWidth,
                    window.innerHeight,
                  );
                  setSize(next);
                  setPosition((prev) =>
                    clampTerminalPosition(
                      prev.x,
                      prev.y,
                      next.width,
                      next.height,
                      window.innerWidth,
                      window.innerHeight,
                    ),
                  );
                }}
                className="terminal-range flex-1"
                aria-valuetext={`${size.height} pixels`}
              />
              <span className="w-12 text-right text-teritiary-500">
                {size.height}px
              </span>
            </label>
          </div>
        )}

        <div
          ref={scrollRef}
          className="terminal-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 text-sm sm:text-base leading-relaxed"
          onClick={(e) => {
            const sel = window.getSelection()?.toString();
            if (!sel) inputRef.current?.focus();
          }}
        >
          <div className="space-y-2">
            {transcript.map((entry) => (
              <TranscriptEntry
                key={entry.id}
                entry={entry}
                editorProps={
                  entry.type === "editor" && editor
                    ? {
                        value: editor.value,
                        dirty: editor.dirty,
                        onChange: (v) =>
                          setEditor((ed) =>
                            ed
                              ? {
                                  ...ed,
                                  value: v,
                                  dirty: v !== ed.original,
                                }
                              : null,
                          ),
                        onKeyDown: onEditorKeyDown,
                      }
                    : null
                }
              />
            ))}
          </div>
          {completionMsg && (
            <div className="text-teritiary-200 text-xs mt-1">
              {completionMsg}
            </div>
          )}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {liveMessage}
          </div>
        </div>

        {track && (
          <div className="border-t border-secondary-600 bg-[#141210]/95 shrink-0 px-3 py-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={playing ? "Pause preview" : "Play preview"}
                onClick={togglePreview}
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
                  <span>30s preview</span>
                  {track.externalUrl && (
                    <a
                      href={track.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-200 underline-offset-2 hover:underline"
                    >
                      Open full track
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!editor && (
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 px-3 py-2 border-t border-secondary-600 shrink-0"
          >
            <label htmlFor="portfolio-terminal-input" className="sr-only">
              Terminal command
            </label>
            <span className="shrink-0 text-sm" aria-hidden="true">
              <span className="text-primary-200">tanish</span>
              <span className="text-teritiary-300"> ~ </span>
              <span className="text-primary-300">❯</span>
            </span>
            <input
              ref={inputRef}
              id="portfolio-terminal-input"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTabState({ key: "", shown: false });
              }}
              onKeyDown={onKeyDown}
              disabled={sudoBusy}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="terminal-input flex-1 min-w-0 bg-transparent border-0 outline-none text-teritiary-600 text-base p-0 focus:ring-0 disabled:opacity-50"
              aria-label="Enter portfolio command"
            />
          </form>
        )}

        {!isMobile && (
          <div
            role="separator"
            aria-label="Resize terminal"
            aria-orientation="horizontal"
            title="Drag to resize"
            onPointerDown={onResizeGripPointerDown}
            className="terminal-resize-grip"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M4 10h6M7 7h3M10 4v6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
