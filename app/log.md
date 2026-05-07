# Pengembangan Backend JBR Script Generator - Log Aktivitas

**Tanggal:** 6 Mei 2026

## Checkpoints Harian

- [x] **Memperbaiki Error Tipe pada Route Elysia**
  - **Konteks:** Seluruh route (`batch.ts`, `generate.ts`, `scrape.ts`) ditandai merah karena `error` dari context (`{ body, error, set }`) tidak lagi disupport/di-export pada Elysia `1.4.28`.
  - **Tindakan:** Mengganti parameter destructuring `error` menggunakan pendekatan standar dengan mengirim status code secara manual melalui `set.status = ...` dan langsung mereturn object JSON untuk response error.

- [x] **Menjelaskan Route Root (`/`) Not Found**
  - **Konteks:** User menanyakan mengapa membuka Elysia di browser me-return HTTP 404 (Not Found).
  - **Tindakan:** Menjelaskan bahwa route utama `/` belum didaftarkan di `src/index.ts`, dan memandu user mencoba endpoint yang valid seperti `/health` atau `/programs`.

- [x] **Menerapkan Swagger UI untuk Dokumentasi API**
  - **Konteks:** Permintaan integrasi Swagger untuk kemudahan pengecekan dan pengujian API.
  - **Tindakan:** Menginstal plugin via `bun add @elysiajs/swagger` dan mendaftarkan plugin dengan menambahkan `.use(swagger())` ke instance utama aplikasi di `src/index.ts`, membuat API docs tersedia di path `/swagger`.

- [x] **Membaca Dokumen Proyek (`README.md` & `AGENTS.md`)**
  - **Konteks:** Instruktur untuk memahami basis kode ke depannya.
  - **Tindakan:** Telah meninjau arsitektur proyek, stack (Bun + Elysia + AI + Scraping), dan pemahaman limitasi (seperti jangan mengubah file lain selain `programs.ts` untuk modifikasi info siaran radio) yang tercantum di file README.md dan AGENTS.md.

**Tanggal:** 7 Mei 2026

- [x] **Melakukan Testing Endpoint `/generate` dan Memastikan Output Docx Valid**
  - **Konteks:** Memastikan bahwa API Deepseek mereturn format JSON yang benar tanpa tag markdown (backticks) dan dapat dikonversi menjadi file Docx.
  - **Tindakan:** Menguji dengan payload tema "Pentingnya Belajar Coding" untuk program "sunset-mood". Sukses memvalidasi file `Naskah_Pentingnya Belajar Coding.docx` yang terbuat secara utuh dengan struktur XML di dalamnya yang valid.

- [x] **Melakukan Testing dan Perbaikan Endpoint `/scrape` pada Portal Berita**
  - **Konteks:** Mengetes web scraping pada artikel Kompas, CNN Indonesia, dan Detik untuk memastikan parameter judul dan ringkasan diambil dengan benar.
  - **Tindakan:** Memperbaiki sistem pencocokan domain menjadi `.includes()` agar dapat menjangkau subdomain seperti `money.kompas.com`. Serta memperbaiki selector CSS untuk CNN Indonesia dari `h1.title` menjadi `h1`. Ketiga portal berita sukses tereksplorasi.
- [x] **Pembaruan Dokumentasi README.md (Integrasi Fullstack)**
  - **Konteks:** Diperlukan instruksi yang jelas bagi pengguna tentang cara menjalankan frontend dan backend secara berdampingan.
  - **Tindakan:** Menambahkan bagian instruksi "Cara Menjalankan Frontend dan Backend Bersamaan" di README.md, meliputi perintah startup kedua sisi (`bun run dev`) di port yang berbeda, serta petunjuk terkait manajemen akses CORS.

- [x] **Menambahkan Filter Regex pada Scraper Berita**
  - **Konteks:** Terdapat sampah teks seperti promosi artikel atau intermezo dari elemen `<p>` di situs berita (yakni "Baca juga:", "Simak video:", "Klik di sini") yang dapat masuk ke prompt DeepSeek dan merusak hasil naskah.
  - **Tindakan:** Memasang pengecekan regex (case-insensitive) `/baca juga|simak video|klik di sini/i` pada `src/services/scraper.ts` untuk mengabaikan dan membuang paragraf yang mengandung kata-kata tersebut.

- [x] **Migrasi dari `fetch` ke `ofetch` pada Scraper**
  - **Konteks:** Menghindari aplikasi macet (*hang*) ketika server website berita lemot/terlambat merespon. 
  - **Tindakan:** Mengganti HTTP client bawaan (`fetch`) dengan `ofetch` di `src/services/scraper.ts`, lalu menyertakan konfigurasi `retry: 3` (agar gagal diulang otomatis tanpa henti), `retryDelay: 1000` (jeda antar retry), dan `timeout: 10000` (waktu respon maksimal 10 detik).

- [x] **Menambahkan Konfigurasi JSON Object Mode pada API DeepSeek**
  - **Konteks:** Model terkadang menyelipkan format penjelasan sebelum/setelah JSON walaupun sudah diprompting.
  - **Tindakan:** Mengatur `response_format: { type: "json_object" }` pada service `generateNaskah` di dalam file `src/services/ai.ts`. Hal ini secara paksa mewajibkan DeepSeek untuk me-return syntax JSON Object yang murni valid guna mengurangi error saat parsing naskah.

- [x] **Menambahkan Properti `tabStops` pada Pembuatan Paragraf Docx**
  - **Konteks:** Spasi antar tab untuk identasi informasi program seperti "Judul Naskah", "Gaya Penyiar", dll sering kali kurang sejajar/absolut karena bergantung pada manual multispaces (single atau double tab `\t\t`).
  - **Tindakan:** Mengimpor `TabStopType` dan `TabStopPosition` dari API `docx` lalu mengaplikasikannya di fungsi `makeTabPara` pada `src/services/docx.ts`. Semua tab kini diset satu indentasi absolut pada titik `2835 DXA` sehingga alignment informasi program yang digenerate selalu rapih tidak peduli panjang karakternya.
