import * as cheerio from "cheerio"

// selector per domain — tambah sesuai kebutuhan
const DOMAIN_SELECTORS: Record<string, { title: string; content: string }> = {
  "kompas.com"       : { title: "h1.read__title",      content: "div.read__content p"     },
  "cnnindonesia.com" : { title: "h1.title",             content: "div.detail-text p"       },
  "tribunnews.com"   : { title: "h1#judul",             content: "div#article-body p"      },
  "detik.com"        : { title: "h1.detail__title",     content: "div.detail__body-text p" },
  "tempo.co"         : { title: "h1.title",             content: "div.detail-konten p"     },
}

// fallback generic selector
const FALLBACK = { title: "h1", content: "article p, .content p, .post-content p" }

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return ""
  }
}

export async function scrapeArticle(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; JBR-Bot/1.0)",
    },
  })

  if (!res.ok) throw new Error(`Gagal fetch URL: ${res.status}`)

  const html     = await res.text()
  const $        = cheerio.load(html)
  const domain   = getDomain(url)
  const selector = DOMAIN_SELECTORS[domain] ?? FALLBACK

  const judul = $(selector.title).first().text().trim()

  const paragraphs: string[] = []
  $(selector.content).each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 40) paragraphs.push(text) // filter paragraf terlalu pendek
  })

  if (!judul && paragraphs.length === 0) {
    throw new Error("Konten tidak ditemukan, coba cek URL atau domain belum didukung")
  }

  // ringkasan: ambil max 5 paragraf pertama biar konteks gak terlalu panjang ke AI
  const ringkasan = paragraphs.slice(0, 5).join("\n\n")

  return { judul, ringkasan, total_paragraf: paragraphs.length }
}