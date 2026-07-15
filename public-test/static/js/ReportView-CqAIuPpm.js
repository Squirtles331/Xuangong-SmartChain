import { Bn as s, Mn as d, On as z, Xn as I, an as T, dn as i, i as v, it as B, pn as L, rr as c, sr as b, un as R } from './element-plus-CzL7BOKu.js'
import { C as O, D as _, E as F, M as m, b as q, g, w as G, x as A, y as K } from './index-DqMfCNbk.js'
import { t as U } from './useTable-Hzr4fBAy.js'
var p = [
  { id: 1, name: '2024骞?鏈堣惀鏀舵姤琛?', category: '钀ユ敹鎶ヨ〃', createdAt: '2024-06-30', creator: 'admin', status: '宸茬敓鎴?' },
  { id: 2, name: '2024骞?鏈堝伐鍗曟眹鎬?', category: '宸ュ崟鎶ヨ〃', createdAt: '2024-06-30', creator: 'planner', status: '宸茬敓鎴?' },
  { id: 3, name: '2024骞?鏈堣澶嘜EE鍒嗘瀽', category: 'OEE鎶ヨ〃', createdAt: '2024-06-30', creator: 'analyst', status: '鐢熸垚涓?' },
  { id: 4, name: '2024骞?鏈堣惀鏀舵姤琛?', category: '钀ユ敹鎶ヨ〃', createdAt: '2024-05-31', creator: 'admin', status: '宸茬敓鎴?' },
  { id: 5, name: '2024骞?鏈堝伐鍗曟眹鎬?', category: '宸ュ崟鎶ヨ〃', createdAt: '2024-05-31', creator: 'planner', status: '宸茬敓鎴?' },
  { id: 6, name: '2024骞?鏈堣澶嘜EE鍒嗘瀽', category: 'OEE鎶ヨ〃', createdAt: '2024-05-31', creator: 'analyst', status: '宸茬敓鎴?' },
  { id: 7, name: '2024骞碤2璐ㄩ噺鍒嗘瀽鎶ュ憡', category: '璐ㄩ噺鎶ヨ〃', createdAt: '2024-06-30', creator: 'quality', status: '宸茬敓鎴?' },
  { id: 8, name: '2024骞?鏈堝簱瀛樼洏鐐?', category: '搴撳瓨鎶ヨ〃', createdAt: '2024-06-30', creator: 'warehouse', status: '鐢熸垚澶辫触' },
  { id: 9, name: '2024骞?鏈堥噰璐眹鎬?', category: '閲囪喘鎶ヨ〃', createdAt: '2024-06-30', creator: 'buyer', status: '宸茬敓鎴?' },
  { id: 10, name: '2024骞碤2浜や粯鐜囩粺璁?', category: '浜や粯鎶ヨ〃', createdAt: '2024-06-30', creator: 'planner', status: '宸茬敓鎴?' },
  { id: 11, name: '2024骞?鏈堣兘鑰楃粺璁?', category: '鑳借€楁姤琛?', createdAt: '2024-06-28', creator: 'ehs', status: '宸茬敓鎴?' },
  { id: 12, name: '2024骞?鏈堜汉鍛樻晥鐜囧垎鏋?', category: '鏁堢巼鎶ヨ〃', createdAt: '2024-06-29', creator: 'hr', status: '鐢熸垚涓?' }
]
async function X(e) {
  await g()
  let t = [...p]
  e.name && (t = G(t, e.name, ['name']))
  const n = O(t, e.pageNum, e.pageSize)
  return q(n.list, n.total, n.pageNum, n.pageSize)
}
async function j(e) {
  await g()
  const t = p.find((n) => n.id === e)
  return K({ id: e, preview_url: `/mock/report-preview/${e}`, name: t?.name || '' })
}
async function H(e) {
  return (await g(), A(`已准备下载报表：${p.find((t) => t.id === e)?.name || e}`))
}
async function J(e) {
  await g()
  const t = p.findIndex((n) => n.id === e)
  return (t > -1 && p.splice(t, 1), A('删除成功'))
}
function Q(e) {
  return m ? X(e) : _('/analysis/reports', { params: e })
}
function Y(e) {
  return m ? j(e) : _(`/analysis/reports/${e}/preview`)
}
function Z(e) {
  return m ? H(e) : _(`/analysis/reports/${e}/download`)
}
function ee(e) {
  return m ? J(e) : F(`/analysis/reports/${e}`)
}
var te = L({
    __name: 'ReportView',
    setup(e) {
      const t = I({ name: '' }),
        n = [{ type: 'input', label: '报表名称', field: 'name', props: { placeholder: '请输入报表名称' } }],
        $ = [
          { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
          { prop: 'name', label: '报表名称', minWidth: 200 },
          { prop: 'type', label: '报表类型', minWidth: 120 },
          { prop: 'createdAt', label: '创建时间', minWidth: 140 },
          { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
          { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        {
          tableData: x,
          pagination: y,
          loading: C,
          search: h,
          onDelete: E
        } = U({
          rowKey: 'id',
          listAPI: async ({ page: a, size: r }) => {
            const u = await Q({ pageNum: a, pageSize: r, name: t.value.name || void 0 })
            return { list: u.data.list.map((l) => ({ ...l, type: l.type || l.category || '-' })), total: u.data.total }
          },
          deleteAPI: (a) => Promise.all(a.map((r) => ee(Number(r))))
        })
      function k(a) {
        return { 已生成: 'success', 生成中: 'warning', 生成失败: 'danger' }[a] || 'info'
      }
      function N() {
        h()
      }
      function D() {
        ;((t.value = { name: '' }), h())
      }
      async function S(a) {
        const r = await Y(a.id)
        v.info(`预览报表：${r.data.name || a.name}`)
      }
      async function V(a) {
        const r = await Z(a.id)
        v.success(r.msg || `下载报表：${a.name}`)
      }
      function W(a) {
        E(a)
      }
      return (a, r) => {
        const u = d('gi-form'),
          l = B,
          f = d('gi-button'),
          M = d('gi-table'),
          P = d('gi-page-layout')
        return (
          z(),
          T(P, null, {
            header: s(() => [
              i(
                u,
                {
                  ref: 'searchFormRef',
                  modelValue: t.value,
                  'onUpdate:modelValue': r[0] || (r[0] = (o) => (t.value = o)),
                  columns: n,
                  search: '',
                  onReset: D,
                  onSearch: N
                },
                null,
                8,
                ['modelValue']
              )
            ]),
            default: s(() => [
              i(
                M,
                { columns: $, data: c(x), pagination: c(y), loading: c(C), border: '', style: { height: '100%' } },
                {
                  index: s(({ $index: o }) => [R(b(o + 1 + (c(y).currentPage - 1) * c(y).pageSize), 1)]),
                  status: s(({ row: o }) => [i(l, { type: k(o.status) }, { default: s(() => [R(b(o.status), 1)]), _: 2 }, 1032, ['type'])]),
                  actions: s(({ row: o }) => [
                    i(f, { type: 'view', onClick: (w) => S(o) }, null, 8, ['onClick']),
                    i(f, { style: { 'margin-left': '8px' }, type: 'edit', onClick: (w) => V(o) }, null, 8, ['onClick']),
                    i(f, { style: { 'margin-left': '8px' }, type: 'delete', onClick: (w) => W(o) }, null, 8, ['onClick'])
                  ]),
                  _: 1
                },
                8,
                ['data', 'pagination', 'loading']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  oe = te
export { oe as default }
