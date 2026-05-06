export interface ProgramConfig {
  label: string
  jam_tayang: string
  call_audience: string
  tagline: string
  font: string
  system_prompt: string
}

export interface NaskahRow {
  col1: string
  col2: string
  col3: string
}

export interface NaskahJSON {
  opening: NaskahRow[]
  content: NaskahRow[]
  closing: NaskahRow[]
}

export interface GenerateRequest {
  tema: string
  program_id: string
  news_context?: string
}

export interface BatchRequest {
  items: { tema: string; news_context?: string }[]
  program_id: string
}

export interface ScrapeRequest {
  url: string
}