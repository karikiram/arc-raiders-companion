import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider, ProgressProvider, SubscriptionProvider } from "@/context";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://arc-companion.com";
const SITE_NAME = "Arc Raiders Companion";
const SITE_DESCRIPTION = "The ultimate Arc Raiders companion app. Track your stash, get smart KEEP/SELL/RECYCLE recommendations, manage workshop upgrades, plan loadouts, and optimize your raids. Free inventory management tool for Arc Raiders players.";

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: `${SITE_NAME} - Inventory & Stash Tracker`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    // Primary keywords
    "Arc Raiders",
    "Arc Raiders companion",
    "Arc Raiders companion app",
    "Arc Raiders stash tracker",
    "Arc Raiders inventory",
    "Arc Raiders loot guide",
    // Feature keywords
    "workshop upgrades",
    "Scrappy upgrades",
    "loadout builder",
    "extraction shooter",
    "recycle guide",
    "sell guide",
    "what to keep Arc Raiders",
    "what to sell Arc Raiders",
    "what to recycle Arc Raiders",
    // Station keywords
    "Gunsmith upgrades",
    "Gear Bench upgrades",
    "Medical Lab upgrades",
    "Refiner upgrades",
    "Explosives Station",
    "Utility Station",
    // Item-related
    "Arc Raiders items",
    "Arc Raiders materials",
    "Arc Raiders crafting",
    "raider stash",
    "loot tracker",
    // Gaming terms
    "extraction game",
    "looter shooter",
    "inventory management",
    "raid planner",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  // Canonical URL
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Smart Inventory & Stash Tracker for Arc Raiders`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Track your Arc Raiders inventory`,
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Smart Inventory & Stash Tracker`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@arccompanion", // Placeholder - update when you have social
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Manifest
  manifest: "/manifest.webmanifest",

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification - add your verification codes here
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // App-specific
  category: "games",
  classification: "Gaming Tools",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5382553553174190"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
      >
        <AuthProvider>
          <SubscriptionProvider>
            <ProgressProvider>
              {children}
            </ProgressProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
