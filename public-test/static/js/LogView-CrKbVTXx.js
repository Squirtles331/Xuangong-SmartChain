import {
  Bn as o,
  Fn as E,
  Kn as x,
  On as A,
  U as I,
  W as M,
  Xn as N,
  Yn as W,
  an as L,
  dn as s,
  in as F,
  on as O,
  pn as D,
  rn as P,
  rr as p,
  sr as c,
  un as m,
  yn as k
} from './element-plus-CzL7BOKu.js'
import { I as B } from './index-DqMfCNbk.js'
import { t as S } from './useTable-Hzr4fBAy.js'
import { t as w } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as q } from './CrudPage-7Q0FEhS_.js'
import { t as j } from './CrudRowActions-Dmc4i_Io.js'
import { s as G } from './static-data-B3FhK4xc.js'
var K = { class: 'json-preview' },
  $ = D({
    __name: 'LogFormDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, detailLog: { required: !0 }, detailLogModifiers: {} },
    emits: k(['close'], ['update:visible', 'update:detailLog']),
    setup(_, { emit: v }) {
      const y = [
          { value: 'CREATE', label: '新增', type: 'success' },
          { value: 'UPDATE', label: '修改', type: 'warning' },
          { value: 'DELETE', label: '删除', type: 'danger' },
          { value: 'APPROVE', label: '审批', type: 'primary' },
          { value: 'LOGIN', label: '登录', type: 'info' }
        ],
        g = E(_, 'visible'),
        n = E(_, 'detailLog'),
        e = P(() => ({})),
        u = v
      return (f, i) => {
        const r = M,
          h = I
        return (
          A(),
          L(
            Y,
            {
              visible: g.value,
              'onUpdate:visible': i[0] || (i[0] = (d) => (g.value = d)),
              form: e.value,
              'onUpdate:form': i[1] || (i[1] = (d) => (e.value = d)),
              title: '操作日志详情',
              columns: [],
              width: '640px',
              'show-footer': !1,
              onCancel: i[2] || (i[2] = (d) => u('close'))
            },
            {
              default: o(() => [
                s(
                  h,
                  { column: 2, border: '' },
                  {
                    default: o(() => [
                      s(r, { label: '操作人' }, { default: o(() => [m(c(n.value?.userName || '-'), 1)]), _: 1 }),
                      s(r, { label: '操作时间' }, { default: o(() => [m(c(n.value?.createdAt || '-'), 1)]), _: 1 }),
                      s(r, { label: '所属模块' }, { default: o(() => [m(c(n.value?.module || '-'), 1)]), _: 1 }),
                      s(
                        r,
                        { label: '操作类型' },
                        {
                          default: o(() => [n.value ? (A(), L(w, { key: 0, value: n.value.action, options: y }, null, 8, ['value'])) : O('', !0)]),
                          _: 1
                        }
                      ),
                      s(r, { label: '操作对象' }, { default: o(() => [m(c(n.value?.target || '-'), 1)]), _: 1 }),
                      s(r, { label: 'IP 地址' }, { default: o(() => [m(c(n.value?.ip || '-'), 1)]), _: 1 }),
                      s(r, { label: '请求参数', span: 2 }, { default: o(() => [F('pre', K, c(n.value?.requestParams || '-'), 1)]), _: 1 })
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            },
            8,
            ['visible', 'form']
          )
        )
      }
    }
  }),
  X = B($, [['__scopeId', 'data-v-9b79cd65']]),
  H = D({
    __name: 'LogView',
    setup(_) {
      const v = [
          { value: 'CREATE', label: '新增', type: 'success' },
          { value: 'UPDATE', label: '修改', type: 'warning' },
          { value: 'DELETE', label: '删除', type: 'danger' },
          { value: 'APPROVE', label: '审批', type: 'primary' },
          { value: 'LOGIN', label: '登录', type: 'info' }
        ],
        y = [{ key: 'detail', label: '详情', tone: 'primary' }],
        g = [
          { type: 'input', label: '操作人', field: 'userName', props: { clearable: !0 } },
          { type: 'input', label: '模块', field: 'module', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '操作类型',
            field: 'action',
            props: { clearable: !0, options: v.map((t) => ({ label: t.label, value: t.value })) }
          },
          {
            type: 'date-picker',
            label: '时间范围',
            field: 'dateRange',
            props: { type: 'daterange', valueFormat: 'YYYY-MM-DD', startPlaceholder: '开始日期', endPlaceholder: '结束日期' }
          }
        ],
        n = [
          { prop: 'userName', label: '操作人', minWidth: 100 },
          { prop: 'module', label: '模块', minWidth: 130 },
          { label: '操作类型', minWidth: 100, slotName: 'actionType', align: 'center' },
          { prop: 'target', label: '操作对象', minWidth: 180 },
          { prop: 'ip', label: 'IP 地址', minWidth: 130 },
          { prop: 'createdAt', label: '操作时间', minWidth: 170 },
          { label: '操作', minWidth: 90, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let e = W({ userName: '', module: '', action: '', dateRange: [] })
      const u = N(!1),
        f = N(null),
        i = P(() =>
          G.value.filter((t) => {
            const l = !e.userName || t.userName.includes(e.userName),
              a = !e.module || t.module.includes(e.module),
              b = !e.action || t.action === e.action,
              U = e.dateRange.length !== 2 || (t.createdAt.slice(0, 10) >= e.dateRange[0] && t.createdAt.slice(0, 10) <= e.dateRange[1])
            return l && a && b && U
          })
        ),
        {
          tableData: r,
          pagination: h,
          loading: d,
          search: R,
          refresh: C
        } = S({
          rowKey: 'id',
          listAPI: async ({ page: t, size: l }) => {
            const a = (t - 1) * l,
              b = a + l
            return { list: i.value.slice(a, b), total: i.value.length }
          }
        })
      function T() {
        ;(Object.assign(e, { userName: '', module: '', action: '', dateRange: [] }), R())
      }
      function V(t) {
        ;((f.value = t), (u.value = !0))
      }
      return (t, l) => (
        A(),
        L(
          q,
          {
            'search-model': p(e),
            'onUpdate:searchModel': l[3] || (l[3] = (a) => (x(e) ? (e.value = a) : (e = a))),
            title: '操作日志',
            'search-columns': g,
            columns: n,
            data: p(r),
            pagination: p(h),
            loading: p(d),
            'show-add-button': !1,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: p(R),
            onReset: T,
            onRefresh: p(C)
          },
          {
            actionType: o(({ row: a }) => [s(w, { value: a.action, options: v }, null, 8, ['value'])]),
            actions: o(({ row: a }) => [s(j, { actions: y, onAction: (b) => V(a) }, null, 8, ['onAction'])]),
            dialog: o(() => [
              s(
                X,
                {
                  visible: u.value,
                  'onUpdate:visible': l[0] || (l[0] = (a) => (u.value = a)),
                  'detail-log': f.value,
                  'onUpdate:detailLog': l[1] || (l[1] = (a) => (f.value = a)),
                  onClose: l[2] || (l[2] = (a) => (u.value = !1))
                },
                null,
                8,
                ['visible', 'detail-log']
              )
            ]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  oe = H
export { oe as default }
