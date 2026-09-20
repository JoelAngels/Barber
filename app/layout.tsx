import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { BRAND_CONFIG } from "@/config/brand";
import "./globals.css";

/** Display face — headings, logo, numerals. Variable axes keep it one file. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
});

/** Text face — body copy, UI labels. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Tabular face — money, ticket codes, receipts. */
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
    template: `%s · ${BRAND_CONFIG.name}`,
  },
  description: BRAND_CONFIG.subtagline,
  applicationName: BRAND_CONFIG.name,
  keywords: [
    "barbershop software",
    "barber booking system",
    "walk-in queue",
    "salon POS",
    "barber CRM",
  ],
  openGraph: {
    title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.subtagline,
    siteName: BRAND_CONFIG.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.subtagline,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFCFB" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0A09" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Applies the persisted theme before first paint so a dark-mode visitor never
 * sees a white flash. Mirrors the `trimly_theme` key written by AppContext.
 */
const THEME_BOOTSTRAP = `
(function () {
  try {
    var saved = localStorage.getItem('trimly_theme');
    var dark = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
