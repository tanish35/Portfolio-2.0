// Real (browser-feasible) ping + port probing for the terminal.
//
// Browsers can't do ICMP or raw TCP, so "ping" here measures the round-trip
// time to load a host's favicon over HTTP(S) via the `ping.js` library, and
// "nmap" probes only the web ports a browser is actually allowed to reach.
import Ping from "ping.js";

/** Strip protocol/path and return a clean host[:port] label. */
function cleanHost(input) {
  return String(input || "")
    .trim()
    .replace(/^[a-z]+:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "");
}

/** Build an origin (protocol://host[:port]) for a probe. */
function toOrigin(host, protocol, port) {
  const hostOnly = cleanHost(host).replace(/:\d+$/, "");
  const isDefault =
    (protocol === "http" && port === 80) ||
    (protocol === "https" && port === 443);
  return isDefault
    ? `${protocol}://${hostOnly}`
    : `${protocol}://${hostOnly}:${port}`;
}

/**
 * Time a single favicon load. Resolves to { received, ms }.
 * ping.js resolves to the RTT on image load, and rejects to the RTT on error
 * or timeout — a reject faster than the timeout still means the host answered.
 */
function probe(origin, timeout) {
  const p = new Ping({ timeout });
  return p
    .ping(origin)
    .then((ms) => ({ received: true, ms }))
    .catch((ms) => {
      const value = typeof ms === "number" ? ms : timeout;
      return { received: value < timeout - 50, ms: value };
    });
}

/** ping <host> — sequential favicon RTT probes, formatted like ping(8). */
export async function pingHost(host, { count = 4, timeout = 4000 } = {}) {
  const raw = String(host || "").trim();
  const label = cleanHost(host) || "tanish.site";
  const hasProto = /^[a-z]+:\/\//i.test(raw);
  let origin;
  if (hasProto) {
    // keep protocol + host[:port], drop any path
    origin = (raw.match(/^[a-z]+:\/\/[^/]+/i) || [raw])[0];
  } else {
    const hp = cleanHost(host) || "tanish.site";
    // an explicit :port implies a dev/plain-http service; otherwise HTTPS
    origin = /:\d+$/.test(hp) ? `http://${hp}` : `https://${hp}`;
  }

  const lines = [`PING ${label} (${origin}) — HTTP favicon probe, not ICMP`];
  const times = [];
  for (let seq = 0; seq < count; seq++) {
    // eslint-disable-next-line no-await-in-loop
    const { received, ms } = await probe(origin, timeout);
    if (received) {
      times.push(ms);
      lines.push(`64 bytes from ${label}: seq=${seq} time=${ms} ms`);
    } else {
      lines.push(`request to ${label}: seq=${seq} timed out`);
    }
  }

  const loss = Math.round(((count - times.length) / count) * 100);
  lines.push("", `--- ${label} ping statistics ---`);
  lines.push(
    `${count} probes sent, ${times.length} received, ${loss}% loss`,
  );
  if (times.length) {
    const min = Math.min(...times);
    const max = Math.max(...times);
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    lines.push(`rtt min/avg/max = ${min}/${avg}/${max} ms`);
  }
  return lines;
}

// Web ports a browser can attempt (well-known blocked ports like 22 are
// excluded because the browser refuses to connect to them at all).
const WEB_PORTS = [
  { port: 443, protocol: "https", service: "https" },
  { port: 80, protocol: "http", service: "http" },
  { port: 8080, protocol: "http", service: "http-alt" },
  { port: 3000, protocol: "http", service: "dev-server" },
];

/** nmap <host> — real reachability scan of the probeable web ports. */
export async function scanHost(host, { timeout = 3000 } = {}) {
  const label = cleanHost(host) || "unknown";
  const results = await Promise.all(
    WEB_PORTS.map(async ({ port, protocol, service }) => {
      const { received } = await probe(toOrigin(host, protocol, port), timeout);
      return { port, service, state: received ? "open" : "filtered" };
    }),
  );

  const openCount = results.filter((r) => r.state === "open").length;
  const rows = results.map(
    (r) =>
      `${`${r.port}/tcp`.padEnd(9)}${r.state.padEnd(11)}${r.service}`,
  );

  return [
    `Scanning ${label} — browser web-port probe (no raw TCP/ICMP)`,
    "PORT     STATE      SERVICE",
    ...rows,
    "",
    `${openCount} responded, ${results.length - openCount} no response.`,
    "Non-web ports (22, 3306, 6379, …) can't be reached from a browser.",
  ];
}
