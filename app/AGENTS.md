# AGENTS.md — Backend JBR Script Generator

Dokumen ini adalah panduan untuk AI agent atau LLM (termasuk Claude, Copilot, Cursor, dll) yang bekerja di codebase backend ini. Baca seluruh dokumen ini sebelum membuat perubahan apapun.

---

## Gambaran Sistem

Backend ini adalah REST API yang menerima input tema/judul program radio, memanggil Deepseek AI untuk generate naskah siaran dalam format JSON terstruktur, lalu mengonversinya menjadi file `.docx` berformat standar Jogja Belajar Radio.

**Runtime:** Bun | **Framework:** ElysiaJS | **Language:** TypeScript

---

## Struktur File & Tanggung Jawab

```
src/
├── index.ts              # Entry point. Hanya berisi setup server + mounting routes.
│                         # Jangan tambahkan business logic di sini.
│
├── types.ts              # Semua shared TypeScript interface ada di sini.
│                         # Tambah type baru di sini, bukan inline di file lain.
│
├── routes/               # Thin layer. Hanya validasi input & memanggil service.
│   ├── scrape.ts         # POST /scrape
│   ├── generate.ts       # GET /programs, POST /generate
│   └── batch.ts          # POST /batch
│
├── services/             # Business logic. Semua logic utama ada di sini.
│   ├── ai.ts             # Satu-satunya file yang boleh memanggil Deepseek API.
│   ├── docx.ts           # Satu-satunya file yang boleh menggunakan package `docx`.
│   ├── scraper.ts        # Satu-satunya file yang boleh melakukan HTTP scraping.
│   └── zip.ts            # Utility untuk zip buffer. Tidak boleh ada side effect.
│
└── templates/
    └── programs.ts       # Source of truth untuk semua config program radio.
                          # Ini satu-satunya file yang perlu diubah untuk tambah program baru.
```

---

## Aturan Wajib

### 1. Jangan ubah struktur JSON naskah

Output AI **harus** selalu dalam format ini dan tidak boleh diubah tanpa koordinasi dengan tim frontend karena frontend bergantung pada struktur ini:

```ts
interface NaskahJSON {
  opening: NaskahRow[]  // selalu 4 baris: Backsound, Penyiar, Backsound, Musik
  content: NaskahRow[]  // selalu 9 baris dengan 2 blok Penyiar
  closing: NaskahRow[]  // selalu 5 baris: Backsound, Penyiar, Backsound, Penyiar, Backsound
}

interface NaskahRow {
  col1: string  // "Backsound" | "Penyiar" | "Musik"
  col2: string  // selalu ":"
  col3: string  // konten/instruksi
}
```

### 2. Jangan hardcode config program di luar `programs.ts`

Semua nilai seperti `label`, `jam_tayang`, `call_audience`, `tagline`, dan `system_prompt` harus diambil dari object `ProgramConfig` yang dipass ke service. Tidak boleh ada string literal nama program di file selain `programs.ts`.

### 3. Routes harus tetap thin

Routes hanya boleh berisi:
- Validasi input menggunakan Elysia schema (`t.Object(...)`)
- Satu panggilan ke service
- Set response headers
- Error handling

Jika ada logic lebih dari itu, pindahkan ke service yang sesuai.

### 4. Satu entry point ke Deepseek API

Semua pemanggilan Deepseek API harus melalui fungsi `generateNaskah()` di `src/services/ai.ts`. Jangan instantiate `OpenAI` client di file lain.

### 5. Batch processing wajib pakai chunking

Jangan pernah kirim semua request ke Deepseek secara parallel sekaligus. Selalu gunakan fungsi `chunkProcess()` di `src/routes/batch.ts` dengan `CHUNK_SIZE = 3` (atau kurang). Ini untuk menghindari rate limit.

### 6. Gunakan `Promise.allSettled` bukan `Promise.all` untuk batch

Batch harus tetap berjalan meskipun sebagian item gagal. Gunakan `Promise.allSettled` dan laporkan kegagalan di response headers (`X-Failed-Count`, `X-Failed-Topics`), bukan throw error.

---

## Panduan Per File

### `src/templates/programs.ts`

**Kapan diedit:** Hanya saat menambah atau mengubah program radio.

**Cara tambah program baru:**
```ts
"id-program-baru": {
  label         : "Nama Program",
  jam_tayang    : "HH.MM - HH.MM WIB",
  call_audience : "Sebutan Pendengar",
  tagline       : "Tagline Program",
  font          : "Calibri",   // jangan ubah kecuali ada permintaan khusus
  system_prompt : `...`,       // ikuti format BASE_RULES yang sudah ada
},
```

**Jangan:**
- Hapus `BASE_RULES` dari `system_prompt`
- Mengubah format output JSON di dalam `system_prompt` tanpa koordinasi
- Menghapus program yang sudah ada tanpa konfirmasi

