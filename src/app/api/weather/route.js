/**
 * Plain-text weather proxy (wttr.in returns HTML to browser UAs).
 * GET /api/weather?q=Mumbai
 */

export const runtime = "nodejs";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let place = (searchParams.get("q") || "Mumbai").trim().slice(0, 60);
    if (!place || /[\u0000-\u001F]/.test(place)) {
      return json({ error: "Invalid place" }, 400);
    }

    const url = `https://wttr.in/${encodeURIComponent(place)}?format=3`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);

    let res;
    try {
      res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          "User-Agent": "curl/8.0.0",
          Accept: "text/plain",
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      return json({ error: "Weather service unavailable" }, 502);
    }

    const body = (await res.text()).trim();
    // Reject HTML fallbacks
    if (!body || body.startsWith("<") || /<html/i.test(body)) {
      return json({ error: `No weather for “${place}”` }, 404);
    }

    return json({ line: body, place });
  } catch (e) {
    if (e?.name === "AbortError") {
      return json({ error: "Weather request timed out" }, 504);
    }
    return json({ error: "Weather fetch failed" }, 502);
  }
}
