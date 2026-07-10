/**
 * Pure terminal helpers — path, parse, completion, project resolution, VFS.
 * Safe for Node self-checks and browser use.
 */

export const VIRTUAL_ROOT = "~/portfolio";
export const UI_STORAGE_KEY = "portfolio-terminal-ui";
export const FS_STORAGE_KEY = "portfolio-terminal-fs";
export const NOTE_MAX_BYTES = 20 * 1024;
export const NOTES_STORE_MAX_BYTES = 100 * 1024;

export const COMMAND_NAMES = [
  "help",
  "ls",
  "cd",
  "cat",
  "rm",
  "open",
  "vim",
  "neofetch",
  "pwd",
  "whoami",
  "whoamireally",
  "clear",
  "ifconfig",
  "nmap",
  "about",
  "projects",
  "experience",
  "contact",
  "resume",
  "play",
  "search",
  "track",
  "results",
  "pause",
  "continue",
  "stop",
  "now",
  "spotify",
  "fortune",
  "joke",
  "cowsay",
  "sl",
  "matrix",
  "skills",
  "hire",
  "status",
  "echo",
  "history",
  "exit",
  "logout",
  "ping",
  "weather",
  "coffee",
  "tea",
  "flip",
  "dice",
  "roll",
  "banner",
  "hello",
  "hi",
  "id",
  "man",
  "please",
  "hack",
  "date",
  "uptime",
  "who",
];

export const SPOTIFY_SUBCOMMANDS = ["play", "pause", "resume", "stop", "now"];

export const NMAP_HOSTS = ["localhost", "portfolio", "tanish.site"];

export const ALLOWLISTED_APPS = {
  github: "https://github.com/tanish35",
  linkedin: "https://www.linkedin.com/in/tanish34/",
  resume: "/files/resume.pdf",
  mail: "mailto:tanishmajumdar2912@gmail.com",
  email: "mailto:tanishmajumdar2912@gmail.com",
};

/** @param {string} path */
export function normalizePath(path, cwd = VIRTUAL_ROOT) {
  const raw = (path || "").trim();
  if (!raw || raw === "~" || raw === VIRTUAL_ROOT) return VIRTUAL_ROOT;

  let abs;
  if (raw === VIRTUAL_ROOT || raw.startsWith(`${VIRTUAL_ROOT}/`)) {
    abs = raw;
  } else if (raw.startsWith("~/")) {
    // ~/foo → ~/portfolio/foo (treat ~ as portfolio home)
    const rest = raw.slice(2);
    abs =
      rest === "portfolio" || rest.startsWith("portfolio/")
        ? `~/${rest}`
        : `${VIRTUAL_ROOT}/${rest}`;
  } else if (raw.startsWith("~")) {
    abs = `${VIRTUAL_ROOT}/${raw.slice(1)}`;
  } else if (raw.startsWith("/")) {
    abs = `${VIRTUAL_ROOT}${raw}`;
  } else {
    abs = `${cwd}/${raw}`;
  }

  const parts = abs
    .replace(/^~\/portfolio\/?/, "")
    .split("/")
    .filter((p) => p && p !== ".");

  const stack = [];
  for (const part of parts) {
    if (part === "..") {
      if (stack.length) stack.pop();
    } else {
      stack.push(part);
    }
  }

  return stack.length ? `${VIRTUAL_ROOT}/${stack.join("/")}` : VIRTUAL_ROOT;
}

/** @param {string} path */
export function basename(path) {
  const n = normalizePath(path);
  if (n === VIRTUAL_ROOT) return "portfolio";
  return n.slice(VIRTUAL_ROOT.length + 1).split("/").pop();
}

/** @param {string} path */
export function dirname(path) {
  const n = normalizePath(path);
  if (n === VIRTUAL_ROOT) return VIRTUAL_ROOT;
  const rest = n.slice(VIRTUAL_ROOT.length + 1);
  const idx = rest.lastIndexOf("/");
  if (idx === -1) return VIRTUAL_ROOT;
  return `${VIRTUAL_ROOT}/${rest.slice(0, idx)}`;
}

/**
 * @param {string} input
 * @returns {{ name: string, args: string[], flags: string[], raw: string } | null}
 */
