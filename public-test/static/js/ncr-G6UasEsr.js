import {
  Bn as o,
  Fn as q,
  Mn as M,
  On as V,
  U as J,
  W as K,
  Xn as b,
  an as R,
  dn as i,
  i as N,
  pn as S,
  rn as L,
  rr as v,
  sr as g,
  un as y,
  yn as U
} from './element-plus-CzL7BOKu.js'
import { I as X } from './index-DqMfCNbk.js'
import { t as G } from './useTable-Hzr4fBAy.js'
import { t as A } from './StatusTag-DWd3m1xj.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
import { D as Y, d as Z, r as $, y as ee } from './qms-DDSeKvwp.js'
var le = S({
    __name: 'NcrDecisionDialog',
    props: U({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: U(['submit'], ['update:visible', 'update:form']),
    setup(m, { emit: _ }) {
      const f = m,
        c = q(m, 'visible'),
        s = q(m, 'form'),
        n = _,
        w = L(() => (f.mode === 'add' ? '新增不合格处置' : f.mode === 'judge' ? '执行质量裁决' : '编辑不合格处置')),
        h = [
          {
            type: 'select-v2',
            label: '严重等级',
            field: 'severity',
            required: !0,
            props: {
              options: [
                { label: '严重', value: 'critical' },
                { label: '主要', value: 'major' },
                { label: '次要', value: 'minor' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '裁决动作',
            field: 'disposition',
            required: !0,
            props: {
              options: [
                { label: '待裁决', value: 'pending' },
                { label: '返工', value: 'rework' },
                { label: '报废', value: 'scrap' },
                { label: '让步接收', value: 'concession' },
                { label: '复检', value: 'reinspect' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '处理状态',
            field: 'status',
            required: !0,
            props: {
              options: [
                { label: '待处理', value: 'open' },
                { label: '处理中', value: 'reviewing' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          },
          { type: 'input', label: '责任人', field: 'owner', required: !0 },
          { type: 'input', label: '后续动作', field: 'followUp', required: !0 },
          { type: 'input', label: '问题描述', field: 'issueDesc', required: !0, props: { type: 'textarea', rows: 4 } }
        ]
      function C() {
        c.value = !1
      }
      async function D() {
        return (n('submit'), !1)
      }
      return (k, d) => {
        const p = K,
          x = J,
          u = M('gi-form'),
          r = M('gi-dialog')
        return (
          V(),
          R(
            r,
            {
              modelValue: c.value,
              'onUpdate:modelValue': d[1] || (d[1] = (l) => (c.value = l)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': D,
              'on-cancel': C,
              title: w.value,
              width: '720px'
            },
            {
              default: o(() => [
                i(
                  x,
                  { column: 2, border: '', class: 'source-block' },
                  {
                    default: o(() => [
                      i(p, { label: '处置单号' }, { default: o(() => [y(g(s.value.code || '-'), 1)]), _: 1 }),
                      i(p, { label: '检验单号' }, { default: o(() => [y(g(s.value.inspectionCode || '-'), 1)]), _: 1 }),
                      i(p, { label: '物料名称' }, { default: o(() => [y(g(s.value.material || '-'), 1)]), _: 1 }),
                      i(p, { label: '来源单号' }, { default: o(() => [y(g(s.value.sourceCode || '-'), 1)]), _: 1 })
                    ]),
                    _: 1
                  }
                ),
                i(
                  u,
                  {
                    modelValue: s.value,
                    'onUpdate:modelValue': d[0] || (d[0] = (l) => (s.value = l)),
                    columns: h,
                    'label-width': 110,
                    style: { 'margin-top': '16px' }
                  },
                  null,
                  8,
                  ['modelValue']
                )
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
  te = X(le, [['__scopeId', 'data-v-7c7153cf']]),
  ae = S({
    __name: 'index',
    setup(m) {
      const _ = [{ key: 'export', label: '导出' }],
        f = [
          { value: 'critical', label: '严重', type: 'danger' },
          { value: 'major', label: '主要', type: 'warning' },
          { value: 'minor', label: '次要', type: 'info' }
        ],
        c = [
          { value: 'open', label: '待处理', type: 'warning' },
          { value: 'reviewing', label: '处理中', type: 'primary' },
          { value: 'closed', label: '已关闭', type: 'success' }
        ],
        s = [
          { value: 'pending', label: '待裁决', type: 'info' },
          { value: 'rework', label: '返工', type: 'danger' },
          { value: 'scrap', label: '报废', type: 'danger' },
          { value: 'concession', label: '让步接收', type: 'warning' },
          { value: 'reinspect', label: '复检', type: 'primary' }
        ],
        n = b({ code: '', inspectionCode: '', status: '', disposition: '' }),
        w = [
          { type: 'input', label: '处置单号', field: 'code', props: { clearable: !0 } },
          { type: 'input', label: '检验单号', field: 'inspectionCode', props: { clearable: !0 } },
          {
            type: 'select-v2',
            label: '处理状态',
            field: 'status',
            props: { options: c.map((e) => ({ label: e.label, value: e.value })), clearable: !0 }
          },
          {
            type: 'select-v2',
            label: '裁决动作',
            field: 'disposition',
            props: { options: s.map((e) => ({ label: e.label, value: e.value })), clearable: !0 }
          }
        ],
        h = [
          { prop: 'code', label: '处置单号', width: 160 },
          { prop: 'inspectionCode', label: '检验单号', width: 160 },
          { prop: 'material', label: '物料名称', minWidth: 160 },
          { prop: 'sourceCode', label: '来源单号', width: 150 },
          { label: '严重等级', width: 100, slotName: 'severity', align: 'center' },
          { label: '裁决动作', width: 120, slotName: 'disposition', align: 'center' },
          { label: '处理状态', width: 100, slotName: 'status', align: 'center' },
          { prop: 'followUp', label: '后续动作', minWidth: 160 },
          { label: '操作', minWidth: 180, slotName: 'actions', align: 'center', fixed: 'right' }
        ],
        {
          tableData: C,
          pagination: D,
          loading: k,
          search: d,
          refresh: p,
          onDelete: x
        } = G({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) =>
            (
              await ee({
                pageNum: e,
                pageSize: t,
                code: n.value.code || void 0,
                inspectionCode: n.value.inspectionCode || void 0,
                status: n.value.status || void 0,
                disposition: n.value.disposition || void 0
              })
            ).data,
          deleteAPI: (e) => Promise.all(e.map((t) => Z(t)))
        }),
        u = b(!1),
        r = b('add'),
        l = b(j())
      function j() {
        return {
          id: '',
          code: '',
          inspectionCode: '',
          inspectionCategory: 'incoming',
          material: '',
          sourceCode: '',
          sourceType: 'receipt',
          severity: 'major',
          status: 'open',
          disposition: 'pending',
          owner: '',
          issueDesc: '',
          followUp: '',
          createdAt: '2026-07-15 09:00'
        }
      }
      function T() {
        ;((n.value = { code: '', inspectionCode: '', status: '', disposition: '' }), d())
      }
      function I(e) {
        e === 'export' && N.success('不合格处置静态数据已导出')
      }
      function P() {
        ;((r.value = 'add'), (l.value = j()), (u.value = !0))
      }
      function B(e) {
        ;((r.value = 'edit'), (l.value = { ...e }), (u.value = !0))
      }
      function E(e) {
        ;((r.value = 'judge'), (l.value = { ...e, status: e.status === 'open' ? 'reviewing' : e.status }), (u.value = !0))
      }
      function O(e) {
        return [
          { key: 'judge', label: e.status === 'closed' ? '查看' : '裁决', tone: 'primary' },
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      }
      function W(e, t) {
        if (e === 'judge') {
          E(t)
          return
        }
        if (e === 'edit') {
          B(t)
          return
        }
        e === 'delete' && x(t)
      }
      async function F() {
        const e = {
          ...l.value,
          status: r.value === 'judge' && l.value.disposition !== 'pending' && l.value.status === 'open' ? 'reviewing' : l.value.status
        }
        ;(r.value === 'add'
          ? (await $(e), N.success('新增成功'))
          : (await Y(l.value.id, e), N.success(r.value === 'judge' ? '裁决已保存' : '编辑成功')),
          (u.value = !1),
          await p())
      }
      return (e, t) => (
        V(),
        R(
          H,
          {
            'search-model': n.value,
            'onUpdate:searchModel': t[2] || (t[2] = (a) => (n.value = a)),
            title: '不合格处置列表',
            'search-columns': w,
            columns: h,
            data: v(C),
            pagination: v(D),
            loading: v(k),
            'toolbar-actions': _,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: v(d),
            onReset: T,
            onRefresh: v(p),
            onAdd: P,
            onToolbarAction: I
          },
          {
            severity: o(({ row: a }) => [i(A, { value: a.severity, options: f }, null, 8, ['value'])]),
            disposition: o(({ row: a }) => [i(A, { value: a.disposition, options: s }, null, 8, ['value'])]),
            status: o(({ row: a }) => [i(A, { value: a.status, options: c }, null, 8, ['value'])]),
            actions: o(({ row: a }) => [i(Q, { actions: O(a), onAction: (z) => W(z, a) }, null, 8, ['actions', 'onAction'])]),
            dialog: o(() => [
              i(
                te,
                {
                  visible: u.value,
                  'onUpdate:visible': t[0] || (t[0] = (a) => (u.value = a)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (a) => (l.value = a)),
                  mode: r.value,
                  onSubmit: F
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
  pe = ae
export { pe as default }
