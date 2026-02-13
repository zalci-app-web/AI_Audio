import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "AudioStore - AI Generated Music Library",
  description: "Zalci AudioによるAI生成BGMライブラリ。ゲーム開発や動画制作に最適な高品質な楽曲を公開中。",
  keywords: ["AI音楽", "BGM素材", "ゲーム開発", "Zalci Audio", "無料配布"],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "AudioStore - AI Generated Music Library",
    description: "Zalci AudioによるAI生成BGMライブラリ。ゲーム開発や動画制作に最適な高品質な楽曲を公開中。",
    url: "https://audiostore.zalci.net",
    siteName: "Zalci Audio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