export function parseCommandLine(input) {
  const raw = (input || "").trim();
  if (!raw) return null;

  const tokens = raw.split(/\s+/);
  const name = tokens[0].toLowerCase();
  const rest = tokens.slice(1);
  const flags = [];
  const args = [];

  for (const token of rest) {
    if (token.startsWith("-") && token.length > 1 && !token.startsWith("--")) {
      // e.g. -rf or -a -l
      const chars = token.slice(1).split("");
      for (const c of chars) flags.push(c);
    } else if (token.startsWith("--") && token.length > 2) {
      flags.push(token.slice(2));
    } else {
      args.push(token);
    }
  }

  return { name, args, flags, raw, tokens };
}

/**
 * Preserve original argument text after a multi-word command prefix.
 * e.g. "spotify play one line" → query "one line"
 */
export function parseSpotifyPlayQuery(raw) {
  const match = raw.trim().match(/^spotify\s+play\s+(.+)$/i);
  return match ? match[1] : "";
}

/**
 * Parse rm flags separately from path.
 * @param {string} input
 */
export function parseRm(input) {
  const parsed = parseCommandLine(input);
  if (!parsed || parsed.name !== "rm") return null;
  const recursive = parsed.flags.includes("r") || parsed.flags.includes("R");
  const force = parsed.flags.includes("f");
  const path = parsed.args[0] || "";
  return { recursive, force, path, raw: parsed.raw };
}

/**
 * @param {Array<{ slug: string, title: string, buttonLink: string }>} projects
 */
export function buildProjectTargets(projects) {
  const byKey = new Map();
  for (const p of projects) {
    const entry = {
      slug: p.slug,
      title: p.title,
      buttonLink: p.buttonLink,
    };
    byKey.set(p.slug.toLowerCase(), entry);
    const titleAlias = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (titleAlias) byKey.set(titleAlias, entry);
  }
  return byKey;
}

/**
 * @param {string} query
 * @param {Map<string, { slug: string, title: string, buttonLink: string }>} targets
 */
export function resolveProject(query, targets) {
  if (!query) return null;
  const key = query.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (targets.has(query.toLowerCase())) return targets.get(query.toLowerCase());
  if (targets.has(key)) return targets.get(key);
  return null;
}

/**
 * @param {string} query
 * @param {Map<string, { slug: string, title: string, buttonLink: string }>} targets
 */
export function suggestProjects(query, targets) {
  const q = (query || "").toLowerCase();
  const seen = new Set();
  const out = [];
  for (const p of targets.values()) {
    if (seen.has(p.slug)) continue;
    if (p.slug.includes(q) || p.title.toLowerCase().includes(q)) {
      seen.add(p.slug);
      out.push(p);
    }
  }
  return out.slice(0, 5);
}

/** Longest common prefix of strings */
export function longestCommonPrefix(strings) {
  if (!strings.length) return "";
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix) && prefix) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

/**
 * Fuzzy match score for completion (lower is better).
 * Matches startsWith, basename startsWith, and includes.
 * @returns {number | null} null if no match
 */
export function fuzzyMatchScore(candidate, token) {
  if (!token) return 0;
  const c = String(candidate).toLowerCase();
  const t = token.toLowerCase();
  const base = c.includes("/") ? c.slice(c.lastIndexOf("/") + 1) : c;
  const baseNoExt = base.includes(".") ? base.slice(0, base.lastIndexOf(".")) : base;

  if (base.startsWith(t) || baseNoExt.startsWith(t)) return 0;
  if (c.startsWith(t)) return 1;
  if (base.includes(t) || baseNoExt.includes(t)) return 2;
  if (c.includes(t)) return 3;
  // subsequence: r-e-s matches r...e...s... in resume
  let ti = 0;
  for (let i = 0; i < base.length && ti < t.length; i++) {
    if (base[i] === t[ti]) ti++;
  }
  if (ti === t.length) return 4;
  return null;
}

/**
 * @param {string[]} candidates
 * @param {string} token
 */
