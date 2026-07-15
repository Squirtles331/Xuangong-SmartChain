import {
  B as j,
  Bn as a,
  Kn as X,
  On as k,
  U as z,
  W as F,
  Xn as b,
  Yn as G,
  an as g,
  dn as n,
  i as w,
  it as H,
  on as J,
  ot as Q,
  pn as Z,
  rr as d,
  sr as s,
  un as o
} from './element-plus-CzL7BOKu.js'
import { i as ee } from './vue-chunks-CWn_TkJU.js'
import { t as te } from './useTable-Hzr4fBAy.js'
import { t as C } from './StatusTag-DWd3m1xj.js'
import { t as ae } from './CrudPage-7Q0FEhS_.js'
import { a as S, i as T, l as v, s as W } from './second-batch-static-BT92aayT.js'
var le = Z({
    __name: 'index',
    setup(oe) {
      const N = ee(),
        y = b(W(v)),
        f = b(!1),
        r = b(null),
        m = b(''),
        O = Array.from(new Set(v.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        V = [{ label: '全部', value: '' }, ...T.map((e) => ({ label: e.label, value: e.value }))],
        x = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索任务号 / 工单号 / 产品名称', clearable: !0 } },
          { type: 'select-v2', label: '优先级', field: 'priority', props: { options: S, clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: O, clearable: !0 } }
        ],
        P = [
          { prop: 'task_code', label: '任务号', minWidth: 150 },
          { prop: 'wo_code', label: '工单号', minWidth: 150 },
          { prop: 'material_name', label: '产品名称', minWidth: 150 },
          { label: '工序', minWidth: 160, slotName: 'operation' },
          { prop: 'work_center', label: '工作中心', minWidth: 120 },
          { label: '优先级', minWidth: 100, slotName: 'priority', align: 'center' },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '阻塞信号', minWidth: 110, slotName: 'blocked', align: 'center' },
          { label: '进度', minWidth: 120, slotName: 'progress', align: 'center' },
          { label: '依赖就绪', minWidth: 110, slotName: 'dependency', align: 'center' },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let i = G({ keyword: '', priority: '', workshop: '' })
      const {
        tableData: R,
        pagination: B,
        loading: D,
        search: _,
        refresh: E
      } = te({
        rowKey: 'id',
        listAPI: async ({ page: e, size: l }) => {
          const u = y.value.filter(I),
            p = (e - 1) * l
          return { list: u.slice(p, p + l), total: u.length }
        }
      })
      function I(e) {
        const l = i.keyword.trim().toLowerCase()
        return !(
          (l && ![e.task_code, e.wo_code, e.material_name].join(' ').toLowerCase().includes(l)) ||
          (m.value && e.status !== m.value) ||
          (i.priority && e.priority !== i.priority) ||
          (i.workshop && e.workshop_name !== i.workshop)
        )
      }
      function A(e) {
        ;((r.value = e), (f.value = !0))
      }
      function U(e) {
        N.push(`/mes/work-order/${e}`)
      }
      function K(e) {
        ;((e.blocked = !e.blocked),
          (e.blocked_reason = e.blocked ? '静态演示：等待协调后解除' : ''),
          (e.release_note = e.blocked ? '请同步异常中心与班组负责人' : '已解除协调阻塞'),
          r.value?.id === e.id && (r.value = e),
          w.success(e.blocked ? '已标记为阻塞任务' : '已解除阻塞信号'),
          E())
      }
      function q() {
        ;((y.value = W(v)), (f.value = !1), (r.value = null), w.success('任务池视图已刷新'), _())
      }
      function L() {
        _()
      }
      function $() {
        ;((i.keyword = ''), (i.priority = ''), (i.workshop = ''), (m.value = ''), _())
      }
      return (e, l) => {
        const u = H,
          p = Q,
          c = F,
          M = z,
          Y = j
        return (
          k(),
          g(
            ae,
            {
              'search-model': d(i),
              'onUpdate:searchModel': l[1] || (l[1] = (t) => (X(i) ? (i.value = t) : (i = t))),
              'segmented-value': m.value,
              'onUpdate:segmentedValue': l[2] || (l[2] = (t) => (m.value = t)),
              title: '工序任务',
              'search-columns': x,
              columns: P,
              data: d(R),
              pagination: d(B),
              loading: d(D),
              'show-add-button': !1,
              'segmented-options': V,
              onSearch: d(_),
              onReset: $,
              onRefresh: q,
              onSegmentedChange: L
            },
            {
              operation: a(({ row: t }) => [o(s(t.operation_no) + ' - ' + s(t.operation_name), 1)]),
              priority: a(({ row: t }) => [n(C, { value: t.priority, options: d(S) }, null, 8, ['value', 'options'])]),
              status: a(({ row: t }) => [n(C, { value: t.status, options: d(T) }, null, 8, ['value', 'options'])]),
              blocked: a(({ row: t }) => [
                t.blocked
                  ? (k(), g(u, { key: 0, type: 'danger', effect: 'light' }, { default: a(() => [...(l[3] || (l[3] = [o('已阻塞', -1)]))]), _: 1 }))
                  : (k(), g(u, { key: 1, type: 'success', effect: 'light' }, { default: a(() => [...(l[4] || (l[4] = [o('通畅', -1)]))]), _: 1 }))
              ]),
              progress: a(({ row: t }) => [o(s(t.reported_qty) + ' / ' + s(t.planned_qty), 1)]),
              dependency: a(({ row: t }) => [
                n(
                  u,
                  { type: t.dependency_ready ? 'success' : 'warning', effect: 'light' },
                  { default: a(() => [o(s(t.dependency_ready ? '已就绪' : '待释放'), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              actions: a(({ row: t }) => [
                n(p, { link: '', type: 'primary', onClick: (h) => A(t) }, { default: a(() => [...(l[5] || (l[5] = [o('协调', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ]),
                n(p, { link: '', onClick: (h) => U(t.wo_id) }, { default: a(() => [...(l[6] || (l[6] = [o('工单', -1)]))]), _: 1 }, 8, ['onClick']),
                n(
                  p,
                  { link: '', type: t.blocked ? 'success' : 'danger', onClick: (h) => K(t) },
                  { default: a(() => [o(s(t.blocked ? '解除阻塞' : '标记阻塞'), 1)]), _: 2 },
                  1032,
                  ['type', 'onClick']
                )
              ]),
              dialog: a(() => [
                n(
                  Y,
                  { modelValue: f.value, 'onUpdate:modelValue': l[0] || (l[0] = (t) => (f.value = t)), title: '任务协调面板', size: '420px' },
                  {
                    default: a(() => [
                      r.value
                        ? (k(),
                          g(
                            M,
                            { key: 0, column: 1, border: '' },
                            {
                              default: a(() => [
                                n(c, { label: '任务号' }, { default: a(() => [o(s(r.value.task_code), 1)]), _: 1 }),
                                n(c, { label: '所属工单' }, { default: a(() => [o(s(r.value.wo_code), 1)]), _: 1 }),
                                n(
                                  c,
                                  { label: '工序' },
                                  { default: a(() => [o(s(r.value.operation_no) + ' - ' + s(r.value.operation_name), 1)]), _: 1 }
                                ),
                                n(c, { label: '依赖任务' }, { default: a(() => [o(s(r.value.dependency_task), 1)]), _: 1 }),
                                n(c, { label: '阻塞原因' }, { default: a(() => [o(s(r.value.blocked_reason || '无'), 1)]), _: 1 }),
                                n(c, { label: '释放说明' }, { default: a(() => [o(s(r.value.release_note), 1)]), _: 1 })
                              ]),
                              _: 1
                            }
                          ))
                        : J('', !0)
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
  pe = le
export { pe as default }
