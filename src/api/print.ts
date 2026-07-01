import { isMockMode } from './_config'
import { apiDelete, apiGet, apiPost, apiPut, type ApiResponse, type PaginatedData } from './_factory'
import * as mockService from '@/mock/services/print'

/* ============================================================
 * 打印模板数据模型（Template Schema）
 * 单位统一用毫米(mm)，渲染时按 DPI 换算或直接用 CSS mm 单位
 * 详见 docs/print-designer-design.md
 * ============================================================ */

export type TemplateCategory = 'document' | 'label' | 'report' | 'certificate'
export type TemplateStatus = 'draft' | 'published'
export type EditScope = 'admin' | 'user'

/** 页眉/页脚区域：只定义高度与重复策略，内容是 region 为 header/footer 的元素 */
export interface PageBand {
  /** 区高度 mm，0 = 不启用 */
  height: number
  /** every=每页 first=仅首页 last=仅末页 exceptFirst=除首页外每页 */
  repeat: 'every' | 'first' | 'last' | 'exceptFirst'
}

export interface PageMargin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface PageConfig {
  /** 预设纸张或自定义 */
  paper: 'A4' | 'A5' | 'A6' | 'B5' | 'letter' | 'custom'
  width: number // mm
  height: number // mm
  orientation: 'portrait' | 'landscape'
  margin: PageMargin // mm
  header: PageBand
  footer: PageBand
  /** 是否连续纸（针式），连续纸不强制分页高度 */
  continuous: boolean
  /** 背景图（套打底纹对齐用），dataURL 或 url */
  background?: string
  /** 设计期网格大小 mm，0=关闭 */
  grid: number
  /** 网格是否吸附 */
  snapToGrid: boolean
}

/* ----------------------- 元素 ----------------------- */

export type ElementType = 'text' | 'field' | 'table' | 'image' | 'barcode' | 'qrcode' | 'line' | 'rect' | 'html'

export type ElementRegion = 'header' | 'body' | 'footer'

export interface ElementRect {
  x: number
  y: number
  w: number
  h: number
}

export interface BorderEdge {
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  color: string
}

export interface BorderStyle {
  top?: BorderEdge
  right?: BorderEdge
  bottom?: BorderEdge
  left?: BorderEdge
}

export interface ElementStyle {
  fontFamily?: string
  fontSize?: number // pt
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  color?: string
  background?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  lineHeight?: number
  letterSpacing?: number
  border?: BorderStyle
  padding?: PageMargin
  overflow?: 'visible' | 'ellipsis' | 'shrink'
}

/* PLACEHOLDER_ELEMENTS */

export interface FieldFormat {
  kind: 'none' | 'number' | 'currency' | 'date' | 'datetime' | 'percent' | 'custom'
  decimals?: number
  thousands?: boolean
  pattern?: string
  fn?: string
  prefix?: string
  suffix?: string
}

export interface BaseElement {
  id: string
  type: ElementType
  /** 绝对定位，单位 mm，相对页面左上角（边距内坐标系） */
  rect: ElementRect
  zIndex: number
  locked?: boolean
  region: ElementRegion
  /** 条件显示表达式，如 "{{ data.status === 'paid' }}" */
  visibleIf?: string
  style: ElementStyle
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
}

export interface FieldElement extends BaseElement {
  type: 'field'
  /** 绑定表达式，如 "{{ data.supplierName }}" */
  expression: string
  format?: FieldFormat
}

export interface TableColumn {
  id: string
  title: string
  /** 单元格表达式，行上下文为 row */
  expression: string
  width: number // mm
  align?: 'left' | 'center' | 'right'
  format?: FieldFormat
  /** 合并相同值的相邻单元格 */
  mergeSame?: boolean
}

export interface TableSummary {
  label: string
  labelColumnId: string
  items: Array<{ columnId: string; agg: 'sum' | 'avg' | 'count' | 'max' | 'min' }>
}

export interface TableElement extends BaseElement {
  type: 'table'
  /** 明细数据来源表达式，求值结果须为数组 */
  dataKey: string
  columns: TableColumn[]
  repeatHeader: boolean
  summary?: TableSummary
  rowHeight: number | 'auto'
  stripe?: boolean
  minRows?: number
  headerStyle?: ElementStyle
  cellStyle?: ElementStyle
}

