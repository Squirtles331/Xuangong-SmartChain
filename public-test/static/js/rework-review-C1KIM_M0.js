import { Bn as p, Fn as C, Mn as A, On as M, Xn as w, an as V, dn as c, i as h, pn as D, rr as d, yn as q } from './element-plus-CzL7BOKu.js'
import { t as W } from './useTable-Hzr4fBAy.js'
import { t as x } from './StatusTag-DWd3m1xj.js'
import { t as j } from './CrudPage-7Q0FEhS_.js'
import { t as I } from './CrudRowActions-Dmc4i_Io.js'
import { A as z, S as E, m as F, o as K } from './qms-DDSeKvwp.js'
var L = D({
    __name: 'ReworkReviewDialog',
    props: q({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: q(['submit'], ['update:visible', 'update:form']),
    setup(v, { emit: g }) {
      const n = C(v, 'visible'),
        s = C(v, 'form'),
        m = g,
        t = [
          { type: 'input', label: '裁决单号', field: 'code', required: !0 },
          { type: 'input', label: '不合格单号', field: 'ncrCode', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input', label: '工单号', field: 'workOrderCode', required: !0 },
          { type: 'input', label: '来源单号', field: 'sourceCode', required: !0 },
          { type: 'input', label: '返工路径', field: 'reviewRoute', required: !0 },
          { type: 'input', label: '复检规则', field: 'reinspectionRule', required: !0, props: { type: 'textarea', rows: 3 } },
          { type: 'input', label: '责任人', field: 'owner', required: !0 },
          {
            type: 'select-v2',
            label: '裁决结果',
            field: 'decision',
            required: !0,
            props: {
              options: [
                { label: '待裁决', value: 'pending' },
                { label: '允许返工', value: 'approved' },
                { label: '不允许返工', value: 'rejected' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            required: !0,
            props: {
              options: [
                { label: '待处理', value: 'open' },
                { label: '评审中', value: 'reviewing' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          }
        ]
      function y() {
        n.value = !1
      }
      async function R() {
        return (m('submit'), !1)
      }
      return (k, i) => {
        const _ = A('gi-form'),
          f = A('gi-dialog')
        return (
          M(),
          V(
            f,
            {
              modelValue: n.value,
              'onUpdate:modelValue': i[1] || (i[1] = (r) => (n.value = r)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': R,
              'on-cancel': y,
              title: v.mode === 'add' ? '新增返工裁决' : '编辑返工裁决',
              width: '720px'
            },
            {
              default: p(() => [
                c(_, { modelValue: s.value, 'onUpdate:modelValue': i[0] || (i[0] = (r) => (s.value = r)), columns: t, 'label-width': 110 }, null, 8, [
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
  X = L,
  G = D({
    __name: 'index',
    setup(v) {
      const g = [{ key: 'export', label: '导出' }],
        n = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        s = [
          { value: 'pending', label: '待裁决', type: 'info' },
          { value: 'approved', label: '允许返工', type: 'success' },
          { value: 'rejected', label: '不允许返工', type: 'danger' }
        ],
        m = [
          { value: 'open', label: '待处理', type: 'warning' },
          { value: 'reviewing', label: '评审中', type: 'primary' },
          { value: 'closed', label: '已关闭', type: 'success' }
        ],
        t = w({ code: '', decision: '', status: '' }),
        y = [
          { type: 'input', label: '裁决单号 / 工单号', field: 'code', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '裁决结果',
            field: 'decision',
            props: { options: s.map((e) => ({ label: e.label, value: e.value })), clearable: !0 }
          },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: m.map((e) => ({ label: e.label, value: e.value })), clearable: !0 } }
        ],
        R = [
          { prop: 'code', label: '裁决单号', width: 160 },
          { prop: 'ncrCode', label: '不合格单号', width: 160 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'workOrderCode', label: '工单号', width: 160 },
          { label: '裁决结果', width: 110, slotName: 'decision', align: 'center' },
          { label: '状态', width: 100, slotName: 'status', align: 'center' },
          { prop: 'reviewRoute', label: '返工路径', minWidth: 220 },
          { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: k,
          pagination: i,
          loading: _,
          search: f,
          refresh: r,
          onDelete: O
        } = W({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) =>
            (
              await E({
                pageNum: e,
                pageSize: l,
                code: t.value.code || void 0,
                decision: t.value.decision || void 0,
                status: t.value.status || void 0
              })
            ).data,
          deleteAPI: (e) => Promise.all(e.map((l) => F(l)))
        }),
        u = w(!1),
        b = w('add'),
        o = w({
          id: '',
          code: '',
          ncrCode: '',
          material: '',
          workOrderCode: '',
          sourceCode: '',
          reviewRoute: '',
          reinspectionRule: '',
          owner: '',
          status: 'open',
          decision: 'pending',
          createdAt: '2026-07-15 09:00'
        })
      function S() {
        ;((t.value = { code: '', decision: '', status: '' }), f())
      }
      function N(e) {
        e === 'export' && h.success('返工裁决静态数据已导出')
      }
      function P() {
        ;((b.value = 'add'),
          (o.value = {
            id: '',
            code: '',
            ncrCode: '',
            material: '',
            workOrderCode: '',
            sourceCode: '',
            reviewRoute: '',
            reinspectionRule: '',
            owner: '',
            status: 'open',
            decision: 'pending',
            createdAt: '2026-07-15 09:00'
          }),
          (u.value = !0))
      }
      function U(e, l) {
        ;(e === 'edit' && ((b.value = 'edit'), (o.value = { ...l }), (u.value = !0)), e === 'delete' && O(l))
      }
      async function B() {
        ;(b.value === 'add' ? (await K(o.value), h.success('新增成功')) : (await z(o.value.id, o.value), h.success('编辑成功')),
          (u.value = !1),
          await r())
      }
      return (e, l) => (
        M(),
        V(
          j,
          {
            'search-model': t.value,
            'onUpdate:searchModel': l[2] || (l[2] = (a) => (t.value = a)),
            title: '返工裁决列表',
            'search-columns': y,
            columns: R,
            data: d(k),
            pagination: d(i),
            loading: d(_),
            'toolbar-actions': g,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: d(f),
            onReset: S,
            onRefresh: d(r),
            onAdd: P,
            onToolbarAction: N
          },
          {
            decision: p(({ row: a }) => [c(x, { value: a.decision, options: s }, null, 8, ['value'])]),
            status: p(({ row: a }) => [c(x, { value: a.status, options: m }, null, 8, ['value'])]),
            actions: p(({ row: a }) => [c(I, { actions: n, onAction: (T) => U(T, a) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              c(
                X,
                {
                  visible: u.value,
                  'onUpdate:visible': l[0] || (l[0] = (a) => (u.value = a)),
                  form: o.value,
                  'onUpdate:form': l[1] || (l[1] = (a) => (o.value = a)),
                  mode: b.value,
                  onSubmit: B
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
  ee = G
export { ee as default }
