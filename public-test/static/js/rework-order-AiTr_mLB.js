import {
  B as $,
  Bn as o,
  Kn as L,
  On as g,
  U as Y,
  W as j,
  Xn as f,
  Yn as F,
  an as y,
  dn as a,
  i as b,
  on as z,
  ot as G,
  pn as H,
  rr as c,
  sr as d,
  un as i
} from './element-plus-CzL7BOKu.js'
import { i as Z } from './vue-chunks-CWn_TkJU.js'
import { t as ee } from './useTable-Hzr4fBAy.js'
import { t as W } from './StatusTag-DWd3m1xj.js'
import { t as te } from './CrudPage-7Q0FEhS_.js'
var R = [
    { value: 'pending_decision', label: '待裁决', type: 'info' },
    { value: 'released', label: '已放行', type: 'primary' },
    { value: 'executing', label: '返工中', type: 'warning' },
    { value: 'pending_recheck', label: '待复检', type: 'danger' },
    { value: 'closed', label: '已关闭', type: 'success' }
  ],
  O = [
    { value: 'high', label: '高优先', type: 'danger' },
    { value: 'normal', label: '普通', type: 'warning' },
    { value: 'low', label: '低优先', type: 'info' }
  ],
  w = [
    {
      id: 'rw-1',
      rework_code: 'RW-20260714-001',
      status: 'executing',
      priority: 'high',
      source_type: '执行异常',
      source_code: 'EX-20260714-001',
      wo_code: 'WO202501150001',
      material_name: '离心泵 XJP-100',
      workshop_name: '机加一车间',
      qms_decision_ref: 'QMS-RWK-240714-001',
      rework_route: '首件复核 -> 精车返修 -> 复检放行',
      current_step: '精车返修中',
      owner_name: '返工组 赵六',
      planned_finish: '2026-07-14 18:30',
      recheck_owner: '质量工程师 李娜',
      close_note: '待复检通过后关闭'
    },
    {
      id: 'rw-2',
      rework_code: 'RW-20260714-002',
      status: 'released',
      priority: 'normal',
      source_type: '质量不合格',
      source_code: 'NCR-20260714-004',
      wo_code: 'WO202501140003',
      material_name: '离心泵 XJP-200',
      workshop_name: '装配车间',
      qms_decision_ref: 'QMS-RWK-240714-003',
      rework_route: '磨削返工 -> 外观修整 -> 复检',
      current_step: '待返工班组接收',
      owner_name: '返工组 孙八',
      planned_finish: '2026-07-14 17:00',
      recheck_owner: '质检员 刘梅',
      close_note: '返工已放行，待正式执行'
    },
    {
      id: 'rw-3',
      rework_code: 'RW-20260714-003',
      status: 'pending_recheck',
      priority: 'normal',
      source_type: '投料偏差',
      source_code: 'MAT-20260714-001',
      wo_code: 'WO202501150001',
      material_name: '离心泵 XJP-100',
      workshop_name: '机加一车间',
      qms_decision_ref: 'QMS-RWK-240714-006',
      rework_route: '补料修正 -> 工序补报 -> 复检确认',
      current_step: '返工完成，等待复检',
      owner_name: '物料返工岗 何琳',
      planned_finish: '2026-07-14 16:00',
      recheck_owner: '质量工程师 李娜',
      close_note: '待复检结果回传'
    },
    {
      id: 'rw-4',
      rework_code: 'RW-20260714-004',
      status: 'pending_decision',
      priority: 'low',
      source_type: '返修申请',
      source_code: 'REQ-20260714-011',
      wo_code: 'WO202501130004',
      material_name: '新型泵 NP-001',
      workshop_name: '装配车间',
      qms_decision_ref: '待 QMS 裁决',
      rework_route: '待确认是否允许返工',
      current_step: '等待质量裁决',
      owner_name: '样件组 赵晨',
      planned_finish: '2026-07-15 10:00',
      recheck_owner: '质量工程师 李娜',
      close_note: '未裁决前不进入执行'
    }
  ]
