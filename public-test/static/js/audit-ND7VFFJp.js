import {
  Bn as l,
  Fn as C,
  Kn as M,
  Mn as T,
  On as v,
  U as W,
  W as I,
  Xn as A,
  Yn as O,
  an as b,
  dn as i,
  in as k,
  on as U,
  pn as R,
  rn as B,
  rr as d,
  sr as u,
  un as p,
  yn as Y
} from './element-plus-CzL7BOKu.js'
import { I as S } from './index-DqMfCNbk.js'
import { t as q } from './useTable-Hzr4fBAy.js'
import { t as D } from './StatusTag-DWd3m1xj.js'
import { t as j } from './CrudPage-7Q0FEhS_.js'
import { t as F } from './CrudRowActions-Dmc4i_Io.js'
import { s as K } from './static-data-B3FhK4xc.js'
var G = { class: 'json-preview' },
  X = R({
    __name: 'AuditDetailDialog',
    props: Y({ detailLog: {}, actionOptions: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {} }),
    emits: ['update:visible'],
    setup(o) {
      const r = C(o, 'visible')
      return (_, m) => {
        const n = I,
          e = W,
          c = T('gi-dialog')
        return (
          v(),
          b(
            c,
            {
              modelValue: r.value,
              'onUpdate:modelValue': m[0] || (m[0] = (g) => (r.value = g)),
              title: '操作日志详情',
              width: '600px',
              footer: !1,
              'lock-scroll': !1
            },
            {
              default: l(() => [
                i(
                  e,
                  { column: 2, border: '' },
                  {
                    default: l(() => [
                      i(n, { label: '操作人' }, { default: l(() => [p(u(o.detailLog?.userName), 1)]), _: 1 }),
                      i(n, { label: '操作时间' }, { default: l(() => [p(u(o.detailLog?.createdAt), 1)]), _: 1 }),
                      i(n, { label: '模块' }, { default: l(() => [p(u(o.detailLog?.module), 1)]), _: 1 }),
                      i(
                        n,
                        { label: '操作类型' },
                        {
                          default: l(() => [
                            o.detailLog
                              ? (v(), b(D, { key: 0, value: o.detailLog.action, options: o.actionOptions }, null, 8, ['value', 'options']))
                              : U('', !0)
                          ]),
                          _: 1
                        }
                      ),
                      i(n, { label: '操作对象' }, { default: l(() => [p(u(o.detailLog?.target), 1)]), _: 1 }),
                      i(n, { label: 'IP 地址' }, { default: l(() => [p(u(o.detailLog?.ip), 1)]), _: 1 }),
                      i(n, { label: '请求参数', span: 2 }, { default: l(() => [k('pre', G, u(o.detailLog?.requestParams || '-'), 1)]), _: 1 })
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
        )
      }
    }
  }),
  H = S(X, [['__scopeId', 'data-v-f53c35de']]),
  J = R({
    __name: 'index',
    setup(o) {
      const r = [
          { value: 'CREATE', label: '新增', type: 'success' },
          { value: 'UPDATE', label: '修改', type: 'warning' },
          { value: 'DELETE', label: '删除', type: 'danger' },
          { value: 'APPROVE', label: '审批', type: 'primary' },
          { value: 'LOGIN', label: '登录', type: 'info' }
        ],
        _ = [{ key: 'detail', label: '详情', tone: 'primary' }],
        m = [
          { type: 'input', label: '操作人', field: 'userName', props: { clearable: !0 } },
          { type: 'input', label: '模块', field: 'module', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '操作类型',
            field: 'action',
            props: { clearable: !0, options: r.map((a) => ({ label: a.label, value: a.value })) }
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
          { prop: 'module', label: '模块', minWidth: 120 },
          { label: '操作类型', minWidth: 100, slotName: 'actionType', align: 'center' },
          { prop: 'target', label: '操作对象', minWidth: 180 },
          { prop: 'ip', label: 'IP 地址', minWidth: 140 },
          { prop: 'createdAt', label: '操作时间', minWidth: 170 },
          { label: '操作', minWidth: 90, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let e = O({ userName: '', module: '', action: '', dateRange: [] })
      const c = A(!1),
        g = A(null),
        h = B(() =>
          K.value.filter((a) => {
            const s = !e.userName || a.userName.includes(e.userName),
              t = !e.module || a.module.includes(e.module),
              f = !e.action || a.action === e.action,
              w = e.dateRange.length !== 2 || (a.createdAt.slice(0, 10) >= e.dateRange[0] && a.createdAt.slice(0, 10) <= e.dateRange[1])
            return s && t && f && w
          })
        ),
        {
          tableData: N,
          pagination: L,
          loading: P,
          search: y,
          refresh: x
        } = q({
          rowKey: 'id',
          listAPI: async ({ page: a, size: s }) => {
            const t = (a - 1) * s,
              f = t + s
            return { list: h.value.slice(t, f), total: h.value.length }
          }
        })
      function E() {
        ;(Object.assign(e, { userName: '', module: '', action: '', dateRange: [] }), y())
      }
      function V(a) {
        ;((g.value = a), (c.value = !0))
      }
      return (a, s) => (
        v(),
        b(
          j,
          {
            'search-model': d(e),
            'onUpdate:searchModel': s[1] || (s[1] = (t) => (M(e) ? (e.value = t) : (e = t))),
            title: '系统审计日志',
            'search-columns': m,
            columns: n,
            data: d(N),
            pagination: d(L),
            loading: d(P),
            'show-add-button': !1,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: d(y),
            onReset: E,
            onRefresh: d(x)
          },
          {
            actionType: l(({ row: t }) => [i(D, { value: t.action, options: r }, null, 8, ['value'])]),
            actions: l(({ row: t }) => [i(F, { actions: _, onAction: (f) => V(t) }, null, 8, ['onAction'])]),
            dialog: l(() => [
              i(
                H,
                { visible: c.value, 'onUpdate:visible': s[0] || (s[0] = (t) => (c.value = t)), 'detail-log': g.value, 'action-options': r },
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
  le = J
export { le as default }
