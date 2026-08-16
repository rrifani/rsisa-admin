# Product Requirements Document (PRD)

## RSISA Admin — Sistem Administrasi Rumah Sakit

|                    |                                       |
| ------------------ | ------------------------------------- |
| **Nama Produk**    | RSISA Admin                           |
| **Versi Dokumen**  | 1.0                                   |
| **Tanggal**        | 16 Agustus 2026                       |
| **Status**         | Tahap Fondasi (Foundation / Sprint 0) |
| **Pemilik Produk** | Tim Pengembang RSISA                  |

---

## 1. Ringkasan Eksekutif

RSISA Admin adalah sistem administrasi berbasis web yang sedang dibangun untuk mengelola operasional Rumah Sakit ISA. Produk ini terdiri dari **Backend API** yang dibangun dengan kerangka kerja modern (NestJS) di atas monorepo Nx, terhubung ke database **Microsoft SQL Server**.

Saat ini produk berada pada tahap fondasi: arsitektur proyek, koneksi database, dan kerangka modul autentikasi telah disiapkan, namun fitur bisnis utama belum diimplementasikan.

---

## 2. Latar Belakang & Masalah

Rumah sakit membutuhkan sistem terpusat untuk mengelola data operasional (pasien, pegawai, layanan, dan laporan). Proses manual atau sistem terpisah menyebabkan:

- Duplikasi dan inkonsistensi data antar unit.
- Kesulitan audit dan pelacakan aktivitas admin.
- Waktu respons layanan yang lambat.

**Solusi:** sebuah aplikasi admin terpusat dengan API yang aman, auditable, dan dapat dikembangkan secara bertahap (modular monorepo).

---

## 3. Tujuan & Sasaran

### Tujuan Produk

1. Menyediakan API backend yang andal dan aman sebagai fondasi sistem administrasi rumah sakit.
2. Memastikan konektivitas stabil ke database pusat (SQL Server) dengan connection pooling.
3. Menyiapkan sistem autentikasi dan otorisasi untuk mengamankan seluruh endpoint administratif.

### Metrik Keberhasilan (KPI)

| Metrik                        | Target                                      |
| ----------------------------- | ------------------------------------------- |
| Ketersediaan API (uptime)     | ≥ 99% pada jam operasional                  |
| Latensi respons endpoint umum | < 300 ms (P95)                              |
| Kegagalan koneksi database    | 0 pada kondisi normal (pool max 20 koneksi) |
| Coverage unit test            | ≥ 80% pada modul kritis                     |

---

## 4. Ruang Lingkup

### 4.1 Dalam Lingkup (MVP & Roadmap)

- ✅ Arsitektur monorepo Nx dengan aplikasi API (NestJS)
- ✅ Koneksi dan health-check database SQL Server
- 🚧 Modul autentikasi (login, guard, DTO, decorator) — saat ini baru kerangka
- ⬜ Manajemen pengguna admin & role-based access control (RBAC)
- ⬜ Modul data master rumah sakit (pasien, pegawai, poli/tindakan, dll.)
- ⬜ Dashboard admin & pelaporan

### 4.2 Di Luar Lingkup (untuk saat ini)

- Aplikasi mobile
- Integrasi sistem BPJS/Satusehat (fase lanjutan, dapat dievaluasi kembali)
- Pembayaran online

---

## 5. Fitur & Kebutuhan Fungsional

### 5.1 Sudah Diimplementasikan (Baseline Saat Ini)

