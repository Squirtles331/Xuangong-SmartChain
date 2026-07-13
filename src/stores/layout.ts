import { defineStore } from 'pinia'

export type LayoutMode = 'classic' | 'double-row' | 'double-column'

const STORAGE_KEY = 'app-layout-mode'
const SUPPORTED_MODES: LayoutMode[] = ['classic', 'double-row', 'double-column']

const getInitialMode = (): LayoutMode => {
  const saved = localStorage.getItem(STORAGE_KEY) as LayoutMode | 'embedded' | null
  if (saved === 'embedded') return 'double-row'
  return saved && SUPPORTED_MODES.includes(saved) ? saved : 'classic'
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    mode: getInitialMode()
  }),
  getters: {
    showBreadcrumb: () => true
  },
  actions: {
    setMode(mode: LayoutMode) {
      const nextMode = SUPPORTED_MODES.includes(mode) ? mode : 'classic'
      this.mode = nextMode
      localStorage.setItem(STORAGE_KEY, nextMode)
    }
  }
})