export function fuzzyFilter(candidates, token) {
  const lower = (token || "").toLowerCase();
  if (!lower) return [...new Set(candidates)];

  const scored = [];
  for (const c of candidates) {
    const score = fuzzyMatchScore(c, lower);
    if (score != null) scored.push({ c, score });
  }
  scored.sort((a, b) => a.score - b.score || a.c.localeCompare(b.c));
  return [...new Set(scored.map((s) => s.c))];
}

/**
 * Tab completion for the token at caret.
 * @returns {{ value: string, candidates?: string[], message?: string, completed?: string }}
 */
export function completeToken(input, caret, context) {
  const {
    commands = COMMAND_NAMES,
    directories = [],
    files = [],
    projectSlugs = [],
    apps = Object.keys(ALLOWLISTED_APPS),
    nmapHosts = NMAP_HOSTS,
    tracks = [],
    spotifySubs = SPOTIFY_SUBCOMMANDS,
    playIndexes = [],
  } = context;

  const text = input || "";
  const pos = Math.max(0, Math.min(caret ?? text.length, text.length));
  const before = text.slice(0, pos);

  const tokenMatch = before.match(/(\S*)$/);
  const token = tokenMatch ? tokenMatch[1] : "";
  const tokenStart = before.length - token.length;
  const leading = text.slice(0, tokenStart);
  const leadingTrim = leading.trimStart();
  const leadingTokens = leadingTrim ? leadingTrim.split(/\s+/) : [];

  const relDirs = directories.map((d) =>
    d === VIRTUAL_ROOT || d === "."
      ? "."
      : d.replace(`${VIRTUAL_ROOT}/`, "").replace(VIRTUAL_ROOT, "") || ".",
  );

  let candidates = [];

  if (leadingTokens.length === 0) {
    candidates = commands;
  } else {
    const cmd = leadingTokens[0].toLowerCase();
    if (cmd === "cd") {
      // dirs + files + projects (files help discover resume.pdf etc.)
      candidates = [...relDirs, ...files, ...projectSlugs, ...apps];
    } else if (cmd === "open") {
      candidates = [...apps, ...files, ...projectSlugs];
    } else if (cmd === "cat" || cmd === "rm" || cmd === "vim") {
      candidates = files;
    } else if (cmd === "nmap") {
      candidates = nmapHosts;
    } else if (cmd === "spotify") {
      if (leadingTokens.length === 1) {
        candidates = spotifySubs;
      } else if (leadingTokens[1]?.toLowerCase() === "play") {
        candidates = [...tracks, ...playIndexes];
      } else {
        candidates = [];
      }
    } else if (cmd === "play" || cmd === "track") {
      candidates = playIndexes;
    } else if (cmd === "ls") {
      candidates = [...relDirs, ...files];
    } else {
      candidates = [];
    }
  }

  const unique = fuzzyFilter(candidates, token);

  if (unique.length === 0) {
    return { value: text, message: "no completion" };
  }

  if (unique.length === 1) {
    let insert = unique[0];
    const isDir =
      directories.some(
        (d) =>
          d === insert ||
          d.endsWith(`/${insert}`) ||
          d.replace(`${VIRTUAL_ROOT}/`, "") === insert ||
          insert === ".",
      ) || insert.endsWith("/");
    const cmd0 = (leadingTokens[0] || "").toLowerCase();
    if (isDir && !insert.endsWith("/") && insert !== ".") insert = `${insert}/`;
    else if (!isDir && leadingTokens.length === 0) insert = `${insert} `;
    else if (
      !isDir &&
      (cmdIsProjectLike(cmd0) ||
        cmd0 === "spotify" ||
        cmd0 === "open" ||
        cmd0 === "nmap" ||
        cmd0 === "cat" ||
        cmd0 === "ls" ||
        cmd0 === "play" ||
        cmd0 === "track")
    ) {
      insert = `${insert} `;
    }

    const replaced = text.slice(0, tokenStart) + insert + text.slice(pos);
    return { value: replaced, completed: unique[0] };
  }

  // Prefer LCP of basenames when token is a partial basename
  const bases = unique.map((u) => {
    const b = u.includes("/") ? u.slice(u.lastIndexOf("/") + 1) : u;
    return b;
  });
  const lcpBase = longestCommonPrefix(bases.map((b) => b.toLowerCase()));
  if (lcpBase.length > token.length) {
    const first = unique[0];
    const firstBase = first.includes("/")
      ? first.slice(first.lastIndexOf("/") + 1)
      : first;
    const insert = firstBase.slice(0, lcpBase.length);
    // If all share same directory prefix, keep path
    const dirPrefix = first.includes("/")
      ? first.slice(0, first.lastIndexOf("/") + 1)
      : "";
    const allSameDir = unique.every(
      (u) =>
        (u.includes("/") ? u.slice(0, u.lastIndexOf("/") + 1) : "") === dirPrefix,
    );
    const fullInsert = allSameDir ? dirPrefix + insert : insert;
    return {
      value: text.slice(0, tokenStart) + fullInsert + text.slice(pos),
      candidates: unique,
    };
  }

  const lcp = longestCommonPrefix(unique.map((u) => u.toLowerCase()));
  const extension = lcp.slice(token.toLowerCase().length);
  if (extension) {
    const first = unique[0];
    const insert = first.slice(0, token.length + extension.length);
    return {
      value: text.slice(0, tokenStart) + insert + text.slice(pos),
      candidates: unique,
    };
  }

  return { value: text, candidates: unique };
}

