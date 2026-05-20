export default function UserGuide() {
  return (
    <section className="user-guide">
      <div className="guide-header">
        <span className="guide-badge">Panduan</span>
        <h2>Cara Menggunakan JB Radio Script Generator</h2>
        <p>Pelajari langkah cepat membuat naskah siaran radio dengan konten profesional.</p>
      </div>

      <div className="guide-grid">
        <article className="guide-card">
          <h3>Apa yang bisa dilakukan</h3>
          <p>
            Platform ini mengubah ide, berita, atau topik menarik menjadi sebuah naskah radio siap siar.
            Kamu bisa memilih program radio yang sesuai lalu mendapatkan file <strong>.docx</strong> berisi naskah.
          </p>
        </article>

        <article className="guide-card">
          <h3>Langkah cepat</h3>
          <ol className="guide-list">
            <li>Pilih menu <strong>Script Generator</strong>.</li>
            <li>Isi <strong>Link Artikel Berita</strong> jika ingin menerapkan konteks berita.</li>
            <li>Pilih program radio di dropdown.</li>
            <li>Masukkan judul naskah yang jelas dan spesifik.</li>
            <li>Tekan <strong>Generate Naskah</strong>.</li>
            <li>Download file <strong>.docx</strong> dari panel preview.</li>
          </ol>
        </article>

        <article className="guide-card">
          <h3>Memilih program</h3>
          <ul className="guide-list">
            <li>Gunakan <strong>BRUNCH ALA JBR</strong> untuk suasana santai dan topik ringan.</li>
            <li><strong>BALAI TEKKOMDIK NEWS</strong> cocok untuk naskah berita dan informasi terkini.</li>
            <li><strong>GODAIN</strong> dipakai jika kamu ingin nada hiburan musik dangdut.</li>
            <li><strong>NGUDARKAWRUH</strong> cocok untuk konten budaya lokal dan edukasi.</li>
          </ul>
        </article>

        <article className="guide-card guide-highlight">
          <h3>Tips hasil terbaik</h3>
          <ul className="guide-list">
            <li>Gunakan judul yang singkat namun mencakup topik utama.</li>
            <li>Jangan lupa pakai link berita yang valid bila membutuhkan konteks real-time.</li>
            <li>Periksa kembali judul sebelum generate agar hasil lebih relevan.</li>
            <li>Hasil file akan otomatis muncul di panel preview, siap diunduh.</li>
          </ul>
        </article>
      </div>

      <div className="guide-layout">
        <div className="guide-section">
          <h3>Bagian utama halaman</h3>
          <p>
            Halaman generator terbagi menjadi dua sisi. Form kiri untuk input data dan panel kanan untuk melihat ringkasan hasil serta preview dokumen.
            Setelah proses selesai, kamu bisa langsung mengunduh naskah radio dalam format <strong>.docx</strong>.
          </p>
        </div>

        <div className="guide-section">
          <h3>Catatan penting</h3>
          <div className="guide-callout">
            <p>
              Jika tidak menggunakan link artikel, sistem akan membuat naskah berdasarkan judul dan program radio yang dipilih.
              Pastikan judul tetap jelas untuk menjaga hasil naskah tetap fokus.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
