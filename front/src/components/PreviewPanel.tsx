import type { PreviewData } from '../types'

interface PreviewPanelProps {
  previewData: PreviewData | null
  isGenerating: boolean
  previewContainerRef: React.RefObject<HTMLDivElement | null>
  onDownload: () => void
  isDownloading: boolean
}

export default function PreviewPanel({
  previewData,
  isGenerating,
  previewContainerRef,
  onDownload,
  isDownloading,
}: PreviewPanelProps) {
  return (
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
          <div className="preview-badge">
            <span className="material-symbols-outlined">check_circle</span>
            Naskah Berhasil Dibuat
          </div>

          <h3 className="preview-title">{previewData.title}</h3>

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

          <div className="preview-viewer">
            <h4 className="preview-viewer-title">Pratinjau Dokumen</h4>
            <div className="docx-preview-container" ref={previewContainerRef}></div>
          </div>

          <div className="preview-note">
            <span className="material-symbols-outlined">info</span>
            <p>
              Naskah siap diunduh dalam format <strong>.docx</strong>.
              Klik tombol di bawah untuk menyimpan file ke perangkat Anda.
            </p>
          </div>

          <button
            className="download-button"
            onClick={onDownload}
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
  )
}
