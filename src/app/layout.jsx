import { Inter } from "next/font/google";
import "@/assets/css/globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://tanishm.site"),
  title: "Tanish's Portfolio",
  description:
    "Showcasing software projects by Tanish Majumdar - Web Developer, Freelancer, and AI Expert.",
  applicationName: "Tanish's Portfolio",
  authors: [
    {
      name: "Tanish Majumdar",
      url: "mailto:tanishmajumdar2912@gmail.com",
    },
  ],
  keywords: [
    "Tanish Majumdar",
    "portfolio",
    "web developer",
    "freelancer",
    "AI expert",
    "software projects",
    "frontend developer",
    "backend developer",
  ],
  robots: "index, follow",
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
    url: "https://tanishm.site",
    siteName: "Tanish's Portfolio",
    locale: "en_US",
    images: [
      {
        url: "https://tanishm.site/images/port.png",
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
    images: ["https://tanishm.site/images/port.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="canonical" href="https://tanishm.site/" />
      </head>
      <Script id="clarity-script" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`}
      </Script>
      <Script id="google-script" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${process.env.NEXT_PUBLIC_GA4}');`}
      </Script>
      <body className={inter.className}>
        <NavBar />
        {children}
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
        <SpeedInsights />
        <Analytics />
      </body>
      <Script
        src="https://umami34.vercel.app/script.js"
        data-website-id="5ed1fbcb-c766-4aee-9640-1db097636558"
        strategy="afterInteractive"
        defer
      />
    </html>
  );
}
