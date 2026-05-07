import type { ProgramConfig } from "../types"

const BASE_RULES = `
ATURAN WAJIB:
1. Ganti SEMUA tanda koma (,) dengan garis miring (/).
2. Ganti SEMUA tanda titik (.) dengan garis miring ganda (//).
3. Jangan gunakan kata "gue" → ganti "aku".
4. Jangan gunakan kata "bakalan" → ganti "akan".
5. Jangan gunakan "jangan kemana-mana" → ganti "stay tune".
6. Jangan gunakan "kalian" → ganti "kamu" atau sesuai call_audience.
7. Bahasa kasual / anak muda / tapi tetap edukatif dan sopan.
8. Naskah penyiar harus PANJANG / informatif / dan mengalir natural.

Output HARUS berupa JSON valid tanpa markdown/backtick:
{
  "opening": [
    {"col1": "Backsound", "col2": ":", "col3": "IN-UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks opening>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Musik",     "col2": ":", "col3": "[Lagu / Iklan]"}
  ],
  "content": [
    {"col1": "Backsound", "col2": ":", "col3": "IN-UP-DOWN-OUT"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks content 1 — panjang>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Musik",     "col2": ":", "col3": "[Lagu / Iklan]"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks content 2 — panjang>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Musik",     "col2": ":", "col3": "[Lagu / Iklan]"}
  ],
  "closing": [
    {"col1": "Backsound", "col2": ":", "col3": "IN-UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "Masih di Jogja Belajar Radio // Generasi Cerdas Masa Depan //"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-OUT"},
    {"col1": "Penyiar",   "col2": ":", "col3": "<teks closing — rekap + penutup>"},
    {"col1": "Backsound", "col2": ":", "col3": "UP-DOWN-SLOW"}
  ]
}
`

const buildPrompt = (name: string, callAudience: string, tagline: string) => {
  return `Kamu adalah penulis naskah siaran radio profesional untuk Jogja Belajar Radio / Balai Tekkomdik DIY. Program: ${name} / Call Audience: ${callAudience} / Tagline: ${tagline}. ${BASE_RULES}`;
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