---

### `src/services/ai.ts`

**Yang boleh diubah:**
- Model yang digunakan (`deepseek-chat` → versi lain jika diperlukan)
- `max_tokens` jika naskah terpotong
- Logic strip markdown fence jika format response AI berubah

**Yang tidak boleh diubah:**
- Struktur `messages` array (system + user)
- Cara inject `newsContext` ke user message
- Return type `NaskahJSON`

**Jika AI sering return non-JSON:** Tambahkan retry logic di fungsi ini, bukan di route.

---

### `src/services/scraper.ts`

**Cara tambah domain baru:**
```ts
const DOMAIN_SELECTORS = {
  // ... existing
  "namadomain.com": {
    title  : "h1.selector-judul",
    content: "div.selector-konten p",
  },
}
```

**Aturan selector:**
- `title` → selector untuk elemen judul artikel (return text pertama saja)
- `content` → selector untuk paragraf isi (semua elemen, filter `length > 40`)
- Maksimal 5 paragraf pertama yang dikirim ke AI (`slice(0, 5)`)

**Jangan:**
- Menggunakan Puppeteer atau browser headless — gunakan fetch biasa
- Menyimpan hasil scraping ke disk
- Mengirim seluruh konten artikel ke AI (terlalu besar, cukup 5 paragraf)

---

### `src/services/docx.ts`

**Aturan layout yang tidak boleh diubah:**

| Elemen | Nilai |
|---|---|
| Font size | 28 half-point (= 14pt) |
| Kolom tabel | 1980 / 420 / 6480 DXA |
| Total lebar tabel | 8880 DXA |
| Semua border tabel | `NIL` (tidak terlihat) |
| Margin halaman | 1440 DXA semua sisi |
| Ukuran halaman | 11909 × 16834 (A4) |

**Jika perlu mengubah font:** Ubah hanya di `ProgramConfig.font` di `programs.ts`, bukan hardcode di `docx.ts`.

**Urutan section dalam dokumen** (jangan diubah):
1. Header 3 baris (center)
2. Blank paragraph
3. Program info (tab-separated)
4. Blank paragraph
5. Opening → tabel
6. Blank paragraph
7. Content → tabel
8. Blank paragraph
9. Closing → tabel

---

### `src/services/zip.ts`

File ini adalah pure utility. Tidak boleh ada:
- File I/O ke disk
- Side effects
- Dependencies selain `archiver` dan Node.js built-ins

Input: array `{ name: string, buffer: Buffer }[]`
Output: `Promise<Buffer>`

---

## Cara Kerja Batch Chunking

```ts
// Di src/routes/batch.ts
const CHUNK_SIZE = 3

// items = [A, B, C, D, E, F, G]
// Chunk 1: [A, B, C] → Promise.allSettled → tunggu selesai
// Chunk 2: [D, E, F] → Promise.allSettled → tunggu selesai
// Chunk 3: [G]       → Promise.allSettled → tunggu selesai
// Semua hasil digabung → zip → return
```

Jika ingin mengubah `CHUNK_SIZE`, pertimbangkan rate limit Deepseek tier yang digunakan.

---

## Error Handling Convention

| Kondisi | HTTP Status | Format Response |
|---|---|---|
| Input tidak valid | `400` | `{ message: string }` |
| `program_id` tidak ada | `400` | `{ message: string }` |
| URL tidak bisa di-scrape | `400` | `{ message: string }` |
| AI return non-JSON | `500` | `{ message: string }` |
| Semua batch item gagal | `500` | `{ message: string }` |
| Sebagian batch gagal | `200` | ZIP tetap dikirim + info di headers |

---

## Environment Variables

| Variable | Digunakan di | Keterangan |
|---|---|---|
| `DEEPSEEK_API_KEY` | `src/services/ai.ts` | Wajib ada |
| `PORT` | `src/index.ts` | Default `3000` |

Jangan akses `process.env` di luar dua file di atas.

---

## Yang Tidak Perlu Diubah Saat Menambah Fitur Baru

Saat menambah **program radio baru** → edit hanya `programs.ts`

Saat menambah **domain scraping baru** → edit hanya `scraper.ts`

Saat menambah **endpoint baru** → buat file baru di `routes/` + daftarkan di `index.ts`

Saat mengubah **format dokumen** → edit hanya `docx.ts`

---

## Hal yang Perlu Dikonfirmasi Sebelum Diubah

Perubahan berikut berdampak ke frontend dan harus dikonfirmasi dulu:

- Struktur JSON response dari `/programs`
- Struktur JSON `NaskahJSON` (opening/content/closing)
- Nama atau format header response batch (`X-Success-Count`, dll)
- Penambahan field wajib baru di request body endpoint manapun