import {
  Bn as o,
  Kn as B,
  L as T,
  O as Y,
  On as i,
  R as q,
  Yn as z,
  _t as A,
  an as p,
  dn as s,
  i as f,
  in as y,
  on as _,
  or as K,
  ot as V,
  pn as L,
  r as U,
  rr as l,
  sr as j,
  un as n,
  vt as F,
  z as G
} from './element-plus-CzL7BOKu.js'
import { I as H } from './index-DqMfCNbk.js'
import { t as J } from './useTable-Hzr4fBAy.js'
import { t as b } from './StatusTag-DWd3m1xj.js'
import { i as Q, r as X } from './status-maps-BEsjyiP9.js'
import { t as Z } from './CrudPage-7Q0FEhS_.js'
import { f as ee, n as te, t as ae, u as oe } from './work-order-Clsu8Szn.js'
var re = { class: 'progress-cell' },
  se = L({
    __name: 'index',
    setup(le) {
      const h = [
          { type: 'input', label: '工单编号', field: 'code', props: { placeholder: '请输入工单编号', clearable: !0 } },
          { type: 'input', label: '生产车间', field: 'workshopName', props: { placeholder: '请输入生产车间', clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '草稿', value: 'draft' },
                { label: '已审核', value: 'approved' },
                { label: '已下达', value: 'released' },
                { label: '生产中', value: 'in_progress' },
                { label: '已完工', value: 'completed' },
                { label: '已关闭', value: 'closed' }
              ],
              clearable: !0
            }
          },
          {
            type: 'select-v2',
            label: '优先级',
            field: 'priority',
            props: {
              options: [
                { label: '紧急', value: 'urgent' },
                { label: '高', value: 'high' },
                { label: '普通', value: 'normal' },
                { label: '低', value: 'low' }
              ],
              clearable: !0
            }
          },
          {
            type: 'date-picker',
            label: '计划日期',
            field: 'dateRange',
            props: { type: 'daterange', startPlaceholder: '开始日期', endPlaceholder: '结束日期', valueFormat: 'YYYY-MM-DD' }
          }
        ],
        k = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        R = [
          { prop: 'code', label: '工单编号', minWidth: 160 },
          { prop: 'material_code', label: '产品编码', minWidth: 140 },
          { prop: 'material_name', label: '产品名称', minWidth: 160 },
          { prop: 'planned_qty', label: '计划数量', minWidth: 100, align: 'center' },
          { label: '进度', minWidth: 140, slotName: 'progress' },
          { prop: 'current_operation_display', label: '当前工序', minWidth: 160 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '优先级', minWidth: 100, slotName: 'priority', align: 'center' },
          { prop: 'workshop_name', label: '生产车间', minWidth: 130 },
          { prop: 'line_name', label: '生产产线', minWidth: 120 },
          { prop: 'bom_version', label: 'BOM版本', minWidth: 140 },
          { prop: 'routing_version', label: '工艺版本', minWidth: 140 },
          { label: '计划完工', minWidth: 120, slotName: 'plannedEnd' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let r = z({ code: '', workshopName: '', status: '', priority: '', dateRange: [] })
      const {
        tableData: W,
        pagination: O,
        loading: w,
        search: g,
        refresh: d
      } = J({
        rowKey: 'id',
        listAPI: async ({ page: e, size: t }) => {
          const u = await oe({
            pageNum: e,
            pageSize: t,
            code: r.code || void 0,
            workshopName: r.workshopName || void 0,
            status: r.status || void 0,
            priority: r.priority || void 0,
            startDate: r.dateRange[0] || void 0,
            endDate: r.dateRange[1] || void 0
          })
          return { list: u.data.list.map(C), total: u.data.total }
        }
      })
      function C(e) {
        const t =
          e.current_operation || (e.status === 'completed' ? '全部完工' : e.status === 'draft' || e.status === 'approved' ? '待下达' : '待排产')
        return { ...e, current_operation_display: t, progress: e.planned_qty > 0 ? Math.round(((e.completed_qty || 0) / e.planned_qty) * 100) : 0 }
      }
      function N() {
        ;(Object.assign(r, { code: '', workshopName: '', status: '', priority: '', dateRange: [] }), g())
      }
      function D(e) {
        return e.status === 'completed' || e.status === 'closed' || !e.planned_end_date ? !1 : new Date(e.planned_end_date).getTime() < Date.now()
      }
      function $(e) {
        return e.status === 'released' || e.status === 'in_progress'
      }
      async function x(e) {
        const t = await ae(e.id, !0)
        ;(f.success(t.msg || `工单 ${e.code} 已提交审核`), await d())
      }
      async function E(e) {
        const t = await ee(e.id)
        ;(f.success(t.msg || `工单 ${e.code} 已下达`), await d())
      }
      function I(e) {
        U.confirm(`确认关闭工单 ${e.code} 吗？`, '关闭工单', { type: 'warning' })
          .then(async () => {
            const t = await te(e.id, { close_type: 'normal' })
            ;(f.success(t.msg || '工单已关闭'), await d())
          })
          .catch(() => {})
      }
      return (e, t) => {
        const u = Y,
          v = V,
          M = A,
          c = q,
          P = G,
          S = T
        return (
          i(),
          p(
            Z,
            {
              'search-model': l(r),
              'onUpdate:searchModel': t[0] || (t[0] = (a) => (B(r) ? (r.value = a) : (r = a))),
              title: '工单列表',
              'search-columns': h,
              'search-grid-item-props': k,
              columns: R,
              data: l(W),
              pagination: l(O),
              loading: l(w),
              'add-text': '新建工单',
              onSearch: l(g),
              onReset: N,
              onRefresh: l(d),
              onAdd: t[1] || (t[1] = (a) => e.$router.push('/mes/work-order/create'))
            },
            {
              priority: o(({ row: a }) => [s(b, { value: a.priority, options: l(X) }, null, 8, ['value', 'options'])]),
              progress: o(({ row: a }) => [
                y('div', re, [
                  s(u, { percentage: a.progress, 'stroke-width': 6, color: a.progress === 100 ? '#67c23a' : '#409eff' }, null, 8, [
                    'percentage',
                    'color'
                  ])
                ])
              ]),
              status: o(({ row: a }) => [s(b, { value: a.status, options: l(Q) }, null, 8, ['value', 'options'])]),
              plannedEnd: o(({ row: a }) => [y('span', { style: K({ color: D(a) ? '#f56c6c' : '' }) }, j(a.planned_end_date || '-'), 5)]),
              actions: o(({ row: a }) => [
                s(
                  v,
                  { type: 'primary', link: '', size: 'small', onClick: (m) => e.$router.push(`/mes/work-order/${a.id}`) },
                  { default: o(() => [...(t[2] || (t[2] = [n('详情', -1)]))]), _: 1 },
                  8,
                  ['onClick']
                ),
                s(
                  S,
                  { trigger: 'click' },
                  {
                    dropdown: o(() => [
                      s(
                        P,
                        null,
                        {
                          default: o(() => [
                            a.status === 'draft'
                              ? (i(),
                                p(c, { key: 0, onClick: (m) => x(a) }, { default: o(() => [...(t[4] || (t[4] = [n('提交审核', -1)]))]), _: 1 }, 8, [
                                  'onClick'
                                ]))
                              : _('', !0),
                            a.status === 'approved'
                              ? (i(),
                                p(c, { key: 1, onClick: (m) => E(a) }, { default: o(() => [...(t[5] || (t[5] = [n('下达', -1)]))]), _: 1 }, 8, [
                                  'onClick'
                                ]))
                              : _('', !0),
                            $(a)
                              ? (i(),
                                p(
                                  c,
                                  { key: 2, onClick: (m) => e.$router.push(`/mes/execution/report/${a.id}`) },
                                  { default: o(() => [...(t[6] || (t[6] = [n('报工', -1)]))]), _: 1 },
                                  8,
                                  ['onClick']
                                ))
                              : _('', !0),
                            a.status === 'completed'
                              ? (i(),
                                p(c, { key: 3, onClick: (m) => I(a) }, { default: o(() => [...(t[7] || (t[7] = [n('关闭', -1)]))]), _: 1 }, 8, [
                                  'onClick'
                                ]))
                              : _('', !0)
                          ]),
                          _: 2
                        },
                        1024
                      )
                    ]),
                    default: o(() => [
                      s(
                        v,
                        { type: 'primary', link: '', size: 'small' },
                        {
                          default: o(() => [
                            t[3] || (t[3] = n(' 更多 ', -1)),
                            s(M, { class: 'el-icon--right' }, { default: o(() => [s(l(F))]), _: 1 })
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 2
                  },
                  1024
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  _e = H(se, [['__scopeId', 'data-v-6caf7a8f']])
export { _e as default }
