import Elysia, { t } from "elysia"
import { scrapeArticle } from "../services/scraper"

export const scrapeRoute = new Elysia().post(
  "/scrape",
  async ({ body, set }) => {
    try {
      const result = await scrapeArticle(body.url)
      return result
    } catch (e: any) {
      set.status = 400
      return { message: e.message }
    }
  },
  {
    body: t.Object({ url: t.String({ format: "uri" }) }),
  }
)