import { o as r } from './vue-chunks-CWn_TkJU.js'
var o = 'app-layout-mode',
  a = ['classic', 'double-row', 'double-column'],
  s = () => {
    const e = localStorage.getItem(o)
    return e === 'embedded' ? 'double-row' : e && a.includes(e) ? e : 'classic'
  },
  l = r('layout', {
    state: () => ({ mode: s() }),
    getters: { showBreadcrumb: () => !0 },
    actions: {
      setMode(e) {
        const t = a.includes(e) ? e : 'classic'
        ;((this.mode = t), localStorage.setItem(o, t))
      }
    }
  })
export { l as t }
