import { useState, useEffect, useRef, type FormEvent } from 'react'
import { renderAsync } from 'docx-preview'
import './App.css'

interface RadioProgram {
  id: string
  name: string
  fullName: string
  description?: string
}

interface PreviewData {
  title: string
  programName: string
  programFullName: string
  articleLink?: string
  generatedAt: string
  blob: Blob
  filename: string
}

const RADIO_PROGRAMS: RadioProgram[] = [
  { id: 'gudeg_jogja', name: 'GUDEG JOGJA', fullName: 'GOOD MORNING MARI MANDEG MAMPIR JBR AJA', description: 'Program pagi yang energik untuk memulai hari dengan semangat' },
  { id: 'lanosta_zone', name: 'LANOSTA ZONE', fullName: 'LAGU NOSTALGIA', description: 'Memutar lagu-lagu nostalgia yang menenangkan' },
  { id: 'brunch_ala_jbr', name: 'BRUNCH ALA JBR', fullName: 'BRUNCH ALA JBR', description: 'Program santai di siang hari dengan berbagai topik menarik' },
  { id: 'balai_tekkomdik', name: 'BALAI TEKKOMDIK NEWS', fullName: 'BALAI TEKKOMDIK NEWS', description: 'Berita dan informasi terkini' },
  { id: 'inspirative', name: 'INSPIRATIVE PROGRAM', fullName: 'INSPIRATIVE PROGRAM', description: 'Program inspiratif untuk meningkatkan semangat dan motivasi' },
  { id: 'lintas_info', name: 'LINTAS INFORMASI TERKINI', fullName: 'LINTAS INFORMASI TERKINI', description: 'Informasi terkini dari berbagai aspek kehidupan' },
  { id: 'ngudarkawruh', name: 'NGUDARKAWRUH KEBUDAYAAN', fullName: 'NGUDARKAWRUH KEBUDAYAAN', description: 'Membahas dan melestarikan budaya lokal' },
  { id: 'godain', name: 'GODAIN', fullName: 'GOYANG DANGDUT PALING IN', description: 'Lagu-lagu dangdut yang paling hits dan in' },
  { id: 'serangkai', name: 'SERANGKAI', fullName: 'SHARING DAN BELAJAR BARENG SKAI', description: 'Berbagi ilmu dan belajar bersama dengarkan' },
  { id: 'tau_gak_sih', name: 'TAU GAK SIH?', fullName: 'TAU GAK SIH?', description: 'Program trivia dan pengetahuan umum' },
  { id: 'sunset_mood', name: 'SUNSET MOOD', fullName: 'SUNSET MOOD', description: 'Program santai di sore hari dengan musik yang menenangkan' },
  { id: 'persada_zone', name: 'PERSADA ZONE', fullName: 'PERSADA ZONE', description: 'Program zone untuk berbagai tema menarik' },
  { id: 'sinau_bareng', name: 'SINAU BARENG JBR', fullName: 'SINAU BARENG JBR', description: 'Program edukasi untuk belajar bersama' },
  { id: 'satnite_fever', name: 'SATNITE FEVER', fullName: 'SATNITE FEVER', description: 'Program malam hari yang penuh energi' },
  { id: 'sunday_geek', name: 'SUNDAY GEEK', fullName: 'SUNDAY GEEK', description: 'Program Minggu untuk para geek dan penggemar teknologi' },
  { id: 'intm', name: 'INTM', fullName: 'INTM', description: 'Program spesial dengan topik yang variatif' },
  { id: 'insom_club', name: 'INSOM CLUB', fullName: 'INSOM CLUB', description: 'Program malam untuk mereka yang tidak bisa tidur' },
]

