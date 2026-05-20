import { useState } from 'react'
import './App.css'
import InputForm from './components/InputForm'
import PreviewPanel from './components/PreviewPanel'
import LibraryView from './components/LibraryView'
import UserGuide from './components/UserGuide'
import { useGenerate } from './hooks/useGenerate'

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

function App() {
  const [currentView, setCurrentView] = useState<'generator' | 'library' | 'guide'>('generator')
  const {
    articleLink,
    programType,
    scriptTitle,
    isGenerating,
    isDownloading,
    previewData,
    previewContainerRef,
    programs,
    setArticleLink,
    setProgramType,
    setScriptTitle,
    handleGenerate,
    handleDownload,
  } = useGenerate()

  const handleSelectProgram = (programId: string) => {
    setProgramType(programId)
    setCurrentView('generator')
  }

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
          <button
            className={`nav-link ${currentView === 'guide' ? 'active' : ''}`}
            onClick={() => setCurrentView('guide')}
          >
            <span className="material-symbols-outlined">menu_book</span>
            User Guide
          </button>
        </nav>

        <div className="sidebar-footer"></div>
      </aside>

      <div className="workspace-area">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <h1>
                {currentView === 'generator'
                  ? 'Generate Naskah Radio'
                  : currentView === 'library'
                  ? 'Program Library'
                  : 'User Guide'}
              </h1>
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
              <section className="form-card">
                <div className="form-header">
                  <h2>Buat Naskah Radio</h2>
                  <p>Konversi artikel berita menjadi naskah siaran profesional.</p>
                </div>

                <InputForm
                  articleLink={articleLink}
                  programType={programType}
                  scriptTitle={scriptTitle}
                  programs={programs}
                  onArticleLinkChange={setArticleLink}
                  onProgramTypeChange={setProgramType}
                  onScriptTitleChange={setScriptTitle}
                  onSubmit={handleGenerate}
                  isGenerating={isGenerating}
                />
              </section>

              <PreviewPanel
                previewData={previewData}
                isGenerating={isGenerating}
                previewContainerRef={previewContainerRef}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            </div>
          ) : currentView === 'library' ? (
            <LibraryView programs={programs} onSelectProgram={handleSelectProgram} />
          ) : (
            <UserGuide />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
