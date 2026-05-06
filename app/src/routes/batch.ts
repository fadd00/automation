import Elysia, { t } from "elysia"
import { PROGRAMS } from "../templates/programs"
import { generateNaskah } from "../services/ai"
import { buildDocx } from "../services/docx"
import { zipBuffers } from "../services/zip"

const CHUNK_SIZE = 3 // max concurrent request ke Deepseek

async function chunkProcess<T, R>(
  items    : T[],
  chunkSize: number,
  fn       : (item: T, index: number) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    const batch = await Promise.allSettled(
      chunk.map((item, j) => fn(item, i + j))
    )
    results.push(...batch)
  }
  return results
}

export const batchRoute = new Elysia().post(
  "/batch",
  async ({ body, set }) => {
    const program = PROGRAMS[body.program_id]
    if (!program) {
      set.status = 400
      return { message: "Program tidak ditemukan" }
    }
    if (body.items.length > 60) {
      set.status = 400
      return { message: "Maksimal 60 naskah" }
    }

    const results = await chunkProcess(body.items, CHUNK_SIZE, async (item) => {
      const naskah = await generateNaskah(item.tema, program, item.news_context)
      const buffer = await buildDocx(item.tema, naskah, program)
      const safe   = item.tema.slice(0, 60).replace(/[/\\:*?"<>|]/g, "-")
      return { name: `Naskah_${safe}.docx`, buffer }
    })

    const success = results
      .filter((r): r is PromiseFulfilledResult<{ name: string; buffer: Buffer }> =>
        r.status === "fulfilled"
      )
      .map(r => r.value)

    const failed = results
      .map((r, i) => r.status === "rejected" ? body.items[i].tema : null)
      .filter(Boolean)

    if (success.length === 0) {
      set.status = 500
      return { message: "Semua naskah gagal di-generate" }
    }

    const zipBuffer = await zipBuffers(success)

    set.headers["Content-Type"]        = "application/zip"
    set.headers["Content-Disposition"] = `attachment; filename="Naskah_Batch_${Date.now()}.zip"`
    set.headers["X-Success-Count"]     = String(success.length)
    set.headers["X-Failed-Count"]      = String(failed.length)
    set.headers["X-Failed-Topics"]     = JSON.stringify(failed)

    return zipBuffer
  },
  {
    body: t.Object({
      program_id: t.String(),
      items: t.Array(
        t.Object({
          tema        : t.String({ minLength: 3 }),
          news_context: t.Optional(t.String()),
        }),
        { minItems: 1, maxItems: 60 }
      ),
    }),
  }
)