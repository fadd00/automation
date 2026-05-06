import { Elysia } from "elysia"
import { cors }   from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { scrapeRoute }   from "./routes/scrape"
import { generateRoute } from "./routes/generate"
import { batchRoute }    from "./routes/batch"

const app = new Elysia()
  .use(swagger())
  .use(cors({ origin: "http://localhost:5173" })) // ganti sesuai URL frontend
  .use(scrapeRoute)
  .use(generateRoute)
  .use(batchRoute)
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen(process.env.PORT ?? 3000)

console.log(`🚀 Server running at http://localhost:${app.server?.port}`)