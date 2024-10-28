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
      <Script
        strategy="afterInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4}`}
      ></Script>
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
