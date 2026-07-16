/**
 * Browser-side visitor probe for `whoamireally`.
 * Returns structured sections for rich terminal UI.
 */

const IP_ENDPOINTS = [
  {
    name: "ipapi.co",
    url: "https://ipapi.co/json/",
    map: (d) => ({
      ip: d.ip,
      city: d.city,
      region: d.region || d.region_code,
      country: d.country_name || d.country,
      postal: d.postal,
      latitude: d.latitude,
      longitude: d.longitude,
      org: d.org,
      asn: d.asn,
      timezone: d.timezone,
      currency: d.currency,
      callingCode: d.country_calling_code,
      languages: d.languages,
    }),
  },
  {
    name: "ipwho.is",
    url: "https://ipwho.is/",
    map: (d) => ({
      ip: d.ip,
      city: d.city,
      region: d.region,
      country: d.country,
      postal: d.postal,
      latitude: d.latitude,
      longitude: d.longitude,
      org: d.connection?.org || d.org,
      asn: d.connection?.asn ? `AS${d.connection.asn}` : d.asn,
      isp: d.connection?.isp,
      timezone: d.timezone?.id || d.timezone,
      currency: d.currency?.code,
      callingCode: d.calling_code,
      flag: d.flag?.emoji,
      type: d.type,
    }),
  },
];

function parseBrowserFamily(ua) {
  if (!ua) return "unknown";
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) return "Safari";
  if (/opr\//i.test(ua)) return "Opera";
  return "Other";
}

function mq(query) {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

function val(v) {
  if (v === undefined || v === null || v === "") return "—";
  return String(v);
}

function section(id, title, icon, rows) {
  return {
    id,
    title,
    icon,
    rows: rows
      .filter((r) => r && r.label)
      .map((r) => ({ label: r.label, value: val(r.value) })),
  };
}

function getGpuInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) {
      return { renderer: "unavailable", vendor: "unavailable", version: "—" };
    }
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      vendor: ext
        ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR),
      renderer: ext
        ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION) || "—",
      shading: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || "—",
      maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    };
  } catch {
    return { renderer: "unavailable", vendor: "unavailable", version: "—" };
  }
}

function getCanvasFingerprint() {
  try {
    const c = document.createElement("canvas");
    c.width = 240;
    c.height = 60;
    const ctx = c.getContext("2d");
    if (!ctx) return "—";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(0, 0, 120, 60);
    ctx.fillStyle = "#069";
    ctx.fillText("tanish@portfolio", 2, 15);
    ctx.fillStyle = "rgba(102,204,0,0.7)";
    ctx.fillText("whoamireally", 4, 35);
    const data = c.toDataURL();
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash |= 0;
    }
    return (hash >>> 0).toString(16);
  } catch {
    return "—";
  }
}

function getAudioFingerprint() {
  return new Promise((resolve) => {
    try {
      const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!Ctx) {
        resolve("—");
        return;
      }
      const ctx = new Ctx(1, 44100, 44100);
      const osc = ctx.createOscillator();
      const comp = ctx.createDynamicsCompressor();
      osc.type = "triangle";
      osc.frequency.value = 10000;
      osc.connect(comp);
      comp.connect(ctx.destination);
      osc.start(0);
      ctx
        .startRendering()
        .then((buf) => {
          const data = buf.getChannelData(0);
          let sum = 0;
          for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
          resolve(sum.toFixed(6));
        })
        .catch(() => resolve("—"));
    } catch {
      resolve("—");
    }
  });
}

