import {
  Bn as a,
  Mn as u,
  On as W,
  Tn as M,
  Xn as f,
  an as N,
  b as z,
  dn as e,
  i as E,
  in as s,
  it as B,
  or as T,
  ot as q,
  pn as P,
  sr as r,
  tt as R,
  un as g,
  y as k
} from './element-plus-CzL7BOKu.js'
import { c as S } from './mrp-CaR7BBur.js'
var V = { style: { padding: '8px 24px' } },
  D = P({
    __name: 'index',
    setup(O) {
      const d = f([]),
        p = f([]),
        b = [
          { prop: 'type', label: '变更类型', minWidth: 140 },
          { prop: 'detail', label: '变更内容', minWidth: 320 },
          { prop: 'time', label: '时间', minWidth: 170 }
        ],
        y = [
          { type: 'expand', slotName: 'expand' },
          { prop: 'material', label: '物料', minWidth: 160 },
          { prop: 'old_qty', label: '原数量', minWidth: 90, align: 'center' },
          { prop: 'new_qty', label: '新数量', minWidth: 90, align: 'center' },
          { prop: 'diff', label: '差异', minWidth: 90, align: 'center' },
          { label: '动作', minWidth: 90, slotName: 'action', align: 'center' }
        ]
      async function c() {
        const i = await S({ pageNum: 1, pageSize: 100 })
        ;((d.value = i.data.events || []), (p.value = i.data.affected || []))
      }
      async function h() {
        ;(await c(), E.success('净变更 MRP 已完成'))
      }
      return (
        M(() => {
          c()
        }),
        (i, l) => {
          const v = q,
            _ = u('gi-table'),
            m = R,
            x = B,
            n = z,
            w = k,
            C = u('gi-page-layout')
          return (
            W(),
            N(C, null, {
              header: a(() => [
                ...(l[0] ||
                  (l[0] = [
                    s('h3', null, '净变更 MRP', -1),
                    s('p', { style: { color: '#909399', margin: '4px 0' } }, '仅对发生变化的需求与供给信号重新计算。', -1)
                  ]))
              ]),
              tool: a(() => [e(v, { type: 'primary', onClick: h }, { default: a(() => [...(l[1] || (l[1] = [g('执行净变更 MRP', -1)]))]), _: 1 })]),
              default: a(() => [
                e(
                  m,
                  { header: '变更事件', shadow: 'never', style: { 'margin-bottom': '16px' } },
                  { default: a(() => [e(_, { columns: b, data: d.value, border: '', stripe: '', size: 'small' }, null, 8, ['data'])]), _: 1 }
                ),
                e(
                  m,
                  { header: '受影响物料', shadow: 'never' },
                  {
                    default: a(() => [
                      e(
                        _,
                        { columns: y, data: p.value, border: '', stripe: '', size: 'small' },
                        {
                          action: a(({ row: t }) => [
                            e(
                              x,
                              { type: t.action === 'increase' ? 'success' : t.action === 'decrease' ? 'danger' : 'warning', size: 'small' },
                              { default: a(() => [g(r(t.action === 'increase' ? '增加' : t.action === 'decrease' ? '减少' : '保持'), 1)]), _: 2 },
                              1032,
                              ['type']
                            )
                          ]),
                          expand: a(({ row: t }) => [
                            s('div', V, [
                              e(
                                w,
                                { data: t.details || [], border: '', size: 'small' },
                                {
                                  default: a(() => [
                                    e(n, { prop: 'source', label: '来源', 'min-width': '180' }),
                                    e(n, { prop: 'old_qty', label: '原数量', 'min-width': '90', align: 'center' }),
                                    e(n, { prop: 'new_qty', label: '新数量', 'min-width': '90', align: 'center' }),
                                    e(
                                      n,
                                      { prop: 'diff', label: '差异', 'min-width': '90', align: 'center' },
                                      {
                                        default: a(({ row: o }) => [
                                          s(
                                            'span',
                                            { style: T({ color: o.diff > 0 ? '#67c23a' : o.diff < 0 ? '#f56c6c' : '#909399' }) },
                                            r(o.diff > 0 ? '+' : '') + r(o.diff),
                                            5
                                          )
                                        ]),
                                        _: 1
                                      }
                                    ),
                                    e(n, { prop: 'reason', label: '原因', 'min-width': '180' })
                                  ]),
                                  _: 1
                                },
                                8,
                                ['data']
                              )
                            ])
                          ]),
                          _: 1
                        },
                        8,
                        ['data']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  A = D
export { A as default }
