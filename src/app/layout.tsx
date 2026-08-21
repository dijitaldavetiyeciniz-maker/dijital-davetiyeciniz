import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Montserrat, Outfit, Lora, Cinzel, Playfair_Display, Inter, Caveat } from "next/font/google";
import "./globals.css";
import StickyWhatsAppCTA from "@/components/StickyWhatsAppCTA";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-cormorant", display: "swap" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-montserrat", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-outfit", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-lora", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-cinzel", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-caveat", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dijital-davetiyeciniz.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dijital Davetiyeciniz - Online Düğün, Nişan & Etkinlik Davetiyesi",
    template: "%s | Dijital Davetiyeciniz",
  },
  description: "Zarf açılış animasyonlu, müzikli, konum tarifli ve anlık LCV takipli 120+ premium dijital davetiye şablonu. Düğün, nişan, kına ve kurumsal etkinlikleriniz için 2 dakikada oluşturun.",
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
    "whatsapp davetiye",
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
    description: "Zarf açılış animasyonlu, müzikli, konum tarifli ve anlık LCV takipli 120+ premium dijital davetiye şablonu.",
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
    description: "Zarf animasyonlu, müzikli, yol tarifli ve LCV takipli 120+ dijital davetiye şablonu.",
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
  verification: {
    google: "google-site-verification-token",
  },
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
      "telephone": "+90-555-000-0000",
      "contactType": "customer service",
      "areaServed": "TR",
      "availableLanguage": "Turkish"
    },
    "sameAs": [
      "https://instagram.com/dijitaldavetiyeciniz"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Dijital Davetiyeciniz",
    "image": `${SITE_URL}/favicon.ico`,
    "url": SITE_URL,
    "telephone": "+90-555-000-0000",
    "priceRange": "₺₺",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Levent, Büyükdere Cad. No: 199",
      "addressLocality": "Şişli",
      "addressRegion": "İstanbul",
      "postalCode": "34394",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.0805,
      "longitude": 29.0117
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${greatVibes.variable} ${montserrat.variable} ${outfit.variable} ${lora.variable} ${cinzel.variable} ${playfair.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        {children}
        <StickyWhatsAppCTA />
      </body>
    </html>
  );
}
