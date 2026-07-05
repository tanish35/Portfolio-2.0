import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Projects by Tanish Majumdar";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Projects"
        title="Things I've built"
        subtitle="Full-stack · AI · Blockchain engineering"
        tags={["Next.js", "AI / RAG", "TypeScript", "Node.js", "Postgres"]}
      />
    ),
    { ...OG_SIZE }
  );
}