| ID   | Fitur                       | Deskripsi                                                                                                                                                                                             | Status         |
| ---- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| F-01 | Bootstrap Aplikasi API      | Server NestJS berjalan dengan global prefix `/api` pada port default `3000` (dapat dikonfigurasi via `PORT`).                                                                                         | ✅ Selesai     |
| F-02 | Koneksi Database SQL Server | Provider koneksi global menggunakan `mssql` dengan connection pool (max 20, idle timeout 30 detik), konfigurasi via environment variable (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`). | ✅ Selesai     |
| F-03 | Health Check Database       | Endpoint `GET /api/db-check` menjalankan query `SELECT GETDATE()` untuk memverifikasi konektivitas database dan mengembalikan status.                                                                 | ✅ Selesai     |
| F-04 | Endpoint Dasar              | `GET /api` mengembalikan pesan "Hello API" sebagai smoke test.                                                                                                                                        | ✅ Selesai     |
| F-05 | Kerangka Modul Autentikasi  | Modul `Auth` (controller, service, guard, DTO, decorator) telah disiapkan sebagai fondasi keamanan.                                                                                                   | 🚧 Scaffolding |

### 5.2 Direncanakan (Derived dari Struktur Kode)

| ID   | Fitur                    | Deskripsi                                                                                                                            | Prioritas |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| F-10 | Login & Autentikasi      | `POST /api/auth/login` dengan kredensial, mengeluarkan token sesi/JWT; DTO validasi input.                                           | P0        |
| F-11 | Route Protection (Guard) | `AuthGuard` memvalidasi token pada request; saat ini guard sudah terpasang namun selalu mengembalikan `true` (belum ada verifikasi). | P0        |
| F-12 | Custom Decorator Auth    | Decorator (mis. `@CurrentUser()`, `@Public()`) untuk mengambil identitas user pada handler. File sudah disiapkan namun masih kosong. | P0        |
| F-13 | Manajemen Pengguna Admin | CRUD pengguna admin, hash password, aktif/nonaktif.                                                                                  | P1        |
| F-14 | Role & Permission (RBAC) | Role admin (super admin, admin unit, dll.) dengan batasan akses per endpoint.                                                        | P1        |
| F-15 | Modul Data Master        | Modul-modul bisnis rumah sakit (pasien, pegawai, poli, tindakan) mengikuti pola module NestJS yang sudah ada.                        | P1        |
| F-16 | Audit Log                | Pencatatan aktivitas admin (siapa melakukan apa, kapan).                                                                             | P2        |

---

## 6. Kebutuhan Non-Fungsional

| Kategori            | Kebutuhan                                                                                                                                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keamanan**        | Password di-hash (bcrypt/argon2); kredensial database & secret hanya via environment variable; komunikasi produksi via HTTPS; `encrypt: false` pada koneksi DB hanya untuk jaringan internal tepercaya (perlu ditinjau untuk produksi). |
| **Kinerja**         | Connection pooling aktif (max 20 koneksi); respons API < 300 ms P95.                                                                                                                                                                    |
| **Reliabilitas**    | Log sukses/gagal koneksi database saat startup; aplikasi fail-fast jika DB tidak tersedia.                                                                                                                                              |
| **Maintainability** | Struktur monorepo Nx; modul terpisah per domain; linter (ESLint) + formatter (Prettier); unit test dengan Jest.                                                                                                                         |
| **Portabilitas**    | Node.js >= 18.20.2 < 19; package manager Yarn 1.x; konfigurasi via `.env`.                                                                                                                                                              |
| **Observability**   | Logging bawaan NestJS (Logger) untuk event penting (startup, koneksi DB).                                                                                                                                                               |

---

## 7. Arsitektur Teknis (Current State)

```
rsisa-admin/ (Nx Monorepo)
└── apps/
    └── api/                        # Aplikasi NestJS
        └── src/
            ├── main.ts             # Bootstrap, prefix /api, load .env
            └── app/
                ├── app.module.ts   # Root module (Config, Database, Auth)
                ├── app.controller  # GET / dan GET /db-check
                ├── auth/           # Kerangka: controller, service, guard, dto, decorator
                └── database/       # Provider global mssql ConnectionPool
```

**Tech Stack:**

- **Runtime:** Node.js 18.x, TypeScript
- **Framework:** NestJS 10, RxJS
- **Database:** Microsoft SQL Server (driver `mssql`)
- **Konfigurasi:** `@nestjs/config` (global) + `dotenv`
- **Monorepo/Build:** Nx 19 (webpack), SWC
- **Testing:** Jest 29 (`*.spec.ts` per komponen)
- **Quality:** ESLint, Prettier, EditorConfig

**Konvensi Penting:**

- Semua endpoint diawali prefix `/api`.
- `DatabaseModule` bersifat `@Global()` — connection pool dapat di-inject di semua modul via token `DATABASE_POOL`.
- Konfigurasi melalui environment variables: `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- Perintah: `yarn api` (serve development), `yarn build:app-api` (build), `npx nx test api` (unit test).

---

## 8. API Endpoint (Kondisi Saat Ini)

| Method | Path            | Deskripsi                                                                  | Auth  |
| ------ | --------------- | -------------------------------------------------------------------------- | ----- |
| GET    | `/api`          | Smoke test — mengembalikan `{ message: "Hello API" }`                      | Tidak |
| GET    | `/api/db-check` | Health check database — mengembalikan `{ connected: true, result: [...] }` | Tidak |

---

## 9. Roadmap / Milestone

| Milestone                          | Deliverable                                                          | Estimasi          |
| ---------------------------------- | -------------------------------------------------------------------- | ----------------- |
| **M0 — Fondasi** ✅                | Setup Nx + NestJS, koneksi MSSQL, health check, scaffolding Auth     | Selesai           |
| **M1 — Autentikasi**               | Login JWT, AuthGuard aktif, decorator user, integrasi tabel pengguna | Sprint berikutnya |
| **M2 — Manajemen Pengguna & RBAC** | CRUD admin, role, permission                                         | —                 |
| **M3 — Modul Bisnis Inti**         | Data master rumah sakit (pasien, pegawai, layanan)                   | —                 |
| **M4 — Dashboard & Laporan**       | API agregasi data untuk dashboard admin                              | —                 |

---

## 10. Risiko & Mitigasi

| Risiko                                                                                    | Dampak | Mitigasi                                                             |
| ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------- |
| `AuthGuard` saat ini selalu mengembalikan `true` (endpoint tidak benar-benar terproteksi) | Tinggi | Implementasikan verifikasi JWT sebelum endpoint sensitif ditambahkan |
| Koneksi DB `encrypt: false`                                                               | Sedang | Gunakan enkripsi + sertifikat valid di lingkungan produksi           |
| Kegagalan koneksi DB membuat aplikasi tidak bisa start                                    | Sedang | Sudah fail-fast; tambahkan retry/reconnect strategy untuk resiliensi |
| `.env` belum ada contoh template                                                          | Rendah | Tambahkan `.env.example` ke repository                               |

---

## 11. Definisi Selesai (Definition of Done)

- Kode lolos lint (`nx run api:lint`) dan build (`nx run api:build`).
- Unit test lolos (`nx run api:test`) dengan coverage ≥ 80% untuk modul yang diubah.
- Endpoint baru terdokumentasi dan mengikuti prefix `/api`.
- Tidak ada kredensial yang di-hardcode (semua via environment variable).
