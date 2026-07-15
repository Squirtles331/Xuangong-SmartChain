import {
  B as G,
  Bn as l,
  Kn as $,
  On as w,
  U as j,
  W as Q,
  Xn as v,
  Yn as X,
  an as C,
  dn as n,
  i as g,
  on as Y,
  ot as z,
  pn as F,
  rr as s,
  sr as d,
  un as u
} from './element-plus-CzL7BOKu.js'
import { t as H } from './useTable-Hzr4fBAy.js'
import { t as m } from './StatusTag-DWd3m1xj.js'
import { t as J } from './CrudPage-7Q0FEhS_.js'
import { a as N, i as b, r as W, s as k } from './third-batch-static-CHXUB_05.js'
var Z = F({
    __name: 'index',
    setup(ee) {
      const S = v(N(k)),
        _ = v(!1),
        o = v(null),
        p = v(''),
        T = Array.from(new Set(k.map((e) => e.workshop_name))).map((e) => ({ label: e, value: e })),
        R = [{ label: '全部', value: '' }, ...W.map((e) => ({ label: e.label, value: e.value }))],
        V = [
          { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '搜索放行单号 / 工单号 / 产品名称', clearable: !0 } },
          { type: 'select-v2', label: '生产车间', field: 'workshop', props: { options: T, clearable: !0 } }
        ],
        x = [
          { prop: 'release_code', label: '放行单号', minWidth: 150 },
          { prop: 'wo_code', label: '工单号', minWidth: 150 },
          { prop: 'material_name', label: '产品名称', minWidth: 150 },
          { prop: 'planned_start', label: '计划开工', minWidth: 150 },
          { label: '物料就绪', minWidth: 100, slotName: 'materialSignal', align: 'center' },
          { label: '版本就绪', minWidth: 100, slotName: 'versionSignal', align: 'center' },
          { label: '批次就绪', minWidth: 100, slotName: 'batchSignal', align: 'center' },
          { label: '放行关口', minWidth: 100, slotName: 'qualitySignal', align: 'center' },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'release_owner', label: '责任人', minWidth: 140 },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let r = X({ keyword: '', workshop: '' })
      const {
        tableData: B,
        pagination: D,
        loading: I,
        search: f,
        refresh: h
      } = H({
        rowKey: 'id',
        listAPI: async ({ page: e, size: t }) => {
          const c = S.value.filter(O),
            i = (e - 1) * t
          return { list: c.slice(i, i + t), total: c.length }
        }
      })
      function O(e) {
        const t = r.keyword.trim().toLowerCase()
        return !(
          (t && ![e.release_code, e.wo_code, e.material_name].join(' ').toLowerCase().includes(t)) ||
          (p.value && e.status !== p.value) ||
          (r.workshop && e.workshop_name !== r.workshop)
        )
      }
      function E(e) {
        ;((o.value = e), (_.value = !0))
      }
      function A(e) {
        if (e.status === 'blocked') {
          ;((e.status = 'ready'), (e.blocker_reason = ''), (e.release_note = '阻塞已解除，可进入放行确认'), g.success('已解除阻塞'), h())
          return
        }
        ;((e.status = 'blocked'),
          (e.blocker_reason = '静态演示：待补齐来料 / 放行条件'),
          (e.release_note = '请同步 WMS / QMS / 异常中心后重新确认'),
          g.success('已标记阻塞'),
          h())
      }
      function M(e) {
        ;((e.status = 'released'),
          (e.blocker_reason = ''),
          (e.release_note = '静态演示：放行成功，可进入执行链'),
          o.value?.id === e.id && (o.value = e),
          g.success('已放行开工条件'),
          h())
      }
      function P() {
        ;((S.value = N(k)), (_.value = !1), (o.value = null), g.success('齐套视图已刷新'), f())
      }
      function U() {
        f()
      }
      function q() {
        ;((r.keyword = ''), (r.workshop = ''), (p.value = ''), f())
      }
      return (e, t) => {
        const c = z,
          i = Q,
          K = j,
          L = G
        return (
          w(),
          C(
            J,
            {
              'search-model': s(r),
              'onUpdate:searchModel': t[1] || (t[1] = (a) => ($(r) ? (r.value = a) : (r = a))),
              'segmented-value': p.value,
              'onUpdate:segmentedValue': t[2] || (t[2] = (a) => (p.value = a)),
              title: '开工齐套检查',
              'search-columns': V,
              columns: x,
              data: s(B),
              pagination: s(D),
              loading: s(I),
              'show-add-button': !1,
              'segmented-options': R,
              onSearch: s(f),
              onReset: q,
              onRefresh: P,
              onSegmentedChange: U
            },
            {
              materialSignal: l(({ row: a }) => [n(m, { value: a.material_signal, options: s(b) }, null, 8, ['value', 'options'])]),
              versionSignal: l(({ row: a }) => [n(m, { value: a.version_signal, options: s(b) }, null, 8, ['value', 'options'])]),
              batchSignal: l(({ row: a }) => [n(m, { value: a.batch_signal, options: s(b) }, null, 8, ['value', 'options'])]),
              qualitySignal: l(({ row: a }) => [n(m, { value: a.quality_signal, options: s(b) }, null, 8, ['value', 'options'])]),
              status: l(({ row: a }) => [n(m, { value: a.status, options: s(W) }, null, 8, ['value', 'options'])]),
              actions: l(({ row: a }) => [
                n(c, { link: '', type: 'primary', onClick: (y) => E(a) }, { default: l(() => [...(t[3] || (t[3] = [u('详情', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ]),
                n(
                  c,
                  { link: '', type: a.status === 'blocked' ? 'warning' : 'danger', onClick: (y) => A(a) },
                  { default: l(() => [u(d(a.status === 'blocked' ? '解除阻塞' : '标记阻塞'), 1)]), _: 2 },
                  1032,
                  ['type', 'onClick']
                ),
                n(c, { link: '', type: 'success', onClick: (y) => M(a) }, { default: l(() => [...(t[4] || (t[4] = [u('放行', -1)]))]), _: 1 }, 8, [
                  'onClick'
                ])
              ]),
              dialog: l(() => [
                n(
                  L,
                  { modelValue: _.value, 'onUpdate:modelValue': t[0] || (t[0] = (a) => (_.value = a)), title: '开工放行条件详情', size: '460px' },
                  {
                    default: l(() => [
                      o.value
                        ? (w(),
                          C(
                            K,
                            { key: 0, column: 1, border: '' },
                            {
                              default: l(() => [
                                n(i, { label: '放行单号' }, { default: l(() => [u(d(o.value.release_code), 1)]), _: 1 }),
                                n(i, { label: '工单号' }, { default: l(() => [u(d(o.value.wo_code), 1)]), _: 1 }),
                                n(i, { label: 'BOM版本' }, { default: l(() => [u(d(o.value.bom_version), 1)]), _: 1 }),
                                n(i, { label: '工艺版本' }, { default: l(() => [u(d(o.value.routing_version), 1)]), _: 1 }),
                                n(i, { label: '阻塞原因' }, { default: l(() => [u(d(o.value.blocker_reason || '无'), 1)]), _: 1 }),
                                n(i, { label: '放行说明' }, { default: l(() => [u(d(o.value.release_note), 1)]), _: 1 })
                              ]),
                              _: 1
                            }
                          ))
                        : Y('', !0)
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
  se = Z
export { se as default }
