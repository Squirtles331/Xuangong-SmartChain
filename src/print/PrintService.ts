import { createApp, h, nextTick } from 'vue'
import { getPublishedTemplate, type PrintData, type PrintTemplate } from '@/api/print'
import { printElement } from './adapters/browser'
import { printDotMatrix } from './adapters/dotmatrix'
import { exportPdf } from './adapters/pdf'
import { serverPrint } from './adapters/server'
import PrintRenderer from './renderer/PrintRenderer.vue'

/**
 * 打印服务：业务页统一入口。
 *
 * 把「模板 + 数据」离屏挂载为真实 DOM，再交给输出适配器。
 * 离屏渲染保证业务页无需在自己的视图里嵌入 PrintRenderer。
 */

export type PrintOutput = 'browser' | 'pdf' | 'dotmatrix' | 'server'

export interface PrintOptions {
  /** 业务唯一键，如 'scm.purchase.order' */
  templateKey?: string
  /** 直接传模板（跳过按 key 拉取） */
  template?: PrintTemplate
  /** 单据数据；批量时数组会逐条渲染拼页 */
  data: PrintData | PrintData[]
  output?: PrintOutput
  filename?: string
  /** pdf 输出模式：native=打印对话框另存，file=生成文件下载 */
  pdfMode?: 'native' | 'file'
  /** dotmatrix：打印时是否保留底纹 */
  keepBackground?: boolean
}

async function resolveTemplate(opts: PrintOptions): Promise<PrintTemplate | null> {
  if (opts.template) return opts.template
  if (opts.templateKey) {
    const res = await getPublishedTemplate(opts.templateKey)
    return res.data
  }
  return null
}

/** 离屏挂载 PrintRenderer，回调拿到根 DOM，用完自动卸载 */
async function withRenderedDom<T>(template: PrintTemplate, dataList: PrintData[], fn: (root: HTMLElement) => T | Promise<T>): Promise<T> {
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-99999px'
  host.style.top = '0'
  document.body.appendChild(host)

  const app = createApp({
    render() {
      // 批量：多条数据各渲染一个 PrintRenderer
      return dataList.map((data, i) => h(PrintRenderer, { key: i, template, data }))
    }
  })
  app.mount(host)
  await nextTick()

  try {
    return await fn(host)
  } finally {
    app.unmount()
    if (host.parentNode) host.parentNode.removeChild(host)
  }
}

export const PrintService = {
  /** 业务页唯一入口 */
  async print(opts: PrintOptions): Promise<void> {
    // server 输出无需前端渲染：直接发起后端任务
    if (opts.output === 'server') {
      const key = opts.template?.templateKey ?? opts.templateKey
      if (!key) throw new Error('后端批量打印需要 templateKey')
      const dataIds = (Array.isArray(opts.data) ? opts.data : [opts.data]).map((d, i) => String((d as Record<string, unknown>).id ?? i))
      await serverPrint(key, dataIds)
      return
    }

    const template = await resolveTemplate(opts)
    if (!template) throw new Error(`打印模板不存在：${opts.templateKey ?? '(未指定)'}`)

    const dataList = Array.isArray(opts.data) ? opts.data : [opts.data]
    const output = opts.output ?? 'browser'

    await withRenderedDom(template, dataList, async (root) => {
      switch (output) {
        case 'browser':
          printElement(root, template)
          break
        case 'pdf':
          await exportPdf(root, template, { filename: opts.filename, mode: opts.pdfMode })
          break
        case 'dotmatrix':
          printDotMatrix(root, template, { keepBackground: opts.keepBackground })
          break
      }
    })
  },

  /** 仅渲染为 HTML 字符串（预览/调试用） */
  async renderHtml(templateKey: string, data: PrintData): Promise<string> {
    const res = await getPublishedTemplate(templateKey)
    const template = res.data
    if (!template) throw new Error(`打印模板不存在：${templateKey}`)
    return withRenderedDom(template, [data], (root) => root.innerHTML)
  }
}
