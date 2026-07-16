import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { projects, getProjectBySlug } from "@/data/projects";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Project by Tanish Majumdar";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Project"
        title={project?.title || "Project"}
        subtitle={project?.caption}
        tags={project?.tags || []}
      />
    ),
    { ...OG_SIZE }
  );
}
