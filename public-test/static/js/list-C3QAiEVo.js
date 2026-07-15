import {
  An as j,
  Bn as n,
  Fn as A,
  H,
  Kn as X,
  On as O,
  Xn as h,
  Yn as J,
  an as x,
  dn as i,
  ht as Q,
  i as S,
  it as Z,
  mt as z,
  nt as ee,
  ot as te,
  pn as I,
  rn as w,
  rr as _,
  rt as ae,
  sn as le,
  sr as k,
  tn as ne,
  un as R,
  yn as N
} from './element-plus-CzL7BOKu.js'
import { i as oe } from './vue-chunks-CWn_TkJU.js'
import { t as re } from './useTable-Hzr4fBAy.js'
import { t as W } from './StatusTag-DWd3m1xj.js'
import { t as ie } from './CrudPage-7Q0FEhS_.js'
import { t as se } from './CrudRowActions-Dmc4i_Io.js'
var de = I({
    __name: 'BOMCompareDialog',
    props: N(
      { currentBom: {}, versions: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, selectedVersionId: { required: !0 }, selectedVersionIdModifiers: {} }
    ),
    emits: N(['submit'], ['update:visible', 'update:selectedVersionId']),
    setup(s, { emit: v }) {
      const m = A(s, 'visible'),
        c = A(s, 'selectedVersionId'),
        d = v
      function V(u) {
        return u === 'active' ? '生效中' : u === 'draft' ? '草稿' : u === 'pending_approval' ? '待评审' : u === 'disabled' ? '已停用' : '已归档'
      }
      return (u, l) => {
        const o = Z,
          b = Q,
          E = ee,
          C = ae,
          T = z,
          f = te,
          M = H
        return (
          O(),
          x(
            M,
            {
              modelValue: m.value,
              'onUpdate:modelValue': l[3] || (l[3] = (r) => (m.value = r)),
              title: '选择对比版本',
              width: '500px',
              'lock-scroll': !1
            },
            {
              footer: n(() => [
                i(f, { onClick: l[1] || (l[1] = (r) => (m.value = !1)) }, { default: n(() => [...(l[4] || (l[4] = [R('取消', -1)]))]), _: 1 }),
                i(
                  f,
                  { type: 'primary', disabled: !c.value, onClick: l[2] || (l[2] = (r) => d('submit')) },
                  { default: n(() => [...(l[5] || (l[5] = [R('开始对比', -1)]))]), _: 1 },
                  8,
                  ['disabled']
                )
              ]),
              default: n(() => [
                i(
                  T,
                  { 'label-width': '88px' },
                  {
                    default: n(() => [
                      i(
                        b,
                        { label: '当前版本' },
                        {
                          default: n(() => [
                            i(o, null, {
                              default: n(() => [
                                R(k(s.currentBom?.material_code) + ' ' + k(s.currentBom?.material_name) + ' ' + k(s.currentBom?.version), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }
                      ),
                      i(
                        b,
                        { label: '对比版本' },
                        {
                          default: n(() => [
                            i(
                              C,
                              {
                                modelValue: c.value,
                                'onUpdate:modelValue': l[0] || (l[0] = (r) => (c.value = r)),
                                placeholder: '请选择对比版本',
                                style: { width: '100%' }
                              },
                              {
                                default: n(() => [
                                  (O(!0),
                                  le(
                                    ne,
                                    null,
                                    j(
                                      s.versions,
                                      (r) => (
                                        O(),
                                        x(E, { key: r.id, label: `${r.version}（${V(r.status)}）`, value: r.id }, null, 8, ['label', 'value'])
                                      )
                                    ),
                                    128
                                  ))
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            },
            8,
            ['modelValue']
          )
        )
      }
    }
  }),
  ue = de,
  pe = I({
    __name: 'index',
    setup(s) {
      const v = oe(),
        m = [
          { value: 'EBOM', label: 'EBOM', type: 'primary' },
          { value: 'MBOM', label: 'MBOM', type: 'success' }
        ],
        c = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'pending_approval', label: '待评审', type: 'warning' },
          { value: 'active', label: '已生效', type: 'success' },
          { value: 'disabled', label: '已停用', type: 'warning' },
          { value: 'archived', label: '已归档', type: 'info' }
        ],
        d = h([
          {
            id: 'BOM-EB-1001',
            material_code: 'FG-ASSY-2101',
            material_name: '供液控制总成',
            product_line: '注液装备',
            bom_type: 'EBOM',
            version: 'V2.3',
            status: 'active',
            effective_date: '2026-07-01',
            item_count: 28,
            route_binding: 'RT-2101-V2.0',
            change_order: 'ECN-202607-001',
            updated_by: '李工艺',
            updated_at: '2026-07-10 11:20'
          },
          {
            id: 'BOM-EB-1002',
            material_code: 'FG-ASSY-2101',
            material_name: '供液控制总成',
            product_line: '注液装备',
            bom_type: 'EBOM',
            version: 'V2.4',
            status: 'pending_approval',
            effective_date: '2026-07-18',
            item_count: 30,
            route_binding: 'RT-2101-V2.1',
            change_order: 'ECN-202607-004',
            updated_by: '李工艺',
            updated_at: '2026-07-12 16:05'
          },
          {
            id: 'BOM-MB-2101',
            material_code: 'FG-ASSY-2101',
            material_name: '供液控制总成',
            product_line: '注液装备',
            bom_type: 'MBOM',
            version: 'V1.2',
            status: 'active',
            effective_date: '2026-07-05',
            item_count: 34,
            route_binding: 'RT-2101-V2.0',
            change_order: 'ECN-202607-001',
            updated_by: '周制造',
            updated_at: '2026-07-10 19:12'
          },
          {
            id: 'BOM-MB-3102',
            material_code: 'SM-CNC-1001',
            material_name: '壳体粗加工件',
            product_line: '机加中心',
            bom_type: 'MBOM',
            version: 'V1.0',
            status: 'draft',
            effective_date: '2026-07-15',
            item_count: 12,
            route_binding: 'RT-1001-V1.0',
            change_order: 'ECN-202607-005',
            updated_by: '周制造',
            updated_at: '2026-07-13 09:48'
          },
          {
            id: 'BOM-EB-4106',
            material_code: 'FG-ASSY-1888',
            material_name: '真空模组总成',
            product_line: '封装设备',
            bom_type: 'EBOM',
            version: 'V3.1',
            status: 'archived',
            effective_date: '2026-06-01',
            item_count: 42,
            route_binding: 'RT-1888-V1.8',
            change_order: 'ECN-202606-017',
            updated_by: '陈设计',
            updated_at: '2026-06-28 15:32'
          }
        ]),
        V = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '产品编码 / 产品名称 / 变更单号' } },
          {
            type: 'select-v2',
            label: 'BOM 类型',
            field: 'bomType',
            props: { options: [{ label: '全部', value: '' }, ...m.map((e) => ({ label: e.label, value: e.value }))] }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { options: [{ label: '全部', value: '' }, ...c.map((e) => ({ label: e.label, value: e.value }))] }
          }
        ],
        u = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        l = [
          { prop: 'material_code', label: '产品编码', minWidth: 150 },
          { prop: 'material_name', label: '产品名称', minWidth: 170 },
          { prop: 'product_line', label: '所属产品线', minWidth: 120 },
          { label: 'BOM 类型', minWidth: 100, align: 'center', slotName: 'bomType' },
          { prop: 'version', label: '版本', minWidth: 90, align: 'center' },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { prop: 'item_count', label: '子项数', minWidth: 90, align: 'center' },
          { prop: 'route_binding', label: '工艺路线绑定', minWidth: 150 },
          { prop: 'effective_date', label: '生效日期', minWidth: 120 },
          { prop: 'updated_by', label: '维护人', minWidth: 100 },
          { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let o = J({ keyword: '', bomType: '', status: '' })
      const b = w(() =>
          d.value.filter((e) => {
            const t = o.keyword.trim().toLowerCase(),
              a =
                !t ||
                e.material_code.toLowerCase().includes(t) ||
                e.material_name.toLowerCase().includes(t) ||
                e.change_order.toLowerCase().includes(t),
              g = !o.bomType || e.bom_type === o.bomType,
              K = !o.status || e.status === o.status
            return a && g && K
          })
        ),
        {
          tableData: E,
          pagination: C,
          loading: T,
          search: f,
          refresh: M,
          onDelete: r
        } = re({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const a = (e - 1) * t,
              g = a + t
            return { list: b.value.slice(a, g), total: b.value.length }
          },
          deleteAPI: async (e) => {
            d.value = d.value.filter((t) => !e.includes(t.id))
          }
        }),
        B = h(!1),
        p = h(null),
        y = h(''),
        D = w(() => (p.value ? d.value.filter((e) => e.material_code === p.value?.material_code && e.id !== p.value?.id) : []))
      function F(e) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'compare', label: '对比', tone: 'secondary' },
          { key: 'derive-mbom', label: '派生 MBOM', tone: 'success', hidden: e.bom_type !== 'EBOM' },
          {
            key: e.status === 'draft' ? 'submit' : 'archive',
            label: e.status === 'draft' ? '提交评审' : '归档',
            tone: e.status === 'draft' ? 'warning' : 'danger',
            hidden: e.status === 'archived' && e.bom_type !== 'EBOM'
          }
        ]
      }
      function $() {
        ;(Object.assign(o, { keyword: '', bomType: '', status: '' }), f())
      }
      function G() {
        v.push({ name: 'bomCreate' })
      }
      function L(e) {
        v.push({ name: 'bomEditor', params: { id: e.id } })
      }
      function P(e) {
        ;((p.value = e), (y.value = ''), (B.value = !0))
      }
      function U() {
        !p.value || !y.value || ((B.value = !1), v.push({ name: 'bomCompare', query: { ids: `${p.value.id},${y.value}` } }))
      }
      function Y(e) {
        ;(d.value.unshift({
          ...e,
          id: `BOM-MB-${Date.now()}`,
          bom_type: 'MBOM',
          version: 'V1.0',
          status: 'draft',
          effective_date: '待评审',
          updated_by: '静态派生',
          updated_at: '2026-07-13 23:55'
        }),
          S.success('已派生 MBOM 草稿'),
          M())
      }
      function q(e, t) {
        if (e === 'edit') {
          L(t)
          return
        }
        if (e === 'compare') {
          P(t)
          return
        }
        if (e === 'derive-mbom') {
          Y(t)
          return
        }
        if (e === 'submit') {
          ;((t.status = 'pending_approval'), S.success('已提交结构版本评审'))
          return
        }
        if (e === 'archive') {
          ;((t.status = 'archived'), S.success('已归档当前结构版本'))
          return
        }
        e === 'delete' && r(t)
      }
      return (e, t) => (
        O(),
        x(
          ie,
          {
            'search-model': _(o),
            'onUpdate:searchModel': t[2] || (t[2] = (a) => (X(o) ? (o.value = a) : (o = a))),
            title: '产品结构清单',
            'search-columns': V,
            'search-grid-item-props': u,
            columns: l,
            data: _(E),
            pagination: _(C),
            loading: _(T),
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            'add-text': '新建 BOM',
            onSearch: _(f),
            onReset: $,
            onRefresh: _(M),
            onAdd: G
          },
          {
            bomType: n(({ row: a }) => [i(W, { value: a.bom_type, options: m }, null, 8, ['value'])]),
            status: n(({ row: a }) => [i(W, { value: a.status, options: c }, null, 8, ['value'])]),
            actions: n(({ row: a }) => [i(se, { actions: F(a), onAction: (g) => q(g, a) }, null, 8, ['actions', 'onAction'])]),
            dialog: n(() => [
              i(
                ue,
                {
                  visible: B.value,
                  'onUpdate:visible': t[0] || (t[0] = (a) => (B.value = a)),
                  'selected-version-id': y.value,
                  'onUpdate:selectedVersionId': t[1] || (t[1] = (a) => (y.value = a)),
                  'current-bom': p.value,
                  versions: D.value,
                  onSubmit: U
                },
                null,
                8,
                ['visible', 'selected-version-id', 'current-bom', 'versions']
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
  ye = pe
export { ye as default }
