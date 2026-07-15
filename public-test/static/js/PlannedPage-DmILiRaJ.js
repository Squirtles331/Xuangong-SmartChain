import {
  An as g,
  Bn as t,
  I as B,
  Mn as E,
  On as l,
  an as p,
  dn as u,
  in as n,
  it as I,
  on as x,
  pn as j,
  rn as s,
  sn as d,
  sr as o,
  tn as f,
  tt as C,
  un as _
} from './element-plus-CzL7BOKu.js'
import { r as O } from './vue-chunks-CWn_TkJU.js'
import { I as T } from './index-DqMfCNbk.js'
var V = { class: 'planned-header' },
  A = { class: 'planned-title' },
  M = { class: 'planned-desc' },
  z = { class: 'planned-content' },
  F = { class: 'planned-side-stack' },
  L = { key: 0, class: 'planned-items' },
  R = { class: 'ownership-list' },
  X = { class: 'ownership-label' },
  q = { class: 'ownership-value' },
  G = j({
    __name: 'PlannedPage',
    setup(H) {
      const e = {
          waiting: '等待建设',
          currentPlan: '当前规划',
          ownershipInfo: '页面归属',
          pageBuilding: '页面建设中',
          defaultDesc: '当前先完成系统骨架搭建，后续再按业务优先级逐步补齐功能实现。',
          emptyDesc: '该页面已纳入系统菜单与路由骨架，功能将在后续版本逐步建设。',
          noPlan: '暂未补充详细建设项',
          ownerSystem: '主责系统',
          collaboratorSystems: '协同系统',
          coreObject: '核心对象',
          boundaryNote: '边界说明'
        },
        b = O(),
        a = s(() => b.meta),
        w = s(() => a.value.title?.toString() || e.pageBuilding),
        k = s(() => a.value.placeholderDesc || e.defaultDesc),
        P = s(() => e.emptyDesc),
        S = s(() => e.noPlan),
        v = s(() => a.value.plannedItems || []),
        m = s(() => {
          const r = a.value.collaboratorSystems
          return Array.isArray(r) ? r.join(' / ') : typeof r == 'string' ? r : ''
        }),
        h = s(() =>
          [
            a.value.ownerSystem ? { label: e.ownerSystem, value: a.value.ownerSystem } : null,
            m.value ? { label: e.collaboratorSystems, value: m.value } : null,
            a.value.coreObject ? { label: e.coreObject, value: a.value.coreObject } : null,
            a.value.boundaryNote ? { label: e.boundaryNote, value: a.value.boundaryNote } : null
          ].filter((r) => r !== null)
        )
      return (r, J) => {
        const D = I,
          y = B,
          i = C,
          N = E('gi-page-layout')
        return (
          l(),
          p(N, null, {
            header: t(() => [
              n('div', V, [
                n('div', null, [n('h2', A, o(w.value), 1), n('p', M, o(k.value), 1)]),
                u(D, { type: 'warning', effect: 'dark', round: '' }, { default: t(() => [_(o(e.waiting), 1)]), _: 1 })
              ])
            ]),
            default: t(() => [
              n('div', z, [
                u(
                  i,
                  { shadow: 'never', class: 'planned-main' },
                  { default: t(() => [u(y, { description: P.value }, null, 8, ['description'])]), _: 1 }
                ),
                n('div', F, [
                  u(
                    i,
                    { shadow: 'never', class: 'planned-side' },
                    {
                      header: t(() => [_(o(e.currentPlan), 1)]),
                      default: t(() => [
                        v.value.length
                          ? (l(),
                            d('div', L, [
                              (l(!0),
                              d(
                                f,
                                null,
                                g(v.value, (c) => (l(), d('div', { key: c, class: 'planned-item' }, o(c), 1))),
                                128
                              ))
                            ]))
                          : (l(), p(y, { key: 1, description: S.value, 'image-size': 72 }, null, 8, ['description']))
                      ]),
                      _: 1
                    }
                  ),
                  h.value.length
                    ? (l(),
                      p(
                        i,
                        { key: 0, shadow: 'never', class: 'planned-side' },
                        {
                          header: t(() => [_(o(e.ownershipInfo), 1)]),
                          default: t(() => [
                            n('div', R, [
                              (l(!0),
                              d(
                                f,
                                null,
                                g(
                                  h.value,
                                  (c) => (
                                    l(),
                                    d('div', { key: c.label, class: 'ownership-item' }, [n('div', X, o(c.label), 1), n('div', q, o(c.value), 1)])
                                  )
                                ),
                                128
                              ))
                            ])
                          ]),
                          _: 1
                        }
                      ))
                    : x('', !0)
                ])
              ])
            ]),
            _: 1
          })
        )
      }
    }
  }),
  W = T(G, [['__scopeId', 'data-v-677b5ceb']])
export { W as default }
