# JBR Script Generator 🎙️🤖

Aplikasi *Fullstack* (Frontend & Backend) untuk menghasilkan naskah siaran radio Jogja Belajar Radio secara otomatis menggunakan AI (Deepseek / OpenRouter) dan mengubahnya menjadi file `.docx` siap pakai.

Dibangun dengan **React (Vite)** untuk antarmuka pengguna dan **Bun + ElysiaJS** untuk layanan API backend.

---

## 🏗️ Arsitektur & Tech Stack

| Bagian | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | React, Vite, TypeScript | Antarmuka interaktif pembuat naskah |
| **Backend** | Bun, ElysiaJS, TypeScript | REST API cepat, menangani AI & pembuatan Docx |
| **AI API** | OpenAI SDK | Kompatibel standar dengan Deepseek API & OpenRouter |
| **Scraping** | Cheerio | Ekstraksi konten/berita untuk konteks (*scrape*) |
| **File Gen** | docx, archiver | Pembuatan dokumen `.docx` dan `.zip` (batch) |

Saat ini **Frontend Vite sudah terintegrasi dan disajikan secara utuh sebagai *static files* melalui Backend Elysia** di dalam satu port yang sama secara *seamless*.

---

## 📂 Struktur Proyek

```text
jbr-generator/
├── front/                      # Kode sumber Frontend (React + Vite)
│   ├── src/                    # Komponen UI, Hooks API, Styling
│   └── dist/                   # Tempat hasil build rilis UI (HTML/JS/CSS statis)
│
└── app/                        # Kode sumber Backend (Bun + ElysiaJS)
    ├── src/
    │   ├── index.ts            # Entry point API & penyaji static frontend (/front/dist)
    │   ├── routes/             # Kumpulan endpoint (generate, scrape, batch)
    │   ├── services/           # Logika Bisnis utama (AI, scraper, DOCX generator)
    │   └── templates/          # Konfigurasi 17 Program Radio & Prompt AI
    ├── .env                    # Variabel environment (API Keys)
    └── log.md                  # Log aktivitas pengembangan & perbaikan bug
```

---

## 🚀 Panduan Instalasi & Cara Menjalankan

### Prasyarat
- [Bun](https://bun.sh) v1.0+
- API Key AI yang aktif (dari platform.deepseek.com atau OpenRouter)

### Langkah-langkah Menjalankan (Satu Port)

Kini Anda tidak perlu menjalankan dua terminal secara terpisah, karena backend otomatis menyajikan UI.

**1. Clone & Setup Variabel Environment**
```bash
git clone <repo-url> jbr-generator
cd jbr-generator/app
cp .env.example .env
# Buka file .env dan isikan DEEPSEEK_API_KEY
```

**2. Pasang Dependency & Build Frontend**
Agar antarmuka pengguna dapat dilayani oleh backend, Anda harus mem-*build* frontend ke direktori `dist`.
```bash
cd ../front
bun install
bun run build
```

**3. Jalankan Server Backend**
Jalankan server Elysia di backend. Server ini akan merespons endpoint API sekaligus melayani aplikasi web React di titik utama (`/`).
```bash
cd ../app
bun install
bun run dev
```

**4. Buka Aplikasi**
Buka browser dan arahkan ke **`http://localhost:3000`**.
(Untuk menjelajahi endpoint API secara interaktif, silakan buka dokumentasi Swagger di **`http://localhost:3000/swagger`**).

---

## 🔗 Endpoint API Utama & Dokumentasi

Berdasarkan `FRONTEND_API_DOCS.md` dan `app/README.md`, berikut abstraksi komunikasinya:

| Endpoint | Method | Fungsi |
|---|---|---|
| `/generate` | `POST` | Menghasilkan file output `.docx` dari parameter tema, `program_id`, & konteks berita (opsional). |
| `/scrape` | `POST` | Mengekstraksi dan meringkas teks paragraf dari URL portal berita. Ter-trigger sebelum `/generate` apabila user mengisi link. |
| `/batch` | `POST` | Menghasilkan rentetan banyak naskah dan dikombinasikan dalam unduhan berkas `.zip`. |

> **Catatan Sinkronisasi:** Backend telah diadaptasi untuk menerima 17 parameter format `program_id` *snake_case* dari Frontend (seperti `gudeg_jogja`, `sunset_mood`, dll) secara dinamis menggunakan konteks *prompting* yang diatur di `programs.ts`.

---

## 📝 Changelog / Pembaruan Terkini

Berdasarkan rekaman log penyempurnaan terbaru proyek:
- ✅ **Integrasi Server Tunggal:** Frontend disajikan menggunakan plugin `@elysiajs/static` di backend.
- ✅ **Unduhan Otomatis & UI State:** Tombol generate di Frontend telah dirajut sempurna untuk mengunci sesi submit, memanggil API, dan mengubah respons BLOB menjadi file `.docx` yang otomatis terunduh.
- ✅ **Penyelarasan Program:** Sebanyak 17 sistem program radio sesuai standar UI dituntaskan pada `services/programs.ts`.
- ✅ **Swagger UI:** Tersemat di jalur `/swagger` menggunakan `@elysiajs/swagger`.
- ✅ **Ketangguhan Fitur Scraping:** Sistem pencarian domain telah dimodifikasi menggunakan tipe `includes` dan CSS Selector yang fleksibel untuk memangkas error pada *subdomain* portal populer.
- ✅ **Model AI Adaptif:** Aplikasi telah terbukti sanggup mengakomodasi platform API generik berbasis *OpenAI Wrapper* (termasuk OpenRouter) melengkapi Deepseek.

*Dokumentasi histori terperinci dapat ditinjau lebih jauh masuk melalui file `app/log.md` maupun `front/BACKEND_API_DOCS.md`.*
