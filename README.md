# Aplikasi Pencatatan Distribusi Penjualan Harian (PWA Ready)

Aplikasi web modern, sederhana, cepat, dan responsif untuk mencatat distribusi atau penitipan jualan ke berbagai lapak setiap hari, menghitung rekapitulasi secara otomatis, dan mengirimkan laporan rapi langsung melalui WhatsApp Click to Chat.

Website ini **sudah 100% PWA (Progressive Web App)** sehingga bisa di-install langsung ke layar utama HP Android maupun iPhone dan dapat berjalan offline!

---

## 🚀 Fitur Utama

1. **Langsung Masuk ke Form Pencatatan**:
   - Tanpa login atau dashboard rumit, pengguna langsung dapat mengisi data begitu membuka aplikasi.
2. **PWA (Progressive Web App) & Offline Mode**:
   - Dapat di-install ke layar beranda HP seperti aplikasi native.
   - Tampilan *standalone full-screen* tanpa address bar browser.
   - Tetap dapat dibuka dan digunakan mencatat jualan meskipun tanpa koneksi internet.
3. **Pilihan Harga Jual Cepat**:
   - Tersedia tombol pilihan harga instan **Rp 10.000** dan **Rp 9.000** di setiap baris jualan.
   - Menghitung subtotal per item, subtotal per lapak, dan total nilai Rupiah (omzet) secara otomatis.
4. **Manajemen Lapak & Jenis Jualan Dinamis**:
   - Tambah lapak tujuan sebanyak yang dibutuhkan.
   - Tambah jenis jualan sebanyak yang dibutuhkan dalam satu lapak.
   - Tombol stepper (+ dan -) untuk kemudahan penambahan jumlah di smartphone maupun PC.
   - Dilengkapi **Master Data / Preset Cepat** untuk nama lapak & produk agar penginputan super cepat.
5. **Validasi Formulir Cerdas**:
   - Mendukung pengiriman hanya 1 lapak maupun banyak lapak.
   - Secara otomatis mengabaikan baris kosong yang tidak terisi.
   - Mencegah input lapak duplikat atau jualan duplikat dalam 1 lapak.
   - Memastikan jumlah berupa bilangan bulat positif (> 0).
6. **Integrasi WhatsApp Click to Chat**:
   - Menghasilkan format pesan WhatsApp rapi dan terstandar mencantumkan nama lapak, produk, harga, dan total Rupiah.
   - Pengguna dapat mengatur nomor WhatsApp tujuan secara fleksibel.
   - Membuka WhatsApp secara instan dengan pesan yang telah disiapkan.
7. **Keamanan & Reset Form**:
   - Dialog konfirmasi sebelum mengosongkan seluruh formulir.
   - Tombol cepat untuk mengosongkan formulir setelah selesai mengirim ke WhatsApp.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 15 (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA Engine**: Service Worker (Cache-first for assets, Network-first for pages) + Web App Manifest
- **Penyimpanan**: React State (In-memory, tanpa database eksternal)
- **WhatsApp**: WhatsApp Click to Chat API (`https://wa.me/`)

---

## 📦 Cara Menjalankan Aplikasi di Komputer

1. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
2. **Buka di Browser**:
   Buka [http://localhost:3000](http://localhost:3000)

---

## ☁️ Panduan Deploy ke Vercel (Gratis)

### Opsi A: Via GitHub (Paling Mudah)
1. Buat repository baru di [GitHub](https://github.com).
2. Upload / push semua file di folder ini ke GitHub.
3. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub.
4. Klik **Add New Project**, pilih repository Anda, lalu klik **Deploy**.
5. Selesai! Website langsung aktif dengan HTTPS dan siap di-install di HP.

### Opsi B: Via Vercel CLI Langsung dari Terminal
```bash
npx vercel
```
Ikuti panduan di layar terminal (login via browser dan tekan Enter untuk pengaturan default).
