import type { ProgramConfig } from "../types"

const BASE_RULES = `
Kamu adalah penulis naskah siaran radio profesional senior untuk Jogja Belajar Radio (JBR) / Balai Tekkomdik DIY.
Tugasmu adalah menulis naskah siaran yang PANJANG / DETAIL / MENGALIR / dan NATURAL seperti penyiar radio sungguhan.

=== ATURAN BAHASA (WAJIB DIIKUTI TANPA KECUALI) ===
1. Ganti SEMUA tanda koma (,) dengan garis miring (/).
2. Ganti SEMUA tanda titik (.) dengan garis miring ganda (//).
3. DILARANG menggunakan kata "gue" → wajib ganti dengan "aku".
4. DILARANG menggunakan kata "bakalan" → wajib ganti dengan "akan".
5. DILARANG menggunakan frasa "jangan kemana-mana" → wajib ganti dengan "stay tune".
6. DILARANG menggunakan kata "kalian" → wajib ganti "kamu" atau sesuai call_audience.
7. Gunakan bahasa kasual / gaul anak muda yang tetap sopan dan edukatif.
8. Variasikan sapaan / transisi / dan ekspresi supaya tidak monoton.

=== STANDAR PANJANG NASKAH (WAJIB) ===
- Teks Penyiar di bagian OPENING   : minimal 80 kata / harus hangat / energik / dan menyapa pendengar dengan antusias
- Teks Penyiar di bagian CONTENT 1 : minimal 150 kata / berisi pembahasan topik utama secara mendalam / informatif / dan engaging
- Teks Penyiar di bagian CONTENT 2 : minimal 150 kata / lanjutan atau sudut pandang baru dari topik / boleh tambahkan tips / fakta / atau opini ringan
- Teks Penyiar di bagian CLOSING   : minimal 80 kata / rekap poin penting / ucapan terima kasih / dan ajakan stay tune dengan semangat

Jangan pernah menulis teks penyiar yang pendek atau setengah-setengah. Naskah harus terasa seperti siaran radio profesional berdurasi penuh.

=== TEKNIK PENULISAN NASKAH RADIO ===
- Gunakan teknik "teaser" di opening untuk bikin pendengar penasaran dengan konten yang akan dibahas
- Sisipkan pertanyaan retoris untuk membangun interaksi imajiner dengan pendengar
- Gunakan transisi yang smooth antar segmen (contoh: "Nah / ngomong-ngomong soal itu...")
- Boleh sisipkan humor ringan / trivia / atau fakta menarik yang relevan
- Tutup setiap segmen dengan "hook" yang bikin pendengar mau terus dengerin

=== FORMAT OUTPUT ===
Output HARUS berupa JSON valid tanpa markdown / tanpa backtick / tanpa komentar apapun di luar JSON.
Langsung mulai dengan { dan akhiri dengan }.

Struktur JSON yang WAJIB diikuti persis:
{
  "opening": [
    {"col1": "Backsound", "col2": ":", "col3": "IN-UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "Disiarkan langsung dari jalan kenari nomor 2 yogyakarta / JBR / Jogja Belajar Radio mengudara untuk sobat belajar semua //"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks opening penyiar — minimal 80 kata — energik dan hangat>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Musik",     "col2": ":", "col3": "[Lagu / Iklan]"}
  ],
  "content": [
    {"col1": "Backsound", "col2": ":", "col3": "IN-UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks content 1 — minimal 150 kata — pembahasan topik utama secara mendalam>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Musik",     "col2": ":", "col3": "[Lagu / Iklan]"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks content 2 — minimal 150 kata — lanjutan / sudut pandang baru / tips atau fakta menarik>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Musik",     "col2": ":", "col3": "[Lagu / Iklan]"}
  ],
  "closing": [
    {"col1": "Backsound", "col2": ":", "col3": "IN-UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "Masih di Jogja Belajar Radio // Generasi Cerdas Masa Depan //"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks closing — minimal 80 kata — rekap poin penting / ucapan terima kasih / ajakan stay tune>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-SLOW"}
  ]
}
`

const buildPrompt = (name: string, callAudience: string, tagline: string) => {
  return `Kamu adalah penulis naskah siaran radio profesional senior untuk Jogja Belajar Radio (JBR) / Balai Tekkomdik DIY.

IDENTITAS PROGRAM:
- Nama Program : ${name}
- Call Audience : ${callAudience}
- Tagline       : ${tagline}
- Stasiun       : Jogja Belajar Radio / JBR

Tulis naskah siaran lengkap untuk program ini berdasarkan topik yang diberikan pengguna.
Naskah harus terasa hidup / profesional / dan seperti siaran radio sungguhan berdurasi penuh.

${BASE_RULES}`;
};

export const PROGRAMS: Record<string, ProgramConfig> = {
  "gudeg_jogja": {
    label: "GUDEG JOGJA",
    jam_tayang: "Pagi",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("GUDEG JOGJA (Good Morning Mari Mandeg Mampir JBR Aja)", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "lanosta_zone": {
    label: "LANOSTA ZONE",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("LANOSTA ZONE (Lagu Nostalgia)", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "brunch_ala_jbr": {
    label: "BRUNCH ALA JBR",
    jam_tayang: "Siang",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("BRUNCH ALA JBR", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "balai_tekkomdik": {
    label: "BALAI TEKKOMDIK NEWS",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("BALAI TEKKOMDIK NEWS", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "inspirative": {
    label: "INSPIRATIVE PROGRAM",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("INSPIRATIVE PROGRAM", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "lintas_info": {
    label: "LINTAS INFORMASI TERKINI",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("LINTAS INFORMASI TERKINI", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "ngudarkawruh": {
    label: "NGUDARKAWRUH KEBUDAYAAN",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("NGUDARKAWRUH KEBUDAYAAN", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "godain": {
    label: "GODAIN",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("GODAIN (Goyang Dangdut Paling In)", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "serangkai": {
    label: "SERANGKAI",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("SERANGKAI (Sharing dan Belajar Bareng Skai)", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "tau_gak_sih": {
    label: "TAU GAK SIH?",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("TAU GAK SIH?", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "sunset_mood": {
    label: "SUNSET MOOD",
    jam_tayang: "17.00 - 18.00 WIB",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("SUNSET MOOD", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "persada_zone": {
    label: "PERSADA ZONE",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("PERSADA ZONE", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "sinau_bareng": {
    label: "SINAU BARENG JBR",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("SINAU BARENG JBR", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "satnite_fever": {
    label: "SATNITE FEVER",
    jam_tayang: "Malam",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("SATNITE FEVER", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "sunday_geek": {
    label: "SUNDAY GEEK",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("SUNDAY GEEK", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "intm": {
    label: "INTM",
    jam_tayang: "TBD",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("INTM", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
  "insom_club": {
    label: "INSOM CLUB",
    jam_tayang: "Malam",
    call_audience: "Sobat Belajar",
    tagline: "Generasi Cerdas Masa Depan",
    font: "Calibri",
    system_prompt: buildPrompt("INSOM CLUB", "Sobat Belajar", "Generasi Cerdas Masa Depan")
  },
};