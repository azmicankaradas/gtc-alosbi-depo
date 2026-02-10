# 🏭 GTC Endüstriyel - Alosbi Depo Yönetim Sistemi (WMS)

![Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-CX)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

GTC Endüstriyel için geliştirilmiş, modern ve ölçeklenebilir bir **Depo Yönetim Sistemi (WMS)**. Tekstil ve ayakkabı envanter süreçlerini dijitalleştiren, gerçek zamanlı stok takibi, dinamik depo haritalandırması ve gelişmiş raporlama özelliklerine sahip uçtan uca bir çözümdür.

---

## 🚀 Özellikler

### 📦 Stok Yönetimi
- **Gerçek Zamanlı Takip:** Ürünlerin giriş, çıkış ve transfer işlemlerinin anlık takibi.
- **Kategorizasyon:** Tekstil ve ayakkabı ürünleri için özelleştirilmiş varyant yönetimi (Beden, Renk, Model).
- **Akıllı Arama:** SKU, ürün adı veya konuma göre saniyeler içinde ürün bulma.

### 🗺️ Depo Görselleştirme
- **İnteraktif Harita:** Depo katları, raflar ve bölümlerin görsel temsili.
- **Doluluk Analizi:** Hangi rafların boş veya dolu olduğunun renk kodlarıyla gösterimi.

### 📊 Raporlama ve Analiz
- **Dashboard:** Kritik stok seviyeleri, günlük hareket özetleri ve performans metrikleri.
- **PDF Çıktıları:** Stok giriş/çıkış fişleri ve envanter raporlarının otomatik oluşturulması.

### 🔐 Güvenlik ve Yetkilendirme
- **Rol Tabanlı Erişim:** Yönetici ve personel yetkilerinin ayrıştırılması.
- **Güvenli Oturum:** Supabase Auth ile güvenli giriş sistemi.

---

## 🛠️ Teknolojiler

Bu proje, performans, güvenlik ve geliştirici deneyimi ön planda tutularak en güncel teknolojilerle geliştirilmiştir.

| Alan | Teknolojiler |
|------|--------------|
| **Frontend** | [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Stil & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/) |
| **Backend & DB** | [Supabase](https://supabase.com/), [PostgreSQL](https://www.postgresql.org/) |
| **Form & Validasyon** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Araçlar** | [Recharts](https://recharts.org/) (Grafik), [jsPDF](https://github.com/parallax/jsPDF) (PDF) |

---

## 📋 Gereksinimler

Projeyi yerel ortamınızda çalıştırmadan önce aşağıdaki araçların yüklü olduğundan emin olun:

- [Node.js](https://nodejs.org/) (v18 veya üzeri)
- [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/)
- Bir [Supabase](https://supabase.com/) hesabı ve projesi

---

## ⚙️ Kurulum

Projeyi klonlayın ve aşağıdaki adımları takip ederek çalıştırın.

### 1. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 2. Çevresel Değişkenleri Ayarlayın

`.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase proje bilgilerinizi girin:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sizin-projeniz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sizin-anon-key-degeriniz
```

### 3. Veritabanını Hazırlayın

Supabase SQL Editor üzerinden `supabase/schema.sql` dosyasını çalıştırarak veritabanı tablolarını ve RLS politikalarını oluşturun. Bu işlem:
- `locations`, `products`, `variants`, `stock`, `stock_movements` tablolarını kurar.
- Örnek depo konumlarını ve verilerini yükler.

### 4. Uygulamayı Başlatın

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## 📂 Proje Yapısı

```
src/
├── app/                 # Next.js App Router sayfaları ve layout'lar
│   ├── stock/          # Stok işlem sayfaları
│   ├── dashboard/      # Ana kontrol paneli
│   └── ...
├── components/         # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/             # Temel arayüz elemanları (Button, Input vb.)
│   └── ...
├── lib/               # Yardımcı fonksiyonlar ve Supabase istemcisi
├── types/             # TypeScript tip tanımları
└── styles/            # Global stiller
```

---

## 📄 Lisans

Bu proje GTC Endüstriyel için özel olarak geliştirilmiştir. Tüm hakları saklıdır.
