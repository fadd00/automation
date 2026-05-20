import type { RadioProgram } from '../types'

interface LibraryViewProps {
  programs: RadioProgram[]
}

export default function LibraryView({ programs }: LibraryViewProps) {
  return (
    <section className="library-view">
      <div className="library-header">
        <h2>Daftar Program Radio</h2>
        <p>Jelajahi semua program radio kami dengan deskripsi lengkap</p>
      </div>

      <div className="programs-grid">
        {programs.map((program) => (
          <div key={program.id} className="program-card">
            <div className="program-card-header">
              <span className="material-symbols-outlined program-icon">radio</span>
              <h3 className="program-name">{program.name}</h3>
            </div>

            <div className="program-card-body">
              <p className="program-full-name">{program.fullName}</p>
              {program.description && (
                <p className="program-description">{program.description}</p>
              )}
            </div>

            <div className="program-card-footer">
              <span className="program-tag">Radio JBR</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
