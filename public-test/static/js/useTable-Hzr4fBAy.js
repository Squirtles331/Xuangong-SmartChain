import { Xn as g, Yn as D, i as o, r as S } from './element-plus-CzL7BOKu.js'
function K(t) {
  const { onSuccess: y, onError: m, immediate: P = !0 } = t,
    u = g(!1),
    h = g([]),
    r = D({
      currentPage: 1,
      pageSize: 10,
      total: 0,
      onCurrentChange: (e) => {
        ;((r.currentPage = e), n())
      },
      onSizeChange: (e) => {
        ;((r.pageSize = e), n())
      }
    })
  function d(e) {
    r.total = e
  }
  async function n() {
    try {
      u.value = !0
      const e = await t.listAPI({ page: r.currentPage, size: r.pageSize }),
        a = Array.isArray(e) ? e : e.list,
        c = Array.isArray(e) ? e.length : e.total
      ;((h.value = a), d(c), y?.())
    } catch (e) {
      m?.(e)
    } finally {
      u.value = !1
    }
  }
  P && n()
  function A() {
    ;((r.currentPage = 1), n())
  }
  function w() {
    n()
  }
  function i(e, a) {
    return new Promise((c) => {
      S.confirm(a?.content ?? '是否确认删除当前数据？', a?.title ?? '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (B, s, f) => {
          if (B === 'cancel') {
            ;(f(), c(void 0))
            return
          }
          ;((s.confirmButtonLoading = !0),
            e()
              .then(() => {
                ;(o.success(a?.successTip ?? '删除成功'), n(), (s.confirmButtonLoading = !1), f(), c(!0))
              })
              .catch((v) => {
                ;(console.error('删除失败', v), (s.confirmButtonLoading = !1), f(), c(!1))
              }))
        }
      }).catch(() => c(void 0))
    })
  }
  const l = g([])
  return {
    tableData: h,
    getTableData: n,
    pagination: r,
    loading: u,
    search: A,
    refresh: w,
    handleDelete: i,
    onSelectionChange: (e) => {
      t.rowKey && (l.value = e.map((a) => a[t.rowKey]))
    },
    selectedKeys: l,
    onDelete: (e) => {
      if (!t.deleteAPI || !t.rowKey) {
        o.error('当前页面未配置删除能力')
        return
      }
      i(() => t.deleteAPI?.([e[t.rowKey]]))
    },
    onBatchDelete: () => {
      if (!t.deleteAPI) {
        o.error('当前页面未配置删除能力')
        return
      }
      if (!l.value.length) {
        o.warning('请先选择需要删除的数据')
        return
      }
      i(() => t.deleteAPI?.(l.value), { title: '批量删除', content: `确认删除已选中的 ${l.value.length} 条数据吗？`, successTip: '删除成功' })
    }
  }
}
export { K as t }
