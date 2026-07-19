# Test Frontend Sharing Vision

Dashboard article untuk backend Go di `https://github.com/KhoirulHusein/testbackend`. Dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, dan Bun.

## Halaman

- **All Posts** (`/`) — tabs Published / Drafts / Trashed; tabel title, category, action (icon edit & trash). Trash memindahkan article ke tab Trashed (status `thrash`).
- **Add New** (`/add`) — form Title, Content, Category dengan tombol Publish dan Draft.
- **Edit** (`/edit/[id]`) — form yang sama, terisi data article.
- **Preview** (`/preview`) — blog untuk article berstatus publish, pagination 5 per halaman.

## Menjalankan

1. Jalankan backend: `docker-compose up` di `../testbackend` (API di :8080)
2. `bun install`
3. (Opsional) `cp .env.example .env` lalu sesuaikan `BACKEND_URL`
4. `bun dev` → http://localhost:3000

Build production: `bun run build && bun start`.

## Konfigurasi

| Env | Default | Keterangan |
|---|---|---|
| `BACKEND_URL` | `http://localhost:8080` | Alamat backend. Dibaca `next.config.ts` saat start/build. |

Semua request browser ke `/api/*` di-proxy Next ke backend (backend tidak mengirim header CORS). Error validasi backend (title ≥20, content ≥200, category ≥3 karakter) ditampilkan per field di form.

## Struktur

```
app/
  page.tsx          # All Posts (tabs + tabel + trash)
  add/page.tsx      # Add New
  edit/[id]/page.tsx# Edit article
  preview/page.tsx  # Blog publish + pagination
components/
  post-form.tsx     # Form bersama Add/Edit
lib/api.ts          # Fetch helper + penanganan error terpusat
next.config.ts      # Proxy /api/* → BACKEND_URL
```
