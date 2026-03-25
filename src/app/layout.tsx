import type { Metadata } from "next";
import { JetBrains_Mono, Share_Tech_Mono, DM_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import AmbientCanvas from "@/components/AmbientCanvas";
import CardBreathEffect from "@/components/CardBreathEffect";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Save State — Understory Labs",
  description: "A changelog and portfolio tracker for Understory Labs projects.",
  openGraph: {
    title: "Save State — Understory Labs",
    description: "A changelog and portfolio tracker for Understory Labs projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${shareTechMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ position: "relative" }}>
        <AmbientCanvas />
        <CardBreathEffect />
        <Nav />
        {children}
        <footer
          className="w-full px-6 md:px-10 lg:px-16 py-8 mt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-share-tech), monospace",
              color: "var(--text-muted)",
            }}
          >
            UNDERSTORY LABS · {new Date().getFullYear()}
          </p>
        </footer>
      </body>
    </html>
  );
}
