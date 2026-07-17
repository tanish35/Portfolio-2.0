import { readIdParam, resolveFullStream } from "@/lib/music-resolve";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

const UPSTREAM_TIMEOUT_MS = 12_000;
const MAX_UPSTREAM_BYTES = 32 * 1024 * 1024;

function errorResponse(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Content-Type, Authorization",
        "Access-Control-Expose-Headers":
          "Content-Length, Content-Range, Accept-Ranges",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const id = readIdParam(searchParams);
  if (!id) return errorResponse(400, "Invalid id");

  const resolved = await resolveFullStream(id);
  if (!resolved) {
    return errorResponse(502, "Full stream is temporarily unavailable");
  }

  const range = request.headers.get("range");
  const upstreamHeaders = {
    ...resolved.headers,
    ...(range ? { Range: range } : {}),
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS);
  let upstream;
  try {
    upstream = await fetch(resolved.url, {
      headers: upstreamHeaders,
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e?.name === "AbortError") {
      return errorResponse(504, "Upstream timeout while fetching audio");
    }
    return errorResponse(502, "Upstream unreachable");
  }
  clearTimeout(timer);

  if (!upstream.ok && upstream.status !== 206) {
    return errorResponse(502, `Upstream returned ${upstream.status}`);
  }

  const contentType = upstream.headers.get("content-type") || "audio/mpeg";
  const contentLength = upstream.headers.get("content-length");
  const acceptRanges = upstream.headers.get("accept-ranges") || "bytes";
  const contentRange = upstream.headers.get("content-range");

  const headers = {
    "Content-Type": contentType,
    "Accept-Ranges": acceptRanges,

    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Range, Content-Type, Authorization",
    "Access-Control-Expose-Headers":
      "Content-Length, Content-Range, Accept-Ranges",
    "X-Music-Source": "octave",
    "X-Music-Quality": resolved.quality || "320",
  };
  if (contentLength) headers["Content-Length"] = contentLength;
  if (contentRange) headers["Content-Range"] = contentRange;

  if (!upstream.body) {
    return errorResponse(502, "Upstream returned empty body");
  }

  const capped = limitStream(upstream.body, MAX_UPSTREAM_BYTES);

  return new Response(capped, {
    status: upstream.status,
    headers,
  });
}

function limitStream(body, max) {
  const reader = body.getReader();
  let received = 0;
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        received += value.byteLength;
        if (received > max) {
          controller.error(new Error("Upstream payload too large"));
          try {
            await reader.cancel();
          } catch {}
          return;
        }
        controller.enqueue(value);
      } catch (err) {
        controller.error(err);
      }
    },
    cancel(reason) {
      try {
        reader.cancel(reason);
      } catch {}
    },
  });
}
