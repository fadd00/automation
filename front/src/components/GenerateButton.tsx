interface GenerateButtonProps {
  isGenerating: boolean
  disabled: boolean
}

export default function GenerateButton({ isGenerating, disabled }: GenerateButtonProps) {
  return (
    <div className="form-actions">
      <button className="generate-button" type="submit" disabled={disabled}>
        <span className="material-symbols-outlined">
          {isGenerating ? 'hourglass_top' : 'magic_button'}
        </span>
        {isGenerating ? 'Memproses Naskah...' : 'Generate Naskah'}
      </button>
    </div>
  )
}