function App() {
  const [currentView, setCurrentView] = useState<'generator' | 'library'>('generator')
  const [articleLink, setArticleLink] = useState('')
  const [programType, setProgramType] = useState('')
  const [scriptTitle, setScriptTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  const selectedProgram = RADIO_PROGRAMS.find(p => p.id === programType)

  useEffect(() => {
    if (previewData && previewContainerRef.current) {
      // Clear previous content
      previewContainerRef.current.innerHTML = ''
      
      // Render docx preview
      renderAsync(previewData.blob, previewContainerRef.current)
        .catch((error) => {
          console.error('Error rendering docx preview:', error)
          previewContainerRef.current!.innerHTML = '<p style="color: red;">Gagal memuat preview dokumen</p>'
        })
    }
  }, [previewData])

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!programType) return alert('Pilih program radio terlebih dahulu!')
    if (!scriptTitle) return alert('Masukkan judul naskah!')

    // Reset preview sebelumnya
    setPreviewData(null)
    setIsGenerating(true)

    try {
      let newsContext = undefined

      // 1. Scrape artikel jika link disediakan
      if (articleLink) {
        const scrapeRes = await fetch('/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: articleLink })
        })

        if (!scrapeRes.ok) {
          const err = await scrapeRes.json().catch(() => ({}))
          throw new Error((err as any).message || 'Gagal melakukan scrape artikel')
        }

        const scrapeData = await scrapeRes.json()
        newsContext = scrapeData.ringkasan
      }

      // 2. Generate naskah
      const generateRes = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: scriptTitle,
          program_id: programType,
          news_context: newsContext
        })
      })

      if (!generateRes.ok) {
        const err = await generateRes.json().catch(() => ({}))
        throw new Error((err as any).message || 'Gagal membuat naskah')
      }

      // 3. Simpan blob ke state — belum langsung download
      const blob = await generateRes.blob()

      // Ambil nama file dari header Content-Disposition
      const headerDisposition = generateRes.headers.get('Content-Disposition')
      let filename = `Naskah_${scriptTitle.replace(/\s+/g, '_')}.docx`
      if (headerDisposition && headerDisposition.includes('filename=')) {
        const match = headerDisposition.match(/filename="?([^"]+)"?/)
        if (match && match[1]) filename = match[1]
      }

      // 4. Set preview state
      setPreviewData({
        title: scriptTitle,
        programName: selectedProgram?.name ?? programType,
        programFullName: selectedProgram?.fullName ?? programType,
        articleLink: articleLink || undefined,
        generatedAt: new Date().toLocaleString('id-ID', {
          dateStyle: 'full',
          timeStyle: 'short'
        }),
        blob,
        filename,
      })

    } catch (error: any) {
      alert(`Terjadi kesalahan: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!previewData) return
    setIsDownloading(true)

    try {
      const downloadUrl = window.URL.createObjectURL(previewData.blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = downloadUrl
      a.download = previewData.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      a.remove()
    } catch (error: any) {
      alert(`Gagal mengunduh: ${error.message}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const heroIcons = [
    'menu_book', 'workspace_premium', 'edit', 'school',
    'military_tech', 'draw', 'auto_stories', 'history_edu',
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-header">
          <img alt="JB Radio Logo" className="brand-logo" src="/logo.jpeg" />
          <p className="brand-tagline">Generasi Cerdas Masa Depan</p>
        </div>

        <nav className="main-nav">
          <button
            className={`nav-link ${currentView === 'generator' ? 'active' : ''}`}
            onClick={() => setCurrentView('generator')}
          >
            <span className="material-symbols-outlined">edit_note</span>
            Script Generator
          </button>
          <button
            className={`nav-link ${currentView === 'library' ? 'active' : ''}`}
            onClick={() => setCurrentView('library')}
          >
            <span className="material-symbols-outlined">radio</span>
            Program Library
          </button>
          <a className="nav-link" href="#">
            <span className="material-symbols-outlined">menu_book</span>
            User Guide
          </a>
        </nav>

        <div className="sidebar-footer"></div>
      </aside>

      <div className="workspace-area">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <h1>{currentView === 'generator' ? 'Generate Naskah Radio' : 'Program Library'}</h1>
            </div>
          </div>
        </header>

        <main className="content-area">
          <div className="hero-decor">
            {heroIcons.map((icon) => (
              <span key={icon} className="material-symbols-outlined hero-icon">{icon}</span>
            ))}
          </div>

          {currentView === 'generator' ? (
            <div className="generator-layout">

              {/* ── FORM CARD ── */}
              <section className="form-card">
                <div className="form-header">
                  <h2>Buat Naskah Radio</h2>
                  <p>Konversi artikel berita menjadi naskah siaran profesional.</p>
                </div>

                <form className="form-grid" onSubmit={handleGenerate}>
                  <div className="field-group">
                    <label htmlFor="article_link">Link Artikel Berita (opsional)</label>
                    <div className="field-input-wrapper">
                      <span className="material-symbols-outlined">link</span>
                      <input
                        id="article_link"
                        name="article_link"
                        type="url"
                        value={articleLink}
                        onChange={(e) => setArticleLink(e.target.value)}
                        placeholder="Opsional: https://contoh-berita.com/artikel"
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label htmlFor="program_type">Program Radio</label>
                    <div className="field-input-wrapper">
                      <select
                        id="program_type"
                        name="program_type"
                        value={programType}
                        onChange={(e) => setProgramType(e.target.value)}
                      >
                        <option value="">Pilih program...</option>
                        {RADIO_PROGRAMS.map((program) => (
                          <option key={program.id} value={program.id}>{program.name}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined arrow-icon">keyboard_arrow_down</span>
                    </div>
                  </div>

                  <div className="field-group">
                    <label htmlFor="script_title">Judul Naskah</label>
                    <div className="field-input-wrapper">
                      <span className="material-symbols-outlined">edit</span>
                      <input
                        id="script_title"
                        name="script_title"
                        type="text"
                        value={scriptTitle}
                        onChange={(e) => setScriptTitle(e.target.value)}
                        placeholder="Masukkan judul naskah..."
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="generate-button"
                      type="submit"
                      disabled={isGenerating}
                    >
                      <span className="material-symbols-outlined">
                        {isGenerating ? 'hourglass_top' : 'magic_button'}
                      </span>
                      {isGenerating ? 'Memproses Naskah...' : 'Generate Naskah'}
                    </button>
                  </div>
                </form>
              </section>

              {/* ── PREVIEW PANEL ── */}
              <section className={`preview-panel ${previewData ? 'has-content' : ''} ${isGenerating ? 'is-loading' : ''}`}>
                {!previewData && !isGenerating && (
                  <div className="preview-empty">
                    <span className="material-symbols-outlined preview-empty-icon">article</span>
                    <p className="preview-empty-title">Preview Naskah</p>
                    <p className="preview-empty-desc">
                      Naskah yang berhasil digenerate akan tampil di sini sebelum diunduh.
                    </p>
                  </div>
                )}

                {isGenerating && (
                  <div className="preview-loading">
                    <span className="material-symbols-outlined spin-icon">autorenew</span>
                    <p className="preview-loading-title">Sedang membuat naskah...</p>
                    <p className="preview-loading-desc">Mohon tunggu sebentar</p>
                  </div>
                )}

                {previewData && !isGenerating && (
                  <div className="preview-content">
                    {/* Success badge */}
                    <div className="preview-badge">
                      <span className="material-symbols-outlined">check_circle</span>
                      Naskah Berhasil Dibuat
                    </div>

                    <h3 className="preview-title">{previewData.title}</h3>

                    {/* Meta info */}
                    <div className="preview-meta">
                      <div className="meta-item">
                        <span className="material-symbols-outlined meta-icon">radio</span>
                        <div className="meta-text">
                          <span className="meta-label">Program</span>
                          <span className="meta-value">{previewData.programName}</span>
                          <span className="meta-sub">{previewData.programFullName}</span>
                        </div>
                      </div>

                      <div className="meta-item">
                        <span className="material-symbols-outlined meta-icon">schedule</span>
                        <div className="meta-text">
                          <span className="meta-label">Dibuat pada</span>
                          <span className="meta-value">{previewData.generatedAt}</span>
                        </div>
                      </div>

                      {previewData.articleLink && (
                        <div className="meta-item">
                          <span className="material-symbols-outlined meta-icon">link</span>
                          <div className="meta-text">
                            <span className="meta-label">Sumber Artikel</span>
                            <a
                              className="meta-link"
                              href={previewData.articleLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {previewData.articleLink}
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="meta-item">
                        <span className="material-symbols-outlined meta-icon">description</span>
                        <div className="meta-text">
                          <span className="meta-label">Nama File</span>
                          <span className="meta-value">{previewData.filename}</span>
                        </div>
                      </div>
                    </div>

                    {/* Docx Preview Viewer */}
                    <div className="preview-viewer">
                      <h4 className="preview-viewer-title">Pratinjau Dokumen</h4>
                      <div className="docx-preview-container" ref={previewContainerRef}></div>
                    </div>

                    {/* Info note */}
                    <div className="preview-note">
                      <span className="material-symbols-outlined">info</span>
                      <p>
                        Naskah siap diunduh dalam format <strong>.docx</strong>.
                        Klik tombol di bawah untuk menyimpan file ke perangkat Anda.
                      </p>
                    </div>

                    {/* Download button */}
                    <button
                      className="download-button"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      <span className="material-symbols-outlined">
                        {isDownloading ? 'hourglass_top' : 'download'}
                      </span>
                      {isDownloading ? 'Mengunduh...' : 'Download Naskah (.docx)'}
                    </button>
                  </div>
                )}
              </section>

            </div>
          ) : (
            <section className="program-library">
              <div className="library-header">
                <h2>Perpustakaan Program</h2>
                <p>Daftar lengkap semua program radio JBR</p>
              </div>
              <div className="program-grid">
                {RADIO_PROGRAMS.map((program) => (
                  <div key={program.id} className="program-card">
                    <div className="program-icon">
                      <span className="material-symbols-outlined">radio</span>
                    </div>
                    <h3>{program.name}</h3>
                    <p className="program-subtitle">{program.fullName}</p>
                    {program.description && <p className="program-description">{program.description}</p>}
                    <button
                      className="program-select-btn"
                      onClick={() => {
                        setProgramType(program.id)
                        setCurrentView('generator')
                      }}
                    >
                      Gunakan Program Ini
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App