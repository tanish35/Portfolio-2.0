/**
 * Transcript entry factories + shared formatters for the terminal.
 */

export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function text(lines, extra = {}) {
  return {
    id: makeId(),
    type: "text",
    lines: Array.isArray(lines) ? lines : [lines],
    ...extra,
  };
}

export function list(items) {
  return { id: makeId(), type: "list", items };
}

export function systemEntry() {
  return { id: makeId(), type: "system" };
}

export function commandEntry(cmd) {
  return { id: makeId(), type: "command", command: cmd };
}

export function helpEntry() {
  return { id: makeId(), type: "help" };
}

export function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
