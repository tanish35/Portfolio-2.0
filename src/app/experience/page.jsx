import Link from "next/link";
import { experienceData } from "@/data/experience";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Experience",
  description:
    "Software engineering experience of Tanish Majumdar — SDE internships at Your Brand Mate, UnifiedAI, Steora and Polycab India, spanning AI products, data pipelines, and scalable backends.",
  alternates: { canonical: `${SITE_URL}/experience` },
  openGraph: {
    title: "Experience | Tanish Majumdar",
    description:
      "SDE internships across AI products, data pipelines and scalable backends.",
    url: `${SITE_URL}/experience`,
    type: "profile",
  },
};

export default function ExperiencePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Work experience of Tanish Majumdar",
    itemListElement: experienceData.map((exp, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "OrganizationRole",
        roleName: exp.title,
        startDate: exp.duration,
        memberOf: {
          "@type": "Organization",
          name: exp.company,
          url: `https://${exp.companyUrl}`,
        },
      },
    })),
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-20 py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="max-w-3xl mx-auto mb-14">
        <p className="text-sm uppercase tracking-widest text-orange-500">
          Experience
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mt-3">Work timeline</h1>
        <p className="text-lg text-neutral-400 mt-4">
          Software engineering roles across AI products, data pipelines and
          scalable backends.
        </p>
      </header>

      <ol className="max-w-3xl mx-auto relative border-l border-white/10 pl-8 space-y-10">
        {experienceData.map((exp) => (
          <li key={exp.slug} className="relative">
            <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-orange-500 shadow-[0_0_18px] shadow-orange-500/60" />
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 className="text-2xl font-semibold">
                {exp.title} ·{" "}
                <span className="text-orange-400">{exp.company}</span>
              </h2>
              <span className="text-sm text-neutral-500">{exp.duration}</span>
            </div>
            <a
              href={`https://${exp.companyUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-orange-400"
            >
              {exp.companyUrl}
            </a>
            <p className="text-neutral-300 mt-3 leading-relaxed">
              {exp.description}
            </p>
          </li>
        ))}
      </ol>

      <div className="max-w-3xl mx-auto mt-16">
        <Link href="/" className="text-orange-400 hover:text-orange-300">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
