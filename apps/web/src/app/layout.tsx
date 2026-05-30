import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BannerHeightSync from "@/components/BannerHeightSync";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "Scentora | %s",
    default: "Scentora — Luxury Fragrance Maison",
  },
  description: "Experience the sensory richness and cinematic sophistication of Scentora's exclusive collections.",
  keywords: ["luxury fragrance", "niche perfume", "oud fragrance", "artisan perfume", "perfume shop"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-primary text-text-primary font-sans flex flex-col" style={{ paddingTop: "var(--banner-h)" }} suppressHydrationWarning>
        {/* Demo banner */}
        <div
          id="demo-banner"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            background: "#e53e3e",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            minHeight: "var(--banner-h)",
            padding: "4px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 2,
          }}
        >
          <span style={{ pointerEvents: "none" }}>This is an AI-powered dummy website created by ADIB for demonstration.</span>
          <span>
            To explore the admin panel, visit{" "}
            <a href="/admin" style={{ color: "#fff", textDecoration: "underline", pointerEvents: "auto" }}>/admin</a>
            {" "}— Username &amp; Password:{" "}
            <span style={{ pointerEvents: "none" }}>adminview</span>
          </span>
        </div>
        {/* Inline blocking script — runs synchronously after banner is parsed,
            before any paint, so --banner-h and body padding are exact from frame 1 */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var b=document.getElementById('demo-banner');if(b){var h=b.offsetHeight;document.documentElement.style.setProperty('--banner-h',h+'px');document.body.style.paddingTop=h+'px';}})();` }} />
        <BannerHeightSync />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
