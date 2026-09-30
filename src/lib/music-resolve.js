const MONOCHROME_HOST = "https://tracks.monochrome.st";

export function readIdParam(searchParams) {
  const raw = searchParams.get("id") || "";
  const match = raw.match(/^(?:monochrome:)?([1-9]\d{0,19})$/);
  return match?.[1] || null;
}

export function streamUrl(id) {
  return `${MONOCHROME_HOST}/track/${id}`;
}
