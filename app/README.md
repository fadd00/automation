# JBR Script Generator — Backend

REST API untuk generate naskah siaran radio Jogja Belajar Radio secara otomatis menggunakan AI (OpenAI-compatible API) dan menghasilkan file `.docx` siap pakai.

Dibangun dengan **Bun** + **ElysiaJS** + **TypeScript**.

---

## Tech Stack

| Layer | Library |
|---|---|
| Runtime | Bun |
| Framework | ElysiaJS |
| AI | OpenAI-compatible API via `openai` package |
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
│   │   ├── ai.ts                 # Prompt builder + LLM API call
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
- OpenAI-compatible API endpoint (lihat [Menjalankan dengan LLM Lokal](#menjalankan-dengan-llm-lokal))

### Steps

```bash
# 1. Clone dan masuk ke folder backend
cd app

# 2. Install dependencies
bun install

# 3. Setup environment variable
cp .env.example .env
# lalu isi OPENAI_API_KEY di file .env

# 4. Jalankan dev server
bun --watch src/index.ts
```

Server akan berjalan di `http://localhost:3000`

---

## Cara Menjalankan Frontend dan Backend Bersamaan

Agar sistem dapat berjalan utuh dan dapat digunakan melalui UI, Anda harus memastikan *backend* maupun *frontend* dijalankan secara bersamaan pada waktu yang sama (karena berjalan di port terpisah).

### 1. Jalankan Backend (API & Servis AI)
Buka terminal dan arahkan ke direktori backend (`/app`).
```bash
cd app
bun run dev
```
> Server backend akan berjalan di `http://localhost:3000`

### 2. Jalankan Frontend (UI)
Biarkan terminal backend tetap berjalan. Buka jendela atau tab terminal baru, arahkan ke direktori *frontend* (`/front`), lalu jalankan:
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
OPENROUTER_API_KEY=your_openrouter_key_here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openrouter/free
PORT=3000
```

| Variable | Wajib | Keterangan |
|---|---|---|
| `OPENROUTER_API_KEY` | ✅ | API key dari OpenRouter |
| `OPENAI_BASE_URL` | ❌ | Base URL endpoint (default `https://openrouter.ai/api/v1`) |
| `OPENAI_MODEL` | ❌ | Nama model (default `openrouter/free`, router model gratis) |
| `PORT` | ❌ | Default `3000` |

---

## Menjalankan dengan LLM Lokal

Aplikasi ini menggunakan OpenAI SDK yang kompatibel dengan berbagai provider. Berikut panduan untuk menjalankan dengan LLM lokal:

### A. Ollama (Rekomendasi)

[Ollama](https://ollama.com) adalah cara termudah menjalankan LLM secara lokal.

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull model (contoh: llama3.2)
ollama pull llama3.2

# 3. Pastikan Ollama berjalan
ollama serve
```

Konfigurasi `.env`:
```env
OPENAI_API_KEY=ollama
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_MODEL=llama3.2
PORT=3000
```

> **Catatan**: Ollama tidak memerlukan API key sebenarnya, isi saja dengan string apa pun (misal `ollama`). Model harus support `response_format: { type: "json_object" }` — pastikan gunakan model yang cukup pintar (recommended: `llama3.2`, `mistral`, `qwen2.5`, atau yang lebih besar).

### B. LM Studio

[LM Studio](https://lmstudio.ai) menyediakan GUI untuk download dan menjalankan model lokal.

1. Download dan install LM Studio
2. Download model (misal: Llama 3.2, Mistral)
3. Load model dan nyalakan **Local Server** (port default `1234`)

Konfigurasi `.env`:
```env
OPENAI_API_KEY=lm-studio
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_MODEL=local-model
PORT=3000
```

### C. vLLM

[vLLM](https://github.com/vllm-project/vllm) adalah server inference performa tinggi.

```bash
# Install dan jalankan
pip install vllm
vllm serve meta-llama/Llama-3.2-3B-Instruct --port 8000
```

Konfigurasi `.env`:
```env
OPENAI_API_KEY=vllm
OPENAI_BASE_URL=http://localhost:8000/v1
OPENAI_MODEL=meta-llama/Llama-3.2-3B-Instruct
PORT=3000
```

### D. LiteLLM (Proxy multi-provider)

[LiteLLM](https://github.com/BerriAI/litellm) bisa jadi proxy yang menerjemahkan berbagai provider ke format OpenAI.

```bash
pip install litellm[proxy]
litellm --model ollama/llama3.2 --port 4000
```

Konfigurasi `.env`:
```env
OPENAI_API_KEY=sk-litellm
OPENAI_BASE_URL=http://localhost:4000/v1
OPENAI_MODEL=ollama/llama3.2
PORT=3000
```

### E. OpenAI / Provider Cloud

Untuk menggunakan OpenAI langsung atau provider cloud lain:

```env
# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

# Groq
OPENAI_API_KEY=gsk_xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile

# Together AI
OPENAI_API_KEY=xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.together.xyz/v1
OPENAI_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo

# Fireworks
OPENAI_API_KEY=fw_xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.fireworks.ai/inference/v1
OPENAI_MODEL=accounts/fireworks/models/llama-v3p3-70b-instruct
```

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
  │       ├─► generateNaskah() → LLM API → JSON naskah
  │       ├─► buildDocx() → Buffer .docx
  │       └─► return binary .docx
  │
  └─► POST /batch { program_id, items[] }
          ├─► validasi (max 60 item)
          ├─► chunkProcess() → 3 request sekaligus ke LLM
          │     └─► tiap item: generateNaskah() → buildDocx()
          ├─► zipBuffers() → Buffer .zip
          └─► return binary .zip + headers X-Success/Failed
```

---

## Catatan Penting

- **Rate limit** — batch request diproses 3 item sekaligus (`CHUNK_SIZE = 3`) untuk menghindari rate limit. Ubah nilai ini di `src/routes/batch.ts` sesuai kebutuhan.
- **Timeout** — untuk batch besar (60 naskah), waktu generate bisa mencapai 5–10 menit. Pastikan client tidak timeout sebelum response diterima.
- **CORS** — default mengizinkan semua origin (`*`). Ubah di `src/index.ts` sebelum deploy ke production.
- **JSON mode** — pastikan model yang digunakan mendukung `response_format: { type: "json_object" }`. Model yang terlalu kecil (di bawah 7B parameter) mungkin tidak bisa menghasilkan JSON valid.
