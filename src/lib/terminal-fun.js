/**
 * Fun / easter-egg content for the portfolio terminal.
 * Pure helpers — no side effects.
 */

const FORTUNES = [
  "Ship it. You can always open a PR against yourself later.",
  "There are only two hard things: cache invalidation, naming things, and off-by-one errors.",
  "Works on my machine™ is not a deployment strategy. (But it is a vibe.)",
  "git commit -m \"fix\" — the eternal cycle.",
  "Your CSS is valid. Your design opinions are valid. The browser may disagree.",
  "A watched progress bar never completes. An unwatched one finishes while you make coffee.",
  "Production is just staging with higher stakes and better snacks.",
  "Read the error message. Then read it again. Then google the third word.",
  "One line at a time. That's the whole strategy.",
  "If it compiles, ship it. If it doesn't, blame TypeScript (affectionately).",
  "The best code is the code you delete.",
  "Sleep is a free performance optimization.",
];

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks: “Can I join you?”",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "I would tell you a UDP joke, but you might not get it.",
  "Knock knock. Who's there? Race condition. Race condition who? Knock kno— already open.",
  "My code doesn't have bugs. It just develops random unexpected features.",
  "How many programmers does it take to change a light bulb? None — it's a hardware problem.",
  "I told my computer I needed a break. It said “No problem — I'll go to sleep.”",
  "Debugging: being the detective in a crime movie where you are also the murderer.",
  "Why did the developer go broke? Because they used up all their cache.",
];

