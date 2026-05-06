import Elysia, { t } from "elysia"
import { PROGRAMS } from "../templates/programs"
import { generateNaskah } from "../services/ai"
import { buildDocx } from "../services/docx"

export const generateRoute = new Elysia()
  // GET semua program (buat dropdown frontend)
  .get("/programs", () =>
    Object.entries(PROGRAMS).map(([id, p]) => ({
      id,
      label     : p.label,
      jam_tayang: p.jam_tayang,
    }))
  )

  // POST single generate
  .post(
    "/generate",
    async ({ body, error, set }) => {
      const program = PROGRAMS[body.program_id]
      if (!program) return error(400, { message: "Program tidak ditemukan" })

      try {
        const naskah = await generateNaskah(body.tema, program, body.news_context)
        const buffer = await buildDocx(body.tema, naskah, program)

        const safe = body.tema.slice(0, 60).replace(/[/\\:*?"<>|]/g, "-")
        set.headers["Content-Type"]        = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        set.headers["Content-Disposition"] = `attachment; filename="Naskah_${safe}.docx"`

        return buffer
      } catch (e: any) {
        return error(500, { message: e.message })
      }
    },
    {
      body: t.Object({
        tema        : t.String({ minLength: 3 }),
        program_id  : t.String(),
        news_context: t.Optional(t.String()),
      }),
    }
  )