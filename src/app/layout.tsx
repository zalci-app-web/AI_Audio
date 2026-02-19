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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://audiostore.zalci.net'),
  title: "【全曲無料】AudioStore - 2月限定AI生成BGM配布中 | Zalci Audio",
  description: "【2月中限定オープンセール！全曲無料配布実施中】Zalci AudioによるAI生成BGMライブラリ。RPG、バトル、ホラー、動画制作に最適な高品質な楽曲をダウンロードできます。",
  keywords: ["AI音楽", "BGM素材", "全曲無料", "2月限定", "ゲーム開発", "Zalci Audio", "著作権フリー"],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "【全曲無料】AudioStore - 2月限定AI生成BGM配布中 | Zalci Audio",
    description: "【2月中限定オープンセール！全曲無料配布実施中】Zalci AudioによるAI生成BGMライブラリ。RPG、バトル、ホラー、動画制作に最適な高品質な楽曲をダウンロードできます。",
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
