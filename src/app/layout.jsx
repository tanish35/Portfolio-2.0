import { Inter } from "next/font/google";
import "@/assets/css/globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://portfolio.devpixel.site"),
  title: "Tanish's Portfolio",
  description: "Portfolio of software projects by Tanish Majumdar",
  applicationName: "Portfolio",
  authors: [
    {
      name: "Tanish Majumdar",
      url: "mailto:tanishmajumdar2912@gmail.com",
    },
  ],
  keywords: [
    "portfolio",
    "software",
    "projects",
    "Tanish Majumdar",
    "freelancer",
    "web developer",
    "AI expert",
  ],
  robots: "index, follow",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/x-icon",
        sizes: "16x16",
        url: "/favicon/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/x-icon",
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
    androidIcon: [
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
    title: "Tanish's Portfolio",
    description: "Portfolio of software projects by Tanish Majumdar",
    url: "https://portfolio.devpixel.site",
    site_name: "Tanish's Portfolio",
    images: [
      {
        url: "/images/port.png",
        alt: "Tanish's Portfolio Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanish's Portfolio",
    description: "Portfolio of software projects by Tanish Majumdar",
    image: "/images/port.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
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
      </body>
    </html>
  );
}
