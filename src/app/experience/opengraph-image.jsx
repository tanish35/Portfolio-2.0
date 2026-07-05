import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Experience of Tanish Majumdar";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Experience"
        title="Work timeline"
        subtitle="SDE internships across AI products & scalable backends"
        tags={["Your Brand Mate", "UnifiedAI", "Steora", "Polycab"]}
      />
    ),
    { ...OG_SIZE }
  );
}