function cmdIsProjectLike(cmd) {
  return ["cd", "open"].includes((cmd || "").toLowerCase());
}

/**
 * Match glob against basenames: * or *.ext
 * @param {string} pattern
 * @param {string[]} names
 */
export function matchGlob(pattern, names) {
  if (pattern === "*") return [...names];
  if (pattern.startsWith("*.") && !pattern.slice(2).includes("*")) {
    const ext = pattern.slice(1); // .txt
    return names.filter((n) => n.endsWith(ext));
  }
  if (!pattern.includes("*")) {
    return names.filter((n) => n === pattern);
  }
  return [];
}

/**
 * Build seeded VFS tree from portfolio data + notes.
 * @param {{ projects: Array, experience: Array, notes?: Record<string, { content: string, mtime: number }> }} data
 */
export function buildVfs({ projects, experience, notes = {} }) {
  const now = Date.now();
  const files = new Map();

  const put = (path, node) => {
    files.set(normalizePath(path), node);
  };

  put(VIRTUAL_ROOT, { type: "dir", mtime: now });
  put(`${VIRTUAL_ROOT}/projects`, { type: "dir", mtime: now });
  put(`${VIRTUAL_ROOT}/experience`, { type: "dir", mtime: now });
  put(`${VIRTUAL_ROOT}/music`, { type: "dir", mtime: now });
  put(`${VIRTUAL_ROOT}/notes`, { type: "dir", mtime: now });

  put(`${VIRTUAL_ROOT}/about.txt`, {
    type: "file",
    content:
      "Tanish Majumdar — Full-Stack Developer & AI Engineer based in Mumbai.\nBuilding software one line at a time.\n",
    mtime: now,
    readonly: true,
  });
  put(`${VIRTUAL_ROOT}/contact.txt`, {
    type: "file",
    content:
      "Email: tanishmajumdar2912@gmail.com\nGitHub: https://github.com/tanish35\nLinkedIn: https://www.linkedin.com/in/tanish34/\nResume: /files/resume.pdf\n",
    mtime: now,
    readonly: true,
  });
  put(`${VIRTUAL_ROOT}/resume.pdf`, {
    type: "file",
    content: "[binary pdf — open with `resume` or `open resume`]",
    mtime: now,
    readonly: true,
    binary: true,
  });

  put(`${VIRTUAL_ROOT}/projects/README.txt`, {
    type: "file",
    content: "Project notes generated from the portfolio catalog.\nUse `cd <slug>` or `open <slug>` to visit a project.\n",
    mtime: now,
    readonly: true,
  });

  for (const p of projects) {
    put(`${VIRTUAL_ROOT}/projects/${p.slug}.txt`, {
      type: "file",
      content: `${p.title}\n${p.caption}\n\n${p.description}\n\nLink: ${p.buttonLink}\nTags: ${(p.tags || []).join(", ")}\n`,
      mtime: now,
      readonly: true,
    });
  }

  const timeline = experience
    .map(
      (e) =>
        `${e.title} @ ${e.company} (${e.duration})\n${e.description}\n`,
    )
    .join("\n---\n\n");
  put(`${VIRTUAL_ROOT}/experience/timeline.txt`, {
    type: "file",
    content: timeline || "No experience entries.\n",
    mtime: now,
    readonly: true,
  });

  put(`${VIRTUAL_ROOT}/music/README.txt`, {
    type: "file",
    content:
      "Local preview player. Use `spotify list` and `spotify play <track>`.\n[preview mode — not connected to Spotify]\n",
    mtime: now,
    readonly: true,
  });

  for (const [name, note] of Object.entries(notes)) {
    const safe = name.replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safe) continue;
    put(`${VIRTUAL_ROOT}/notes/${safe}`, {
      type: "file",
      content: note.content || "",
      mtime: note.mtime || now,
      readonly: false,
    });
  }

  return files;
}

