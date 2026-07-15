import { Bn as b, Fn as q, Mn as R, On as x, Xn as f, an as M, dn as g, i as A, pn as V, rr as d, yn as S } from './element-plus-CzL7BOKu.js'
import { t as T } from './useTable-Hzr4fBAy.js'
import { t as W } from './StatusTag-DWd3m1xj.js'
import { t as I } from './CrudPage-7Q0FEhS_.js'
import { t as O } from './CrudRowActions-Dmc4i_Io.js'
import { C as j, h as z, j as E, s as F } from './qms-DDSeKvwp.js'
var K = V({
    __name: 'ScrapReviewDialog',
    props: S({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: S(['submit'], ['update:visible', 'update:form']),
    setup(p, { emit: y }) {
      const r = q(p, 'visible'),
        n = q(p, 'form'),
        l = y,
        w = [
          { type: 'input', label: '裁决单号', field: 'code', required: !0 },
          { type: 'input', label: '不合格单号', field: 'ncrCode', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input', label: '来源单号', field: 'sourceCode', required: !0 },
          { type: 'input', label: '报废原因', field: 'reason', required: !0, props: { type: 'textarea', rows: 3 } },
          { type: 'input-number', label: '报废数量', field: 'qty', props: { min: 1 } },
          { type: 'input-number', label: '损失金额', field: 'lossAmount', props: { min: 0 } },
          { type: 'input', label: '责任人', field: 'owner', required: !0 },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            required: !0,
            props: {
              options: [
                { label: '待审批', value: 'pending' },
                { label: '已批准', value: 'approved' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          }
        ]
      function _() {
        r.value = !1
      }
      async function h() {
        return (l('submit'), !1)
      }
      return (C, i) => {
        const c = R('gi-form'),
          m = R('gi-dialog')
        return (
          x(),
          M(
            m,
            {
              modelValue: r.value,
              'onUpdate:modelValue': i[1] || (i[1] = (s) => (r.value = s)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': h,
              'on-cancel': _,
              title: p.mode === 'add' ? '新增报废裁决' : '编辑报废裁决',
              width: '720px'
            },
            {
              default: b(() => [
                g(c, { modelValue: n.value, 'onUpdate:modelValue': i[0] || (i[0] = (s) => (n.value = s)), columns: w, 'label-width': 110 }, null, 8, [
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
  L = K,
  X = V({
    __name: 'index',
    setup(p) {
      const y = [{ key: 'export', label: '导出' }],
        r = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        n = [
          { value: 'pending', label: '待审批', type: 'warning' },
          { value: 'approved', label: '已批准', type: 'success' },
          { value: 'closed', label: '已关闭', type: 'info' }
        ],
        l = f({ code: '', status: '' }),
        w = [
          { type: 'input', label: '裁决单号 / 不合格单号', field: 'code', props: { clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: n.map((a) => ({ label: a.label, value: a.value })), clearable: !0 } }
        ],
        _ = [
          { prop: 'code', label: '裁决单号', width: 160 },
          { prop: 'ncrCode', label: '不合格单号', width: 160 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'qty', label: '报废数量', width: 100, align: 'center' },
          { prop: 'lossAmount', label: '损失金额', width: 120, align: 'right' },
          { label: '状态', width: 100, slotName: 'status', align: 'center' },
          { prop: 'reason', label: '报废原因', minWidth: 220 },
          { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: h,
          pagination: C,
          loading: i,
          search: c,
          refresh: m,
          onDelete: s
        } = T({
          rowKey: 'id',
          listAPI: async ({ page: a, size: e }) =>
            (await j({ pageNum: a, pageSize: e, code: l.value.code || void 0, status: l.value.status || void 0 })).data,
          deleteAPI: (a) => Promise.all(a.map((e) => z(e)))
        }),
        u = f(!1),
        v = f('add'),
        o = f({
          id: '',
          code: '',
          ncrCode: '',
          material: '',
          sourceCode: '',
          reason: '',
          qty: 1,
          lossAmount: 0,
          owner: '',
          status: 'pending',
          createdAt: '2026-07-15 09:00'
        })
      function k() {
        ;((l.value = { code: '', status: '' }), c())
      }
      function D(a) {
        a === 'export' && A.success('报废裁决静态数据已导出')
      }
      function P() {
        ;((v.value = 'add'),
          (o.value = {
            id: '',
            code: '',
            ncrCode: '',
            material: '',
            sourceCode: '',
            reason: '',
            qty: 1,
            lossAmount: 0,
            owner: '',
            status: 'pending',
            createdAt: '2026-07-15 09:00'
          }),
          (u.value = !0))
      }
      function U(a, e) {
        ;(a === 'edit' && ((v.value = 'edit'), (o.value = { ...e }), (u.value = !0)), a === 'delete' && s(e))
      }
      async function B() {
        ;(v.value === 'add' ? (await F(o.value), A.success('新增成功')) : (await E(o.value.id, o.value), A.success('编辑成功')),
          (u.value = !1),
          await m())
      }
      return (a, e) => (
        x(),
        M(
          I,
          {
            'search-model': l.value,
            'onUpdate:searchModel': e[2] || (e[2] = (t) => (l.value = t)),
            title: '报废裁决列表',
            'search-columns': w,
            columns: _,
            data: d(h),
            pagination: d(C),
            loading: d(i),
            'toolbar-actions': y,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: d(c),
            onReset: k,
            onRefresh: d(m),
            onAdd: P,
            onToolbarAction: D
          },
          {
            status: b(({ row: t }) => [g(W, { value: t.status, options: n }, null, 8, ['value'])]),
            actions: b(({ row: t }) => [g(O, { actions: r, onAction: (N) => U(N, t) }, null, 8, ['onAction'])]),
            dialog: b(() => [
              g(
                L,
                {
                  visible: u.value,
                  'onUpdate:visible': e[0] || (e[0] = (t) => (u.value = t)),
                  form: o.value,
                  'onUpdate:form': e[1] || (e[1] = (t) => (o.value = t)),
                  mode: v.value,
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
  $ = X
export { $ as default }
