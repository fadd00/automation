# JBR Script Generator 🎙️🤖

Aplikasi *Fullstack* (Frontend & Backend) untuk menghasilkan naskah siaran radio Jogja Belajar Radio secara otomatis menggunakan AI (OpenAI-compatible API) dan mengubahnya menjadi file `.docx` siap pakai.

Dibangun dengan **React (Vite)** untuk antarmuka pengguna dan **Bun + ElysiaJS** untuk layanan API backend.

---

## 🏗️ Arsitektur & Tech Stack

| Bagian | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | React, Vite, TypeScript | Antarmuka interaktif pembuat naskah |
| **Backend** | Bun, ElysiaJS, TypeScript | REST API cepat, menangani AI & pembuatan Docx |
| **AI API** | OpenAI SDK | Kompatibel dengan OpenAI / Ollama / LM Studio / vLLM / Groq / provider lainnya |
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
- Endpoint API OpenAI-compatible (OpenAI, Ollama, LM Studio, Groq, dll — lihat [app/README.md](app/README.md#menjalankan-dengan-llm-lokal) untuk panduan LLM lokal)

### Langkah-langkah Menjalankan (Satu Port)

Kini Anda tidak perlu menjalankan dua terminal secara terpisah, karena backend otomatis menyajikan UI.

**1. Clone & Setup Variabel Environment**
```bash
git clone <repo-url> jbr-generator
cd jbr-generator/app
cp .env.example .env
# Buka file .env dan isikan OPENAI_API_KEY, OPENAI_BASE_URL, dan OPENAI_MODEL
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

## 🤖 Menjalankan dengan LLM Lokal

Aplikasi ini mendukung penuh LLM lokal melalui OpenAI-compatible API. Detail lengkap: **[app/README.md — Menjalankan dengan LLM Lokal](app/README.md#menjalankan-dengan-llm-lokal)**

**Cara tercepat dengan Ollama:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull llama3.2

# Konfigurasi .env
OPENAI_API_KEY=ollama
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_MODEL=llama3.2
```

---

## 📝 Changelog / Pembaruan Terkini

Berdasarkan rekaman log penyempurnaan terbaru proyek:
- ✅ **Integrasi Server Tunggal:** Frontend disajikan menggunakan plugin `@elysiajs/static` di backend.
- ✅ **Unduhan Otomatis & UI State:** Tombol generate di Frontend telah dirajut sempurna untuk mengunci sesi submit, memanggil API, dan mengubah respons BLOB menjadi file `.docx` yang otomatis terunduh.
- ✅ **Penyelarasan Program:** Sebanyak 17 sistem program radio sesuai standar UI dituntaskan pada `services/programs.ts`.
- ✅ **Swagger UI:** Tersemat di jalur `/swagger` menggunakan `@elysiajs/swagger`.
- ✅ **Ketangguhan Fitur Scraping:** Sistem pencarian domain telah dimodifikasi menggunakan tipe `includes` dan CSS Selector yang fleksibel untuk memangkas error pada *subdomain* portal populer.
- ✅ **OpenAI-Compatible API:** Aplikasi kini sepenuhnya kompatibel dengan OpenAI SDK dan mendukung LLM lokal (Ollama, LM Studio, vLLM) serta provider cloud (OpenAI, Groq, Together AI, Fireworks).

*Dokumentasi histori terperinci dapat ditinjau lebih jauh melalui file `app/log.md` maupun `front/BACKEND_API_DOCS.md`.*
