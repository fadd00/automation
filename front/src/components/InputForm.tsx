import ProgramSelector from './ProgramSelector'
import GenerateButton from './GenerateButton'
import type { InputFormProps } from '../types'

export default function InputForm({
  articleLink,
  programType,
  scriptTitle,
  programs,
  onArticleLinkChange,
  onProgramTypeChange,
  onScriptTitleChange,
  onSubmit,
  isGenerating,
}: InputFormProps) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="field-group">
        <label htmlFor="article_link">Link Artikel Berita (opsional)</label>
        <div className="field-input-wrapper">
          <span className="material-symbols-outlined">link</span>
          <input
            id="article_link"
            name="article_link"
            type="url"
            value={articleLink}
            onChange={(event) => onArticleLinkChange(event.target.value)}
            placeholder="Opsional: https://contoh-berita.com/artikel"
          />
        </div>
      </div>

      <ProgramSelector
        programs={programs}
        value={programType}
        onChange={onProgramTypeChange}
      />

      <div className="field-group">
        <label htmlFor="script_title">Judul Naskah</label>
        <div className="field-input-wrapper">
          <span className="material-symbols-outlined">edit</span>
          <input
            id="script_title"
            name="script_title"
            type="text"
            value={scriptTitle}
            onChange={(event) => onScriptTitleChange(event.target.value)}
            placeholder="Masukkan judul naskah..."
          />
        </div>
      </div>

      <GenerateButton isGenerating={isGenerating} disabled={isGenerating} />
    </form>
  )
}
