import {
  B as K,
  Bn as a,
  Kn as q,
  On as w,
  U as Y,
  W as z,
  Xn as v,
  Yn as F,
  an as y,
  dn as o,
  i as C,
  on as G,
  ot as H,
  pn as J,
  rr as u,
  sr as p,
  un as d
} from './element-plus-CzL7BOKu.js'
import { i as Q } from './vue-chunks-CWn_TkJU.js'
import { t as Z } from './useTable-Hzr4fBAy.js'
import { t as b } from './StatusTag-DWd3m1xj.js'
import { t as ee } from './CrudPage-7Q0FEhS_.js'
import { c as g, n as _, s as x, t as S } from './second-batch-static-BT92aayT.js'
var te = J({
    __name: 'index',
    setup(ae) {
      const E = Q(),
        h = v(x(g)),
        m = v(!1),
        s = v(null),
        c = v(''),
        W = Array.from(new Set(g.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        O = [{ label: '全部', value: '' }, ..._.map((e) => ({ label: e.label, value: e.value }))],
        N = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索异常号 / 工单号 / 来源对象', clearable: !0 } },
          { type: 'select-v2', label: '等级', field: 'level', props: { options: S, clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: W, clearable: !0 } }
        ],
        V = [
          { prop: 'exception_code', label: '异常号', minWidth: 150 },
          { label: '等级', minWidth: 90, slotName: 'level', align: 'center' },
          { prop: 'source_object', label: '来源对象', minWidth: 140 },
          { prop: 'wo_code', label: '工单号', minWidth: 150 },
          { prop: 'operation_name', label: '工序', minWidth: 120 },
          { label: '状态', minWidth: 110, slotName: 'status', align: 'center' },
          { prop: 'lock_scope', label: '锁定范围', minWidth: 180 },
          { prop: 'owner_name', label: '责任人', minWidth: 120 },
          { prop: 'discovered_at', label: '识别时间', minWidth: 150 },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = F({ keyword: '', level: '', workshop: '' })
      const {
        tableData: T,
        pagination: R,
        loading: D,
        search: f,
        refresh: P
      } = Z({
        rowKey: 'id',
        listAPI: async ({ page: e, size: t }) => {
          const i = h.value.filter(B),
            r = (e - 1) * t
          return { list: i.slice(r, r + t), total: i.length }
        }
      })
      function B(e) {
        const t = n.keyword.trim().toLowerCase()
        return !(
          (t && ![e.exception_code, e.wo_code, e.source_object].join(' ').toLowerCase().includes(t)) ||
          (c.value && e.status !== c.value) ||
          (n.level && e.level !== n.level) ||
          (n.workshop && e.workshop_name !== n.workshop)
        )
      }
      function I(e) {
        ;((s.value = e), (m.value = !0))
      }
      function U(e) {
        E.push(`/mes/work-order/${e}`)
      }
      function L(e) {
        const t = ['identified', 'locked', 'processing', 'awaiting_release', 'released', 'closed'],
          i = t.indexOf(e.status)
        ;((e.status = t[Math.min(i + 1, t.length - 1)]),
          (e.action_summary = `静态演示：异常已推进到“${_.find((r) => r.value === e.status)?.label || e.status}”`),
          s.value?.id === e.id && (s.value = e),
          C.success('异常状态已推进'),
          P())
      }
      function $() {
        ;((h.value = x(g)), (m.value = !1), (s.value = null), C.success('异常视图已刷新'), f())
      }
      function j() {
        f()
      }
      function A() {
        ;((n.keyword = ''), (n.level = ''), (n.workshop = ''), (c.value = ''), f())
      }
      return (e, t) => {
        const i = H,
          r = z,
          M = Y,
          X = K
        return (
          w(),
          y(
            ee,
            {
              'search-model': u(n),
              'onUpdate:searchModel': t[1] || (t[1] = (l) => (q(n) ? (n.value = l) : (n = l))),
              'segmented-value': c.value,
              'onUpdate:segmentedValue': t[2] || (t[2] = (l) => (c.value = l)),
              title: '异常中心',
              'search-columns': N,
              columns: V,
              data: u(T),
              pagination: u(R),
              loading: u(D),
              'show-add-button': !1,
              'segmented-options': O,
              onSearch: u(f),
              onReset: A,
              onRefresh: $,
              onSegmentedChange: j
            },
            {
              level: a(({ row: l }) => [o(b, { value: l.level, options: u(S) }, null, 8, ['value', 'options'])]),
              status: a(({ row: l }) => [o(b, { value: l.status, options: u(_) }, null, 8, ['value', 'options'])]),
              actions: a(({ row: l }) => [
                o(i, { link: '', type: 'primary', onClick: (k) => I(l) }, { default: a(() => [...(t[3] || (t[3] = [d('详情', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ]),
                o(
                  i,
                  { link: '', type: 'warning', onClick: (k) => L(l) },
                  { default: a(() => [...(t[4] || (t[4] = [d('推进状态', -1)]))]), _: 1 },
                  8,
                  ['onClick']
                ),
                o(i, { link: '', onClick: (k) => U(l.wo_id) }, { default: a(() => [...(t[5] || (t[5] = [d('工单', -1)]))]), _: 1 }, 8, ['onClick'])
              ]),
              dialog: a(() => [
                o(
                  X,
                  { modelValue: m.value, 'onUpdate:modelValue': t[0] || (t[0] = (l) => (m.value = l)), title: '异常详情', size: '460px' },
                  {
                    default: a(() => [
                      s.value
                        ? (w(),
                          y(
                            M,
                            { key: 0, column: 1, border: '' },
                            {
                              default: a(() => [
                                o(r, { label: '异常号' }, { default: a(() => [d(p(s.value.exception_code), 1)]), _: 1 }),
                                o(
                                  r,
                                  { label: '当前状态' },
                                  { default: a(() => [o(b, { value: s.value.status, options: u(_) }, null, 8, ['value', 'options'])]), _: 1 }
                                ),
                                o(r, { label: '锁定范围' }, { default: a(() => [d(p(s.value.lock_scope), 1)]), _: 1 }),
                                o(r, { label: '责任人' }, { default: a(() => [d(p(s.value.owner_name), 1)]), _: 1 }),
                                o(r, { label: '放行前提' }, { default: a(() => [d(p(s.value.release_gate), 1)]), _: 1 }),
                                o(r, { label: '处理摘要' }, { default: a(() => [d(p(s.value.action_summary), 1)]), _: 1 })
                              ]),
                              _: 1
                            }
                          ))
                        : G('', !0)
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
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
  ue = te
export { ue as default }
