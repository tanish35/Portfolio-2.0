import Link from "next/link";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Projects",
  description:
    "Full-stack, AI and blockchain projects by Tanish Majumdar — including Ops Smith (autonomous AI-SRE), AskVault, Quantra, EcoX, Campusify, BlockWatch and Pomogen.",
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: "Projects | Tanish Majumdar",
    description:
      "Full-stack, AI and blockchain projects by Tanish Majumdar.",
    url: `${SITE_URL}/projects`,
    type: "website",
  },
};

export default function ProjectsPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Tanish Majumdar",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/projects/${project.slug}`,
      name: project.title,
    })),
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-20 py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <header className="max-w-5xl mx-auto mb-14">
        <p className="text-sm uppercase tracking-widest text-orange-500">
          Projects
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mt-3">
          Things I&apos;ve built
        </h1>
        <p className="text-lg text-neutral-400 mt-4 max-w-2xl">
          A selection of full-stack, AI and blockchain projects. Each has its own
          page — share the link and it renders a live preview.
        </p>
      </header>

      <section className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-orange-500/50 hover:bg-white/[0.06]"
          >
            <h2 className="text-2xl font-semibold group-hover:text-orange-400">
              {project.title}
            </h2>
            <p className="text-neutral-400 mt-1">{project.caption}</p>
            <p className="text-neutral-500 text-sm mt-4 line-clamp-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full bg-white/5 border border-white/10 px-3 py-1 text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>

      <div className="max-w-5xl mx-auto mt-16">
        <Link href="/" className="text-orange-400 hover:text-orange-300">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
