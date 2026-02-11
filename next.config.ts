import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Clickjacking koruması - sayfanın iframe içinde yüklenmesini engeller
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    // MIME type sniffing koruması
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Referrer bilgi sızıntısını önler
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // Tarayıcı özelliklerini sınırlar (kamera, mikrofon, konum vb.)
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  {
    // HTTPS zorunluluğu (HSTS) - 1 yıl
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    // Eski tarayıcılar için XSS koruması
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // Content Security Policy - sadece güvenilir kaynaklardan içerik yükleme
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Tüm rotalara güvenlik başlıkları uygula
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
