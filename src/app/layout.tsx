import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://audiostore.zalci.net'),
  title: {
    default: "【全曲無料】Zalci Audio - AI生成BGM素材 | ゲーム・動画向け著作権フリー楽曲",
    template: "%s | Zalci Audio",
  },
  description: "【2月中限定オープンセール！全曲無料配布実施中】Zalci AudioによるAI生成BGMライブラリ。RPG、バトル、ホラー、動画制作に最適な高品質な楽曲をダウンロードできます。",
  keywords: ["AI音楽", "BGM素材", "全曲無料", "ゲーム開発", "Zalci Audio", "著作権フリー", "フリーBGM", "RPG BGM", "AI生成音楽", "ゲームBGM", "動画BGM", "ロイヤリティフリー", "音楽素材"],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "【全曲無料】Zalci Audio - AI生成BGM素材 | ゲーム・動画向け著作権フリー",
    description: "【2月中限定オープンセール！全曲無料配布実施中】Zalci AudioによるAI生成BGMライブラリ。RPG、バトル、ホラー、動画制作に最適な高品質な楽曲をダウンロードできます。",
    url: "https://audiostore.zalci.net",
    siteName: "Zalci Audio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zalci Audio - AI生成BGM素材ストア",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "【全曲無料】Zalci Audio - AI生成BGM素材",
    description: "AI生成BGMライブラリ。ゲーム、動画、配信向けの高品質なオーディオ素材を無料でダウンロード。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd type="WebSite" />
        <JsonLd type="Organization" />
        {children}
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"}');
          `}
        </Script>
      </body>
    </html>
  );
}
