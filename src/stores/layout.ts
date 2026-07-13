import { defineStore } from 'pinia'

export type LayoutMode = 'classic' | 'embedded'

const STORAGE_KEY = 'app-layout-mode'
const SUPPORTED_MODES: LayoutMode[] = ['classic', 'embedded']

const getInitialMode = (): LayoutMode => {
  const saved = localStorage.getItem(STORAGE_KEY) as LayoutMode | null
  return saved && SUPPORTED_MODES.includes(saved) ? saved : 'classic'
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    mode: getInitialMode()
  }),
  getters: {
    showBreadcrumb: (state) => {
      return state.mode !== 'embedded'
    }
  },
  actions: {
    setMode(mode: LayoutMode) {
      const nextMode = SUPPORTED_MODES.includes(mode) ? mode : 'classic'
      this.mode = nextMode
      localStorage.setItem(STORAGE_KEY, nextMode)
    }
  }
})
