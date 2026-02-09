# SI_pariwisata (Sistem Informasi Desa Wisata Jepara)

Project ini adalah aplikasi web untuk pengelolaan informasi pariwisata, destinasi, dan event budaya di Jepara. Aplikasi ini terdiri dari **Frontend** (Next.js) dan **Backend** (Hono).

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Zustand, Lucide React.
- **Backend**: Hono (Node.js Adapter), TypeScript.
- **Database**: Mock Data (In-memory storage for demo).

## Prasyarat
Pastikan Anda sudah menginstall:
- [Node.js](https://nodejs.org/) (versi 18 atau terbaru)
- npm (bawaan Node.js)
- Git

## Cara Install & Menjalankan Project

### 1. Clone Repository
Buka terminal dan jalankan perintah berikut untuk mengunduh project ke komputer Anda:

```bash
git clone https://github.com/alokmakanjambu/SI_pariwisata.git
cd SI_pariwisata
```

### 2. Setup Backend
Buka terminal baru, masuk ke folder backend, install dependencies, dan jalankan server:

```bash
cd pariwisata-backend
npm install
npm run dev
```
> **Backend berjalan di:** `http://localhost:4000`

### 3. Setup Frontend
Buka terminal **baru lagi**, masuk ke folder frontend, install dependencies, dan jalankan aplikasi:

```bash
cd pariwisata-frontend
npm install
npm run dev
```
> **Frontend berjalan di:** `http://localhost:3000`

## Fitur Utama
- **Dashboard**: Statistik visual kunjungan dan destinasi populer.
- **Destinasi**: CRUD (Create, Read, Update, Delete) data wisata dengan upload gambar.
- **Event & Budaya**: Kalender event dinamis dengan fitur highlight otomatis.
- **Laporan**: Unduh dan kelola laporan bulanan.
- **Pencarian**: Command Palette (Ctrl+K) untuk navigasi cepat.
- **Dark Mode**: Dukungan penuh untuk mode gelap/terang (Light/Dark Theme) di seluruh aplikasi.

---
