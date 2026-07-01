import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ElementRegion, ElementType, PrintElement, PrintTemplate } from '@/api/print'

/**
 * 打印设计器状态：模板、选中、缩放、撤销重做。
 * 历史用快照栈（模板 JSON 序列化），限制深度 50。
 */

const HISTORY_LIMIT = 50
let elementSeq = 0

function genElementId(type: ElementType): string {
  elementSeq += 1
  return `${type}-${Date.now().toString(36)}-${elementSeq}`
}

/** 各元素类型的默认属性（新增时用） */
function createElement(type: ElementType, x: number, y: number, region: ElementRegion): PrintElement {
  const base = {
    id: genElementId(type),
    region,
    zIndex: 1,
    style: { fontSize: 10 } as PrintElement['style']
  }
  switch (type) {
    case 'text':
      return { ...base, type, rect: { x, y, w: 40, h: 8 }, content: '文本' }
    case 'field':
      return { ...base, type, rect: { x, y, w: 40, h: 8 }, expression: '{{ data.field }}' }
    case 'table':
      return {
        ...base,
        type,
        rect: { x, y, w: 160, h: 40 },
        dataKey: '{{ data.items }}',
        repeatHeader: true,
        rowHeight: 8,
        columns: [
          { id: 'col-1', title: '列1', expression: '{{ row.a }}', width: 80 },
          { id: 'col-2', title: '列2', expression: '{{ row.b }}', width: 80, align: 'right' }
        ]
      }
    case 'image':
      return { ...base, type, rect: { x, y, w: 30, h: 30 }, src: '', fit: 'contain' }
    case 'barcode':
      return { ...base, type, rect: { x, y, w: 40, h: 15 }, expression: '{{ data.code }}', symbology: 'CODE128', showText: true }
    case 'qrcode':
      return { ...base, type, rect: { x, y, w: 20, h: 20 }, expression: '{{ data.code }}', level: 'M' }
    case 'line':
      return { ...base, type, rect: { x, y, w: 40, h: 0.5 }, lineStyle: 'solid', lineWidth: 0.3, lineColor: '#333333' }
    case 'rect':
      return {
        ...base,
        type,
        rect: { x, y, w: 40, h: 20 },
        style: {
          border: {
            top: { width: 0.3, style: 'solid', color: '#333' },
            right: { width: 0.3, style: 'solid', color: '#333' },
            bottom: { width: 0.3, style: 'solid', color: '#333' },
            left: { width: 0.3, style: 'solid', color: '#333' }
          }
        }
      }
    case 'html':
      return { ...base, type, rect: { x, y, w: 60, h: 20 }, html: '<b>富文本</b>' }
    default:
      return { ...base, type: 'text', rect: { x, y, w: 40, h: 8 }, content: '文本' } as PrintElement
  }
}

/* PLACEHOLDER_STORE */

export const usePrintDesignerStore = defineStore('printDesigner', () => {
  const template = ref<PrintTemplate | null>(null)
  const selectedIds = ref<string[]>([])
  const zoom = ref(1)
  const dirty = ref(false)

  // 历史栈
  const undoStack = ref<string[]>([])
  const redoStack = ref<string[]>([])

  const selectedElements = computed<PrintElement[]>(() => {
    if (!template.value) return []
    return template.value.elements.filter((el) => selectedIds.value.includes(el.id))
  })

  const primarySelected = computed<PrintElement | null>(() => selectedElements.value[0] ?? null)

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  function snapshot(): string {
    return JSON.stringify(template.value)
  }

  /** 变更前调用，把当前状态压入撤销栈 */
  function commit(): void {
    if (!template.value) return
    undoStack.value.push(snapshot())
    if (undoStack.value.length > HISTORY_LIMIT) undoStack.value.shift()
    redoStack.value = []
    dirty.value = true
  }

  function load(tpl: PrintTemplate): void {
    template.value = tpl
    selectedIds.value = []
    undoStack.value = []
    redoStack.value = []
    zoom.value = 1
    dirty.value = false
  }

  function undo(): void {
    if (!undoStack.value.length || !template.value) return
    redoStack.value.push(snapshot())
    template.value = JSON.parse(undoStack.value.pop() as string)
    selectedIds.value = []
  }

  function redo(): void {
    if (!redoStack.value.length || !template.value) return
    undoStack.value.push(snapshot())
    template.value = JSON.parse(redoStack.value.pop() as string)
    selectedIds.value = []
  }

  function selectElements(ids: string[]): void {
    selectedIds.value = ids
  }

  function toggleSelect(id: string): void {
    const idx = selectedIds.value.indexOf(id)
    if (idx > -1) selectedIds.value.splice(idx, 1)
    else selectedIds.value.push(id)
  }

  function addElement(type: ElementType, region: ElementRegion = 'body', x = 5, y = 5): void {
    if (!template.value) return
    commit()
    const el = createElement(type, x, y, region)
    template.value.elements.push(el)
    selectedIds.value = [el.id]
  }

  function updateElement(id: string, patch: Partial<PrintElement>): void {
    if (!template.value) return
    const el = template.value.elements.find((e) => e.id === id)
    if (!el) return
    Object.assign(el, patch)
    dirty.value = true
  }

  /** 移动/缩放专用：只改 rect（拖动结束时先 commit 一次） */
  function setRect(id: string, rect: PrintElement['rect']): void {
    if (!template.value) return
    const el = template.value.elements.find((e) => e.id === id)
    if (el) {
      el.rect = rect
      dirty.value = true
    }
  }

  function removeSelected(): void {
    if (!template.value || !selectedIds.value.length) return
    commit()
    template.value.elements = template.value.elements.filter((el) => !selectedIds.value.includes(el.id))
    selectedIds.value = []
  }

  function bringForward(id: string, delta: number): void {
    if (!template.value) return
    commit()
    const el = template.value.elements.find((e) => e.id === id)
    if (el) el.zIndex = Math.max(0, (el.zIndex ?? 1) + delta)
  }

  function updatePage(patch: Partial<PrintTemplate['page']>): void {
    if (!template.value) return
    Object.assign(template.value.page, patch)
    dirty.value = true
  }

  function setZoom(z: number): void {
    zoom.value = Math.min(2, Math.max(0.3, z))
  }

  return {
    template,
    selectedIds,
    selectedElements,
    primarySelected,
    zoom,
    dirty,
    canUndo,
    canRedo,
    load,
    commit,
    undo,
    redo,
    selectElements,
    toggleSelect,
    addElement,
    updateElement,
    setRect,
    removeSelected,
    bringForward,
    updatePage,
    setZoom
  }
})
