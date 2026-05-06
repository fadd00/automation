import OpenAI from "openai"
import type { NaskahJSON, ProgramConfig } from "../types"

const client = new OpenAI({
  apiKey  : process.env.DEEPSEEK_API_KEY!,
  baseURL : "https://api.deepseek.com",
})

export async function generateNaskah(
  tema: string,
  program: ProgramConfig,
  newsContext?: string
): Promise<NaskahJSON> {
  const userMsg = newsContext
    ? `Tulis naskah siaran radio dengan tema: ${tema}\n\nKonteks berita:\n${newsContext}`
    : `Tulis naskah siaran radio dengan tema: ${tema}`

  const response = await client.chat.completions.create({
    model     : "deepseek-chat",
    max_tokens: 8000,
    messages  : [
      { role: "system", content: program.system_prompt },
      { role: "user",   content: userMsg },
    ],
  })

  let raw = response.choices[0].message.content?.trim() ?? ""
  // strip markdown fence kalau ada
  raw = raw.replace(/^```[a-z]*\n?/, "").replace(/```$/, "").trim()

  try {
    return JSON.parse(raw) as NaskahJSON
  } catch {
    throw new Error("AI response bukan JSON valid")
  }
}