/** Synchronous structured snapshot */
export function collectLocalProbe() {
  const nav = navigator;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const gpu = getGpuInfo();
  const intl = Intl.DateTimeFormat().resolvedOptions();
  const perfMem = performance.memory;

  return {
    title: "whoamireally",
    subtitle: "Browser session probe",
    summary: [
      { label: "Browser", value: parseBrowserFamily(nav.userAgent) },
      { label: "Platform", value: nav.platform || "—" },
      { label: "Timezone", value: intl.timeZone || "—" },
      {
        label: "Viewport",
        value: `${window.innerWidth}×${window.innerHeight}`,
      },
    ],
    sections: [
      section("browser", "Browser", "◎", [
        { label: "Family", value: parseBrowserFamily(nav.userAgent) },
        { label: "User-Agent", value: nav.userAgent },
        { label: "Vendor", value: nav.vendor },
        { label: "Platform", value: nav.platform },
        { label: "Product", value: nav.product },
        { label: "WebDriver", value: String(nav.webdriver ?? false) },
        { label: "PDF viewer", value: String(nav.pdfViewerEnabled ?? "—") },
        { label: "Cookies", value: String(nav.cookieEnabled) },
        { label: "DNT", value: nav.doNotTrack ?? nav.msDoNotTrack ?? "—" },
      ]),
      section("locale", "Locale", "🌐", [
        { label: "Language", value: nav.language },
        { label: "Languages", value: (nav.languages || []).join(", ") },
        { label: "Timezone", value: intl.timeZone },
        { label: "Locale", value: intl.locale },
        { label: "Calendar", value: intl.calendar },
        { label: "Numbering", value: intl.numberingSystem },
        { label: "UTC offset", value: `${new Date().getTimezoneOffset()} min` },
      ]),
      section("display", "Display", "▣", [
        { label: "Viewport", value: `${window.innerWidth}×${window.innerHeight}` },
        { label: "Outer", value: `${window.outerWidth}×${window.outerHeight}` },
        { label: "Screen", value: `${screen.width}×${screen.height}` },
        { label: "Available", value: `${screen.availWidth}×${screen.availHeight}` },
        { label: "Pixel ratio", value: window.devicePixelRatio },
        { label: "Color depth", value: screen.colorDepth },
        { label: "Orientation", value: screen.orientation?.type },
      ]),
      section("prefs", "Media prefs", "◐", [
        {
          label: "Color scheme",
          value: mq("(prefers-color-scheme: dark)") ? "dark" : "light",
        },
        {
          label: "Reduced motion",
          value: mq("(prefers-reduced-motion: reduce)") ? "reduce" : "no",
        },
        {
          label: "Pointer",
          value: mq("(pointer: fine)")
            ? "fine"
            : mq("(pointer: coarse)")
              ? "coarse"
              : "none",
        },
        { label: "Hover", value: mq("(hover: hover)") ? "hover" : "none" },
        { label: "HDR", value: mq("(dynamic-range: high)") ? "high" : "standard" },
      ]),
      section("hardware", "Hardware", "⚙", [
        { label: "CPUs", value: nav.hardwareConcurrency },
        {
          label: "Memory",
          value:
            nav.deviceMemory != null ? `${nav.deviceMemory} GB (est.)` : "—",
        },
        { label: "Touch points", value: nav.maxTouchPoints ?? 0 },
        {
          label: "JS heap",
          value: perfMem
            ? `${Math.round(perfMem.usedJSHeapSize / 1048576)} / ${Math.round(perfMem.jsHeapSizeLimit / 1048576)} MB`
            : "—",
        },
        { label: "GPU vendor", value: gpu.vendor },
        { label: "GPU renderer", value: gpu.renderer },
        { label: "WebGL", value: gpu.version },
        { label: "Max texture", value: gpu.maxTex },
        { label: "Canvas hash", value: getCanvasFingerprint() },
      ]),
      section("network-local", "Network (local)", "⌁", [
        { label: "Online", value: nav.onLine ? "yes" : "no" },
        { label: "Connection", value: conn?.effectiveType },
        {
          label: "Downlink",
          value: conn?.downlink != null ? `${conn.downlink} Mbps` : "—",
        },
        { label: "RTT", value: conn?.rtt != null ? `${conn.rtt} ms` : "—" },
        {
          label: "Save-Data",
          value: conn ? (conn.saveData ? "on" : "off") : "—",
        },
      ]),
      section("features", "Features", "✦", [
        { label: "Service Worker", value: "serviceWorker" in nav ? "yes" : "no" },
        {
          label: "WebRTC",
          value: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection)
            ? "yes"
            : "no",
        },
        { label: "WebAssembly", value: typeof WebAssembly !== "undefined" ? "yes" : "no" },
        { label: "WebGL2", value: !!document.createElement("canvas").getContext("webgl2") ? "yes" : "no" },
        { label: "Bluetooth", value: nav.bluetooth ? "yes" : "no" },
        { label: "USB", value: nav.usb ? "yes" : "no" },
        { label: "Geolocation", value: nav.geolocation ? "yes" : "no" },
        {
          label: "Notifications",
          value: "Notification" in window ? Notification.permission : "—",
        },
        { label: "IndexedDB", value: window.indexedDB ? "yes" : "no" },
        { label: "Plugins", value: nav.plugins?.length ?? 0 },
      ]),
    ],
  };
}

