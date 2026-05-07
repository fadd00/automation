# JBR Script Generator — Backend

REST API untuk generate naskah siaran radio Jogja Belajar Radio secara otomatis menggunakan AI (Deepseek) dan menghasilkan file `.docx` siap pakai.

Dibangun dengan **Bun** + **ElysiaJS** + **TypeScript**.

---

## Tech Stack

| Layer | Library |
|---|---|
| Runtime | Bun |
| Framework | ElysiaJS |
| AI | Deepseek API via `openai` package |
| Scraping | `cheerio` + native `fetch` |
| Docx | `docx` (npm) |
| Zip | `archiver` |

---

## Struktur Project

```
backend/
├── src/
│   ├── index.ts                  # Entry point, setup Elysia + middleware
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── routes/
│   │   ├── scrape.ts             # POST /scrape
│   │   ├── generate.ts           # GET /programs, POST /generate
│   │   └── batch.ts              # POST /batch
│   ├── services/
│   │   ├── ai.ts                 # Prompt builder + Deepseek API call
│   │   ├── docx.ts               # Build file .docx dari JSON naskah
│   │   ├── scraper.ts            # Extract konten artikel dari URL
│   │   └── zip.ts                # Zip multiple buffer jadi satu file
│   └── templates/
│       └── programs.ts           # Config semua program radio
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── AGENTS.md
```

---

