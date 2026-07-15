import {
  Bn as a,
  Mn as N,
  On as m,
  Tn as q,
  Xn as s,
  _ as A,
  an as v,
  dn as n,
  i as r,
  in as i,
  it as U,
  on as X,
  or as P,
  ot as j,
  pn as F,
  sr as f,
  un as o,
  v as G
} from './element-plus-CzL7BOKu.js'
import { I as H } from './index-DqMfCNbk.js'
import { l as R, o as J, t as T } from './mrp-CaR7BBur.js'
var K = { class: 'mrp-header' },
  Q = { style: { 'margin-bottom': '12px' } },
  Y = { style: { 'margin-bottom': '12px' } },
  Z = F({
    __name: 'index',
    setup(ee) {
      const w = s('purchase'),
        u = s(''),
        c = s(''),
        C = s([]),
        k = s([]),
        _ = s([]),
        W = [
          { type: 'selection', width: 50 },
          { prop: 'code', label: '物料编码', width: 180 },
          { prop: 'name', label: '物料名称', minWidth: 140 },
          { prop: 'qty', label: '建议采购量', minWidth: 110, align: 'center' },
          { prop: 'order_date', label: '建议下单', width: 110 },
          { prop: 'need_date', label: '需求日期', width: 110 },
          { prop: 'supplier', label: '建议供应商', width: 150 },
          { prop: 'source', label: '来源需求', width: 150 },
          { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
        ],
        S = [
          { type: 'selection', width: 50 },
          { prop: 'code', label: '产品编码', width: 180 },
          { prop: 'name', label: '产品名称', minWidth: 140 },
          { prop: 'qty', label: '建议生产量', minWidth: 110, align: 'center' },
          { prop: 'start_date', label: '建议开工', width: 110 },
          { prop: 'end_date', label: '建议完工', width: 110 },
          { prop: 'bom', label: 'BOM 版本', width: 110 },
          { prop: 'routing', label: '工艺版本', width: 130 },
          { prop: 'source', label: '来源需求', width: 150 },
          { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
        ],
        $ = [
          { label: '类型', width: 100, slotName: 'type' },
          { prop: 'material', label: '物料', width: 150 },
          { label: '详情', minWidth: 250, slotName: 'detail' },
          { label: '建议动作', minWidth: 200, slotName: 'action' }
        ]
      function V(t) {
        return t === 'severe' ? 'danger' : t === 'warning' ? 'warning' : 'info'
      }
      function z(t) {
        return t === 'severe' ? '#f56c6c' : t === 'warning' ? '#e6a23c' : '#909399'
      }
      const g = s([])
      function B(t) {
        g.value = t
      }
      async function y(t) {
        if (u.value)
          try {
            const e = await J(u.value, { type: t, pageNum: 1, pageSize: 100 })
            t === 'purchase' ? (C.value = e.data.list) : t === 'production' ? (k.value = e.data.list) : (_.value = e.data.list)
          } catch {
            r.error('获取 MRP 结果失败')
          }
      }
      function E(t) {
        y(t)
      }
      async function M(t, e) {
        try {
          ;(await T(u.value, [e.id]), r.success(t === 'purchase' ? '已生成采购申请' : '已生成工单'))
        } catch {
          r.error('确认失败')
        }
      }
      async function x(t) {
        if (t === 'purchase' && g.value.length === 0) {
          r.warning('请先选择要生成的采购建议')
          return
        }
        try {
          const e = g.value.map((d) => d.id)
          ;(await T(u.value, e), r.success(t === 'purchase' ? `已批量生成 ${e.length} 个采购申请` : '已批量生成工单'))
        } catch {
          r.error('批量确认失败')
        }
      }
      async function I() {
        try {
          ;((u.value = (await R()).data.runId),
            (c.value = new Date().toLocaleString('zh-CN')),
            r.success('MRP 运算已启动，请稍后查看结果'),
            y('purchase'))
        } catch {
          r.error('MRP 运算启动失败')
        }
      }
      return (
        q(async () => {
          try {
            ;((u.value = (await R()).data.runId), (c.value = new Date().toLocaleString('zh-CN')), y('purchase'))
          } catch {}
        }),
        (t, e) => {
          const d = U,
            p = j,
            b = N('gi-table'),
            h = A,
            L = G,
            D = N('gi-page-layout')
          return (
            m(),
            v(D, null, {
              header: a(() => [
                i('div', K, [
                  e[6] || (e[6] = i('h2', null, 'MRP 运算结果', -1)),
                  i('div', null, [
                    c.value
                      ? (m(),
                        v(
                          d,
                          { key: 0, type: 'success', style: { 'margin-right': '8px' } },
                          { default: a(() => [o('最近运行 ' + f(c.value), 1)]), _: 1 }
                        ))
                      : X('', !0),
                    n(p, { type: 'primary', onClick: I }, { default: a(() => [...(e[4] || (e[4] = [o('运行 MRP', -1)]))]), _: 1 }),
                    n(
                      p,
                      { onClick: e[0] || (e[0] = (l) => t.$router.push('/engineering-plan/planning/mrp/history')) },
                      { default: a(() => [...(e[5] || (e[5] = [o('运行历史', -1)]))]), _: 1 }
                    )
                  ])
                ])
              ]),
              default: a(() => [
                n(
                  L,
                  { modelValue: w.value, 'onUpdate:modelValue': e[3] || (e[3] = (l) => (w.value = l)), onTabChange: E },
                  {
                    default: a(() => [
                      n(
                        h,
                        { label: '建议采购', name: 'purchase' },
                        {
                          default: a(() => [
                            i('div', Q, [
                              n(
                                p,
                                { type: 'primary', size: 'small', onClick: e[1] || (e[1] = (l) => x('purchase')) },
                                { default: a(() => [...(e[7] || (e[7] = [o('批量生成采购申请', -1)]))]), _: 1 }
                              )
                            ]),
                            n(
                              b,
                              { columns: W, data: C.value, border: '', stripe: '', size: 'small', onSelectionChange: B },
                              {
                                actions: a(({ row: l }) => [
                                  n(
                                    p,
                                    { type: 'primary', link: '', size: 'small', onClick: (O) => M('purchase', l) },
                                    { default: a(() => [...(e[8] || (e[8] = [o('生成申请', -1)]))]), _: 1 },
                                    8,
                                    ['onClick']
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['data']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      n(
                        h,
                        { label: '建议生产', name: 'production' },
                        {
                          default: a(() => [
                            i('div', Y, [
                              n(
                                p,
                                { type: 'primary', size: 'small', onClick: e[2] || (e[2] = (l) => x('production')) },
                                { default: a(() => [...(e[9] || (e[9] = [o('批量生成工单', -1)]))]), _: 1 }
                              )
                            ]),
                            n(
                              b,
                              { columns: S, data: k.value, border: '', stripe: '', size: 'small' },
                              {
                                actions: a(({ row: l }) => [
                                  n(
                                    p,
                                    { type: 'primary', link: '', size: 'small', onClick: (O) => M('production', l) },
                                    { default: a(() => [...(e[10] || (e[10] = [o('生成工单', -1)]))]), _: 1 },
                                    8,
                                    ['onClick']
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['data']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      n(
                        h,
                        { label: '例外报告', name: 'exception' },
                        {
                          default: a(() => [
                            _.value.length === 0
                              ? (m(),
                                v(
                                  d,
                                  { key: 0, type: 'success', size: 'large' },
                                  { default: a(() => [...(e[11] || (e[11] = [o('无例外', -1)]))]), _: 1 }
                                ))
                              : (m(),
                                v(
                                  b,
                                  { key: 1, columns: $, data: _.value, border: '', stripe: '', size: 'small' },
                                  {
                                    type: a(({ row: l }) => [
                                      n(d, { type: V(l.level), size: 'small', effect: 'dark' }, { default: a(() => [o(f(l.type), 1)]), _: 2 }, 1032, [
                                        'type'
                                      ])
                                    ]),
                                    detail: a(({ row: l }) => [
                                      i(
                                        'span',
                                        { style: P({ color: z(l.level), fontWeight: l.level === 'severe' ? 'bold' : 'normal' }) },
                                        f(l.detail),
                                        5
                                      )
                                    ]),
                                    action: a(({ row: l }) => [i('span', { style: P({ color: z(l.level) }) }, f(l.action), 5)]),
                                    _: 1
                                  },
                                  8,
                                  ['data']
                                ))
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  ne = H(Z, [['__scopeId', 'data-v-e5321613']])
export { ne as default }
