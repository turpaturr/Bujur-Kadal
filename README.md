## BorneoCare 
sebuah platform web health-tech berbasis human-centric yang berfokus penuh pada tindakan preventif untuk melindungi kesehatan masyarakat dari dampak buruk kabut asap Kebakaran Hutan dan Lahan (Karhutla), khususnya ancaman ISPA.

BorneoCare adalah platform web health-tech berbasis human-centric yang membantu masyarakat melakukan tindakan preventif terhadap dampak kabut asap Kebakaran Hutan dan Lahan (Karhutla), khususnya risiko Infeksi Saluran Pernapasan Akut (ISPA) di Pulau Kalimantan.

Platform ini menggabungkan data hotspot kebakaran, peta interaktif, informasi kualitas udara, edukasi mitigasi, dan alur bantuan kesehatan dalam satu pengalaman web. Fokusnya bukan hanya menampilkan data, tetapi membantu pengguna mengambil keputusan yang lebih cepat dan relevan terhadap kondisi di sekitarnya.

## Kapabilitas Utama

- Monitoring hotspot Karhutla berbasis data NASA FIRMS.
- Peta interaktif Kalimantan dengan Leaflet dan pengelompokan marker.
- Visualisasi tren dan indikator kondisi menggunakan Recharts.
- Informasi edukasi mengenai kabut asap, ISPU, dan pencegahan ISPA.
- Registrasi warga dengan data keluarga dan profil kesehatan.
- Pengajuan reservasi pemeriksaan kesehatan.
- Dashboard warga dan dashboard admin dengan alur persetujuan reservasi.
- Update status dan notifikasi real-time melalui Laravel Reverb dan Laravel Echo.
- Typed route generation menggunakan Laravel Wayfinder.

## Arsitektur Singkat

```text
Browser
	|
	| Inertia protocol
	v
Laravel 13 + Controllers + Eloquent
	|                         |
	|                         +-- MySQL / SQLite
	|
	+-- NASA FIRMS API
	+-- Overpass API / OpenStreetMap
	+-- Laravel Reverb <-> Laravel Echo
```

Frontend React dirender melalui Inertia.js, sedangkan Laravel tetap menjadi pemilik routing, autentikasi, validasi, dan akses data. Wayfinder menghasilkan fungsi route bertipe untuk menghubungkan action backend dengan client TypeScript.

## Tech Stack

### Backend

| Teknologi | Peran |
| --- | --- |
| PHP 8.3+ | Runtime backend |
| Laravel 13 | Application framework, routing, auth, validation, ORM |
| Inertia Laravel 3 | Integrasi server-side Laravel dengan SPA client |
| Eloquent ORM | Model dan query database |
| Laravel Reverb | WebSocket server untuk broadcast real-time |
| Laravel Wayfinder | Typed route dan controller actions |
| Pest 4 | Feature dan unit testing |
| Larastan | Static analysis PHP |
| Laravel Pint | Formatting PHP |

### Frontend

| Teknologi | Peran |
| --- | --- |
| React 19 | UI component layer |
| TypeScript | Static typing untuk frontend |
| Inertia React 3 | Client adapter dan page navigation |
| Vite 8 + Vite Plus | Development server dan bundling |
| Tailwind CSS 4 | Utility-first styling |
| Leaflet | Peta interaktif |
| Leaflet.markercluster | Pengelompokan marker hotspot dan fasilitas |
| Recharts | Grafik dan visualisasi data |
| Laravel Echo + Pusher JS | Client WebSocket dan event broadcasting |
| Lucide React | Icon interface |

### Integrasi Data

- **NASA FIRMS** untuk data hotspot satelit.
- **OpenStreetMap / Overpass API** untuk data fasilitas dan lokasi pendukung.
- **MySQL** sebagai database utama pada environment pengembangan saat ini.
- **SQLite** tetap didukung oleh konfigurasi Laravel untuk setup lokal sederhana.

## Prerequisites

- PHP `8.3` atau lebih baru.
- Composer `2.x`.
- Node.js dengan npm.
- MySQL `8.x` atau SQLite.
- Git.
- NASA FIRMS API key jika ingin mengaktifkan pengambilan data hotspot.

## Instalasi

### 1. Clone repository

