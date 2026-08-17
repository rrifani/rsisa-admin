# PRD — RSISA Admin (Nx Monorepo)

**Versi:** 0.1 (Draft — Fase Setup Awal)
**Tanggal:** 17 Agustus 2026
**Status:** In Progress — Backend foundation selesai, frontend belum dimulai

---

## 1. Latar Belakang & Tujuan

RSISA Admin adalah sistem internal rumah sakit yang terdiri dari beberapa aplikasi frontend (dashboard manajemen, aplikasi jasa medik) yang dilayani oleh satu backend API (NestJS), dalam satu Nx monorepo bernama `rsisa-admin`.

Backend menyambung ke database **Microsoft SQL Server 2016** yang sudah ada (existing database `DBRSISA_BANJARBARU_DEVELOPMENT`), tanpa ORM migration — akses data memakai pola repository dengan query langsung ke tabel yang sudah ada.

### Tujuan fase ini

- Menyiapkan struktur monorepo Nx yang bisa menampung 1 backend (NestJS) dan beberapa frontend (React) dalam satu repo.
- Memastikan backend bisa konek ke SQL Server 2016 existing.
- Menyiapkan pondasi modular (dashboard, jasa medik, shared) agar backend bisa melayani banyak frontend dari satu service.
- Tetap kompatibel dengan **Node.js 18.20.2** sebagai target runtime.

---

## 2. Tech Stack

| Layer                      | Teknologi            | Versi                                          |
| -------------------------- | -------------------- | ---------------------------------------------- |
| Monorepo tooling           | Nx                   | 19.7.2                                         |
| Backend framework          | NestJS               | ^10.0.2                                        |
| Bahasa                     | TypeScript           | 5.3.2                                          |
| Database                   | Microsoft SQL Server | 2016 (on-premise)                              |
| Driver DB                  | `mssql` (tedious)    | terbaru kompatibel                             |
| Package manager            | Yarn                 | 1.22.19 (classic)                              |
| Runtime target             | Node.js              | **18.20.2** (dikunci via `.nvmrc` + `engines`) |
| Frontend (rencana)         | React + Vite         | 18.3.1 / ^5.0.0                                |
| State management (rencana) | Redux Toolkit        | ^2.2.7                                         |
| UI Library (rencana)       | PrimeReact           | ^10.8.2                                        |

Referensi stack frontend diambil dari project existing `bridging-eklaim` (react-hook-form, zod, primereact, dll) yang akan dipakai ulang saat generate app React.

---

## 3. Struktur Monorepo

```
rsisa-admin/
├── apps/
│   ├── api/                     # NestJS backend — SATU service untuk semua frontend
│   │   └── src/app/
│   │       ├── auth/            # module autentikasi (JWT, guard)
│   │       ├── database/        # provider koneksi SQL Server
│   │       ├── app.module.ts
│   │       └── app.controller.ts
│   ├── dashboard/                # React app — rencana, belum digenerate
│   └── jasa-medik/               # React app — rencana, belum digenerate
│
├── .env                          # tidak dipakai — env dipindah ke level app
├── .nvmrc                        # 18.20.2
├── .yarnrc                       # ignore-engines true
├── nx.json
└── package.json
```

### Keputusan desain penting

- **Tidak memakai `libs/`** untuk database & auth — karena saat ini hanya ada satu backend service (`api`). Modul `database` dan `auth` diletakkan langsung di `apps/api/src/app/`, bukan di `libs/api/*`. Alasan: menghindari over-engineering untuk kebutuhan yang belum ada (multi-service backend). Bisa dipindah ke `libs/` nanti dengan `nx g move` kalau memang dibutuhkan.
- **Tidak memakai ORM/migration** (TypeORM/Prisma) — karena database sudah ada dan terisi. Akses data akan memakai pola **repository** dengan raw query / query builder, relasi antar tabel ditangani lewat JOIN manual di level repository, direpresentasikan sebagai nested TypeScript interface.
- **Satu backend, banyak frontend** — bukan microservices terpisah. `dashboard` dan `jasa-medik` akan jadi 2 aplikasi React berbeda yang sama-sama memanggil API dari satu NestJS app, dengan routing dipisah lewat prefix:
  - `/api/dashboard/*` — endpoint khusus dashboard
  - `/api/jasa-medik/*` — endpoint khusus jasa medik
  - `/api/pasien/*`, `/api/dokter/*` — endpoint shared, dipakai kedua frontend
