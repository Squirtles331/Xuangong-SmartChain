import {
  Bn as n,
  Fn as w,
  Kn as J,
  On as V,
  Xn as C,
  Yn as X,
  an as k,
  dn as m,
  i as b,
  in as Y,
  it as $,
  on as H,
  pn as S,
  rn as N,
  rr as p,
  sr as D,
  un as M,
  yn as R
} from './element-plus-CzL7BOKu.js'
import { I as Q } from './index-DqMfCNbk.js'
import { t as Z } from './useTable-Hzr4fBAy.js'
import { t as ee } from './StatusTag-DWd3m1xj.js'
import { t as ae } from './CrudFormDialog-1OgQthWb.js'
import { t as te } from './CrudPage-7Q0FEhS_.js'
import { t as le } from './CrudRowActions-Dmc4i_Io.js'
import { v as s } from './static-data-B3FhK4xc.js'
var ue = S({
    __name: 'ConfigFormDialog',
    props: R({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: R(['submit'], ['update:visible', 'update:form']),
    setup(c, { emit: v }) {
      const f = w(c, 'visible'),
        i = w(c, 'form'),
        y = v,
        g = N(() => [
          { type: 'input', label: '参数编码', field: 'code', required: !0, props: { placeholder: '如：loginLockCount' } },
          { type: 'input', label: '参数名称', field: 'name', required: !0 },
          {
            type: 'select-v2',
            label: '所属分类',
            field: 'category',
            required: !0,
            props: {
              options: [
                { label: '认证与安全', value: 'auth' },
                { label: 'MRP 计划', value: 'mrp' },
                { label: '库存与仓储', value: 'stock' },
                { label: '生产管理', value: 'production' },
                { label: '财务管理', value: 'finance' },
                { label: '系统通用', value: 'system' },
                { label: '安全策略', value: 'security' },
                { label: '文件管理', value: 'file' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '值类型',
            field: 'valueType',
            required: !0,
            props: {
              options: [
                { label: '字符串', value: 'string' },
                { label: '数字', value: 'number' },
                { label: '布尔值', value: 'boolean' },
                { label: 'JSON', value: 'json' }
              ]
            }
          },
          { type: 'input', label: '参数值', field: 'value', required: !0 },
          { type: 'input', label: '默认值', field: 'defaultValue' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          },
          { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 2 } }
        ])
      function u() {
        return !i.value.code || !i.value.name || !i.value.value ? (b.warning('请完善参数信息'), !1) : !0
      }
      return (d, o) => (
        V(),
        k(
          ae,
          {
            visible: f.value,
            'onUpdate:visible': o[0] || (o[0] = (t) => (f.value = t)),
            form: i.value,
            'onUpdate:form': o[1] || (o[1] = (t) => (i.value = t)),
            title: c.mode === 'add' ? '新增参数' : '编辑参数',
            columns: g.value,
            'label-width': 110,
            width: '580px',
            'before-submit': u,
            onSubmit: o[2] || (o[2] = (t) => y('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  oe = ue,
  se = { class: 'param-value' },
  ie = S({
    __name: 'ConfigView',
    setup(c) {
      const v = [
          { label: '认证与安全', value: 'auth' },
          { label: 'MRP 计划', value: 'mrp' },
          { label: '库存与仓储', value: 'stock' },
          { label: '生产管理', value: 'production' },
          { label: '财务管理', value: 'finance' },
          { label: '系统通用', value: 'system' },
          { label: '安全策略', value: 'security' },
          { label: '文件管理', value: 'file' }
        ],
        f = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '参数名称或参数编码', clearable: !0 } },
          { type: 'select-v2', label: '分类', field: 'category', props: { clearable: !0, options: v } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              clearable: !0,
              options: [
                { label: '启用', value: 'active' },
                { label: '停用', value: 'disabled' }
              ]
            }
          }
        ],
        i = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        y = [
          { label: '启用', value: 'active', type: 'success' },
          { label: '停用', value: 'disabled', type: 'info' }
        ],
        g = [
          { prop: 'code', label: '参数编码', minWidth: 170 },
          { prop: 'name', label: '参数名称', minWidth: 160 },
          { label: '分类', minWidth: 120, slotName: 'category', align: 'center' },
          { label: '参数值', minWidth: 220, slotName: 'valueCell' },
          { prop: 'description', label: '说明', minWidth: 220, showOverflowTooltip: !0 },
          { prop: 'updatedAt', label: '更新时间', minWidth: 170 },
          { prop: 'updatedBy', label: '更新人', minWidth: 100 },
          { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let u = X({ keyword: '', category: '', status: '' })
      const d = C(!1),
        o = C('add'),
        t = C(A()),
        P = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'reset', label: '恢复默认', tone: 'warning' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        T = N(() => {
          const e = u.keyword.trim().toLowerCase()
          return s.value.filter((a) => {
            const r = !e || a.code.toLowerCase().includes(e) || a.name.toLowerCase().includes(e) || a.description.toLowerCase().includes(e),
              l = !u.category || a.category === u.category,
              _ = !u.status || a.status === u.status
            return r && l && _
          })
        }),
        {
          tableData: W,
          pagination: q,
          loading: B,
          search: x,
          refresh: h,
          onDelete: F
        } = Z({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) => {
            const r = (e - 1) * a,
              l = r + a
            return { list: T.value.slice(r, l), total: T.value.length }
          },
          deleteAPI: async (e) => {
            s.value = s.value.filter((a) => !e.includes(a.id))
          }
        })
      function A() {
        return { id: '', code: '', name: '', value: '', defaultValue: '', category: 'system', valueType: 'string', description: '', status: 'active' }
      }
      function L() {
        ;(Object.assign(u, { keyword: '', category: '', status: '' }), x())
      }
      function O(e) {
        return v.find((a) => a.value === e)?.label || e
      }
      function I(e) {
        return e === 'auth' || e === 'security'
          ? 'danger'
          : e === 'mrp'
            ? 'warning'
            : e === 'stock'
              ? 'primary'
              : e === 'production'
                ? 'success'
                : 'info'
      }
      function U(e) {
        return e.valueType === 'boolean' ? (e.value === 'true' || e.value === '1' ? '是' : '否') : e.value
      }
      function E() {
        ;((o.value = 'add'), (t.value = A()), (d.value = !0))
      }
      function K(e) {
        ;((o.value = 'edit'),
          (t.value = {
            id: e.id,
            code: e.code,
            name: e.name,
            value: e.value,
            defaultValue: e.defaultValue,
            category: e.category,
            valueType: e.valueType,
            description: e.description,
            status: e.status
          }),
          (d.value = !0))
      }
      function j(e, a) {
        if (e === 'edit') {
          K(a)
          return
        }
        if (e === 'reset') {
          G(a)
          return
        }
        e === 'delete' && F(a)
      }
      async function z() {
        if (!t.value.code || !t.value.name) {
          b.warning('请填写参数编码和参数名称')
          return
        }
        const e = {
          code: t.value.code,
          name: t.value.name,
          value: t.value.value,
          defaultValue: t.value.defaultValue || t.value.value,
          category: t.value.category,
          valueType: t.value.valueType,
          description: t.value.description,
          status: t.value.status,
          updatedAt: '2026-07-13 15:30',
          updatedBy: '当前用户'
        }
        ;(o.value === 'add'
          ? s.value.unshift({ id: `PARAM-${String(s.value.length + 1).padStart(3, '0')}`, ...e })
          : (s.value = s.value.map((a) => (a.id === t.value.id ? { ...a, ...e } : a))),
          (d.value = !1),
          await h(),
          b.success(o.value === 'add' ? '已新增静态参数数据' : '已更新静态参数数据'))
      }
      async function G(e) {
        ;((s.value = s.value.map((a) => (a.id === e.id ? { ...a, value: a.defaultValue, updatedAt: '2026-07-13 15:35', updatedBy: '当前用户' } : a))),
          b.success('已恢复默认值'),
          await h())
      }
      return (e, a) => {
        const r = $
        return (
          V(),
          k(
            te,
            {
              'search-model': p(u),
              'onUpdate:searchModel': a[2] || (a[2] = (l) => (J(u) ? (u.value = l) : (u = l))),
              title: '系统参数配置',
              'search-columns': f,
              'search-grid-item-props': i,
              columns: g,
              data: p(W),
              pagination: p(q),
              loading: p(B),
              'add-text': '新增参数',
              onSearch: p(x),
              onReset: L,
              onRefresh: p(h),
              onAdd: E
            },
            {
              category: n(({ row: l }) => [
                m(r, { type: I(l.category), size: 'small' }, { default: n(() => [M(D(O(l.category)), 1)]), _: 2 }, 1032, ['type'])
              ]),
              valueCell: n(({ row: l }) => [
                Y('span', se, D(U(l)), 1),
                l.value === l.defaultValue
                  ? (V(),
                    k(
                      r,
                      { key: 0, size: 'small', type: 'info', class: 'default-tag' },
                      { default: n(() => [...(a[3] || (a[3] = [M('默认值', -1)]))]), _: 1 }
                    ))
                  : H('', !0)
              ]),
              status: n(({ row: l }) => [m(ee, { value: l.status, options: y }, null, 8, ['value'])]),
              actions: n(({ row: l }) => [m(le, { actions: P, onAction: (_) => j(_, l) }, null, 8, ['onAction'])]),
              dialog: n(() => [
                m(
                  oe,
                  {
                    visible: d.value,
                    'onUpdate:visible': a[0] || (a[0] = (l) => (d.value = l)),
                    form: t.value,
                    'onUpdate:form': a[1] || (a[1] = (l) => (t.value = l)),
                    mode: o.value,
                    onSubmit: z
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
  be = Q(ie, [['__scopeId', 'data-v-fc2193b7']])
export { be as default }
