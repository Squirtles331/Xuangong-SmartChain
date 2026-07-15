import { Bn as d, Kn as C, On as W, Xn as A, Yn as S, an as V, dn as c, i as p, pn as q, rn as T, rr as o } from './element-plus-CzL7BOKu.js'
import { i as L } from './vue-chunks-CWn_TkJU.js'
import { t as N } from './useTable-Hzr4fBAy.js'
import { t as P } from './StatusTag-DWd3m1xj.js'
import { t as B } from './CrudPage-7Q0FEhS_.js'
import { t as E } from './CrudRowActions-Dmc4i_Io.js'
var G = q({
    __name: 'index',
    setup(K) {
      const s = L(),
        i = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'active', label: '已生效', type: 'success' },
          { value: 'disabled', label: '已停用', type: 'warning' }
        ],
        _ = A([
          {
            id: 'RT-2101-V2.0',
            routing_name: '供液控制总成主装路线',
            material_code: 'FG-ASSY-2101',
            material_name: '供液控制总成',
            version: 'V2.0',
            status: 'active',
            operation_count: 8,
            work_center_count: 5,
            qc_gate_count: 2,
            total_duration: 186,
            updated_by: '周制造',
            updated_at: '2026-07-10 18:30'
          },
          {
            id: 'RT-2101-V2.1',
            routing_name: '供液控制总成优化路线',
            material_code: 'FG-ASSY-2101',
            material_name: '供液控制总成',
            version: 'V2.1',
            status: 'draft',
            operation_count: 9,
            work_center_count: 5,
            qc_gate_count: 3,
            total_duration: 172,
            updated_by: '周制造',
            updated_at: '2026-07-13 10:10'
          },
          {
            id: 'RT-1001-V1.0',
            routing_name: '壳体粗加工路线',
            material_code: 'SM-CNC-1001',
            material_name: '壳体粗加工件',
            version: 'V1.0',
            status: 'active',
            operation_count: 6,
            work_center_count: 4,
            qc_gate_count: 1,
            total_duration: 96,
            updated_by: '王工艺',
            updated_at: '2026-07-11 09:40'
          }
        ]),
        m = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '路线名称 / 产品编码 / 产品名称' } },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { options: [{ label: '全部', value: '' }, ...i.map((t) => ({ label: t.label, value: t.value }))] }
          }
        ],
        g = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        b = [
          { prop: 'routing_name', label: '工艺路线', minWidth: 180 },
          { prop: 'material_code', label: '产品编码', minWidth: 150 },
          { prop: 'material_name', label: '产品名称', minWidth: 170 },
          { prop: 'version', label: '版本', minWidth: 90, align: 'center' },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'operation_count', label: '工序数', minWidth: 90, align: 'center' },
          { prop: 'work_center_count', label: '工作中心数', minWidth: 100, align: 'center' },
          { prop: 'qc_gate_count', label: '质检关卡', minWidth: 100, align: 'center' },
          { prop: 'total_duration', label: '总工时(分)', minWidth: 110, align: 'center' },
          { prop: 'updated_by', label: '维护人', minWidth: 100 },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = S({ keyword: '', status: '' })
      const l = T(() =>
          _.value.filter((t) => {
            const e = n.keyword.trim().toLowerCase(),
              a =
                !e ||
                t.routing_name.toLowerCase().includes(e) ||
                t.material_code.toLowerCase().includes(e) ||
                t.material_name.toLowerCase().includes(e),
              r = !n.status || t.status === n.status
            return a && r
          })
        ),
        {
          tableData: h,
          pagination: f,
          loading: v,
          search: u,
          refresh: y
        } = N({
          rowKey: 'id',
          listAPI: async ({ page: t, size: e }) => {
            const a = (t - 1) * e,
              r = a + e
            return { list: l.value.slice(a, r), total: l.value.length }
          }
        })
      function w(t) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: t.status === 'disabled' ? 'enable' : 'disable', label: t.status === 'disabled' ? '启用' : '停用', tone: 'warning' }
        ]
      }
      function R() {
        ;(Object.assign(n, { keyword: '', status: '' }), u())
      }
      function k() {
        s.push({ name: 'routingEditor', params: { id: 'new' } })
      }
      function x(t, e) {
        if (t === 'edit') {
          s.push({ name: 'routingEditor', params: { id: e.id } })
          return
        }
        if (t === 'enable') {
          ;((e.status = 'active'), p.success('已启用静态工艺路线'))
          return
        }
        t === 'disable' && ((e.status = 'disabled'), p.success('已停用静态工艺路线'))
      }
      return (t, e) => (
        W(),
        V(
          B,
          {
            'search-model': o(n),
            'onUpdate:searchModel': e[0] || (e[0] = (a) => (C(n) ? (n.value = a) : (n = a))),
            title: '工艺路线',
            'search-columns': m,
            'search-grid-item-props': g,
            columns: b,
            data: o(h),
            pagination: o(f),
            loading: o(v),
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            'add-text': '新建路线',
            onSearch: o(u),
            onReset: R,
            onRefresh: o(y),
            onAdd: k
          },
          {
            status: d(({ row: a }) => [c(P, { value: a.status, options: i }, null, 8, ['value'])]),
            actions: d(({ row: a }) => [c(E, { actions: w(a), onAction: (r) => x(r, a) }, null, 8, ['actions', 'onAction'])]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  D = G
export { D as default }