async function collectBatterySection() {
  try {
    if (!navigator.getBattery) {
      return section("battery", "Battery", "⚡", [
        { label: "Status", value: "unavailable" },
      ]);
    }
    const b = await navigator.getBattery();
    return section("battery", "Battery", "⚡", [
      { label: "Level", value: `${Math.round(b.level * 100)}%` },
      { label: "Charging", value: b.charging ? "yes" : "no" },
      {
        label: "Time to full",
        value: b.chargingTime === Infinity ? "n/a" : `${b.chargingTime}s`,
      },
      {
        label: "Time to empty",
        value: b.dischargingTime === Infinity ? "n/a" : `${b.dischargingTime}s`,
      },
    ]);
  } catch {
    return section("battery", "Battery", "⚡", [
      { label: "Status", value: "denied" },
    ]);
  }
}

async function collectStorageSection() {
  try {
    if (!navigator.storage?.estimate) {
      return section("storage", "Storage", "▤", [
        { label: "Quota", value: "unavailable" },
      ]);
    }
    const est = await navigator.storage.estimate();
    const used =
      est.usage != null ? `${(est.usage / 1048576).toFixed(2)} MB` : "—";
    const quota =
      est.quota != null ? `${(est.quota / 1073741824).toFixed(2)} GB` : "—";
    const persisted = navigator.storage.persisted
      ? await navigator.storage.persisted()
      : null;
    return section("storage", "Storage", "▤", [
      { label: "Used", value: used },
      { label: "Quota", value: quota },
      {
        label: "Persisted",
        value: persisted == null ? "—" : persisted ? "yes" : "no",
      },
    ]);
  } catch {
    return section("storage", "Storage", "▤", [
      { label: "Status", value: "denied" },
    ]);
  }
}

async function collectMediaSection() {
  try {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return section("media", "Media devices", "🎙", [
        { label: "Status", value: "unavailable" },
      ]);
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const counts = { audioinput: 0, audiooutput: 0, videoinput: 0 };
    for (const d of devices) {
      if (counts[d.kind] != null) counts[d.kind]++;
    }
    return section("media", "Media devices", "🎙", [
      { label: "Microphones", value: counts.audioinput },
      { label: "Speakers", value: counts.audiooutput },
      { label: "Cameras", value: counts.videoinput },
      { label: "Total", value: devices.length },
    ]);
  } catch {
    return section("media", "Media devices", "🎙", [
      { label: "Status", value: "denied" },
    ]);
  }
}

