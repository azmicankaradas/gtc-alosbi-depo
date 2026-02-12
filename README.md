# 🏭 GTC Endüstriyel - Alosbi Depo Yönetim Sistemi (WMS)

![Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E)

GTC Endüstriyel için geliştirilmiş, modern ve ölçeklenebilir bir **Depo Yönetim Sistemi (WMS)**. Tekstil ve ayakkabı envanter süreçlerini dijitalleştiren, gerçek zamanlı stok takibi, dinamik depo haritalandırması ve gelişmiş raporlama özelliklerine sahip uçtan uca bir full-stack çözümdür.

---

## 🚀 Özellikler

### 📦 Stok Yönetimi
- **Gerçek Zamanlı Takip:** Ürünlerin giriş, çıkış ve transfer işlemlerinin anlık takibi.
- **Kategorizasyon:** Tekstil ve ayakkabı ürünleri için özelleştirilmiş varyant yönetimi (Beden, Renk, Model).
- **Akıllı Arama:** SKU, ürün adı veya konuma göre saniyeler içinde ürün bulma.
- **Kritik Stok Uyarıları:** Stok seviyesi belirlenen eşiğin altına düştüğünde otomatik uyarı.

### 🗺️ Depo Görselleştirme
- **İnteraktif Harita:** Depo katları, raflar ve bölümlerin görsel olarak yönetildiği dinamik yerleşim planı.
- **Doluluk Analizi:** Rafların doluluk durumunun renk kodlarıyla anlık gösterimi.

### 📊 Raporlama ve Dashboard
- **Kontrol Paneli:** Kritik stok seviyeleri, günlük hareket özetleri ve operasyonel metrikler.
- **Grafik ve Görselleştirme:** Recharts ile stok hareketleri ve doluluk oranlarına dair görsel paneller.
- **PDF Çıktıları:** Stok giriş/çıkış fişleri ve envanter raporlarının jsPDF ile otomatik oluşturulması.

### 🔐 Güvenlik ve Yetkilendirme
- **Rol Tabanlı Erişim (RBAC):** Yönetici ve personel yetkilerinin ayrıştırılması.
- **Güvenli Oturum:** Supabase Auth ile kimlik doğrulama ve oturum yönetimi.
- **Row Level Security (RLS):** PostgreSQL seviyesinde veri güvenliği politikaları.

### 🔍 Gelişmiş Arama
- **Global Arama Motoru:** Binlerce ürün arasında anlık arama yapabilen optimize edilmiş arama altyapısı.

---

## 🛠️ Teknoloji Stack

Bu proje, performans, güvenlik ve geliştirici deneyimi ön planda tutularak en güncel teknolojilerle geliştirilmiştir.

| Alan | Teknoloji | Detay |
|------|-----------|-------|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Actions, SSR |
| **UI Kütüphanesi** | [React 19](https://react.dev/) | Son sürüm React ile yüksek performans |
| **Dil** | [TypeScript 5](https://www.typescriptlang.org/) | Uçtan uca tip güvenliği |
| **Stil** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework |
| **UI Bileşenleri** | [Shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Erişilebilir, özelleştirilebilir bileşenler |
| **İkonlar** | [Lucide React](https://lucide.dev/) | Modern ikon seti |
| **Backend** | [Supabase](https://supabase.com/) | Backend-as-a-Service (BaaS) |
| **Veritabanı** | [PostgreSQL](https://www.postgresql.org/) | RLS ile kurumsal düzey güvenlik |
| **Form Yönetimi** | [React Hook Form](https://react-hook-form.com/) | Performanslı form yönetimi |
| **Validasyon** | [Zod](https://zod.dev/) | Schema tabanlı veri doğrulama |
| **Grafikler** | [Recharts](https://recharts.org/) | Veri görselleştirme ve dashboard grafikleri |
| **PDF** | [jsPDF](https://github.com/parallax/jsPDF) | Otomatik PDF fiş ve rapor oluşturma |

---

## 📋 Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/)
- Bir [Supabase](https://supabase.com/) hesabı ve projesi

---

## ⚙️ Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/azmicankaradas/gtc-alosbi-depo.git
cd gtc-alosbi-depo
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Çevresel Değişkenleri Ayarlayın

`.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase proje bilgilerinizi girin:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sizin-projeniz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sizin-anon-key-degeriniz
```

### 4. Veritabanını Hazırlayın

Supabase SQL Editor üzerinden `supabase/schema.sql` dosyasını çalıştırarak veritabanı tablolarını ve RLS politikalarını oluşturun. Bu işlem:
- `locations`, `products`, `variants`, `stock`, `stock_movements` tablolarını kurar.
- Gerekli RLS politikalarını ve indexleri oluşturur.

### 5. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## 📂 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Yönetici paneli sayfaları
│   ├── dashboard/         # Ana kontrol paneli (page.tsx)
│   ├── locations/         # Depo konum yönetimi
│   ├── login/             # Giriş sayfası
│   ├── movements/         # Stok hareket kayıtları
│   ├── products/          # Ürün yönetimi
│   ├── reports/           # Raporlama sayfaları
│   ├── search/            # Global arama
│   ├── stock/             # Stok giriş/çıkış işlemleri
│   ├── layout.tsx         # Ana layout
│   └── page.tsx           # Dashboard ana sayfa
├── components/            # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/                # Shadcn/ui temel bileşenler
│   └── ...                # Özel bileşenler
├── lib/                   # Supabase istemcisi ve yardımcı fonksiyonlar
└── types/                 # TypeScript tip tanımları

supabase/
├── schema.sql             # Veritabanı şeması
└── migrations/            # Veritabanı migration dosyaları
```

---

## 📸 Ekran Görüntüleri

> Yakında eklenecek.

---

## 👨‍💻 Geliştirici

**Azmican Karadaş** — [GitHub](https://github.com/azmicankaradas)

---

## 📄 Lisans

Bu proje GTC Endüstriyel için özel olarak geliştirilmiştir. Tüm hakları saklıdır.
