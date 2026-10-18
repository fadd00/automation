import OpenAI from "openai"
import type { NaskahJSON, ProgramConfig } from "../types"

const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim()
const openAiApiKey = process.env.OPENAI_API_KEY?.trim()
const deepseekApiKey = process.env.DEEPSEEK_API_KEY?.trim()
const apiKey = openRouterApiKey || openAiApiKey || deepseekApiKey
if (!apiKey) {
  throw new Error(
    "Missing API key. Set OPENROUTER_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY in your environment."
  )
}

const usingDeepSeek = Boolean(deepseekApiKey && !openRouterApiKey && !openAiApiKey)
const baseURL =
  process.env.OPENAI_BASE_URL ??
  (usingDeepSeek ? "https://api.deepseek.com" : "https://openrouter.ai/api/v1")
const model =
  process.env.OPENAI_MODEL ??
  (usingDeepSeek ? "deepseek-chat" : "openrouter/free")

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