function S(h) {
  return typeof structuredClone == 'function' ? structuredClone(h) : JSON.parse(JSON.stringify(h))
}
var oe = H({
    __name: 'index',
    setup(h) {
      const C = Z(),
        k = f(S(w)),
        _ = f(!1),
        l = f(null),
        p = f(''),
        x = Array.from(new Set(w.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        N = [{ label: '全部', value: '' }, ...R.map((e) => ({ label: e.label, value: e.value }))],
        P = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索返工单号 / 来源号 / 工单号 / 产品名称', clearable: !0 } },
          { type: 'select-v2', label: '优先级', field: 'priority', props: { options: O, clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: x, clearable: !0 } }
        ],
        E = [
          { prop: 'rework_code', label: '返工单号', minWidth: 150 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '优先级', minWidth: 100, slotName: 'priority', align: 'center' },
          { prop: 'source_type', label: '来源类型', minWidth: 120 },
          { prop: 'source_code', label: '来源号', minWidth: 150 },
          { prop: 'wo_code', label: '工单号', minWidth: 150 },
          { prop: 'material_name', label: '产品名称', minWidth: 150 },
          { prop: 'workshop_name', label: '生产车间', minWidth: 140 },
          { prop: 'current_step', label: '当前步骤', minWidth: 180 },
          { prop: 'planned_finish', label: '计划完成', minWidth: 150 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = F({ keyword: '', priority: '', workshop: '' })
      const {
        tableData: M,
        pagination: T,
        loading: V,
        search: m,
        refresh: D
      } = ee({
        rowKey: 'id',
        listAPI: async ({ page: e, size: t }) => {
          const u = k.value.filter(K),
            s = (e - 1) * t
          return { list: u.slice(s, s + t), total: u.length }
        }
      })
      function K(e) {
        const t = n.keyword.trim().toLowerCase()
        return !(
          (t && ![e.rework_code, e.source_code, e.wo_code, e.material_name].join(' ').toLowerCase().includes(t)) ||
          (p.value && e.status !== p.value) ||
          (n.priority && e.priority !== n.priority) ||
          (n.workshop && e.workshop_name !== n.workshop)
        )
      }
      function q(e) {
        ;((l.value = e), (_.value = !0))
      }
      function B(e) {
        const t = ['pending_decision', 'released', 'executing', 'pending_recheck', 'closed'],
          u = t.indexOf(e.status)
        ;((e.status = t[Math.min(u + 1, t.length - 1)]),
          e.status === 'released' && (e.current_step = '已获返工放行，待班组接收'),
          e.status === 'executing' && (e.current_step = '返工执行中'),
          e.status === 'pending_recheck' && (e.current_step = '返工完成，等待复检'),
          e.status === 'closed' && (e.current_step = '返工链已关闭'),
          l.value?.id === e.id && (l.value = e),
          b.success('返工状态已推进'),
          D())
      }
      function I(e) {
        C.push(`/mes/work-order/${{ WO202501150001: '1', WO202501140003: '3', WO202501130004: '4' }[e.wo_code] || '1'}`)
      }
      function Q() {
        ;((k.value = S(w)), (_.value = !1), (l.value = null), b.success('返工执行视图已刷新'), m())
      }
      function J() {
        m()
      }
      function U() {
        ;((n.keyword = ''), (n.priority = ''), (n.workshop = ''), (p.value = ''), m())
      }
      return (e, t) => {
        const u = G,
          s = j,
          X = Y,
          A = $
        return (
          g(),
          y(
            te,
            {
              'search-model': c(n),
              'onUpdate:searchModel': t[1] || (t[1] = (r) => (L(n) ? (n.value = r) : (n = r))),
              'segmented-value': p.value,
              'onUpdate:segmentedValue': t[2] || (t[2] = (r) => (p.value = r)),
              title: '返工执行',
              'search-columns': P,
              columns: E,
              data: c(M),
              pagination: c(T),
              loading: c(V),
              'show-add-button': !1,
              'segmented-options': N,
              onSearch: c(m),
              onReset: U,
              onRefresh: Q,
              onSegmentedChange: J
            },
            {
              status: o(({ row: r }) => [a(W, { value: r.status, options: c(R) }, null, 8, ['value', 'options'])]),
              priority: o(({ row: r }) => [a(W, { value: r.priority, options: c(O) }, null, 8, ['value', 'options'])]),
              actions: o(({ row: r }) => [
                a(u, { link: '', type: 'primary', onClick: (v) => q(r) }, { default: o(() => [...(t[3] || (t[3] = [i('详情', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ]),
                a(u, { link: '', type: 'warning', onClick: (v) => B(r) }, { default: o(() => [...(t[4] || (t[4] = [i('推进', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ]),
                a(u, { link: '', onClick: (v) => I(r) }, { default: o(() => [...(t[5] || (t[5] = [i('工单', -1)]))]), _: 1 }, 8, ['onClick'])
              ]),
              dialog: o(() => [
                a(
                  A,
                  { modelValue: _.value, 'onUpdate:modelValue': t[0] || (t[0] = (r) => (_.value = r)), title: '返工执行详情', size: '480px' },
                  {
                    default: o(() => [
                      l.value
                        ? (g(),
                          y(
                            X,
                            { key: 0, column: 1, border: '' },
                            {
                              default: o(() => [
                                a(s, { label: '返工单号' }, { default: o(() => [i(d(l.value.rework_code), 1)]), _: 1 }),
                                a(s, { label: 'QMS 裁决引用' }, { default: o(() => [i(d(l.value.qms_decision_ref), 1)]), _: 1 }),
                                a(s, { label: '返工路径' }, { default: o(() => [i(d(l.value.rework_route), 1)]), _: 1 }),
                                a(s, { label: '执行责任' }, { default: o(() => [i(d(l.value.owner_name), 1)]), _: 1 }),
                                a(s, { label: '复检责任' }, { default: o(() => [i(d(l.value.recheck_owner), 1)]), _: 1 }),
                                a(s, { label: '关闭说明' }, { default: o(() => [i(d(l.value.close_note), 1)]), _: 1 })
                              ]),
                              _: 1
                            }
                          ))
                        : z('', !0)
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
  ie = oe
export { ie as default }
