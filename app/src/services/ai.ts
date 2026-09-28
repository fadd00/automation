import OpenAI from "openai"
import type { NaskahJSON, ProgramConfig } from "../types"

const apiKey =
  process.env.OPENROUTER_API_KEY ??
  process.env.OPENAI_API_KEY ??
  process.env.DEEPSEEK_API_KEY
if (!apiKey) {
  throw new Error(
    "Missing API key. Set OPENROUTER_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY in your environment."
  )
}

const baseURL = process.env.OPENAI_BASE_URL ?? "https://openrouter.ai/api/v1"
const model   = process.env.OPENAI_MODEL   ?? "openrouter/free"

const client = new OpenAI({ apiKey, baseURL })

export async function generateNaskah(
  tema: string,
  program: ProgramConfig,
  newsContext?: string
): Promise<NaskahJSON> {
  const userMsg = newsContext
    ? `Tulis naskah siaran radio dengan tema: ${tema}\n\nKonteks berita:\n${newsContext}`
    : `Tulis naskah siaran radio dengan tema: ${tema}`

  const response = await client.chat.completions.create({
    model,
    max_tokens: 8000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: program.system_prompt },
      { role: "user",   content: userMsg },
    ],
  })

  let raw = response.choices[0].message.content?.trim() ?? ""
  raw = raw.replace(/^```[a-z]*\n?/, "").replace(/```$/, "").trim()

  try {
    return JSON.parse(raw) as NaskahJSON
  } catch {
    throw new Error("AI response bukan JSON valid")
  }
}
