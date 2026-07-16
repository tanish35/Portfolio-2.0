import { AUTHOR, ROLE, SITE_HOST } from "@/lib/site";

export const RESUME_URL = "/files/resume.pdf";

export const SYSTEM_INFO = [
  { label: "Role", value: ROLE },
  { label: "Location", value: "Mumbai, India" },
  { label: "Site", value: SITE_HOST },
  { label: "Shell", value: "portfolio-sh" },
  { label: "UI", value: "Next.js + React" },
  { label: "GitHub", value: "tanish35" },
  { label: "LinkedIn", value: "tanish34" },
  { label: "Theme", value: "one line at a time" },
];

export const THEME_SWATCHES = ["#e63718", "#100f0d", "#fafafa", "#999999", "#e94b30"];

export const ABOUT_BIO = `${AUTHOR} — ${ROLE} based in Mumbai. Building software one line at a time.`;

/**
 * Structured help: aligned command/description pairs per section.
 * Rendered by <HelpCard> so descriptions wrap under their own column
 * instead of overflowing the terminal width.
 */
export const HELP_SECTIONS = [
  {
    title: "Files",
    commands: [
      ["help", "Show this command list"],
      ["ls [-al] [path]", "List virtual filesystem"],
      ["cd <path|project>", "Change dir or open project"],
      ["cat <path|*>", "Print virtual text file(s)"],
      ["rm [-rf] <path>", "Remove browser-local notes"],
      ["open <app|file>", "Open app, file, or project"],
      ["vim <file>", "Edit a notes file inline"],
      ["pwd", "Print working directory"],
    ],
  },
  {
    title: "System",
    commands: [
      ["whoami / about", "Short bio"],
      ["neofetch", "Portfolio system card"],
      ["whoamireally", "Browser fingerprint + IP"],
      ["ifconfig", "Connectivity snapshot"],
      ["nmap <host>", "Simulated scan (labeled)"],
      ["clear", "Clear transcript"],
    ],
  },
  {
    title: "Site",
    commands: [
      ["projects", "List projects and scroll"],
      ["experience", "Scroll to experience"],
      ["contact", "Scroll to contact"],
      ["resume", "Open resume PDF"],
    ],
  },
  {
    title: "Music",
    commands: [
      ["play <song>", "Search full tracks + previews"],
      ["search <query>", "List matches only"],
      ["track <n>", "Play result # from search"],
      ["results", "Reprint last results"],
      ["pause / continue", "Control playback"],
      ["stop / now", "Stop or show now-playing"],
    ],
  },
];

export const HELP_FUN = [
  "fortune · joke · cowsay [msg] · skills · hire",
  "matrix · sl · hack · ping [host] · weather",
  "flip · dice · coffee · banner · history · exit",
  "man <cmd> · hello · please · sudo <anything>",
];

export const TANISH_ASCII = `
████████╗ █████╗ ███╗   ██╗██╗███████╗██╗  ██╗
╚══██╔══╝██╔══██╗████╗  ██║██║██╔════╝██║  ██║
   ██║   ███████║██╔██╗ ██║██║███████╗███████║
   ██║   ██╔══██║██║╚██╗██║██║╚════██║██╔══██║
   ██║   ██║  ██║██║ ╚████║██║███████║██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝
`.trim();
