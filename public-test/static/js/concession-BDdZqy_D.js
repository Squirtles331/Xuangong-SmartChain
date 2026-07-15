import { Bn as b, Fn as x, Mn as k, On as D, Xn as v, an as U, dn as g, i as w, pn as V, rr as d, yn as M } from './element-plus-CzL7BOKu.js'
import { t as W } from './useTable-Hzr4fBAy.js'
import { t as j } from './StatusTag-DWd3m1xj.js'
import { t as E } from './CrudPage-7Q0FEhS_.js'
import { t as I } from './CrudRowActions-Dmc4i_Io.js'
import { T as O, _ as z, l as K, t as L } from './qms-DDSeKvwp.js'
var X = V({
    __name: 'ConcessionFormDialog',
    props: M({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: M(['submit'], ['update:visible', 'update:form']),
    setup(p, { emit: y }) {
      const n = x(p, 'visible'),
        s = x(p, 'form'),
        l = y,
        _ = [
          { type: 'input', label: '放行单号', field: 'code', required: !0 },
          { type: 'input', label: '检验单号', field: 'inspectionCode', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input', label: '来源单号', field: 'sourceCode', required: !0 },
          { type: 'input', label: '放行范围', field: 'scope', required: !0 },
          { type: 'input', label: '风险说明', field: 'riskNote', required: !0, props: { type: 'textarea', rows: 3 } },
          { type: 'input', label: '责任人', field: 'owner', required: !0 },
          { type: 'input', label: '有效期至', field: 'validUntil', required: !0 },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            required: !0,
            props: {
              options: [
                { label: '草拟', value: 'draft' },
                { label: '评审中', value: 'reviewing' },
                { label: '已放行', value: 'released' },
                { label: '已拒绝', value: 'rejected' }
              ]
            }
          }
        ]
      function C() {
        n.value = !1
      }
      async function h() {
        return (l('submit'), !1)
      }
      return (A, i) => {
        const c = k('gi-form'),
          f = k('gi-dialog')
        return (
          D(),
          U(
            f,
            {
              modelValue: n.value,
              'onUpdate:modelValue': i[1] || (i[1] = (r) => (n.value = r)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': h,
              'on-cancel': C,
              title: p.mode === 'add' ? '新增特采放行' : '编辑特采放行',
              width: '720px'
            },
            {
              default: b(() => [
                g(c, { modelValue: s.value, 'onUpdate:modelValue': i[0] || (i[0] = (r) => (s.value = r)), columns: _, 'label-width': 110 }, null, 8, [
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
  G = X,
  H = V({
    __name: 'index',
    setup(p) {
      const y = [{ key: 'export', label: '导出' }],
        n = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        s = [
          { value: 'draft', label: '草拟', type: 'info' },
          { value: 'reviewing', label: '评审中', type: 'warning' },
          { value: 'released', label: '已放行', type: 'success' },
          { value: 'rejected', label: '已拒绝', type: 'danger' }
        ],
        l = v({ code: '', inspectionCode: '', status: '' }),
        _ = [
          { type: 'input', label: '放行单号', field: 'code', props: { clearable: !0 } },
          { type: 'input', label: '检验单号', field: 'inspectionCode', props: { clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: s.map((e) => ({ label: e.label, value: e.value })), clearable: !0 } }
        ],
        C = [
          { prop: 'code', label: '放行单号', width: 160 },
          { prop: 'inspectionCode', label: '检验单号', width: 160 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'scope', label: '放行范围', minWidth: 220 },
          { prop: 'owner', label: '责任人', width: 100 },
          { prop: 'validUntil', label: '有效期至', width: 120 },
          { label: '状态', width: 100, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: h,
          pagination: A,
          loading: i,
          search: c,
          refresh: f,
          onDelete: r
        } = W({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) =>
            (
              await z({
                pageNum: e,
                pageSize: t,
                code: l.value.code || void 0,
                inspectionCode: l.value.inspectionCode || void 0,
                status: l.value.status || void 0
              })
            ).data,
          deleteAPI: (e) => Promise.all(e.map((t) => K(t)))
        }),
        u = v(!1),
        m = v('add'),
        o = v(q())
      function q() {
        return {
          id: '',
          code: '',
          inspectionCode: '',
          material: '',
          sourceCode: '',
          scope: '',
          riskNote: '',
          owner: '',
          status: 'draft',
          validUntil: '2026-07-31',
          createdAt: '2026-07-15 09:00'
        }
      }
      function N() {
        ;((l.value = { code: '', inspectionCode: '', status: '' }), c())
      }
      function R(e) {
        e === 'export' && w.success('特采放行静态数据已导出')
      }
      function S() {
        ;((m.value = 'add'), (o.value = q()), (u.value = !0))
      }
      function F(e) {
        ;((m.value = 'edit'), (o.value = { ...e }), (u.value = !0))
      }
      function P(e, t) {
        ;(e === 'edit' && F(t), e === 'delete' && r(t))
      }
      async function T() {
        ;(m.value === 'add' ? (await L(o.value), w.success('新增成功')) : (await O(o.value.id, o.value), w.success('编辑成功')),
          (u.value = !1),
          await f())
      }
      return (e, t) => (
        D(),
        U(
          E,
          {
            'search-model': l.value,
            'onUpdate:searchModel': t[2] || (t[2] = (a) => (l.value = a)),
            title: '特采放行列表',
            'search-columns': _,
            columns: C,
            data: d(h),
            pagination: d(A),
            loading: d(i),
            'toolbar-actions': y,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: d(c),
            onReset: N,
            onRefresh: d(f),
            onAdd: S,
            onToolbarAction: R
          },
          {
            status: b(({ row: a }) => [g(j, { value: a.status, options: s }, null, 8, ['value'])]),
            actions: b(({ row: a }) => [g(I, { actions: n, onAction: (B) => P(B, a) }, null, 8, ['onAction'])]),
            dialog: b(() => [
              g(
                G,
                {
                  visible: u.value,
                  'onUpdate:visible': t[0] || (t[0] = (a) => (u.value = a)),
                  form: o.value,
                  'onUpdate:form': t[1] || (t[1] = (a) => (o.value = a)),
                  mode: m.value,
                  onSubmit: T
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
  }),
  te = H
export { te as default }
