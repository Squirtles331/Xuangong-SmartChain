import { Bn as p, Fn as x, Mn as R, On as D, Xn as g, an as I, dn as c, i as A, pn as M, rr as d, yn as k } from './element-plus-CzL7BOKu.js'
import { t as O } from './useTable-Hzr4fBAy.js'
import { t as q } from './StatusTag-DWd3m1xj.js'
import { t as W } from './CrudPage-7Q0FEhS_.js'
import { t as z } from './CrudRowActions-Dmc4i_Io.js'
import { a as E, k as F, p as K, x as L } from './qms-DDSeKvwp.js'
var X = M({
    __name: 'ReInspectionDialog',
    props: k({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: k(['submit'], ['update:visible', 'update:form']),
    setup(v, { emit: y }) {
      const s = x(v, 'visible'),
        u = x(v, 'form'),
        m = y,
        a = [
          { type: 'input', label: '关闭单号', field: 'code', required: !0 },
          { type: 'input', label: '检验单号', field: 'inspectionCode', required: !0 },
          { type: 'input', label: '来源单号', field: 'sourceCode', required: !0 },
          { type: 'input', label: '物料名称', field: 'material', required: !0 },
          { type: 'input', label: '前序裁决', field: 'previousDecision', required: !0 },
          { type: 'input', label: '解锁动作', field: 'unlockAction', required: !0, props: { type: 'textarea', rows: 3 } },
          { type: 'input', label: '责任人', field: 'owner', required: !0 },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            required: !0,
            props: {
              options: [
                { label: '待复检', value: 'pending' },
                { label: '处理中', value: 'executing' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '结果',
            field: 'result',
            required: !0,
            props: {
              options: [
                { label: '待确认', value: 'pending' },
                { label: '通过', value: 'pass' },
                { label: '失败', value: 'fail' }
              ]
            }
          }
        ]
      function _() {
        s.value = !1
      }
      async function h() {
        return (m('submit'), !1)
      }
      return (C, i) => {
        const w = R('gi-form'),
          f = R('gi-dialog')
        return (
          D(),
          I(
            f,
            {
              modelValue: s.value,
              'onUpdate:modelValue': i[1] || (i[1] = (n) => (s.value = n)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': h,
              'on-cancel': _,
              title: v.mode === 'add' ? '新增复检关闭' : '编辑复检关闭',
              width: '720px'
            },
            {
              default: p(() => [
                c(w, { modelValue: u.value, 'onUpdate:modelValue': i[0] || (i[0] = (n) => (u.value = n)), columns: a, 'label-width': 110 }, null, 8, [
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
  j = X,
  G = M({
    __name: 'index',
    setup(v) {
      const y = [{ key: 'export', label: '导出' }],
        s = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        u = [
          { value: 'pending', label: '待复检', type: 'warning' },
          { value: 'executing', label: '处理中', type: 'primary' },
          { value: 'closed', label: '已关闭', type: 'success' }
        ],
        m = [
          { value: 'pending', label: '待确认', type: 'info' },
          { value: 'pass', label: '通过', type: 'success' },
          { value: 'fail', label: '失败', type: 'danger' }
        ],
        a = g({ code: '', status: '', result: '' }),
        _ = [
          { type: 'input', label: '关闭单号 / 检验单号', field: 'code', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { options: u.map((e) => ({ label: e.label, value: e.value })), clearable: !0 }
          },
          { type: 'select-v2', label: '结果', field: 'result', props: { options: m.map((e) => ({ label: e.label, value: e.value })), clearable: !0 } }
        ],
        h = [
          { prop: 'code', label: '关闭单号', width: 160 },
          { prop: 'inspectionCode', label: '检验单号', width: 160 },
          { prop: 'material', label: '物料名称', minWidth: 150 },
          { prop: 'previousDecision', label: '前序裁决', width: 120 },
          { label: '状态', width: 100, slotName: 'status', align: 'center' },
          { label: '结果', width: 100, slotName: 'result', align: 'center' },
          { prop: 'unlockAction', label: '解锁动作', minWidth: 220 },
          { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: C,
          pagination: i,
          loading: w,
          search: f,
          refresh: n,
          onDelete: V
        } = O({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) =>
            (await L({ pageNum: e, pageSize: l, code: a.value.code || void 0, status: a.value.status || void 0, result: a.value.result || void 0 }))
              .data,
          deleteAPI: (e) => Promise.all(e.map((l) => K(l)))
        }),
        r = g(!1),
        b = g('add'),
        o = g({
          id: '',
          code: '',
          sourceCode: '',
          inspectionCode: '',
          material: '',
          previousDecision: '',
          unlockAction: '',
          owner: '',
          status: 'pending',
          result: 'pending',
          createdAt: '2026-07-15 09:00'
        })
      function S() {
        ;((a.value = { code: '', status: '', result: '' }), f())
      }
      function N(e) {
        e === 'export' && A.success('复检与关闭静态数据已导出')
      }
      function P() {
        ;((b.value = 'add'),
          (o.value = {
            id: '',
            code: '',
            sourceCode: '',
            inspectionCode: '',
            material: '',
            previousDecision: '',
            unlockAction: '',
            owner: '',
            status: 'pending',
            result: 'pending',
            createdAt: '2026-07-15 09:00'
          }),
          (r.value = !0))
      }
      function U(e, l) {
        ;(e === 'edit' && ((b.value = 'edit'), (o.value = { ...l }), (r.value = !0)), e === 'delete' && V(l))
      }
      async function B() {
        ;(b.value === 'add' ? (await E(o.value), A.success('新增成功')) : (await F(o.value.id, o.value), A.success('编辑成功')),
          (r.value = !1),
          await n())
      }
      return (e, l) => (
        D(),
        I(
          W,
          {
            'search-model': a.value,
            'onUpdate:searchModel': l[2] || (l[2] = (t) => (a.value = t)),
            title: '复检与关闭列表',
            'search-columns': _,
            columns: h,
            data: d(C),
            pagination: d(i),
            loading: d(w),
            'toolbar-actions': y,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: d(f),
            onReset: S,
            onRefresh: d(n),
            onAdd: P,
            onToolbarAction: N
          },
          {
            status: p(({ row: t }) => [c(q, { value: t.status, options: u }, null, 8, ['value'])]),
            result: p(({ row: t }) => [c(q, { value: t.result, options: m }, null, 8, ['value'])]),
            actions: p(({ row: t }) => [c(z, { actions: s, onAction: (T) => U(T, t) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              c(
                j,
                {
                  visible: r.value,
                  'onUpdate:visible': l[0] || (l[0] = (t) => (r.value = t)),
                  form: o.value,
                  'onUpdate:form': l[1] || (l[1] = (t) => (o.value = t)),
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
