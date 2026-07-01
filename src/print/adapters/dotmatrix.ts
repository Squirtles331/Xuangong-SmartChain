import type { PrintTemplate } from '@/api/print'
import { printElement } from './browser'

/**
 * 针式 / 连续纸套打适配器
 *
 * 图形模式（本期）：与普通打印同路走浏览器，靠模板的 mm 精确定位对齐预印刷表单。
 * 设计器可上传底纹图（PageConfig.background）辅助对位；打印时是否保留底纹由参数控制
 * （真实套打通常不打底纹，只打数据；对位校准时才显示底纹）。
 *
 * ESC/P 文本模式：针对老式针式打印机直连，生成指令流由后端/插件下发，
 * 预留接口，本期不实现。
 */

export interface DotMatrixOptions {
  /** 打印时是否保留背景底纹（默认 false：只打数据，套在预印表单上） */
  keepBackground?: boolean
}

export function printDotMatrix(sourceEl: HTMLElement, template: PrintTemplate, options: DotMatrixOptions = {}): void {
  const keepBackground = options.keepBackground ?? false

  if (!keepBackground) {
    // 克隆一份并移除底纹，避免把底纹也打到预印表单上
    const clone = sourceEl.cloneNode(true) as HTMLElement
    clone.querySelectorAll('.print-bg').forEach((n) => n.remove())
    printElement(clone, template)
    return
  }

  printElement(sourceEl, template)
}

/**
 * ESC/P 指令生成占位（后续增强）。
 * 针式打印机文本模式下，把纯文本行按列位对齐生成 ESC/P 字节流。
 */
export function buildEscP(): never {
  throw new Error('ESC/P 文本模式尚未实现（预留接口）')
}
