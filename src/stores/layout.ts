import { defineStore } from 'pinia'

export type LayoutMode = 'vertical' | 'classic' | 'horizontal' | 'columns' | 'mixed' | 'embedded'

const STORAGE_KEY = 'app-layout-mode'

const getInitialMode = (): LayoutMode => {
  const saved = localStorage.getItem(STORAGE_KEY) as LayoutMode | null
  return saved && ['vertical', 'classic', 'horizontal', 'columns', 'mixed', 'embedded'].includes(saved) ? saved : 'classic'
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    mode: getInitialMode()
  }),
  getters: {
    showBreadcrumb: (state) => {
      return !['horizontal', 'embedded'].includes(state.mode)
    }
  },
  actions: {
    setMode(mode: LayoutMode) {
      this.mode = mode
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }
})
