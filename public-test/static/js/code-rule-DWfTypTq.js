import {
  Bn as D,
  Fn as k,
  Kn as E,
  On as C,
  Xn as y,
  Yn as I,
  an as L,
  dn as S,
  i as _,
  in as M,
  pn as A,
  rn as w,
  rr as f,
  sr as N,
  yn as R
} from './element-plus-CzL7BOKu.js'
import { t as V } from './useTable-Hzr4fBAy.js'
import { t as K } from './CrudFormDialog-1OgQthWb.js'
import { t as z } from './CrudPage-7Q0FEhS_.js'
import { t as G } from './CrudRowActions-Dmc4i_Io.js'
import { c as p } from './static-data-B3FhK4xc.js'
var O = { class: 'preview-box', style: { 'margin-top': '16px', padding: '12px', background: '#f5f7fa', 'border-radius': '6px' } },
  T = { style: { 'font-size': '16px', 'font-weight': 'bold', color: '#409eff', 'margin-left': '8px' } },
  X = A({
    __name: 'CodeRuleFormDialog',
    props: R({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: R(['submit'], ['update:visible', 'update:form']),
    setup(c, { emit: Y }) {
      const g = k(c, 'visible'),
        n = k(c, 'form'),
        r = Y,
        s = w(() => [
          { type: 'input', label: '规则编码', field: 'code', required: !0 },
          { type: 'input', label: '规则名称', field: 'name', required: !0 },
          { type: 'input', label: '前缀', field: 'prefix', required: !0 },
          {
            type: 'select-v2',
            label: '日期格式',
            field: 'dateFormat',
            required: !0,
            props: {
              options: [
                { label: 'YYYYMMDD', value: 'YYYYMMDD' },
                { label: 'YYMMDD', value: 'YYMMDD' },
                { label: 'YYYYMM', value: 'YYYYMM' }
              ]
            }
          },
          { type: 'input-number', label: '流水号长度', field: 'serialLength', required: !0, props: { min: 2, max: 10 } }
        ]),
        u = w(() => {
          const b = n.value.prefix || '???',
            l = new Date(),
            i = l.getFullYear().toString(),
            m = (l.getMonth() + 1).toString().padStart(2, '0'),
            v = l.getDate().toString().padStart(2, '0')
          let d = ''
          switch (n.value.dateFormat) {
            case 'YYYYMMDD':
              d = i + m + v
              break
            case 'YYMMDD':
              d = i.slice(2) + m + v
              break
            case 'YYYYMM':
              d = i + m
              break
            default:
              d = i + m + v
          }
          const x = '1'.padStart(n.value.serialLength || 4, '0')
          return `${b}${d}${x}`
        })
      function e() {
        return !n.value.code || !n.value.name || !n.value.prefix ? (_.warning('请完善编码规则信息'), !1) : !0
      }
      return (b, l) => (
        C(),
        L(
          K,
          {
            visible: g.value,
            'onUpdate:visible': l[0] || (l[0] = (i) => (g.value = i)),
            title: c.mode === 'add' ? '新增编码规则' : '编辑编码规则',
            form: n.value,
            'onUpdate:form': l[1] || (l[1] = (i) => (n.value = i)),
            columns: s.value,
            'label-width': 120,
            width: '550px',
            'before-submit': e,
            onSubmit: l[2] || (l[2] = (i) => r('submit'))
          },
          {
            default: D(() => [
              M('div', O, [
                l[3] || (l[3] = M('span', { style: { 'font-size': '13px', color: '#606266' } }, '编码预览：', -1)),
                M('span', T, N(u.value), 1)
              ])
            ]),
            _: 1
          },
          8,
          ['visible', 'title', 'form', 'columns']
        )
      )
    }
  }),
  j = X,
  H = A({
    __name: 'index',
    setup(c) {
      const Y = [{ type: 'input', label: '关键字', field: 'keyword', props: { clearable: !0 } }],
        g = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        n = [
          { prop: 'code', label: '规则编码', minWidth: 120 },
          { prop: 'name', label: '规则名称', minWidth: 160 },
          { prop: 'prefix', label: '前缀', minWidth: 100 },
          { prop: 'dateFormat', label: '日期格式', minWidth: 120 },
          { prop: 'serialLength', label: '流水号长度', minWidth: 120, align: 'center' },
          { prop: 'example', label: '预览示例', minWidth: 180 },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let r = I({ keyword: '' })
      const s = y(!1),
        u = y('add'),
        e = y(F()),
        b = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        l = w(() => p.value.filter((a) => !r.keyword || a.code.includes(r.keyword) || a.name.includes(r.keyword) || a.prefix.includes(r.keyword))),
        {
          tableData: i,
          pagination: m,
          loading: v,
          search: d,
          refresh: x,
          onDelete: q
        } = V({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const o = (a - 1) * t,
              h = o + t
            return { list: l.value.slice(o, h), total: l.value.length }
          },
          deleteAPI: async (a) => {
            p.value = p.value.filter((t) => !a.includes(t.id))
          }
        })
      function F() {
        return { id: '', code: '', name: '', prefix: '', dateFormat: 'YYYYMMDD', serialLength: 4 }
      }
      function W() {
        ;((r.keyword = ''), d())
      }
      function U() {
        ;((u.value = 'add'), (e.value = F()), (s.value = !0))
      }
      function $(a) {
        ;((u.value = 'edit'),
          (e.value = { id: a.id, code: a.code, name: a.name, prefix: a.prefix, dateFormat: a.dateFormat, serialLength: a.serialLength }),
          (s.value = !0))
      }
      function B(a, t) {
        if (a === 'edit') {
          $(t)
          return
        }
        a === 'delete' && q(t)
      }
      async function P() {
        if (!e.value.code || !e.value.name || !e.value.prefix) {
          _.warning('请填写规则编码、规则名称和前缀')
          return
        }
        const a = `${e.value.prefix}20250115${'0'.repeat(e.value.serialLength - 1)}1`
        ;(u.value === 'add'
          ? p.value.unshift({
              id: `RULE-${String(p.value.length + 1).padStart(3, '0')}`,
              code: e.value.code,
              name: e.value.name,
              prefix: e.value.prefix,
              dateFormat: e.value.dateFormat,
              serialLength: e.value.serialLength,
              example: a
            })
          : (p.value = p.value.map((t) =>
              t.id === e.value.id
                ? {
                    ...t,
                    code: e.value.code,
                    name: e.value.name,
                    prefix: e.value.prefix,
                    dateFormat: e.value.dateFormat,
                    serialLength: e.value.serialLength,
                    example: a
                  }
                : t
            )),
          (s.value = !1),
          await x(),
          _.success(u.value === 'add' ? '已新增静态编码规则数据' : '已更新静态编码规则数据'))
      }
      return (a, t) => (
        C(),
        L(
          z,
          {
            'search-model': f(r),
            'onUpdate:searchModel': t[2] || (t[2] = (o) => (E(r) ? (r.value = o) : (r = o))),
            title: '编码规则',
            'search-columns': Y,
            'search-grid-item-props': g,
            columns: n,
            data: f(i),
            pagination: f(m),
            loading: f(v),
            onSearch: f(d),
            onReset: W,
            onRefresh: f(x),
            onAdd: U
          },
          {
            actions: D(({ row: o }) => [S(G, { actions: b, onAction: (h) => B(h, o) }, null, 8, ['onAction'])]),
            dialog: D(() => [
              S(
                j,
                {
                  visible: s.value,
                  'onUpdate:visible': t[0] || (t[0] = (o) => (s.value = o)),
                  form: e.value,
                  'onUpdate:form': t[1] || (t[1] = (o) => (e.value = o)),
                  mode: u.value,
                  onSubmit: P
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
  le = H
export { le as default }