export function listDir(vfs, path, { all = false } = {}) {
  const dir = normalizePath(path);
  const node = vfs.get(dir);
  if (!node || node.type !== "dir") return null;

  const prefix = dir === VIRTUAL_ROOT ? `${VIRTUAL_ROOT}/` : `${dir}/`;
  const entries = [];

  for (const [p, n] of vfs.entries()) {
    if (!p.startsWith(prefix)) continue;
    const rest = p.slice(prefix.length);
    if (!rest || rest.includes("/")) continue;
    if (!all && rest.startsWith(".")) continue;
    entries.push({ name: rest, path: p, ...n });
  }

  entries.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return entries;
}

export function getNode(vfs, path) {
  return vfs.get(normalizePath(path)) || null;
}

export function isUnderNotes(path) {
  const n = normalizePath(path);
  return n === `${VIRTUAL_ROOT}/notes` || n.startsWith(`${VIRTUAL_ROOT}/notes/`);
}

export function expandGlob(vfs, cwd, pattern) {
  const hasGlob = pattern.includes("*");
  if (!hasGlob) {
    const p = normalizePath(pattern, cwd);
    return vfs.has(p) ? [p] : [];
  }

  // only * and *.ext in a single directory segment
  let dir = cwd;
  let basePattern = pattern;
  if (pattern.includes("/")) {
    const last = pattern.lastIndexOf("/");
    dir = normalizePath(pattern.slice(0, last) || ".", cwd);
    basePattern = pattern.slice(last + 1);
  }

  const entries = listDir(vfs, dir, { all: true }) || [];
  const names = entries.filter((e) => e.type === "file").map((e) => e.name);
  const matched = matchGlob(basePattern, names);
  return matched.map((name) => normalizePath(`${dir}/${name}`));
}

export function formatSize(content = "") {
  const n = new TextEncoder().encode(content).length;
  if (n < 1024) return `${n}B`;
  return `${(n / 1024).toFixed(1)}K`;
}

export function clampTerminalSize(width, height, vw, vh) {
  const maxW = Math.max(320, vw - 24);
  const maxH = Math.max(220, vh - 24);
  const w = Math.min(Math.max(width, 320), maxW);
  const h = Math.min(Math.max(height, 220), maxH);
  return { width: Math.round(w), height: Math.round(h) };
}

/** Default: at least half the viewport width, tall right-panel feel. */
export function defaultTerminalSize(vw, vh) {
  const width = Math.round(Math.max(vw * 0.5, Math.min(vw - 32, vw * 0.52)));
  const height = Math.round(Math.min(vh - 48, Math.max(vh * 0.72, 480)));
  return clampTerminalSize(width, height, vw, vh);
}

export function clampTerminalPosition(x, y, width, height, vw, vh) {
  const maxX = Math.max(8, vw - width - 8);
  const maxY = Math.max(8, vh - height - 8);
  return {
    x: Math.round(Math.min(Math.max(8, x), maxX)),
    y: Math.round(Math.min(Math.max(8, y), maxY)),
  };
}

/** Pin to the right half by default. */
export function defaultTerminalPosition(vw, vh, width, height) {
  const margin = 16;
  const x = Math.max(margin, vw - width - margin);
  const y = Math.max(margin, Math.round((vh - height) / 2));
  return clampTerminalPosition(x, y, width, height, vw, vh);
}
