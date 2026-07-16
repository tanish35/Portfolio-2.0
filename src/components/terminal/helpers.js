import { FS_STORAGE_KEY, NMAP_HOSTS, UI_STORAGE_KEY } from "@/lib/terminal-core";

export function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    history.pushState(null, "", hash);
  }
}

export function loadNotes() {
  try {
    const raw = localStorage.getItem(FS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    /* quota */
  }
}

export function loadUiPrefs() {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUiPrefs(prefs) {
  try {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function simulatedNmap(host) {
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
