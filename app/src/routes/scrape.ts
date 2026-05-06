import Elysia, { t } from "elysia"
import { scrapeArticle } from "../services/scraper"

export const scrapeRoute = new Elysia().post(
  "/scrape",
  async ({ body, error }) => {
    try {
      const result = await scrapeArticle(body.url)
      return result
    } catch (e: any) {
      return error(400, { message: e.message })
    }
  },
  {
    body: t.Object({ url: t.String({ format: "uri" }) }),
  }
)