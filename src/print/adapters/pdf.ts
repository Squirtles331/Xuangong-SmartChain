import type { PrintTemplate } from '@/api/print'
import { printElement } from './browser'

/**
 * PDF 导出适配器
 *
 * 默认路线：浏览器原生打印 → 用户在打印对话框选「另存为 PDF」。
 * 保真度最高、零依赖、体积为 0。适合绝大多数「点一下拿到 PDF」场景。
 *
 * 自动落盘路线（无人值守 / 批量生成文件）：需 jsPDF + html2canvas，
 * 按需动态 import，不进主包。本函数在缺库时给出明确提示。
 */

export interface PdfExportOptions {
  filename?: string
  /** 'native' 走浏览器打印对话框；'file' 生成并下载文件（需 jsPDF） */
  mode?: 'native' | 'file'
}

export async function exportPdf(sourceEl: HTMLElement, template: PrintTemplate, options: PdfExportOptions = {}): Promise<void> {
  const mode = options.mode ?? 'native'

  if (mode === 'native') {
    // 复用 iframe 打印，@page 尺寸精确；用户选「另存为 PDF」
    printElement(sourceEl, template)
    return
  }

  // file 模式：动态加载重型库（可选依赖，未安装则给出提示）
  // 用变量化的模块说明符，避免 tsc 在未安装时报模块缺失
  const loadOptional = (name: string) => import(/* @vite-ignore */ name)
  let jsPDFCtor: new (opts: Record<string, unknown>) => JsPdfLike
  let html2canvas: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement>
  try {
    const [pdfMod, h2cMod] = await Promise.all([loadOptional('jspdf'), loadOptional('html2canvas')])
    jsPDFCtor = (pdfMod as { jsPDF: typeof jsPDFCtor }).jsPDF
    html2canvas = (h2cMod as { default: typeof html2canvas }).default
  } catch {
    throw new Error('PDF 文件导出需要安装 jspdf 与 html2canvas；或改用 mode="native" 通过打印对话框另存为 PDF')
  }

  const pages = Array.from(sourceEl.querySelectorAll<HTMLElement>('.print-page'))
  if (!pages.length) return

  const orientation = template.page.width > template.page.height ? 'landscape' : 'portrait'
  const pdf = new jsPDFCtor({ unit: 'mm', format: [template.page.width, template.page.height], orientation })

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true })
    const img = canvas.toDataURL('image/png')
    if (i > 0) pdf.addPage([template.page.width, template.page.height], orientation)
    pdf.addImage(img, 'PNG', 0, 0, template.page.width, template.page.height)
  }

  pdf.save(options.filename ?? `${template.name}.pdf`)
}

/** jsPDF 最小接口（避免硬依赖类型） */
interface JsPdfLike {
  addPage(format: [number, number], orientation: string): void
  addImage(data: string, fmt: string, x: number, y: number, w: number, h: number): void
  save(filename: string): void
}
