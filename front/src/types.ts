import type { FormEvent } from 'react'

export interface RadioProgram {
  id: string
  name: string
  fullName: string
  description?: string
}

export interface PreviewData {
  title: string
  programName: string
  programFullName: string
  articleLink?: string
  generatedAt: string
  blob: Blob
  filename: string
}

export interface InputFormProps {
  articleLink: string
  programType: string
  scriptTitle: string
  programs: RadioProgram[]
  onArticleLinkChange: (value: string) => void
  onProgramTypeChange: (value: string) => void
  onScriptTitleChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isGenerating: boolean
}

export interface GenerateButtonProps {
  isGenerating: boolean
  disabled: boolean
}
