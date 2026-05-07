import { useState, type FormEvent } from 'react'
import './App.css'

interface RadioProgram {
  id: string
  name: string
  fullName: string
  description?: string
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!programType) return alert('Pilih program radio terlebih dahulu!')
    if (!scriptTitle) return alert('Masukkan judul naskah!')

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
          throw new Error(err.message || 'Gagal melakukan scrape artikel')
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
        throw new Error(err.message || 'Gagal membuat naskah')
      }

      // 3. Download file DOCX
      const blob = await generateRes.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = downloadUrl
      
      // Ambil nama file dari header Content-Disposition jika ada (opsional)
      const headerDisposition = generateRes.headers.get('Content-Disposition')
      let filename = `Naskah_${scriptTitle.replace(/\s+/g, '_')}.docx`
      if (headerDisposition && headerDisposition.includes('filename=')) {
        const match = headerDisposition.match(/filename="?([^"]+)"?/)
        if (match && match[1]) filename = match[1]
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl)
      a.remove()
      alert('Berhasil membuat dan mengunduh naskah!')

    } catch (error: any) {
      alert(`Terjadi kesalahan: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const heroIcons = [
    'menu_book',
    'workspace_premium',
    'edit',
    'school',
    'military_tech',
    'draw',
    'auto_stories',
    'history_edu',
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-header">
          <img
            alt="JB Radio Logo"
            className="brand-logo"
            src="/logo.jpeg"
          />
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

        <div className="sidebar-footer">
          <button className="primary-cta" type="button" onClick={() => setCurrentView('generator')}>
            <span className="material-symbols-outlined">add</span>
            New Script
          </button>
        </div>
      </aside>

      <div className="workspace-area">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <button className="menu-toggle" type="button">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1>{currentView === 'generator' ? 'Generate Naskah Radio' : 'Program Library'}</h1>
            </div>
            <nav className="topbar-nav">
              <button
                className={`topbar-link ${currentView === 'generator' ? 'active' : ''}`}
                onClick={() => setCurrentView('generator')}
              >
                Generator
              </button>
              <button
                className={`topbar-link ${currentView === 'library' ? 'active' : ''}`}
                onClick={() => setCurrentView('library')}
              >
                Library
              </button>
            </nav>
          </div>
        </header>

        <main className="content-area">
          <div className="hero-decor">
            {heroIcons.map((icon) => (
              <span key={icon} className="material-symbols-outlined hero-icon">
                {icon}
              </span>
            ))}
          </div>

          {currentView === 'generator' ? (
            <section className="form-card">
              <div className="form-header">
                <h2>Buat Naskah Radio</h2>
                <p>Konversi artikel berita menjadi naskah siaran profesional dalam hitungan detik.</p>
              </div>

              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label htmlFor="article_link">Link Artikel Berita</label>
                  <div className="field-input-wrapper">
                    <span className="material-symbols-outlined">link</span>
                    <input
                      id="article_link"
                      name="article_link"
                      type="url"
                      value={articleLink}
                      onChange={(event) => setArticleLink(event.target.value)}
                      placeholder="https://contoh-berita.com/artikel"
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
                      onChange={(event) => setProgramType(event.target.value)}
                    >
                      <option value="">Pilih program...</option>
                      {RADIO_PROGRAMS.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
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
                      onChange={(event) => setScriptTitle(event.target.value)}
                      placeholder="Masukkan judul naskah..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="generate-button" type="submit" disabled={isGenerating}>
                    <span className="material-symbols-outlined">magic_button</span>
                    {isGenerating ? 'Memproses Naskah...' : 'Generate & Download'}
                  </button>
                </div>
              </form>
            </section>
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