const SKILLS = [
  { name: "TypeScript", level: 92 },
  { name: "React / Next.js", level: 94 },
  { name: "Node / APIs", level: 90 },
  { name: "AI / RAG", level: 88 },
  { name: "Postgres", level: 85 },
  { name: "DevOps-ish", level: 78 },
  { name: "Coffee intake", level: 99 },
  { name: "Asking “why?”", level: 100 },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function bar(level, width = 20) {
  const filled = Math.round((level / 100) * width);
  return `${"█".repeat(filled)}${"░".repeat(width - filled)}`;
}

export function fortuneText() {
  return pick(FORTUNES);
}

export function jokeText() {
  return pick(JOKES);
}

export function skillsLines() {
  const lines = ["Tanish // skill matrix", "─────────────────────"];
  for (const s of SKILLS) {
    lines.push(`${s.name.padEnd(16)} ${bar(s.level)} ${s.level}%`);
  }
  lines.push("", "tip: hire me before coffee hits 100%");
  return lines;
}

export function hireLines() {
  return [
    "status:     OPEN TO WORK / COLLAB",
    "role:       Full-Stack + AI Engineer",
    "location:   Mumbai · remote-friendly",
    "email:      tanishmajumdar2912@gmail.com",
    "github:     github.com/tanish35",
    "linkedin:   linkedin.com/in/tanish34",
    "resume:     type `resume` or open /files/resume.pdf",
    "",
    "pitch:      I ship systems that don't panic at 3am.",
    "next:       type `contact` or `projects`",
  ];
}

export function cowsay(message) {
  const msg = (message || "one line at a time").slice(0, 48);
  const edge = "_".repeat(msg.length + 2);
  const bottom = "-".repeat(msg.length + 2);
  return [
    ` ${edge}`,
    `< ${msg} >`,
    ` ${bottom}`,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ];
}

export function trainFrames() {
  const cars = [
    "      ====        ________                ___________",
    "  _D _|  |_______/        \\__I_I_____===__|_________|",
    "   |(_)---  |   H\\________/ |   |        =|___ ___|",
    "   /     |  |   H  |  |     |   |         ||_| |_||",
    "  |      |  |   H  |__--------------------| [___] |",
    "  | ________|___H__/__|_____/[][]~\\_______|       |",
    "  |/ |   |-----------I_____I [][] []  D   |=======|____",
  ];
  const frames = [];
  for (let i = 0; i < 12; i++) {
    const pad = " ".repeat(i * 2);
    frames.push(cars.map((line) => pad + line).join("\n") + "\n\n  chugga chugga… (you meant `ls`, didn't you?)");
  }
  frames.push(
    cars.map((line) => " ".repeat(24) + line).join("\n") +
      "\n\n  🚂 gone. type `help` for real commands.",
  );
  return frames;
}

export function matrixFrames() {
  const cols = 28;
  const rows = 10;
  const glyphs = "01アイウエオカキクケコﾀﾆｼｭ<>/$#@*+";
  const frames = [];
  for (let f = 0; f < 10; f++) {
    const lines = [];
    for (let r = 0; r < rows; r++) {
      let row = "";
      for (let c = 0; c < cols; c++) {
        row += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      lines.push(row);
    }
    lines.push("");
    lines.push(f < 9 ? "  entering the matrix…" : "  welcome back, neo. (just kidding — you're still on tanish.site)");
    frames.push(lines.join("\n"));
  }
  return frames;
}

export function hackFrames(target = "portfolio") {
  const t = String(target).slice(0, 24);
  return [
    `[*] recon on ${t}…\n`,
    `[*] recon on ${t}…\n[+] found open port: 443 (https)\n`,
    `[*] recon on ${t}…\n[+] found open port: 443 (https)\n[*] deploying friendly payload…\n`,
    `[*] recon on ${t}…\n[+] found open port: 443 (https)\n[*] deploying friendly payload…\n[████████░░░░] 66%\n`,
    `[*] recon on ${t}…\n[+] found open port: 443 (https)\n[*] deploying friendly payload…\n[████████████] 100%\n\n[✓] access granted: visitor@portfolio\n[✓] loot: respect + curiosity\n[!] no systems were harmed in this simulation`,
  ];
}

export function pingLines(host = "tanish.site") {
  const h = host || "tanish.site";
  const base = 12 + Math.floor(Math.random() * 18);
  return [
    `PING ${h} (simulated): 56 data bytes`,
    `64 bytes from ${h}: icmp_seq=0 ttl=56 time=${base}.1 ms`,
    `64 bytes from ${h}: icmp_seq=1 ttl=56 time=${base + 2}.4 ms`,
    `64 bytes from ${h}: icmp_seq=2 ttl=56 time=${base - 1}.8 ms`,
    `64 bytes from ${h}: icmp_seq=3 ttl=56 time=${base + 1}.2 ms`,
    "",
    `--- ${h} ping statistics ---`,
    "4 packets transmitted, 4 received, 0.0% packet loss",
    `(fake ping — browsers can't ICMP. but the vibes are ~${base}ms)`,
  ];
}

export function bannerLines(name = "TANISH") {
  // compact block letters for short names
  return [
    "╔══════════════════════════════════╗",
    `║  ${String(name).toUpperCase().slice(0, 18).padEnd(18)}  ║`,
    "║  full-stack · ai · one line      ║",
    "╚══════════════════════════════════╝",
  ];
}

export function flipResult() {
  return Math.random() < 0.5 ? "heads" : "tails";
}

export function diceResult(sides = 6) {
  const s = Math.min(100, Math.max(2, Number(sides) || 6));
  return 1 + Math.floor(Math.random() * s);
}

export function manPage(cmd) {
  const pages = {
    help: ["help — list commands", "usage: help"],
    play: ["play — search free music catalog", "usage: play <song>", "then: track <n>"],
    track: ["track — play a search result", "usage: track <n>"],
    sudo: ["sudo — elevated privileges", "usage: sudo <anything>", "warning: may ddos the portfolio (theatrically)"],
    cowsay: ["cowsay — bovine speech synthesizer", "usage: cowsay [message]"],
    fortune: ["fortune — random developer wisdom"],
    joke: ["joke — dad-tier programmer humor"],
    matrix: ["matrix — aesthetic rain. no red pill required."],
    sl: ["sl — steam locomotive (when you typo ls)"],
    skills: ["skills — ASCII skill bars"],
    hire: ["hire — open-to-work card"],
    weather: ["weather — quick forecast via wttr.in"],
    ping: ["ping — simulated latency check", "usage: ping [host]"],
  };
  return pages[cmd] || [
    `No manual entry for ${cmd || "that"}`,
    "try: man help | man cowsay | man sudo | man play",
  ];
}

export const FUN_COMMANDS = [
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

/**
 * Whole-token blocklist only (case-insensitive).
 * "grass" does not match "ass"; "cowsay ass" does.
 */
const BLOCKED_WORDS = new Set(
  [
    "fuck",
    "fucker",
    "fucking",
    "fucked",
    "motherfucker",
    "shit",
    "shitty",
    "bullshit",
    "ass",
    "asshole",
    "bitch",
    "bastard",
    "cunt",
    "dick",
    "cock",
    "pussy",
    "whore",
    "slut",
    "sex",
    "sexy",
    "porn",
    "porno",
    "xxx",
    "nude",
    "nudes",
    "nigga",
    "nigger",
    "negro",
    "fag",
    "faggot",
    "dyke",
    "retard",
    "retarded",
    "rape",
    "rapist",
    "kill yourself",
    "kys",
  ].map((w) => w.toLowerCase()),
);

/**
 * True if any whole word in the input is blocked.
 * Splits on non-letters so punctuation doesn't hide tokens.
 */
export function containsBlockedWord(input) {
  const raw = String(input || "").toLowerCase();
  if (!raw.trim()) return false;

  // Multi-word phrases first
  if (/\bkill\s+yourself\b/.test(raw)) return true;

  // Whole tokens: letters only (handles "ass!" "FUCK," etc.)
  const tokens = raw.split(/[^a-z0-9]+/).filter(Boolean);
  for (const t of tokens) {
    if (BLOCKED_WORDS.has(t)) return true;
  }
  return false;
}

/** ASCII person backflip frames + anti-slur closer */
export function backflipFrames() {
  return [
    `
    o
   /|\\
   / \\
  standing up…
`,
    `
    o/
   /|
   / \\
  wind up…
`,
    `
   \\o/
    |
   / \\
  lift off…
`,
    `
    _o_
   /   \\
   
  airborne…
`,
    `
     _o
    / 
   <   
  spinning…
`,
    `
      o
     /|\\
       
  still spinning…
`,
    `
     o_
      \\
       >
  almost…
`,
    `
    \\o/
     |
    / \\
  nailed it.
`,
    `
    \\o/
     |
    / \\

  ★ backflip complete ★

  Never use slurs or crude language here.
  It doesn't make you look tough —
  it makes you look weak.

  Respect costs nothing. Type help to continue.
`,
  ];
}
