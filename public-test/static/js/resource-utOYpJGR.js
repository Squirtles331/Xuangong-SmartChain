import {
  Bn as p,
  Kn as q,
  On as m,
  Xn as c,
  Yn as G,
  an as k,
  dn as S,
  i as C,
  pn as N,
  rn as U,
  rr as s,
  sn as V,
  sr as X
} from './element-plus-CzL7BOKu.js'
import { t as J } from './useTable-Hzr4fBAy.js'
import { t as K } from './StatusTag-DWd3m1xj.js'
import { t as Y } from './CrudFormDialog-1OgQthWb.js'
import { t as H } from './CrudPage-7Q0FEhS_.js'
import { t as Q } from './CrudRowActions-Dmc4i_Io.js'
var Z = { key: 1 },
  z = N({
    __name: 'index',
    setup($) {
      const f = '新增制造资源',
        _ = '编辑制造资源',
        x = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '资源编码 / 资源名称 / 工作中心' } }],
        R = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        A = [
          { prop: 'code', label: '资源编码', minWidth: 140 },
          { prop: 'name', label: '资源名称', minWidth: 150 },
          { prop: 'type', label: '资源类型', minWidth: 120 },
          { prop: 'model', label: '资源型号', minWidth: 120 },
          { prop: 'workCenter', label: '所属工作中心', minWidth: 150 },
          { prop: 'status', label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 150, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        E = [
          { type: 'input', label: '资源编码', field: 'code', required: !0 },
          { type: 'input', label: '资源名称', field: 'name', required: !0 },
          { type: 'input', label: '资源类型', field: 'type' },
          { type: 'input', label: '资源型号', field: 'model' },
          { type: 'input', label: '所属工作中心', field: 'workCenter' },
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
          }
        ],
        v = ['code', 'name', 'workCenter'],
        y = [
          { value: 'active', label: '启用', type: 'success' },
          { value: 'disabled', label: '停用', type: 'warning' }
        ],
        I = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        o = c([
          { id: 'RES-001', code: 'RES-JIG-01', name: '装配夹具 A', type: '工装夹具', model: 'JIG-A', workCenter: '主装工位', status: 'active' },
          { id: 'RES-002', code: 'RES-FIX-02', name: '测试治具 B', type: '测试治具', model: 'FIX-B', workCenter: '测试组', status: 'active' },
          { id: 'RES-003', code: 'RES-LIFT-01', name: '翻转工装', type: '辅助工装', model: 'LFT-01', workCenter: '预装工位', status: 'disabled' }
        ])
      let r = G({ keyword: '' })
      const i = c(!1),
        d = c('add'),
        l = c(w()),
        b = U(() =>
          o.value.filter((a) =>
            Object.entries(r).every(([t, e]) => {
              if (e === '' || e === void 0 || e === null) return !0
              if (t === 'keyword') {
                const u = String(e).trim().toLowerCase()
                return u
                  ? (v.length ? v : Object.keys(a)).some((j) =>
                      String(a[j] ?? '')
                        .toLowerCase()
                        .includes(u)
                    )
                  : !0
              }
              const n = a[t]
              return Array.isArray(n) ? n.map((u) => String(u)).includes(String(e)) : String(n ?? '') === String(e)
            })
          )
        ),
        {
          tableData: D,
          pagination: F,
          loading: M,
          search: g,
          refresh: h,
          onDelete: W
        } = J({
          rowKey: 'id',
          listAPI: async ({ page: a, size: t }) => {
            const e = (a - 1) * t,
              n = e + t
            return { list: b.value.slice(e, n), total: b.value.length }
          },
          deleteAPI: async (a) => {
            o.value = o.value.filter((t) => !a.includes(String(t.id)))
          }
        })
      function w() {
        return { id: '', code: '', name: '', type: '', model: '', workCenter: '', status: 'active' }
      }
      function B() {
        ;(Object.assign(r, { keyword: '' }), g())
      }
      function T() {
        ;((d.value = 'add'), (l.value = w()), (i.value = !0))
      }
      function O(a) {
        ;((d.value = 'edit'), (l.value = { ...a }), (i.value = !0))
      }
      function P(a, t) {
        if (a === 'edit') {
          O(t)
          return
        }
        a === 'delete' && W(t)
      }
      async function L() {
        const a = String(l.value.id || '')
        ;(d.value === 'add'
          ? (o.value.unshift({ ...l.value, id: a || 'MDM-' + Date.now() }), C.success('已新增静态数据'))
          : ((o.value = o.value.map((t) => (String(t.id) === a ? { ...l.value } : t))), C.success('已更新静态数据')),
          (i.value = !1),
          await h())
      }
      return (a, t) => (
        m(),
        k(
          H,
          {
            'search-model': s(r),
            'onUpdate:searchModel': t[2] || (t[2] = (e) => (q(r) ? (r.value = e) : (r = e))),
            title: '制造资源',
            'search-columns': x,
            'search-grid-item-props': R,
            columns: A,
            data: s(D),
            pagination: s(F),
            loading: s(M),
            'add-text': f,
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            onSearch: s(g),
            onReset: B,
            onRefresh: s(h),
            onAdd: T
          },
          {
            status: p(({ row: e }) => [
              y.length ? (m(), k(K, { key: 0, value: e.status, options: y }, null, 8, ['value'])) : (m(), V('span', Z, X(e.status ?? '-'), 1))
            ]),
            actions: p(({ row: e }) => [S(Q, { actions: I, onAction: (n) => P(n, e) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              S(
                Y,
                {
                  visible: i.value,
                  'onUpdate:visible': t[0] || (t[0] = (e) => (i.value = e)),
                  form: l.value,
                  'onUpdate:form': t[1] || (t[1] = (e) => (l.value = e)),
                  title: d.value === 'add' ? f : _,
                  columns: E,
                  width: '680px',
                  'label-width': 110,
                  onSubmit: L
                },
                null,
                8,
                ['visible', 'form', 'title']
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
  re = z
export { re as default }
