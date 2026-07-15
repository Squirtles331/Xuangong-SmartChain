import {
  Bn as o,
  Fn as C,
  Kn as j,
  Mn as W,
  On as N,
  Xn as g,
  Yn as z,
  an as F,
  d as J,
  dn as p,
  i as v,
  in as R,
  pn as O,
  rn as P,
  rr as i,
  sr as Q,
  un as Z,
  yn as V
} from './element-plus-CzL7BOKu.js'
import { I as $ } from './index-DqMfCNbk.js'
import { t as ee } from './useTable-Hzr4fBAy.js'
import { t as q } from './StatusTag-DWd3m1xj.js'
import { t as ae } from './CrudPage-7Q0FEhS_.js'
import { t as te } from './CrudRowActions-Dmc4i_Io.js'
var le = O({
    __name: 'MaterialFormDialog',
    props: V({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: V(['submit'], ['update:visible', 'update:form']),
    setup(f, { emit: h }) {
      const c = C(f, 'visible'),
        m = C(f, 'form'),
        b = h,
        n = P(() => [
          { type: 'input', label: '物料编码', field: 'code', required: !0 },
          { type: 'input', label: '物料名称', field: 'name', required: !0 },
          { type: 'input', label: '规格型号', field: 'spec' },
          {
            type: 'select-v2',
            label: '分类',
            field: 'category',
            required: !0,
            props: { options: ['钢材', '铝材', '机加件', '装配件', '电气件', '标准件'].map((y) => ({ label: y, value: y })) }
          },
          {
            type: 'select-v2',
            label: '物料类型',
            field: 'type',
            required: !0,
            props: {
              options: [
                { label: '外购', value: 'purchased' },
                { label: '自制', value: 'manufactured' },
                { label: '委外', value: 'outsourced' }
              ]
            }
          },
          { type: 'input', label: '单位', field: 'unit', required: !0 },
          { type: 'input', label: '供应策略', field: 'supplyMode' },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            required: !0,
            props: {
              options: [
                { label: '草稿', value: 'draft' },
                { label: '已生效', value: 'active' },
                { label: '已停用', value: 'disabled' },
                { label: '已归档', value: 'archived' }
              ]
            }
          },
          { type: 'input', label: '责任计划组', field: 'planner' },
          { type: 'input-number', label: '提前期(天)', field: 'leadTimeDays', props: { min: 0, precision: 0 } },
          { type: 'input-number', label: '安全库存', field: 'safeStock', props: { min: 0, precision: 0 } }
        ])
      function M() {
        c.value = !1
      }
      async function _() {
        return (b('submit'), !1)
      }
      return (y, s) => {
        const u = W('gi-form'),
          d = W('gi-dialog')
        return (
          N(),
          F(
            d,
            {
              modelValue: c.value,
              'onUpdate:modelValue': s[1] || (s[1] = (a) => (c.value = a)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': _,
              'on-cancel': M,
              title: f.mode === 'add' ? '新增物料主数据' : '编辑物料主数据',
              width: '720px'
            },
            {
              default: o(() => [
                p(
                  u,
                  { modelValue: m.value, 'onUpdate:modelValue': s[0] || (s[0] = (a) => (m.value = a)), columns: n.value, 'label-width': 110 },
                  null,
                  8,
                  ['modelValue', 'columns']
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
  se = le,
  ne = { class: 'material-tree-panel' },
  ie = O({
    __name: 'index',
    setup(f) {
      const h = { size: 240 },
        c = [
          {
            id: 'metal',
            name: '金属原材',
            children: [
              { id: 'steel', name: '钢材' },
              { id: 'aluminum', name: '铝材' }
            ]
          },
          {
            id: 'semi',
            name: '半成品',
            children: [
              { id: 'machined', name: '机加件' },
              { id: 'assembly', name: '装配件' }
            ]
          },
          {
            id: 'purchase',
            name: '采购件',
            children: [
              { id: 'electrical', name: '电气件' },
              { id: 'standard', name: '标准件' }
            ]
          }
        ],
        m = [
          { value: 'purchased', label: '外购', type: 'primary' },
          { value: 'manufactured', label: '自制', type: 'success' },
          { value: 'outsourced', label: '委外', type: 'warning' }
        ],
        b = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'active', label: '已生效', type: 'success' },
          { value: 'disabled', label: '已停用', type: 'warning' },
          { value: 'archived', label: '已归档', type: 'info' }
        ],
        n = g([
          {
            id: 'MAT-001',
            code: 'RM-AL-6061-08',
            name: '铝板 6061',
            spec: '8mm',
            category: '铝材',
            type: 'purchased',
            unit: '张',
            supplyMode: '采购补货',
            status: 'active',
            planner: '周计划组',
            leadTimeDays: 5,
            safeStock: 24,
            updatedAt: '2026-07-11 09:20'
          },
          {
            id: 'MAT-002',
            code: 'SM-CNC-1001',
            name: '壳体粗加工件',
            spec: 'XG-HS-01',
            category: '机加件',
            type: 'manufactured',
            unit: '件',
            supplyMode: '按工单投产',
            status: 'active',
            planner: '机加计划组',
            leadTimeDays: 2,
            safeStock: 12,
            updatedAt: '2026-07-11 13:40'
          },
          {
            id: 'MAT-003',
            code: 'FG-ASSY-2101',
            name: '供液控制总成',
            spec: 'XG-FG-21',
            category: '装配件',
            type: 'manufactured',
            unit: '套',
            supplyMode: 'MTO 装配',
            status: 'draft',
            planner: '装配计划组',
            leadTimeDays: 3,
            safeStock: 6,
            updatedAt: '2026-07-12 10:18'
          },
          {
            id: 'MAT-004',
            code: 'PO-EL-3008',
            name: '伺服驱动器',
            spec: '7.5kW',
            category: '电气件',
            type: 'purchased',
            unit: '台',
            supplyMode: '订单采购',
            status: 'active',
            planner: '采购协同组',
            leadTimeDays: 12,
            safeStock: 4,
            updatedAt: '2026-07-10 16:12'
          },
          {
            id: 'MAT-005',
            code: 'OS-HT-5002',
            name: '热处理外协件',
            spec: '42CrMo',
            category: '标准件',
            type: 'outsourced',
            unit: '件',
            supplyMode: '委外回厂',
            status: 'disabled',
            planner: '工艺工程组',
            leadTimeDays: 4,
            safeStock: 0,
            updatedAt: '2026-07-08 08:55'
          },
          {
            id: 'MAT-006',
            code: 'RM-ST-45-20',
            name: '45# 圆钢',
            spec: '20mm',
            category: '钢材',
            type: 'purchased',
            unit: '支',
            supplyMode: '安全库存',
            status: 'archived',
            planner: '周计划组',
            leadTimeDays: 7,
            safeStock: 10,
            updatedAt: '2026-07-04 18:20'
          }
        ]),
        M = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码 / 物料名称 / 规格' } },
          {
            type: 'select-v2',
            label: '分类',
            field: 'category',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '钢材', value: '钢材' },
                { label: '铝材', value: '铝材' },
                { label: '机加件', value: '机加件' },
                { label: '装配件', value: '装配件' },
                { label: '电气件', value: '电气件' },
                { label: '标准件', value: '标准件' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '物料类型',
            field: 'type',
            props: { options: [{ label: '全部', value: '' }, ...m.map((e) => ({ label: e.label, value: e.value }))] }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { options: [{ label: '全部', value: '' }, ...b.map((e) => ({ label: e.label, value: e.value }))] }
          }
        ],
        _ = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 } },
        y = [
          { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
          { prop: 'code', label: '物料编码', minWidth: 150 },
          { prop: 'name', label: '物料名称', minWidth: 170 },
          { prop: 'spec', label: '规格型号', minWidth: 120 },
          { prop: 'category', label: '分类', minWidth: 110 },
          { label: '物料类型', minWidth: 100, slotName: 'type', align: 'center' },
          { prop: 'supplyMode', label: '供应策略', minWidth: 120 },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
          { prop: 'leadTimeDays', label: '采购/制造提前期', minWidth: 130, align: 'center' },
          { prop: 'updatedAt', label: '最近维护时间', minWidth: 160 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let s = z({ keyword: '', category: '', type: '', status: '' })
      const u = g(!1),
        d = g('add'),
        a = g(x()),
        A = P(() =>
          n.value.filter((e) => {
            const t = s.keyword.trim().toLowerCase(),
              r = !t || e.code.toLowerCase().includes(t) || e.name.toLowerCase().includes(t) || e.spec.toLowerCase().includes(t),
              l = !s.category || e.category === s.category,
              S = !s.type || e.type === s.type,
              Y = !s.status || e.status === s.status
            return r && l && S && Y
          })
        ),
        {
          tableData: L,
          pagination: T,
          loading: w,
          search: k,
          refresh: D,
          onDelete: B
        } = ee({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const r = (e - 1) * t,
              l = r + t
            return { list: A.value.slice(r, l), total: A.value.length }
          },
          deleteAPI: async (e) => {
            n.value = n.value.filter((t) => !e.includes(t.id))
          }
        })
      function x() {
        return {
          id: '',
          code: '',
          name: '',
          spec: '',
          category: '钢材',
          type: 'purchased',
          unit: '件',
          supplyMode: '',
          status: 'draft',
          planner: '',
          leadTimeDays: 0,
          safeStock: 0
        }
      }
      function G(e) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          {
            key: e.status === 'disabled' ? 'enable' : 'disable',
            label: e.status === 'disabled' ? '启用' : '停用',
            tone: 'warning',
            hidden: e.status === 'archived'
          },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      }
      function I(e) {
        ;((s.category = e.children?.length ? '' : e.name), k())
      }
      function U() {
        ;(Object.assign(s, { keyword: '', category: '', type: '', status: '' }), k())
      }
      function E() {
        ;((d.value = 'add'), (a.value = x()), (u.value = !0))
      }
      function K(e) {
        ;((d.value = 'edit'),
          (a.value = {
            id: e.id,
            code: e.code,
            name: e.name,
            spec: e.spec,
            category: e.category,
            type: e.type,
            unit: e.unit,
            supplyMode: e.supplyMode,
            status: e.status,
            planner: e.planner,
            leadTimeDays: e.leadTimeDays,
            safeStock: e.safeStock
          }),
          (u.value = !0))
      }
      function X(e, t) {
        if (e === 'edit') {
          K(t)
          return
        }
        if (e === 'enable') {
          ;((t.status = 'active'), v.success('已启用静态物料'))
          return
        }
        if (e === 'disable') {
          ;((t.status = 'disabled'), v.success('已停用静态物料'))
          return
        }
        e === 'delete' && B(t)
      }
      async function H() {
        if (!a.value.code || !a.value.name || !a.value.category) {
          v.warning('请完整填写物料编码、物料名称和分类')
          return
        }
        ;(d.value === 'add'
          ? (n.value.unshift({
              id: `MAT-${String(n.value.length + 1).padStart(3, '0')}`,
              code: a.value.code,
              name: a.value.name,
              spec: a.value.spec,
              category: a.value.category,
              type: a.value.type,
              unit: a.value.unit,
              supplyMode: a.value.supplyMode || '待定义',
              status: a.value.status,
              planner: a.value.planner || '待分配',
              leadTimeDays: a.value.leadTimeDays,
              safeStock: a.value.safeStock,
              updatedAt: '2026-07-13 23:50'
            }),
            v.success('已新增静态物料数据'))
          : ((n.value = n.value.map((e) =>
              e.id === a.value.id
                ? {
                    ...e,
                    code: a.value.code,
                    name: a.value.name,
                    spec: a.value.spec,
                    category: a.value.category,
                    type: a.value.type,
                    unit: a.value.unit,
                    supplyMode: a.value.supplyMode || '待定义',
                    status: a.value.status,
                    planner: a.value.planner || '待分配',
                    leadTimeDays: a.value.leadTimeDays,
                    safeStock: a.value.safeStock,
                    updatedAt: '2026-07-13 23:50'
                  }
                : e
            )),
            v.success('已更新静态物料数据')),
          (u.value = !1),
          await D())
      }
      return (e, t) => {
        const r = J
        return (
          N(),
          F(
            ae,
            {
              'search-model': i(s),
              'onUpdate:searchModel': t[2] || (t[2] = (l) => (j(s) ? (s.value = l) : (s = l))),
              title: '物料主数据',
              'search-columns': M,
              'search-grid-item-props': _,
              columns: y,
              data: i(L),
              pagination: i(T),
              loading: i(w),
              'page-attrs': h,
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              onSearch: i(k),
              onReset: U,
              onRefresh: i(D),
              onAdd: E
            },
            {
              left: o(() => [
                R('div', ne, [
                  t[3] || (t[3] = R('div', { class: 'panel-title' }, '分类视图', -1)),
                  p(r, {
                    data: c,
                    props: { children: 'children', label: 'name' },
                    'node-key': 'id',
                    'default-expand-all': '',
                    'expand-on-click-node': !1,
                    'highlight-current': '',
                    onNodeClick: I
                  })
                ])
              ]),
              index: o(({ $index: l }) => [Z(Q(l + 1 + (i(T).currentPage - 1) * i(T).pageSize), 1)]),
              type: o(({ row: l }) => [p(q, { value: l.type, options: m }, null, 8, ['value'])]),
              status: o(({ row: l }) => [p(q, { value: l.status, options: b }, null, 8, ['value'])]),
              actions: o(({ row: l }) => [p(te, { actions: G(l), onAction: (S) => X(S, l) }, null, 8, ['actions', 'onAction'])]),
              dialog: o(() => [
                p(
                  se,
                  {
                    visible: u.value,
                    'onUpdate:visible': t[0] || (t[0] = (l) => (u.value = l)),
                    form: a.value,
                    'onUpdate:form': t[1] || (t[1] = (l) => (a.value = l)),
                    mode: d.value,
                    onSubmit: H
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
  me = $(ie, [['__scopeId', 'data-v-01bd3874']])
export { me as default }