async function collectPermissionsSection() {
  const names = [
    "geolocation",
    "notifications",
    "camera",
    "microphone",
    "clipboard-read",
    "clipboard-write",
  ];
  if (!navigator.permissions?.query) {
    return section("permissions", "Permissions", "⚿", [
      { label: "Status", value: "unavailable" },
    ]);
  }
  const rows = [];
  for (const name of names) {
    try {
      const r = await navigator.permissions.query({ name });
      rows.push({ label: name, value: r.state });
    } catch {
      /* unsupported */
    }
  }
  return section(
    "permissions",
    "Permissions",
    "⚿",
    rows.length ? rows : [{ label: "Status", value: "none reported" }],
  );
}

async function collectFingerprintSection() {
  try {
    const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
    const agent = await FingerprintJS.load();
    const result = await agent.get();
    const rows = [
      { label: "Visitor ID", value: result.visitorId },
      {
        label: "Confidence",
        value:
          result.confidence?.score != null
            ? result.confidence.score.toFixed(3)
            : "—",
      },
      { label: "Library", value: result.version },
    ];
    const keys = [
      "platform",
      "timezone",
      "languages",
      "colorDepth",
      "deviceMemory",
      "screenResolution",
      "touchSupport",
      "webglVendorAndRenderer",
      "adBlock",
    ];
    for (const key of keys) {
      const comp = result.components?.[key];
      if (!comp) continue;
      let v = comp.value;
      if (Array.isArray(v)) v = v.join(" × ");
      else if (v && typeof v === "object") v = JSON.stringify(v);
      if (typeof v === "string" && v.length > 100) v = `${v.slice(0, 97)}…`;
      rows.push({ label: key, value: v ?? (comp.error ? `err` : "—") });
    }
    return section("fingerprint", "FingerprintJS", "◈", rows);
  } catch (e) {
    return section("fingerprint", "FingerprintJS", "◈", [
      { label: "Status", value: e?.message || "failed" },
    ]);
  }
}

async function fetchJson(url, ms = 7000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function collectNetworkSections() {
  const sections = [];
  await Promise.all(
    IP_ENDPOINTS.map(async (ep) => {
      try {
        const raw = await fetchJson(ep.url);
        if (raw.success === false) throw new Error(raw.message || "failed");
        const d = ep.map(raw);
        sections.push(
          section(`net-${ep.name}`, `Public IP · ${ep.name}`, "⬡", [
            { label: "IP", value: d.ip },
            { label: "City", value: d.city },
            { label: "Region", value: d.region },
            { label: "Country", value: d.country },
            { label: "Postal", value: d.postal },
            {
              label: "Coords",
              value:
                d.latitude != null ? `${d.latitude}, ${d.longitude}` : "—",
            },
            { label: "Org", value: d.org },
            { label: "ISP", value: d.isp },
            { label: "ASN", value: d.asn },
            { label: "Timezone", value: d.timezone },
            { label: "Currency", value: d.currency },
            { label: "Calling code", value: d.callingCode },
            { label: "Flag", value: d.flag },
            { label: "Type", value: d.type },
          ]),
        );
      } catch {
        sections.push(
          section(`net-${ep.name}`, `Public IP · ${ep.name}`, "⬡", [
            { label: "Status", value: "lookup failed" },
          ]),
        );
      }
    }),
  );
  return sections;
}

/** Async extras merged into probe report */
export async function collectAsyncProbe() {
  const [
    battery,
    storage,
    media,
    permissions,
    audioFp,
    fingerprint,
    networkSections,
  ] = await Promise.all([
    collectBatterySection(),
    collectStorageSection(),
    collectMediaSection(),
    collectPermissionsSection(),
    getAudioFingerprint(),
    collectFingerprintSection(),
    collectNetworkSections(),
  ]);

  const hardwareExtra = section("signals", "Extra signals", "※", [
    { label: "Audio hash", value: audioFp },
    { label: "Captured at", value: new Date().toISOString() },
  ]);

  return {
    sections: [
      battery,
      storage,
      media,
      permissions,
      fingerprint,
      hardwareExtra,
      ...networkSections,
    ],
    footer: "Browser-only signals from this visit · network geo is IP-based, not GPS",
  };
}
