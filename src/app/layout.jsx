import { Inter } from "next/font/google";
import "@/assets/css/globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/navbar";
import { SITE_URL } from "@/lib/site";
// import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tanish Majumdar | Full-Stack Developer & AI Engineer",
    template: "%s | Tanish Majumdar",
  },
  alternates: {
    canonical: SITE_URL,
  },
  description:
    "Tanish Majumdar - Full-Stack Web Developer, Freelancer & AI Engineer. Explore projects, blogs, and open-source work.",
  applicationName: "Tanish's Portfolio",
  authors: [
    {
      name: "Tanish Majumdar",
      url: "mailto:tanishmajumdar2912@gmail.com",
    },
  ],
  keywords: [
    "Tanish Majumdar",
    "tanish",
    "majumdar",
    "tanishm",
    "tanish34",
    "tanish35",
    "portfolio",
    "web developer",
    "freelancer",
    "AI expert",
    "software projects",
    "frontend developer",
    "backend developer",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon/favicon-32x32.png",
      },
    ],
    appleTouchIcon: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/favicon/apple-touch-icon.png",
      },
    ],
    android: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    title: "Tanish's Portfolio",
    description:
      "Discover software projects by Tanish Majumdar. Explore his expertise in web development and AI.",
    url: SITE_URL,
    siteName: "Tanish's Portfolio",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/images/port.png`,
        width: 1200,
        height: 630,
        alt: "Tanish's Portfolio - A showcase of software projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Jaytilakmajumd2",
    title: "Tanish's Portfolio",
    description:
      "Explore software projects and expertise in web development by Tanish Majumdar.",
    images: [`${SITE_URL}/images/port.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Tanish Majumdar",
              url: SITE_URL,
              image: `${SITE_URL}/images/port.png`,
              sameAs: [
                "https://github.com/tanish35",
                "https://linkedin.com/in/tanish-majumdar",
                "https://twitter.com/Jaytilakmajumd2",
              ],
              jobTitle: "Full-Stack Developer",
              worksFor: {
                "@type": "Organization",
                name: "Freelance",
              },
            }),
          }}
        />
      </head>
      <Script id="clarity-script" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`}
      </Script>
      <body className={inter.className}>
        <NavBar />
        <main>{children}</main>
        <Toaster
          toastOptions={{
            position: "bottom-right",
            style: {
              borderRadius: "10px",
              background: "#111",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
