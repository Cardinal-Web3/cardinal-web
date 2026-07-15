import type { Metadata } from "next";
import Script from "next/script";
import { ProgressiveBlur } from "@/components/layout/progressive-blur";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { WalletModal } from "@/components/site/WalletButton";
import "@/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.cardinalweb3.com"),
  title: {
    default: "Cardinal — Protect every transaction before value moves",
    template: "%s · Cardinal",
  },
  description:
    "Cardinal is the trust layer for digital asset transactions. Scan risk before signature and route users into safer settlement flows like SafeSend and escrow.",
  authors: [{ name: "Cardinal" }],
  openGraph: {
    title: "Cardinal — Protect every transaction before value moves",
    description:
      "Cardinal scans risk before signature and routes users into safer settlement flows like SafeSend and escrow.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cardinal",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <Script id="cardinal-theme" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('cardinal-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var r=document.documentElement;if(t==='light'){r.classList.remove('dark');}else{r.classList.add('dark');}}catch(e){}})();`}
        </Script>
        <SmoothScroll>
          {children}
          <ProgressiveBlur />
          <WalletModal />
        </SmoothScroll>
      </body>
    </html>
  );
}
