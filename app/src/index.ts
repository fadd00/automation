import { Elysia } from "elysia"
import { cors }   from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { scrapeRoute }   from "./routes/scrape"
import { generateRoute } from "./routes/generate"
import { batchRoute }    from "./routes/batch"
import { staticPlugin } from "@elysiajs/static"

const app = new Elysia()
  .use(swagger())
  .use(cors({ origin: "*" })) // allow all for static serving
  .use(staticPlugin({
    assets: "../front/dist",
    prefix: "/" // Serve static files at root
  }))
  .get("/", () => Bun.file("../front/dist/index.html"))
  .use(scrapeRoute)
  .use(generateRoute)
  .use(batchRoute)
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen(process.env.PORT ?? 3000)

console.log(`🚀 Server running at http://localhost:${app.server?.port}`)