- **`.env` per-app** — setiap app (`api`, dan nanti `dashboard`, `jasa-medik`) punya file `.env` sendiri di dalam folder app masing-masing (`apps/api/.env`), bukan satu `.env` global di root. Ini supaya config tidak campur aduk saat jumlah app bertambah.

---

## 4. Status Implementasi Saat Ini

### ✅ Selesai

- [x] Nx workspace `rsisa-admin` berhasil dibuat (preset TypeScript, package manager Yarn).
- [x] Node version dikunci ke 18.20.2 (`.nvmrc` + `engines` di `package.json`).
- [x] Masalah kompatibilitas dependency (sass, `@peculiar/x509` minta Node 20+) diatasi dengan `ignore-engines true` di `.yarnrc`.
- [x] NestJS app `api` berhasil digenerate dan berjalan di `http://localhost:3000/api`.
- [x] Global prefix `/api` sudah aktif secara default (bawaan generator Nx).
- [x] Module `database` dibuat langsung di `apps/api/src/app/database/`, memakai driver `mssql`.
- [x] Koneksi ke SQL Server 2016 **berhasil** — tervalidasi lewat log eksplisit saat startup:
  ```
  ✅ Connected to database "DBRSISA_BANJARBARU_DEVELOPMENT" at 36.92.189.58:1433
  ```
- [x] Endpoint test `/api/db-check` dibuat untuk verifikasi query langsung ke database.
- [x] `.env` dipindah ke level app (`apps/api/.env`), dibaca eksplisit lewat `ConfigModule` dengan `envFilePath` berbasis `process.cwd()`.
- [x] Script `yarn api` (alias `nx run api:serve`) sudah bisa dipakai untuk menjalankan backend.

### 🔧 Sedang berjalan

- [ ] Struktur folder module `auth` (`auth.module.ts`, `auth.controller.ts`, `auth.service.ts`, `auth.guard.ts`, `auth.dto.ts`, `auth.decorator.ts`) — proses generate sempat error karena command dijalankan dari direktori yang salah (`apps/api` alih-alih root workspace), sedang diperbaiki.

### ⏳ Belum dimulai

- [ ] Isi logic JWT authentication (login, guard, role-based access untuk dashboard vs jasa medik).
- [ ] Generate 2 React app: `dashboard` dan `jasa-medik` (Vite bundler).
- [ ] Generate module domain: `pasien`, `dokter` (shared), `dashboard/*`, `jasa-medik/*`.
- [ ] Setup `libs/shared/types` untuk interface yang dipakai bersama backend & frontend.
- [ ] Setup `libs/web/ui` (component library) dan `libs/web/api-client` — baru relevan setelah ada 2 app React.
- [ ] Docker setup untuk deployment.

---

## 5. Kendala yang Sudah Diatasi (Log Teknis)