## Instalasi

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- Deepseek API Key → [platform.deepseek.com](https://platform.deepseek.com)

### Steps

```bash
# 1. Clone dan masuk ke folder backend
cd backend

# 2. Install dependencies
bun install

# 3. Setup environment variable
cp .env.example .env
# lalu isi DEEPSEEK_API_KEY di file .env

# 4. Jalankan dev server
bun --watch src/index.ts
```

Server akan berjalan di `http://localhost:3000`

---

## Cara Menjalankan Frontend dan Backend Bersamaan

Agar sistem dapat berjalan utuh dan dapat digunakan melalui UI, Anda harus memastikan *backend* maupun *frontend* dijalankan secara bersamaan pada waktu yang sama (karena berjalan di port terpisah).

### 1. Jalankan Backend (API & Servis AI)
Buka terminal dan arahkan ke direktori backend (`/app` atau `/backend`).
```bash
cd app
bun run dev
```
> Server backend akan berjalan di `http://localhost:3000`

### 2. Jalankan Frontend (UI)
Biarkan terminal backend tetap berjalan. Buka jendela atau tab terminal baru, arahkan ke direktori *frontend* (misal `/front`), lalu jalankan:
```bash
cd front
bun install   # Hanya jika belum pernah install
bun run dev   # (atau npm run dev)
```
> Server frontend umumnya akan berjalan di `http://localhost:5173`. 
> *Jika port di terminal frontend Anda berbeda, pastikan Anda meng-update nilai origin CORS di file backend `src/index.ts` agar disesuaikan dengan port tersebut.*

### 3. Selesai
Buka browser dan akses **`http://localhost:5173`**. Tombol Generate Naskah dan Scrape Berita siap digunakan dan akan diteruskan ke backend `localhost:3000`.

---

## Environment Variables

Buat file `.env` di root folder backend:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
PORT=3000
```

| Variable | Wajib | Keterangan |
|---|---|---|
| `DEEPSEEK_API_KEY` | ✅ | API key dari platform.deepseek.com |
| `PORT` | ❌ | Default `3000` |

---

## API Reference

### `GET /health`

Cek apakah server berjalan.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T17:00:00.000Z"
}
```

---

### `GET /programs`

Ambil daftar semua program radio yang tersedia. Digunakan frontend untuk mengisi dropdown.

**Response:**
```json
[
  {
    "id": "sunset_mood",
    "label": "Sunset Mood",
    "jam_tayang": "17.00 - 18.00 WIB"
  }
]
```

---

### `POST /scrape`

Scrape konten artikel dari URL berita. Hasilnya digunakan sebagai konteks tambahan saat generate naskah.

**Request Body:**
```json
{
  "url": "https://www.kompas.com/contoh-artikel"
}
```

**Response:**
```json
{
  "judul": "Judul Artikel Berita",
  "ringkasan": "Paragraf 1...\n\nParagraf 2...\n\nParagraf 3...",
  "total_paragraf": 12
}
```

**Error Response:**
```json
{
  "message": "Konten tidak ditemukan, coba cek URL atau domain belum didukung"
}
```

**Domain yang didukung:**
- `kompas.com`
- `cnnindonesia.com`
- `tribunnews.com`
- `detik.com`
- `tempo.co`
- Domain lain → menggunakan selector generic (hasil bisa bervariasi)

---

### `POST /generate`

Generate satu naskah radio dan langsung return file `.docx`.

**Request Body:**
```json
{
  "tema": "Etika Chat ke Guru atau Dosen Biar Gak Kena Semprot",
  "program_id": "sunset_mood",
  "news_context": "(opsional) ringkasan berita dari endpoint /scrape"
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `tema` | string | ✅ | Judul atau tema naskah, min 3 karakter |
| `program_id` | string | ✅ | ID program dari endpoint `/programs` |
| `news_context` | string | ❌ | Konteks berita dari hasil `/scrape` |

**Response:**

Binary file `.docx` dengan headers:
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="Naskah_<tema>.docx"
```

---

### `POST /batch`

Generate banyak naskah sekaligus dan return satu file `.zip` berisi semua `.docx`.

**Request Body:**
```json
{
  "program_id": "sunset_mood",
  "items": [
    {
      "tema": "Tips Belajar Efektif di Era Digital"
    },
    {
      "tema": "Cara Kelola Waktu Biar Gak Keteteran",
      "news_context": "(opsional) konteks berita"
    }
  ]
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `program_id` | string | ✅ | ID program dari endpoint `/programs` |
| `items` | array | ✅ | Min 1, maks 60 item |
| `items[].tema` | string | ✅ | Judul atau tema naskah |
| `items[].news_context` | string | ❌ | Konteks berita opsional per item |

**Response:**

Binary file `.zip` dengan headers:
```
Content-Type: application/zip
Content-Disposition: attachment; filename="Naskah_Batch_<timestamp>.zip"
X-Success-Count: 3
X-Failed-Count: 0
X-Failed-Topics: []
```

> Kalau sebagian tema gagal di-generate, file `.zip` tetap dikirim berisi naskah yang berhasil. Info tema yang gagal ada di header `X-Failed-Topics`.

---

## Menambah Program Baru

Cukup edit satu file: `src/templates/programs.ts`

```ts
export const PROGRAMS: Record<string, ProgramConfig> = {
  "sunset_mood": {
    // ... existing
  },

  // tambahkan program baru di sini
  "pagi-ceria": {
    label         : "Pagi Ceria",
    jam_tayang    : "07.00 - 08.00 WIB",
    call_audience : "Sobat Pagi",
    tagline       : "Semangat Mulai Hari",
    font          : "Calibri",
    system_prompt : `...`, // sesuaikan prompt
  },
}
```

Tidak perlu mengubah file lain. Endpoint `/programs` otomatis menampilkan program baru, dan `/generate` serta `/batch` langsung bisa menggunakannya.

---

## Menambah Dukungan Domain Scraping

Edit `src/services/scraper.ts` pada bagian `DOMAIN_SELECTORS`:

```ts
const DOMAIN_SELECTORS = {
  // ... existing domains
  "namadomain.com": {
    title  : "h1.class-judul",
    content: "div.class-konten p",
  },
}
```

Cara menemukan selector yang tepat: buka artikel di browser → klik kanan judul → Inspect → copy CSS selector.

---

## Flow Lengkap

```
Client
  │
  ├─► POST /scrape { url }
  │       └─► fetch HTML → cheerio parse → return { judul, ringkasan }
  │
  ├─► POST /generate { tema, program_id, news_context? }
  │       ├─► validasi input & cek program_id
  │       ├─► generateNaskah() → Deepseek API → JSON naskah
  │       ├─► buildDocx() → Buffer .docx
  │       └─► return binary .docx
  │
  └─► POST /batch { program_id, items[] }
          ├─► validasi (max 60 item)
          ├─► chunkProcess() → 3 request sekaligus ke Deepseek
          │     └─► tiap item: generateNaskah() → buildDocx()
          ├─► zipBuffers() → Buffer .zip
          └─► return binary .zip + headers X-Success/Failed
```

---

## Catatan Penting

- **Rate limit** — batch request diproses 3 item sekaligus (`CHUNK_SIZE = 3`) untuk menghindari rate limit Deepseek. Ubah nilai ini di `src/routes/batch.ts` sesuai kebutuhan.
- **Timeout** — untuk batch besar (60 naskah), waktu generate bisa mencapai 5–10 menit. Pastikan client tidak timeout sebelum response diterima.
- **CORS** — default hanya mengizinkan origin `http://localhost:5173` (Vite dev server). Ubah di `src/index.ts` sebelum deploy ke production.