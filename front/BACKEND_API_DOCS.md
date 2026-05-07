# Dokumentasi Integrasi Frontend - Backend (JBR Script Generator)

Dokumen ini disusun untuk memudahkan tim Backend memahami alur data, payload rekues, dan opsi-opsi yang dikirimkan oleh Frontend melalui tombol dan formulir interaktif di aplikasi JB Radio Script Generator.

## 1. Alur Interaksi Pengguna & Trigger API

Pada halaman aplikasi (Frontend), interaksi terpusat di form pembuat naskah (`Script Generator`). Ketika pengguna menekan tombol **"Generate & Download"**, alur berikut akan dijalankan oleh sistem:

1. Modul akan mengecek apakah pengguna memasukkan **Link Artikel Berita**.
2. Jika **ada**, Frontend akan melakukan request `POST /scrape`.
3. Setelah rincian berita diringkas (atau jika link dikosongkan), Frontend memanggil request `POST /generate` dengan payload pengaturan dari form.
4. File docx diunduh otomatis oleh browser client.

---

## 2. Kontrak Endpoint (API Payload)

Frontend secara otomatis mendeteksi ketersediaan field dan menembakkan dua request secara skuensial ke *relative path* aplikasi frontend: `/scrape` dan `/generate`. 

### A. Endpoint Scraping Berita
- **Endpoint:** `POST /scrape`
- **Kondisi Trigger:** Hanya dieksekusi jika pengguna men-supply field *Link Artikel Berita* (`articleLink`).
- **Request Body (JSON):**
  ```json
  {
    "url": "https://alamat-berita-yang-diinput-user.com"
  }
  ```
- **Expected Response (200 OK):**
  Backend harus mengembalikan bentuk JSON object yang memiliki property `ringkasan`. Jika tidak, frontend akan error.
  ```json
  {
    "ringkasan": "Teks panjang hasil ekstraksi dan ringkasan konten berita..."
  }
  ```

### B. Endpoint Generate Naskah
- **Endpoint:** `POST /generate`
- **Kondisi Trigger:** Dieksekusi sebagai langkah akhir penciptaan file. 
- **Request Body (JSON):**
  ```json
  {
    "tema": "Input dari field Judul Naskah (scriptTitle)",
    "program_id": "ID program radio terpilih (lihat Tabel Referensi Program ID di bawah)",
    "news_context": "String teks dari hasil response /scrape (Akan bernilai undefined jika input link berita kosong)"
  }
  ```
- **Expected Response (200 OK - BLOB):**
  Penting: Endpoint ini **harus** mengembalikan representasi file binary (secara ideal `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) untuk `.docx`. 
  - **Header Opsional tetapi Direkomendasikan:** 
    `Content-Disposition: attachment; filename="NamaFileCustom.docx"`
    (Frontend memiliki fungsi untuk mendeteksi `filename=` di header untuk di-set sebagai default nama download).

---

## 3. Referensi Pilihan `program_id`

Frontend menggunakan tipe data statis di dalam kode untuk menu Dropdown "Program Radio". Saat pengguna memilih opsi tersebut, Frontend mengirimkan representasi `id` program ini pada key `program_id` di request `POST /generate`. 

Backend (terutama AI Prompting di backend) harus mengenali ID (kode program) ini:

| ID Program (`program_id` dikirim ke API) | Nama Visusal (Ditampilkan di UI) | Deskripsi / Karakteristik Program yang Diharapkan |
| :--- | :--- | :--- |
| `gudeg_jogja` | GUDEG JOGJA | Program pagi yang energik untuk memulai hari dengan semangat |
| `lanosta_zone` | LANOSTA ZONE | Lagu Nostalgia (Memutar lagu-lagu nostalgia yang menenangkan) |
| `brunch_ala_jbr` | BRUNCH ALA JBR | Program santai di siang hari dengan berbagai topik menarik |
| `balai_tekkomdik` | BALAI TEKKOMDIK NEWS | Berita dan informasi terkini institusional |
| `inspirative` | INSPIRATIVE PROGRAM | Program inspiratif untuk meningkatkan semangat dan motivasi |
| `lintas_info` | LINTAS INFORMASI TERKINI | Informasi berita terkini dari berbagai aspek kehidupan |
| `ngudarkawruh` | NGUDARKAWRUH KEBUDAYAAN | Membahas dan melestarikan budaya lokal |
| `godain` | GODAIN | Goyang Dangdut Paling In (Lagu hit/dangdut) |
| `serangkai` | SERANGKAI | Sharing dan Belajar Bareng Skai |
| `tau_gak_sih` | TAU GAK SIH? | Program trivia dan pengetahuan umum |
| `sunset_mood` | SUNSET MOOD | Program santai di sore hari dengan musik menenangkan |
| `persada_zone` | PERSADA ZONE | Program zone untuk berbagai tema menarik |
| `sinau_bareng` | SINAU BARENG JBR | Program edukasi untuk belajar bersama |
| `satnite_fever` | SATNITE FEVER | Program malam hari (Minggu) yang penuh energi |
| `sunday_geek` | SUNDAY GEEK | Program Minggu untuk para geek dan penggemar teknologi |
| `intm` | INTM | Program spesial dengan topik yang variatif |
| `insom_club` | INSOM CLUB | Program malam untuk mereka yang tidak bisa tidur |

## 4. Penanganan Error (Error Handling)
Jika terjadi error API atau backend me-return HTTP status *Not Ok* (misal: 4xx, 5xx):
- Frontend selalu mengekspektasikan respons berupa JSON berisi: `{ "message": "Pesan error spesifik" }` untuk ditampilkan pada Window Alerts.
- Jika JSON tersebut gagal di-parse atau ketiadaan *message*, Frontend akan menampilkan pesan *fallback* default: *"Gagal membuat naskah"* atau *"Gagal melakukan scrape artikel"*.
