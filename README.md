# GTC Endüstriyel - Alosbi Depo Yönetim Sistemi

Modern ve kullanıcı dostu depo stok yönetim uygulaması. Tekstil ve ayakkabı ürünlerinin stok takibi, giriş/çıkış işlemleri ve raporlama özellikleri sunar.

## 🚀 Özellikler

- **Dashboard** - Özet istatistikler ve grafikler
- **Stok Girişi** - Depoya yeni ürün ekleme
- **Stok Çıkışı** - Depodan ürün teslimi ve PDF fiş oluşturma
- **Stok Arama** - Ürün, SKU, beden veya konum ile arama
- **Ürün Yönetimi** - Tekstil ve ayakkabı ürünleri
- **Yerleşim Görünümü** - Kat ve raf bazlı depo haritası
- **Hareket Geçmişi** - Tüm stok hareketlerinin logu
- **Raporlar** - PDF formatında stok raporları

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Supabase hesabı

## ⚙️ Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Environment değişkenlerini ayarlayın

`.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase bilgilerinizi girin:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Veritabanını kurun

Supabase SQL Editor'da `supabase/schema.sql` dosyasını çalıştırın. Bu:
- Tüm tabloları oluşturur (locations, products, variants, stock, stock_movements)
- 180 depo konumunu otomatik oluşturur
- Örnek ürünleri ekler
- RLS politikalarını etkinleştirir

### 4. Uygulamayı başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🏗️ Teknolojiler

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth)
- **Diğer:** jsPDF, Recharts

## 📁 Proje Yapısı

```
src/
├── app/                 # Next.js App Router sayfaları
│   ├── stock/          # Stok giriş/çıkış
│   ├── search/         # Arama
│   ├── products/       # Ürünler
│   ├── locations/      # Yerleşim
│   ├── movements/      # Hareketler
│   └── reports/        # Raporlar
├── components/         # UI bileşenleri
├── lib/               # Yardımcı fonksiyonlar
└── types/             # TypeScript tipleri
```

## 🔐 Kimlik Doğrulama

Uygulama Supabase Auth kullanır. Giriş sayfası: `/login`

## 📄 Lisans

Bu proje GTC Endüstriyel için geliştirilmiştir.