export interface ImageElement extends BaseElement {
  type: 'image'
  /** 静态 url/dataURL，或绑定表达式 */
  src: string
  /** src 是否为表达式 */
  dynamic?: boolean
  fit?: 'fill' | 'contain' | 'cover'
}

export interface BarcodeElement extends BaseElement {
  type: 'barcode'
  expression: string
  symbology: 'CODE128' | 'CODE39' | 'EAN13' | 'ITF14'
  showText: boolean
}

export interface QRCodeElement extends BaseElement {
  type: 'qrcode'
  expression: string
  level: 'L' | 'M' | 'Q' | 'H'
}

export interface LineElement extends BaseElement {
  type: 'line'
  /** 方向：水平/垂直，由 rect 宽高决定，这里记线宽与样式 */
  lineStyle: 'solid' | 'dashed' | 'dotted'
  lineWidth: number
  lineColor: string
}

export interface RectElement extends BaseElement {
  type: 'rect'
  radius?: number
}

export interface HtmlElement extends BaseElement {
  type: 'html'
  /** 富文本/自由 HTML，可含表达式 */
  html: string
}

export type PrintElement =
  | TextElement
  | FieldElement
  | TableElement
  | ImageElement
  | BarcodeElement
  | QRCodeElement
  | LineElement
  | RectElement
  | HtmlElement

/* ----------------------- 数据源 ----------------------- */

export interface FieldMeta {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean'
  sample?: unknown
}

export interface DataSourceDataset {
  key: string
  label: string
  fields: FieldMeta[]
}

export interface DataSourceDef {
  fields: FieldMeta[]
  datasets: DataSourceDataset[]
}

export interface PrintTemplate {
  id: string
  /** 业务唯一键，如 'scm.purchase.order' */
  templateKey: string
  name: string
  module: string
  category: TemplateCategory
  version: number
  status: TemplateStatus
  page: PageConfig
  elements: PrintElement[]
  dataSource: DataSourceDef
  editScope: EditScope
  createdAt: string
  updatedAt: string
}

/** 业务运行时传入的数据 */
export type PrintData = Record<string, unknown>

/* PLACEHOLDER_API */

/* ============================================================
 * API（isMockMode 切换，对齐 src/api/qms.ts）
 * ============================================================ */

export interface PrintTemplateListParams {
  pageNum: number
  pageSize: number
  module?: string
  category?: TemplateCategory
  keyword?: string
}

export function getPrintTemplateList(params: PrintTemplateListParams) {
  if (isMockMode) return mockService.getPrintTemplateList(params) as Promise<ApiResponse<PaginatedData<PrintTemplate>>>
  return apiGet<PaginatedData<PrintTemplate>>('/print/templates', { params })
}

export function getPrintTemplate(id: string) {
  if (isMockMode) return mockService.getPrintTemplate(id) as Promise<ApiResponse<PrintTemplate>>
  return apiGet<PrintTemplate>(`/print/templates/${id}`)
}

/** 业务页按 templateKey 取已发布模板 */
export function getPublishedTemplate(templateKey: string) {
  if (isMockMode) return mockService.getPublishedTemplate(templateKey) as Promise<ApiResponse<PrintTemplate>>
  return apiGet<PrintTemplate>(`/print/templates/by-key/${templateKey}`)
}

export function createPrintTemplate(data: Partial<PrintTemplate>) {
  if (isMockMode) return mockService.createPrintTemplate(data)
  return apiPost<PrintTemplate, Partial<PrintTemplate>>('/print/templates', data)
}

export function updatePrintTemplate(id: string, data: Partial<PrintTemplate>) {
  if (isMockMode) return mockService.updatePrintTemplate(id, data)
  return apiPut<PrintTemplate, Partial<PrintTemplate>>(`/print/templates/${id}`, data)
}

export function deletePrintTemplate(id: string) {
  if (isMockMode) return mockService.deletePrintTemplate(id)
  return apiDelete<Record<string, never>>(`/print/templates/${id}`)
}

/** 发起后端批量打印任务 */
export function createServerPrintJob(data: { templateKey: string; dataIds: string[] }) {
  if (isMockMode) return mockService.createServerPrintJob(data)
  return apiPost<{ taskId: string }, typeof data>('/print/jobs', data)
}