```bash
git clone <repository-url>
cd Bujur-Kadal
```

### 2. Install dependency

```bash
composer install
npm install
```

### 3. Siapkan environment

Buat file `.env` pada root project, lalu isi konfigurasi aplikasi dan database. Contoh konfigurasi minimal untuk MySQL:

```dotenv
APP_NAME=BorneoCare
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=borneo_care
DB_USERNAME=root
DB_PASSWORD=

NASA_API_KEY=your_nasa_firms_api_key

BROADCAST_CONNECTION=reverb
REVERB_APP_ID=borneo-care
REVERB_APP_KEY=borneocare_key
REVERB_APP_SECRET=change-me
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY=${REVERB_APP_KEY}
VITE_REVERB_HOST=${REVERB_HOST}
VITE_REVERB_PORT=${REVERB_PORT}
VITE_REVERB_SCHEME=${REVERB_SCHEME}
```

Generate application key:

```bash
php artisan key:generate
```

> Jangan commit `.env` atau API key ke repository. Gunakan secret manager atau environment variable pada deployment.

### 4. Siapkan database

Pastikan database pada `DB_DATABASE` sudah tersedia, kemudian jalankan migration dan seeder:

```bash
php artisan migrate --seed
```

Untuk mereset database lokal dan mengisi ulang data seed:

```bash
php artisan migrate:fresh --seed
```

### 5. Jalankan aplikasi

Jalankan backend dan frontend pada terminal terpisah:

```bash
php artisan serve
```

```bash
npm run dev
```

Jika fitur real-time digunakan, jalankan Laravel Reverb pada terminal tambahan:

```bash
php artisan reverb:start
```

Aplikasi tersedia di `http://127.0.0.1:8000`.

## Akun dan Route Utama

| Route | Keterangan |
| --- | --- |
| `/` | Landing page BorneoCare |
| `/register` | Registrasi warga bertahap |
| `/login` | Login warga |
| `/dashboard` | Dashboard monitoring warga |
| `/admin/login` | Login admin |
| `/admin/register` | Registrasi admin |
| `/admin/dashboard` | Dashboard operasional admin |

Data hotspot dikonsumsi melalui route terproteksi `GET /api/wildfire/hotspots` dan diproses oleh `WildfireController`.

## Development Workflow

Perintah yang tersedia:

```bash
npm run dev          # Vite development server
npm run build        # Production frontend build
npm run build:ssr    # Frontend build + SSR build
npm run check        # Lint dan format check frontend
npm run types:check  # TypeScript check
```

Untuk quality checks Laravel:

```bash
vendor/bin/pint --dirty --format agent
php artisan test --compact
vendor/bin/phpstan analyse
```

Full CI-oriented check yang tersedia melalui Composer:

```bash
composer run ci:check
```

## Struktur Direktori

```text
app/
	Http/Controllers/       Controller dan endpoint aplikasi
	Models/                 Eloquent models
	Events/                 Broadcast events
	Services/               Integrasi dan business service
database/
	migrations/             Definisi schema database
	factories/              Factory untuk testing
	seeders/                Data awal aplikasi
resources/js/
	pages/                  Inertia pages dan UI components
	actions/                Typed controller actions dari Wayfinder
	routes/                 Typed named routes dari Wayfinder
	hooks/                  React hooks
	data/                   Data statis dan dataset pendukung
routes/
	web.php                 Web routes dan Inertia entry points
```

## Catatan Integrasi

- Tanpa `NASA_API_KEY`, peta tetap dapat dirender, tetapi data hotspot dari NASA FIRMS tidak dapat diambil secara penuh.
- `REVERB_*` dan `VITE_REVERB_*` diperlukan untuk update real-time. Fitur utama selain broadcast tetap dapat dikembangkan tanpa menjalankan Reverb.
- Pastikan dependency frontend sudah terpasang sebelum menjalankan Vite. Dependency penting untuk dashboard termasuk `laravel-echo`, `pusher-js`, dan `leaflet.markercluster`.

## Status Project

BorneoCare dikembangkan sebagai project DevFest Hackathon 2026 dengan fokus pada mitigasi Karhutla, pemantauan kualitas udara, dan perlindungan kesehatan masyarakat Kalimantan.
