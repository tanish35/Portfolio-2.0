import { readIdParam, streamUrl } from "@/lib/music-resolve";

export async function GET(request) {
  const id = readIdParam(new URL(request.url).searchParams);
  if (!id) return Response.json({ error: "Invalid track id" }, { status: 400 });

  return Response.redirect(streamUrl(id), 307);
}
