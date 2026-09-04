import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SupportWidget from "@/components/support/SupportWidget";
import PlatformAnnouncementBanner from "@/components/PlatformAnnouncementBanner";
import MaintenanceGate from "@/components/MaintenanceGate";
import { PRODUCT_STATS } from "@/lib/productStats";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijitaldavetiyeciniz.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dijital Davetiyeciniz - Online Düğün, Nişan & Etkinlik Davetiyesi",
    template: "%s | Dijital Davetiyeciniz",
  },
  description: `${PRODUCT_STATS.templateCount}+ premium dijital davetiye şablonu, ${PRODUCT_STATS.openingCount} zarf açılış animasyonu, müzikli, konum tarifli ve anlık LCV takipli yeni nesil online davetiye platformu.`,
  keywords: [
    "dijital davetiye",
    "online davetiye",
    "düğün davetiyesi",
    "nişan davetiyesi",
    "kına davetiyesi",
    "sünnet davetiyesi",
    "baby shower davetiyesi",
    "lcv toplama",
    "interaktif davetiye",
    "e davetiye"
  ],
  authors: [{ name: "Dijital Davetiyeciniz" }],
  creator: "Dijital Davetiyeciniz",
  publisher: "Dijital Davetiyeciniz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Dijital Davetiyeciniz",
    title: "Dijital Davetiyeciniz - Premium Online Davetiye Deneyimi",
    description: `${PRODUCT_STATS.templateCount}+ premium dijital davetiye şablonu, ${PRODUCT_STATS.openingCount} zarf açılış animasyonu ve anlık LCV takibi.`,
    images: [
      {
        url: `${SITE_URL}/images/og-main.png`,
        width: 1200,
        height: 630,
        alt: "Dijital Davetiyeciniz - Online Düğün ve Etkinlik Davetiyesi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dijital Davetiyeciniz - Premium Online Davetiye",
    description: `${PRODUCT_STATS.templateCount}+ dijital davetiye şablonu, ${PRODUCT_STATS.openingCount} zarf animasyonu ve LCV takibi.`,
    images: [`${SITE_URL}/images/og-main.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }
  } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dijital Davetiyeciniz",
    "url": SITE_URL,
    "logo": `${SITE_URL}/favicon.ico`,
    "description": "Yeni nesil online düğün, nişan, kına ve kurumsal etkinlik dijital davetiye platformu.",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "destek@dijitaldavetiyeciniz.com",
      "contactType": "customer service",
      "availableLanguage": "Turkish"
    }
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dijital Davetiyeciniz",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/sablonlar?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-500 selection:text-white flex flex-col relative overflow-x-hidden">
        <MaintenanceGate>
          <PlatformAnnouncementBanner />
          {children}
          <SupportWidget />
        </MaintenanceGate>
      </body>
    </html>
  );
}
