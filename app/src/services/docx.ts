import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, BorderStyle,
} from "docx"
import type { NaskahJSON, ProgramConfig } from "../types"

const NIL_BORDER = { style: BorderStyle.NIL, size: 0, color: "auto" }
const NIL_BORDERS = {
  top: NIL_BORDER, bottom: NIL_BORDER,
  left: NIL_BORDER, right: NIL_BORDER,
  insideH: NIL_BORDER, insideV: NIL_BORDER,
}

function makeRun(text: string, font: string) {
  return new TextRun({ text, font, size: 28 }) // 28 half-pt = 14pt
}

function makePara(text: string, font: string, align?: (typeof AlignmentType)[keyof typeof AlignmentType]) {
  return new Paragraph({
    children : [makeRun(text, font)],
    alignment: align,
    spacing  : { after: 80 },
  })
}

function makeTabPara(label: string, value: string, font: string, singleTab = false) {
  return new Paragraph({
    children: [
      makeRun(label, font),
      new TextRun({ text: (singleTab ? "\t" : "\t\t") + `: ${value}`, font, size: 28 }),
    ],
    spacing: { after: 60 },
  })
}

function makeTableRow(col1: string, col2: string, col3: string, font: string) {
  const makeCell = (text: string, width: number) =>
    new TableCell({
      width  : { size: width, type: WidthType.DXA },
      borders: NIL_BORDERS,
      margins: { top: 60, bottom: 60, left: 80, right: 80 },
      children: [new Paragraph({
        children : [makeRun(text, font)],
        alignment: AlignmentType.JUSTIFIED,
        spacing  : { after: 0 },
      })],
    })

  return new TableRow({
    children: [makeCell(col1, 1980), makeCell(col2, 420), makeCell(col3, 6480)],
  })
}

function makeTable(rows: { col1: string; col2: string; col3: string }[], font: string) {
  return new Table({
    width      : { size: 8880, type: WidthType.DXA },
    columnWidths: [1980, 420, 6480],
    borders    : NIL_BORDERS,
    rows       : rows.map(r => makeTableRow(r.col1, r.col2, r.col3, font)),
  })
}

export async function buildDocx(
  tema    : string,
  naskah  : NaskahJSON,
  program : ProgramConfig
): Promise<Buffer> {
  const f = program.font
  const ONE_TAB = new Set(["Judul Naskah", "Gaya Penyiar", "Call Audience"])

  const programInfo: [string, string][] = [
    ["Program",       program.label],
    ["Judul Naskah",  tema],
    ["Format",        "Topik Santai"],
    ["Segmentasi",    "Semua Umur"],
    ["Gaya Penyiar",  "Style Komunikatif dan Smart"],
    ["Penyiar",       "Penyiar Jogja Belajar Radio"],
    ["Call Sign",     "Jogja Belajar Radio"],
    ["Call Audience", program.call_audience],
  ]

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size  : { width: 11909, height: 16834 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        makePara("NASKAH PROGRAM SIARAN RADIO PENDIDIKAN", f, AlignmentType.CENTER),
        makePara("MATERI NASKAH",                          f, AlignmentType.CENTER),
        makePara("PROGRAM SIARAN RADIO PENDIDIKAN",        f, AlignmentType.CENTER),
        makePara(" ", f),
        ...programInfo.map(([label, val]) =>
          makeTabPara(label, val, f, ONE_TAB.has(label))
        ),
        makePara(" ", f),
        // Opening
        makePara("Opening", f),
        makeTable(naskah.opening, f),
        makePara(" ", f),
        // Content
        makePara("Content", f),
        makeTable(naskah.content, f),
        makePara(" ", f),
        // Closing
        makePara("Closing", f),
        makeTable(naskah.closing, f),
      ],
    }],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}