import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTC Endüstriyel | Alosbi Depo Stok Yönetimi",
  description: "GTC Endüstriyel için profesyonel depo stok yönetim sistemi",
  keywords: ["stok yönetimi", "depo", "GTC Endüstriyel", "Alosbi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
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
