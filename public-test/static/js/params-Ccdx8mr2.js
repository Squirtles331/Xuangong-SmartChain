import {
  Bn as d,
  Fn as M,
  Kn as V,
  On as k,
  Xn as v,
  Yn as K,
  an as D,
  dn as f,
  i as h,
  it as L,
  pn as A,
  rn as C,
  rr as u,
  sr as O,
  un as G,
  yn as S
} from './element-plus-CzL7BOKu.js'
import { t as X } from './useTable-Hzr4fBAy.js'
import { t as Y } from './StatusTag-DWd3m1xj.js'
import { t as $ } from './CrudFormDialog-1OgQthWb.js'
import { t as j } from './CrudPage-7Q0FEhS_.js'
import { t as H } from './CrudRowActions-Dmc4i_Io.js'
var J = A({
    __name: 'ParamFormDialog',
    props: S({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: S(['submit'], ['update:visible', 'update:form']),
    setup(c, { emit: g }) {
      const o = M(c, 'visible'),
        p = M(c, 'form'),
        y = g,
        b = C(() => [
          { type: 'input', label: '参数编码', field: 'code', required: !0 },
          { type: 'input', label: '参数名称', field: 'name', required: !0 },
          { type: 'input', label: '参数值', field: 'value', required: !0 },
          { type: 'input', label: '所属分类', field: 'category', props: { placeholder: '如：MES配置' } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: {
              options: [
                { label: '启用', value: 'active' },
                { label: '停用', value: 'inactive' }
              ]
            }
          },
          { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 3 } }
        ])
      return (n, s) => (
        k(),
        D(
          $,
          {
            visible: o.value,
            'onUpdate:visible': s[0] || (s[0] = (i) => (o.value = i)),
            form: p.value,
            'onUpdate:form': s[1] || (s[1] = (i) => (p.value = i)),
            title: c.mode === 'add' ? '新增参数' : '编辑参数',
            columns: b.value,
            'label-width': 100,
            onSubmit: s[2] || (s[2] = (i) => y('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  Q = J,
  Z = A({
    __name: 'index',
    setup(c) {
      const g = [
          { label: '启用', value: 'active', type: 'success' },
          { label: '停用', value: 'inactive', type: 'info' }
        ],
        o = v([
          {
            id: 'P-001',
            code: 'sys.default-theme',
            name: '默认主题',
            value: '工业蓝灰',
            category: '界面配置',
            description: '系统首次登录默认采用的主题方案。',
            status: 'active'
          },
          {
            id: 'P-002',
            code: 'sys.workbench-cycle',
            name: '工作台刷新周期',
            value: '15分钟',
            category: '运行配置',
            description: '用于静态工作台模块的指标刷新展示说明。',
            status: 'active'
          },
          {
            id: 'P-003',
            code: 'mes.report-timeout',
            name: '报工超时阈值',
            value: '30分钟',
            category: 'MES配置',
            description: '超出该时长的未完工报工将进入异常跟踪池。',
            status: 'active'
          },
          {
            id: 'P-004',
            code: 'wms.scan-mode',
            name: '默认扫描模式',
            value: '单据优先',
            category: 'WMS配置',
            description: '条码作业页面默认打开的扫描策略。',
            status: 'inactive'
          }
        ]),
        p = [{ type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '请输入参数编码、参数名称或分类' } }],
        y = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        b = [
          { type: 'index', label: '#', width: 60 },
          { prop: 'code', label: '参数编码', minWidth: 180 },
          { prop: 'name', label: '参数名称', minWidth: 160 },
          { prop: 'value', label: '参数值', minWidth: 140 },
          { prop: 'category', label: '分类', minWidth: 120, slotName: 'category' },
          { prop: 'description', label: '说明', minWidth: 260 },
          { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = K({ keyword: '' })
      const s = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        i = v(!1),
        m = v('add'),
        a = v(w()),
        _ = C(() => {
          const e = n.keyword.trim().toLowerCase()
          return e ? o.value.filter((t) => [t.code, t.name, t.category, t.description].some((r) => r.toLowerCase().includes(e))) : o.value
        }),
        {
          tableData: R,
          pagination: W,
          loading: q,
          search: x,
          refresh: P,
          onDelete: F
        } = X({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const r = (e - 1) * t,
              l = r + t
            return { list: _.value.slice(r, l), total: _.value.length }
          },
          deleteAPI: async (e) => {
            o.value = o.value.filter((t) => !e.includes(t.id))
          }
        })
      function w() {
        return { id: '', code: '', name: '', value: '', category: '', description: '', status: 'active' }
      }
      function E() {
        ;((n.keyword = ''), x())
      }
      function N() {
        ;((m.value = 'add'), (a.value = w()), (i.value = !0))
      }
      function U(e) {
        ;((m.value = 'edit'),
          (a.value = { id: e.id, code: e.code, name: e.name, value: e.value, category: e.category, description: e.description, status: e.status }),
          (i.value = !0))
      }
      function B(e, t) {
        if (e === 'edit') {
          U(t)
          return
        }
        e === 'delete' && F(t)
      }
      async function T() {
        if (!a.value.code || !a.value.name || !a.value.value) {
          h.warning('请完整填写参数编码、参数名称和参数值')
          return
        }
        ;(m.value === 'add'
          ? (o.value.unshift({
              id: `P-${String(o.value.length + 1).padStart(3, '0')}`,
              code: a.value.code,
              name: a.value.name,
              value: a.value.value,
              category: a.value.category || '未分类',
              description: a.value.description,
              status: a.value.status
            }),
            h.success('已新增静态参数数据'))
          : ((o.value = o.value.map((e) =>
              e.id === a.value.id
                ? {
                    ...e,
                    code: a.value.code,
                    name: a.value.name,
                    value: a.value.value,
                    category: a.value.category || '未分类',
                    description: a.value.description,
                    status: a.value.status
                  }
                : e
            )),
            h.success('已更新静态参数数据')),
          (i.value = !1),
          await P())
      }
      return (e, t) => {
        const r = L
        return (
          k(),
          D(
            j,
            {
              'search-model': u(n),
              'onUpdate:searchModel': t[2] || (t[2] = (l) => (V(n) ? (n.value = l) : (n = l))),
              title: '参数配置',
              'search-columns': p,
              'search-grid-item-props': y,
              columns: b,
              data: u(R),
              pagination: u(W),
              loading: u(q),
              onSearch: u(x),
              onReset: E,
              onRefresh: u(P),
              onAdd: N
            },
            {
              status: d(({ row: l }) => [f(Y, { value: l.status, options: g }, null, 8, ['value'])]),
              category: d(({ row: l }) => [f(r, { effect: 'plain' }, { default: d(() => [G(O(l.category), 1)]), _: 2 }, 1024)]),
              actions: d(({ row: l }) => [f(H, { actions: s, onAction: (I) => B(I, l) }, null, 8, ['onAction'])]),
              dialog: d(() => [
                f(
                  Q,
                  {
                    visible: i.value,
                    'onUpdate:visible': t[0] || (t[0] = (l) => (i.value = l)),
                    form: a.value,
                    'onUpdate:form': t[1] || (t[1] = (l) => (a.value = l)),
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
    }
  }),
  ie = Z
export { ie as default }
