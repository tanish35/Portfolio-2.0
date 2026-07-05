import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — ${project.caption}`;
  const url = `${SITE_URL}/projects/${project.slug}`;

  return {
    title: `${project.title} | ${project.caption}`,
    description: project.description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: project.description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title} — ${project.caption}`,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    keywords: project.tags.join(", "),
    author: {
      "@type": "Person",
      name: "Tanish Majumdar",
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-20 py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto">
        <Link
          href="/projects"
          className="text-sm text-neutral-400 hover:text-orange-400"
        >
          ← All projects
        </Link>

        <p className="text-sm uppercase tracking-widest text-orange-500 mt-8">
          {project.caption}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mt-3">{project.title}</h1>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.title} — ${project.caption}`}
            className="w-full h-auto"
          />
        </div>

        <p className="text-lg text-neutral-300 mt-8 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.buttonLink ? (
          <div className="mt-10">
            <a
              href={project.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
            >
              {project.buttonText || "View project"} ↗
            </a>
          </div>
        ) : null}
      </article>
    </main>
  );
}
