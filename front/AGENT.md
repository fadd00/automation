# Konteks Proyek (JB Radio Script Generator)

Repositori ini adalah Frontend berbasis React (dengan Vite, TypeScript) untuk aplikasi **JB Radio Script Generator**. Aplikasi ini dibuat untuk secara otomatis mengambil (scrape) ringkasan artikel berita dan membuatkannya naskah siaran radio (format `.docx`) sesuai dengan berbagai jenis program siaran JB Radio.

## Teknologi Utama
- **Framework**: React 19, Vite
- **Bahasa**: TypeScript
- **Struktur UI**: CSS kustom, Material Symbols (ikon)
- **Komunikasi Data**: Terintegrasi ke backend internal memanggil endpoint API `/scrape` (scrape berita) dan `/generate` (menghasilkan file docx naskah).

## Struktur Direktori
- `src/App.tsx`: Saat ini merupakan struktur monolitik berisi `state` UI lengkap (Generator dan Library) beserta logika form `handleSubmit` (Scraping dan Generating Docx).
- `src/components/`: Terdapat file komponen (`BatchInput.tsx`, `GenerateButton.tsx`, dsb) yang saat ini masih kosong. *Direktori ini dipersiapkan untuk refactoring kelak jika proyek diperluas.*
- `src/hooks/`: Tempat custom hooks seperti `useGenerate.ts` (juga saat ini masih kosong untuk keperluan refactoring di masa depan).

## Panduan untuk Agen AI
1. **Pengerjaan di `App.tsx` vs Komponen:** Jika diminta untuk menambahkan fitur baru atau mengubah antarmuka, utamakan eksplorasi di dalam `src/App.tsx` karena logika inti saat ini ditempatkan di situ.
2. **Refactoring:** Jika pengguna meminta restrukturisasi atau perapihan (seperti memecah `App.tsx`), pindahkan fungsionalitas UI yang relevan ke file form/komponen yang ada di dalam `/src/components`.
3. **Penanganan API:** Panggilan API secara implisit menggunakan proxy yang di-route ke backend lewat path relatif (seperti `/scrape`). Perhatikan hal ini jika diminta untuk mengubah fungsi Network Error Handling.
4. **Dependensi Eksternal:** Jangan asumsikan adanya komponen framework CSS pre-built (seperti Tailwind atau Bootstrap), karena proyek ini berjalan me-render styling konvensional melalui class-class di `App.css`.

## Target Output 
Ketika ditugaskan memperbaiki bug atau menambah fitur:
- Periksa state management di `App.tsx`.
- Jaga konsistensi antarmuka UI dan penggunaan Ikon Google (`material-symbols-outlined`).
- Pertahankan dukungan TypeScript (*strict mode*) dan berikan *type definitions* dengan jelas.
