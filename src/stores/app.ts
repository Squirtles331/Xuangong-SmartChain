import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({ title: '玄工智链' }),
  actions: {
    setTitle(t: string) {
      this.title = t
    }
  }
})
