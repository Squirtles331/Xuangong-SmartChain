import type { PageConfig, PrintTemplate } from '@/api/print'

/**
 * 浏览器原生打印适配器
 *
 * 用隐藏 iframe 而非 window.open：
 *  - 不被弹窗拦截
 *  - 打印作用域干净，不污染主文档样式
 *  - @page 规则写入 iframe，物理尺寸精确
 */

function buildPageCss(page: PageConfig): string {
  const size = page.continuous ? `${page.width}mm auto` : `${page.width}mm ${page.height}mm`
  return `
    @page { size: ${size}; margin: 0; }
    html, body { margin: 0; padding: 0; }
    .print-root { gap: 0 !important; }
    .print-page { box-shadow: none !important; page-break-after: always; }
    .print-page:last-child { page-break-after: auto; }
  `
}

/** 收集当前文档的样式（含 scoped CSS），注入 iframe，保证渲染一致 */
function collectStyles(): string {
  const parts: string[] = []
  document.querySelectorAll('style').forEach((s) => parts.push(s.innerHTML))
  return parts.join('\n')
}

/**
 * 打印一段已渲染好的 DOM。
 * @param sourceEl 包含 .print-root 的元素（PrintRenderer 根）
 * @param template 模板，用于生成 @page 尺寸
 */
export function printElement(sourceEl: HTMLElement, template: PrintTemplate): void {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  const win = iframe.contentWindow
  if (!doc || !win) {
    document.body.removeChild(iframe)
    return
  }

  doc.open()
  doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${template.name}</title>
    <style>${collectStyles()}</style>
    <style>${buildPageCss(template.page)}</style>
    </head><body>${sourceEl.innerHTML}</body></html>`)
  doc.close()

  const cleanup = () => {
    // 延迟移除，避免某些浏览器打印对话框未完成
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    }, 500)
  }

  // 等待图片/字体加载后再打印
  const triggerPrint = () => {
    win.focus()
    win.print()
    cleanup()
  }

  if (doc.readyState === 'complete') {
    setTimeout(triggerPrint, 200)
  } else {
    win.addEventListener('load', () => setTimeout(triggerPrint, 200))
  }
}
