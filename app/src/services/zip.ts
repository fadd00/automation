import archiver from "archiver"
import { Readable } from "stream"

export async function zipBuffers(
  files: { name: string; buffer: Buffer }[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 6 } })
    const chunks: Buffer[] = []

    archive.on("data",  chunk  => chunks.push(chunk))
    archive.on("end",   ()     => resolve(Buffer.concat(chunks)))
    archive.on("error", reject)

    for (const { name, buffer } of files) {
      archive.append(Readable.from(buffer), { name })
    }

    archive.finalize()
  })
}