import { useEffect, useRef, useState, type FormEvent } from 'react'
import { renderAsync } from 'docx-preview'
import type { PreviewData, RadioProgram } from '../types'

const RADIO_PROGRAMS: RadioProgram[] = [
  { id: 'gudeg_jogja', name: 'GUDEG JOGJA', fullName: 'GOOD MORNING MARI MANDEG MAMPIR JBR AJA', description: 'Program pagi yang energik untuk memulai hari dengan semangat' },
  { id: 'lanosta_zone', name: 'LANOSTA ZONE', fullName: 'LAGU NOSTALGIA', description: 'Memutar lagu-lagu nostalgia yang menenangkan' },
  { id: 'brunch_ala_jbr', name: 'BRUNCH ALA JBR', fullName: 'BRUNCH ALA JBR', description: 'Program santai di siang hari dengan berbagai topik menarik' },
  { id: 'balai_tekkomdik', name: 'BALAI TEKKOMDIK NEWS', fullName: 'BALAI TEKKOMDIK NEWS', description: 'Berita dan informasi terkini' },
  { id: 'inspirative', name: 'INSPIRATIVE PROGRAM', fullName: 'INSPIRATIVE PROGRAM', description: 'Program inspiratif untuk meningkatkan semangat dan motivasi' },
  { id: 'lintas_info', name: 'LINTAS INFORMASI TERKINI', fullName: 'LINTAS INFORMASI TERKINI', description: 'Informasi terkini dari berbagai aspek kehidupan' },
  { id: 'ngudarkawruh', name: 'NGUDARKAWRUH KEBUDAYAAN', fullName: 'NGUDARKAWRUH KEBUDAYAAN', description: 'Membahas dan melestarikan budaya lokal' },
  { id: 'godain', name: 'GODAIN', fullName: 'GOYANG DANGDUT PALING IN', description: 'Lagu-lagu dangdut yang paling hits dan in' },
  { id: 'serangkai', name: 'SERANGKAI', fullName: 'SHARING DAN BELAJAR BARENG SKAI', description: 'Berbagi ilmu dan belajar bersama dengarkan' },
  { id: 'tau_gak_sih', name: 'TAU GAK SIH?', fullName: 'TAU GAK SIH?', description: 'Program trivia dan pengetahuan umum' },
  { id: 'sunset_mood', name: 'SUNSET MOOD', fullName: 'SUNSET MOOD', description: 'Program santai di sore hari dengan musik yang menenangkan' },
  { id: 'persada_zone', name: 'PERSADA ZONE', fullName: 'PERSADA ZONE', description: 'Program zone untuk berbagai tema menarik' },
  { id: 'sinau_bareng', name: 'SINAU BARENG JBR', fullName: 'SINAU BARENG JBR', description: 'Program edukasi untuk belajar bersama' },
  { id: 'satnite_fever', name: 'SATNITE FEVER', fullName: 'SATNITE FEVER', description: 'Program malam hari yang penuh energi' },
  { id: 'sunday_geek', name: 'SUNDAY GEEK', fullName: 'SUNDAY GEEK', description: 'Program Minggu untuk para geek dan penggemar teknologi' },
  { id: 'intm', name: 'INTM', fullName: 'INTM', description: 'Program spesial dengan topik yang variatif' },
  { id: 'insom_club', name: 'INSOM CLUB', fullName: 'INSOM CLUB', description: 'Program malam untuk mereka yang tidak bisa tidur' },
]

export function useGenerate() {
  const [articleLink, setArticleLink] = useState('')
  const [programType, setProgramType] = useState('')
  const [scriptTitle, setScriptTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const previewContainerRef = useRef<HTMLDivElement | null>(null)

  const selectedProgram = RADIO_PROGRAMS.find((program) => program.id === programType)

  useEffect(() => {
    if (!previewData || !previewContainerRef.current) {
      return
    }

    previewContainerRef.current.innerHTML = ''

    renderAsync(previewData.blob, previewContainerRef.current).catch((error: unknown) => {
      console.error('Error rendering docx preview:', error)
      previewContainerRef.current!.innerHTML = '<p style="color: red;">Gagal memuat preview dokumen</p>'
    })
  }, [previewData])

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!programType) {
      return alert('Pilih program radio terlebih dahulu!')
    }

    if (!scriptTitle) {
      return alert('Masukkan judul naskah!')
    }

    setPreviewData(null)
    setIsGenerating(true)

    try {
      let newsContext: string | undefined

      if (articleLink) {
        const scrapeRes = await fetch('/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: articleLink }),
        })

        if (!scrapeRes.ok) {
          const err = await scrapeRes.json().catch(() => ({}))
          throw new Error((err as any).message || 'Gagal melakukan scrape artikel')
        }

        const scrapeData = await scrapeRes.json()
        newsContext = scrapeData.ringkasan
      }

      const generateRes = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: scriptTitle,
          program_id: programType,
          news_context: newsContext,
        }),
      })

      if (!generateRes.ok) {
        const err = await generateRes.json().catch(() => ({}))
        throw new Error((err as any).message || 'Gagal membuat naskah')
      }

      const blob = await generateRes.blob()
      const headerDisposition = generateRes.headers.get('Content-Disposition')
      let filename = `Naskah_${scriptTitle.replace(/\s+/g, '_')}.docx`

      if (headerDisposition && headerDisposition.includes('filename=')) {
        const match = headerDisposition.match(/filename="?([^"]+)"?/) 
        if (match && match[1]) {
          filename = match[1]
        }
      }

      setPreviewData({
        title: scriptTitle,
        programName: selectedProgram?.name ?? programType,
        programFullName: selectedProgram?.fullName ?? programType,
        articleLink: articleLink || undefined,
        generatedAt: new Date().toLocaleString('id-ID', {
          dateStyle: 'full',
          timeStyle: 'short',
        }),
        blob,
        filename,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      alert(`Terjadi kesalahan: ${message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!previewData) {
      return
    }

    setIsDownloading(true)

    try {
      const downloadUrl = window.URL.createObjectURL(previewData.blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = downloadUrl
      a.download = previewData.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      a.remove()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mengunduh file'
      alert(`Gagal mengunduh: ${message}`)
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    articleLink,
    setArticleLink,
    programType,
    setProgramType,
    scriptTitle,
    setScriptTitle,
    isGenerating,
    isDownloading,
    previewData,
    previewContainerRef,
    programs: RADIO_PROGRAMS,
    selectedProgram,
    handleGenerate,
    handleDownload,
  }
}
