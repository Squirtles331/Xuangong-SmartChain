import { Bn as m, Fn as S, Mn as x, O as E, On as C, Xn as c, an as k, dn as f, i as h, pn as D, rr as p, yn as M } from './element-plus-CzL7BOKu.js'
import { t as T } from './useTable-Hzr4fBAy.js'
import { t as I } from './CrudPage-7Q0FEhS_.js'
import { t as O } from './CrudRowActions-Dmc4i_Io.js'
import { M as z, c as K, g as L, w as X } from './qms-DDSeKvwp.js'
var j = D({
    __name: 'SupplierQualityFormDialog',
    props: M({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: M(['submit'], ['update:visible', 'update:form']),
    setup(d, { emit: b }) {
      const u = S(d, 'visible'),
        o = S(d, 'form'),
        i = b,
        s = [{ type: 'input', label: '供应商名称', field: 'supplier', required: !0 }]
      function t() {
        u.value = !1
      }
      async function v() {
        return (i('submit'), !1)
      }
      return (y, r) => {
        const _ = x('gi-form'),
          g = x('gi-dialog')
        return (
          C(),
          k(
            g,
            {
              modelValue: u.value,
              'onUpdate:modelValue': r[1] || (r[1] = (n) => (u.value = n)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': v,
              'on-cancel': t,
              title: d.mode === 'add' ? '新增供应商' : '编辑供应商',
              width: '600px'
            },
            {
              default: m(() => [
                f(_, { modelValue: o.value, 'onUpdate:modelValue': r[0] || (r[0] = (n) => (o.value = n)), columns: s, 'label-width': 100 }, null, 8, [
                  'modelValue'
                ])
              ]),
              _: 1
            },
            8,
            ['modelValue', 'title']
          )
        )
      }
    }
  }),
  G = j,
  H = D({
    __name: 'index',
    setup(d) {
      const b = [{ key: 'export', label: '导出' }],
        u = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        o = c({ supplier: '' }),
        i = c(!1),
        s = c('add'),
        t = c(A()),
        v = [{ type: 'input', label: '供应商', field: 'supplier', props: { clearable: !0 } }],
        y = [
          { prop: 'supplier', label: '供应商', minWidth: 180 },
          { prop: 'total_batches', label: '总批次数', minWidth: 100, align: 'center' },
          { prop: 'pass_batches', label: '合格批次', minWidth: 100, align: 'center' },
          { label: '合格率', minWidth: 180, slotName: 'passRate' },
          { prop: 'repeat_issues', label: '重复问题', minWidth: 90, align: 'center' },
          { prop: 'last_inspection', label: '最近检验', width: 120 },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        {
          tableData: r,
          pagination: _,
          loading: g,
          search: n,
          refresh: w,
          onDelete: V
        } = T({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) => (await X({ pageNum: e, pageSize: a, supplier: o.value.supplier || void 0 })).data,
          deleteAPI: (e) => Promise.all(e.map((a) => L(a)))
        })
      function A() {
        return { id: '', supplier: '', total_batches: 0, pass_batches: 0, pass_rate: 0, repeat_issues: 0, last_inspection: '' }
      }
      function Q() {
        ;((o.value = { supplier: '' }), n())
      }
      function R(e) {
        e === 'export' && h.success('供应商质量静态数据已导出')
      }
      function F() {
        ;((s.value = 'add'), (t.value = A()), (i.value = !0))
      }
      function P(e) {
        ;((s.value = 'edit'), (t.value = { ...e }), (i.value = !0))
      }
      function W(e, a) {
        if (e === 'edit') {
          P(a)
          return
        }
        e === 'delete' && V(a)
      }
      function q(e) {
        return e >= 95 ? '#67c23a' : e >= 80 ? '#e6a23c' : '#f56c6c'
      }
      async function N() {
        const e = { ...t.value, pass_rate: t.value.total_batches > 0 ? Number(((t.value.pass_batches / t.value.total_batches) * 100).toFixed(1)) : 0 }
        ;(s.value === 'add' ? (await K(e), h.success('新增成功')) : (await z(t.value.id, e), h.success('编辑成功')), (i.value = !1), await w())
      }
      return (e, a) => {
        const U = E
        return (
          C(),
          k(
            I,
            {
              'search-model': o.value,
              'onUpdate:searchModel': a[2] || (a[2] = (l) => (o.value = l)),
              title: '供应商质量',
              'search-columns': v,
              columns: y,
              data: p(r),
              pagination: p(_),
              loading: p(g),
              'toolbar-actions': b,
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              onSearch: p(n),
              onReset: Q,
              onRefresh: p(w),
              onAdd: F,
              onToolbarAction: R
            },
            {
              passRate: m(({ row: l }) => [
                f(U, { percentage: l.pass_rate, 'stroke-width': 8, color: q(l.pass_rate) }, null, 8, ['percentage', 'color'])
              ]),
              actions: m(({ row: l }) => [f(O, { actions: u, onAction: (B) => W(B, l) }, null, 8, ['onAction'])]),
              dialog: m(() => [
                f(
                  G,
                  {
                    visible: i.value,
                    'onUpdate:visible': a[0] || (a[0] = (l) => (i.value = l)),
                    form: t.value,
                    'onUpdate:form': a[1] || (a[1] = (l) => (t.value = l)),
                    mode: s.value,
                    onSubmit: N
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode']
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
  ae = H
export { ae as default }
