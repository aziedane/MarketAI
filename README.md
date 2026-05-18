# MarketGuard AI

MarketGuard AI adalah asisten cerdas untuk memantau pasar saham Indonesia (IDX) dan pasar saham Global (NASDAQ, NYSE, Crypto). Aplikasi ini menggunakan analisis teknikal sebagai dasar dan AI Gemini untuk menerjemahkan kondisi pasar ke dalam bahasa manusia yang sederhana dan mudah dimengerti.

## Fitur Utama

- **Live Monitoring**: Pemantauan harga live untuk watchlist saham pilihan.
- **AI Market Narrative**: Analisis suasana pasar menggunakan bahasa pasar tradisional yang santai dan mudah dipahami oleh pemula.
- **Technical Scanner**: Deteksi otomatis untuk volume spike, breakout SMA, dan kondisi jenuh jual (oversold).
- **Telegram Alerts**: Notifikasi instan ke Telegram saat ditemukan sinyal atau momentum menarik.
- **Global & Local Scope**: Mendukung pantauan untuk saham Global, Crypto, dan bursa Indonesia (IDX).

## Prasyarat

Sebelum memulai, pastikan sistem Linux Anda sudah terinstall:

- **Node.js**: v18.x atau lebih baru.
- **npm**: v9.x atau lebih baru.

## Konfigurasi

Buat file `.env` di direktori root project dan isi dengan variabel berikut:

```env
GEMINI_API_KEY=your_gemini_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

## Cara Build dan Run di Linux

Ikuti langkah-langkah berikut untuk menjalankan MarketGuard AI di server Linux (seperti Ubuntu, Debian, atau Armbian):

### 1. Persiapan Direktori
```bash
# Clone repository ini (atau copy semua file ke folder project Anda)
mkdir marketguard-ai
cd marketguard-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Aplikasi
Proses build akan mengkompilasi server TypeScript menjadi file CommonJS dan membuild frontend React menggunakan Vite.
```bash
npm run build
```

### 4. Menjalankan Aplikasi
Setelah build selesai, Anda bisa menjalankan server menggunakan script `start`. Aplikasi akan berjalan di port **3000** secara default (`http://localhost:3000`).
```bash
npm start
```

### 5. (Opsional) Menggunakan PM2 untuk Auto-Restart
Sangat disarankan menggunakan PM2 agar aplikasi tetap berjalan di background dan otomatis restart jika server reboot.
```bash
# Install PM2 secara global
sudo npm install -g pm2

# Jalankan aplikasi dengan PM2
pm2 start npm --name "marketguard-ai" -- start

# Simpan konfigurasi PM2
pm2 save
```

## Struktur Proyek

- `server.ts`: Entry point backend (Express + Yahoo Finance + AI Gemini integration).
- `src/`: Source code frontend React (Dashboard UI).
- `dist/`: Output build (Frontend statis & server bundle).

## Lisensi

Aplikasi ini dibuat untuk tujuan edukasi dan asisten pemantau pasar pribadi. Segala keputusan investasi berada di tangan pengguna sepenuhnya.
