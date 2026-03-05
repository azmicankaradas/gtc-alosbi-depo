import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "GTC Endüstriyel | Alosbi Depo Stok Yönetimi",
  description: "GTC Endüstriyel için profesyonel depo stok yönetim sistemi",
  keywords: ["stok yönetimi", "depo", "GTC Endüstriyel", "Alosbi"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GTC Depo",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="pb-20 md:pb-0">
          {children}
        </div>
        <MobileNav />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
