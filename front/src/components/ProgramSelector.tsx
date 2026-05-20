import type { RadioProgram } from '../types'

interface ProgramSelectorProps {
  programs: RadioProgram[]
  value: string
  onChange: (value: string) => void
}

export default function ProgramSelector({ programs, value, onChange }: ProgramSelectorProps) {
  return (
    <div className="field-group">
      <label htmlFor="program_type">Program Radio</label>
      <div className="field-input-wrapper">
        <select
          id="program_type"
          name="program_type"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Pilih program...</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined arrow-icon">keyboard_arrow_down</span>
      </div>
    </div>
  )
}
