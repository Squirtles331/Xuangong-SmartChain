import type { BorderStyle, ElementStyle, FieldFormat, PrintElement } from '@/api/print'

/**
 * 渲染辅助：把模板元素的 mm 矩形与样式转换为 CSS。
 * 坐标系：相对正文区左上角（边距内）。单位统一 mm，直接输出 CSS mm。
 */

export function mm(v: number): string {
  return `${v}mm`
}

/** 元素绝对定位样式（rect → left/top/width/height） */
export function rectStyle(el: PrintElement): Record<string, string> {
  return {
    position: 'absolute',
    left: mm(el.rect.x),
    top: mm(el.rect.y),
    width: mm(el.rect.w),
    height: mm(el.rect.h),
    zIndex: String(el.zIndex ?? 1)
  }
}

function borderEdge(prop: string, edge?: { width: number; style: string; color: string }): Record<string, string> {
  if (!edge || !edge.width) return {}
  return { [prop]: `${edge.width}mm ${edge.style} ${edge.color}` }
}

export function borderStyle(border?: BorderStyle): Record<string, string> {
  if (!border) return {}
  return {
    ...borderEdge('borderTop', border.top),
    ...borderEdge('borderRight', border.right),
    ...borderEdge('borderBottom', border.bottom),
    ...borderEdge('borderLeft', border.left)
  }
}

const VALIGN_MAP: Record<string, string> = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }

/** 文本/字段类元素的内容样式 */
export function textStyle(style: ElementStyle = {}): Record<string, string> {
  const out: Record<string, string> = {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: style.overflow === 'visible' ? 'visible' : 'hidden'
  }
  if (style.fontFamily) out.fontFamily = style.fontFamily
  if (style.fontSize) out.fontSize = `${style.fontSize}pt`
  if (style.fontWeight) out.fontWeight = style.fontWeight
  if (style.fontStyle) out.fontStyle = style.fontStyle
  if (style.color) out.color = style.color
  if (style.background) out.background = style.background
  if (style.textAlign) out.textAlign = style.textAlign
  if (style.lineHeight) out.lineHeight = String(style.lineHeight)
  if (style.letterSpacing) out.letterSpacing = mm(style.letterSpacing)
  out.justifyContent = VALIGN_MAP[style.verticalAlign ?? 'top'] ?? 'flex-start'
  if (style.padding) {
    out.padding = `${mm(style.padding.top)} ${mm(style.padding.right)} ${mm(style.padding.bottom)} ${mm(style.padding.left)}`
  }
  if (style.overflow === 'ellipsis') {
    out.whiteSpace = 'nowrap'
    out.textOverflow = 'ellipsis'
  }
  Object.assign(out, borderStyle(style.border))
  return out
}

/* ----------------------- 格式化 ----------------------- */

const customFormatters: Record<string, (v: unknown) => string> = {}

/** 注册自定义格式化函数（供 FieldFormat.kind='custom' fn 引用） */
export function registerFormatter(name: string, fn: (v: unknown) => string): void {
  customFormatters[name] = fn
}

function formatNumber(n: number, decimals = 0, thousands = false): string {
  const fixed = n.toFixed(decimals)
  if (!thousands) return fixed
  const [int, dec] = fixed.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec ? `${grouped}.${dec}` : grouped
}

function formatDate(value: unknown, pattern = 'YYYY-MM-DD'): string {
  const d = value instanceof Date ? value : new Date(String(value))
  if (isNaN(d.getTime())) return String(value ?? '')
  const pad = (n: number) => String(n).padStart(2, '0')
  return pattern
    .replace(/YYYY/g, String(d.getFullYear()))
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/DD/g, pad(d.getDate()))
    .replace(/HH/g, pad(d.getHours()))
    .replace(/mm/g, pad(d.getMinutes()))
    .replace(/ss/g, pad(d.getSeconds()))
}

/** 按 FieldFormat 格式化求值结果 */
export function applyFormat(value: unknown, format?: FieldFormat): string {
  if (!format || format.kind === 'none') return value == null ? '' : String(value)
  let out: string
  switch (format.kind) {
    case 'number':
      out = formatNumber(Number(value) || 0, format.decimals ?? 0, format.thousands ?? false)
      break
    case 'currency':
      out = formatNumber(Number(value) || 0, format.decimals ?? 2, format.thousands ?? true)
      break
    case 'percent':
      out = `${formatNumber((Number(value) || 0) * 100, format.decimals ?? 0)}%`
      break
    case 'date':
      out = formatDate(value, format.pattern ?? 'YYYY-MM-DD')
      break
    case 'datetime':
      out = formatDate(value, format.pattern ?? 'YYYY-MM-DD HH:mm:ss')
      break
    case 'custom':
      out = format.fn && customFormatters[format.fn] ? customFormatters[format.fn](value) : String(value ?? '')
      break
    default:
      out = String(value ?? '')
  }
  return `${format.prefix ?? ''}${out}${format.suffix ?? ''}`
}
