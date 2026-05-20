import type { Metadata } from "next";
import { Inter } from "next/font/google";
import FirebaseAnalytics from "@/components/analytics/FirebaseAnalytics";
import { SITE } from "@/lib/constants";
import { absoluteUrl, OG_IMAGE, SITE_URL } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const siteTitle = "AGEC Finances — Cabinet d'Experts-Comptables";
const siteDescription =
  "Nous traduisons vos chiffres en stratégie. Cabinet d'expertise comptable au Pré-Saint-Gervais, près de Paris.";
const ogImageUrl = absoluteUrl(OG_IMAGE.path);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: SITE.description,
  keywords: [
    "expert-comptable",
    "cabinet comptable",
    "Le Pré-Saint-Gervais",
    "Paris",
    "comptabilité",
    "fiscalité",
    "paie",
    "audit",
    "conseil",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE.name,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: OG_IMAGE.path,
        secureUrl: ogImageUrl,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/images/af-logo-circle.png", sizes: "180x180", type: "image/png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: SITE.name,
  description: SITE.description,
  url: SITE_URL,
  image: ogImageUrl,
  telephone: "+33143605000",
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 Avenue Faidherbe",
    addressLocality: "Le Pré-Saint-Gervais",
    postalCode: "93310",
    addressCountry: "FR",
  },
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/af-logo-circle.png" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content={String(OG_IMAGE.width)} />
        <meta property="og:image:height" content={String(OG_IMAGE.height)} />
        <meta property="og:image:alt" content={OG_IMAGE.alt} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content={ogImageUrl} />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