| Masalah                                      | Penyebab                                                                                             | Solusi                                                                                                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create-nx-workspace` gagal dengan yarn      | Konflik `package.json` di folder induk (`E:\`)                                                       | Generate pakai `npm` dulu, lalu `yarn install` di dalam folder project                                                                                      |
| `sass@1.102.0` incompatible Node 18          | Sub-dependency `@nx/webpack` menarik versi sass terbaru yang butuh Node ≥20                          | Pin `sass@1.77.8` via `resolutions`, lalu set `ignore-engines true` di `.yarnrc` untuk sub-dependency lain (`@peculiar/x509`, dll) yang juga minta Node 20+ |
| `config.server property is required`         | `.env` tidak ditemukan di path yang dibaca `ConfigModule` (sempat salah taruh di `apps/`, root, dst) | `.env` dipastikan ada di `apps/api/.env`, dibaca eksplisit via `path.join(process.cwd(), 'apps/api/.env')`                                                  |
| `config.options.port must be of type number` | `ConfigService.get()` selalu return string, `<number>` generic hanya type-hint, tidak convert        | Wrap eksplisit dengan `Number(configService.get('DB_PORT'))`                                                                                                |
| Generator NestJS taruh file di lokasi salah  | Command `nx g` dijalankan dari dalam `apps/api`, bukan dari root workspace                           | Selalu jalankan command Nx dari root (`E:\rsisa-admin`)                                                                                                     |

---

## 6. Environment & Konfigurasi

**`apps/api/.env`** (development)

```
DB_HOST=36.92.189.58
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=********
DB_NAME=DBRSISA_BANJARBARU_DEVELOPMENT
PORT=3000
```

**Opsi koneksi MSSQL yang dipakai:**

```typescript
options: {
  encrypt: false,               // koneksi on-premise, bukan Azure
  trustServerCertificate: true, // hindari error self-signed certificate
}
```

---

## 7. Rencana Routing API

| Endpoint                       | Konsumen                | Keterangan                                           |
| ------------------------------ | ----------------------- | ---------------------------------------------------- |
| `GET /api`                     | —                       | Health check default                                 |
| `GET /api/db-check`            | —                       | Test koneksi database (sementara, untuk development) |
| `POST /api/auth/login`         | Semua frontend          | Autentikasi, generate JWT                            |
| `GET /api/dashboard/statistik` | `apps/dashboard`        | Data statistik untuk dashboard                       |
| `GET /api/dashboard/laporan`   | `apps/dashboard`        | Laporan manajemen                                    |
| `GET /api/jasa-medik/tarif`    | `apps/jasa-medik`       | Data tarif jasa medik                                |
| `POST /api/jasa-medik/klaim`   | `apps/jasa-medik`       | Input klaim jasa medik                               |
| `GET /api/pasien/:id`          | Semua frontend (shared) | Data pasien                                          |
| `GET /api/dokter/:id`          | Semua frontend (shared) | Data dokter                                          |

Guard/role akan dibedakan per controller (bukan per app terpisah), misalnya:

```typescript
@Roles('admin', 'manajemen')     // untuk controller dashboard
@Roles('staf-keuangan')          // untuk controller jasa-medik
```

---

## 8. Scripts yang Tersedia

```json
{
  "scripts": {
    "api": "nx run api:serve",
    "build:app-api": "nx run api:build"
  }
}
```

Rencana penambahan setelah app React digenerate:

```json
{
  "scripts": {
    "dashboard": "nx run dashboard:serve",
    "jasa-medik": "nx run jasa-medik:serve",
    "dev": "nx run-many --target=serve --projects=api,dashboard,jasa-medik --parallel"
  }
}
```

---

## 9. Risiko & Catatan Teknis

- **`ignore-engines true`** di `.yarnrc` berarti yarn tidak lagi memblokir instalasi package yang secara resmi butuh Node lebih baru dari 18. Ini perlu diwaspadai — kalau ke depan makin banyak dependency baru yang benar-benar butuh Node 20+ API saat runtime (bukan cuma requirement label), bisa muncul bug runtime yang tidak terjadi kalau pakai Node 20.
- **Node 18 sudah end-of-life** (April 2025). Untuk project baru jangka panjang, disarankan mempertimbangkan migrasi ke **Node 20 LTS** sebelum go-live production, meskipun untuk development saat ini Node 18.20.2 masih berjalan normal.
- **Tidak ada migration/versioning skema database** — karena database sudah ada dan dipakai sistem lain (kemungkinan project Go `bridging-eklaim` yang juga connect ke database serupa). Perubahan skema harus dikoordinasikan manual dengan tim yang mengelola database, bukan lewat migration tool otomatis.

---

## 10. Langkah Selanjutnya (Next Actions)

1. Selesaikan struktur module `auth` (guard, dto, decorator, service) — jalankan generator dari root workspace.
2. Implementasi JWT login & role-based guard.
3. Generate app `dashboard` dan `jasa-medik` (React + Vite).
4. Buat module `pasien` sebagai contoh pertama pola repository dengan query nyata ke SQL Server (termasuk relasi JOIN).
5. Setup `libs/shared/types` untuk konsistensi tipe data antara backend dan kedua frontend.
6. Dokumentasi API (Swagger/OpenAPI) — belum dibahas, perlu diputuskan apakah dipakai.
