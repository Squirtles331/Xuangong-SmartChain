import {
  Bn as l,
  Kn as V,
  On as D,
  Xn as h,
  Yn as K,
  an as L,
  dn as i,
  i as p,
  ot as U,
  pn as $,
  rr as s,
  sr as q,
  un as c
} from './element-plus-CzL7BOKu.js'
import { i as E } from './vue-chunks-CWn_TkJU.js'
import { t as M } from './useTable-Hzr4fBAy.js'
import { t as _ } from './StatusTag-DWd3m1xj.js'
import { t as j } from './CrudPage-7Q0FEhS_.js'
import { o as k, r as b, s as v, u as f } from './second-batch-static-BT92aayT.js'
var F = $({
    __name: 'index',
    setup(G) {
      const y = E(),
        m = h(v(f)),
        r = h(''),
        w = Array.from(new Set(f.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        W = [{ label: '全部', value: '' }, ...k.map((e) => ({ label: e.label, value: e.value }))],
        C = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索批次号 / 工单号 / 产品名称', clearable: !0 } },
          { type: 'select-v2', label: '信号等级', field: 'signal', props: { options: b, clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: w, clearable: !0 } }
        ],
        S = [
          { prop: 'batch_code', label: 'WIP批次号', minWidth: 150 },
          { prop: 'wo_code', label: '工单号', minWidth: 150 },
          { prop: 'material_name', label: '产品名称', minWidth: 150 },
          { prop: 'current_operation', label: '当前工序', minWidth: 140 },
          { prop: 'next_operation', label: '下一工序', minWidth: 140 },
          { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
          { label: '批次状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '监控信号', minWidth: 100, slotName: 'signal', align: 'center' },
          { prop: 'hold_owner', label: '持有岗位', minWidth: 120 },
          { prop: 'last_report_time', label: '最近报工', minWidth: 150 },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = K({ keyword: '', signal: '', workshop: '' })
      const {
        tableData: N,
        pagination: P,
        loading: x,
        search: u,
        refresh: d
      } = M({
        rowKey: 'id',
        listAPI: async ({ page: e, size: a }) => {
          const o = m.value.filter(B),
            t = (e - 1) * a
          return { list: o.slice(t, t + a), total: o.length }
        }
      })
      function B(e) {
        const a = n.keyword.trim().toLowerCase()
        return !(
          (a && ![e.batch_code, e.wo_code, e.material_name].join(' ').toLowerCase().includes(a)) ||
          (r.value && e.status !== r.value) ||
          (n.signal && e.signal !== n.signal) ||
          (n.workshop && e.workshop_name !== n.workshop)
        )
      }
      function I(e) {
        y.push(`/mes/work-order/${e}`)
      }
      function O(e) {
        if (e.status === 'frozen') {
          ;((e.status = 'processing'), (e.freeze_reason = ''), (e.signal = 'attention'), p.success('已解除冻结，批次恢复执行流转'), d())
          return
        }
        ;((e.status = 'frozen'),
          (e.freeze_reason = '静态演示：待异常中心确认后释放'),
          (e.signal = 'overdue'),
          p.success('已冻结批次并同步至异常关注'),
          d())
      }
      function R(e) {
        ;((e.status = 'rework'),
          (e.rework_route = e.rework_route || '静态演示：返工回流 -> 复检 -> 放行'),
          (e.signal = 'attention'),
          p.success('已标记返工回流路径'),
          d())
      }
      function T() {
        ;((m.value = v(f)), p.success('WIP 视图已刷新'), u())
      }
      function z() {
        u()
      }
      function A() {
        ;((n.keyword = ''), (n.signal = ''), (n.workshop = ''), (r.value = ''), u())
      }
      return (e, a) => {
        const o = U
        return (
          D(),
          L(
            j,
            {
              'search-model': s(n),
              'onUpdate:searchModel': a[0] || (a[0] = (t) => (V(n) ? (n.value = t) : (n = t))),
              'segmented-value': r.value,
              'onUpdate:segmentedValue': a[1] || (a[1] = (t) => (r.value = t)),
              title: 'WIP',
              'search-columns': C,
              columns: S,
              data: s(N),
              pagination: s(P),
              loading: s(x),
              'show-add-button': !1,
              'segmented-options': W,
              onSearch: s(u),
              onReset: A,
              onRefresh: T,
              onSegmentedChange: z
            },
            {
              status: l(({ row: t }) => [i(_, { value: t.status, options: s(k) }, null, 8, ['value', 'options'])]),
              signal: l(({ row: t }) => [i(_, { value: t.signal, options: s(b) }, null, 8, ['value', 'options'])]),
              actions: l(({ row: t }) => [
                i(
                  o,
                  { link: '', type: 'primary', onClick: (g) => I(t.wo_id) },
                  { default: l(() => [...(a[2] || (a[2] = [c('工单', -1)]))]), _: 1 },
                  8,
                  ['onClick']
                ),
                i(
                  o,
                  { link: '', type: t.status === 'frozen' ? 'success' : 'danger', onClick: (g) => O(t) },
                  { default: l(() => [c(q(t.status === 'frozen' ? '解除冻结' : '冻结'), 1)]), _: 2 },
                  1032,
                  ['type', 'onClick']
                ),
                i(
                  o,
                  { link: '', type: 'warning', onClick: (g) => R(t) },
                  { default: l(() => [...(a[3] || (a[3] = [c('返工回流', -1)]))]), _: 1 },
                  8,
                  ['onClick']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'segmented-value', 'data', 'pagination', 'loading', 'onSearch']
          )
        )
      }
    }
  }),
  ee = F
export { ee as default }
