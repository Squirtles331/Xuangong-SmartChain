import type { Ref } from 'vue'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export interface DeleteOptions {
  title?: string
  content?: string
  successTip?: string
}

export interface PageParams {
  page: number
  size: number
}

export interface PageResult<T> {
  list: T[]
  total: number
}

interface Options<T> {
  onSuccess?: () => void
  onError?: (_error: Error) => void
  immediate?: boolean
  rowKey?: keyof T
  listAPI: (_p: PageParams) => Promise<PageResult<T>> | Promise<T[]>
  deleteAPI?: (_pks: string[]) => Promise<unknown>
  exportAPI?: () => Promise<unknown>
}

export function useTable<T>(options: Options<T>) {
  const { onSuccess, onError, immediate = true } = options

  const loading = ref(false)
  const tableData: Ref<T[]> = ref([])

  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    onCurrentChange: (page: number) => {
      pagination.currentPage = page
      getTableData()
    },
    onSizeChange: (size: number) => {
      pagination.pageSize = size
      getTableData()
    }
  })

  function setTotal(total: number) {
    pagination.total = total
  }

  async function getTableData() {
    try {
      loading.value = true
      const result = await options.listAPI({ page: pagination.currentPage, size: pagination.pageSize })
      const list = Array.isArray(result) ? result : result.list
      const total = Array.isArray(result) ? result.length : result.total

      tableData.value = list as T[]
      setTotal(total)
      onSuccess?.()
    } catch (error) {
      onError?.(error as Error)
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    getTableData()
  }

  function search() {
    pagination.currentPage = 1
    getTableData()
  }

  function refresh() {
    getTableData()
  }

  function handleDelete(deleteAction: () => Promise<unknown>, deleteOptions?: DeleteOptions): Promise<boolean | undefined> {
    return new Promise((resolve) => {
      ElMessageBox.confirm(deleteOptions?.content ?? '是否确认删除当前数据？', deleteOptions?.title ?? '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'cancel') {
            done()
            resolve(undefined)
            return
          }

          instance.confirmButtonLoading = true
          deleteAction()
            .then(() => {
              ElMessage.success(deleteOptions?.successTip ?? '删除成功')
              getTableData()
              instance.confirmButtonLoading = false
              done()
              resolve(true)
            })
            .catch((error) => {
              console.error('删除失败', error)
              instance.confirmButtonLoading = false
              done()
              resolve(false)
            })
        }
      }).catch(() => resolve(undefined))
    })
  }

  const selectedKeys = ref<string[]>([])

  const onSelectionChange = (rows: T[]) => {
    if (!options.rowKey) return
    selectedKeys.value = rows.map((row) => row[options.rowKey as keyof T] as unknown as string)
  }

  const onDelete = (row: T) => {
    if (!options.deleteAPI || !options.rowKey) {
      ElMessage.error('当前页面未配置删除能力')
      return
    }

    handleDelete(() => options.deleteAPI?.([row[options.rowKey as keyof T] as unknown as string]) as Promise<unknown>)
  }

  const onBatchDelete = () => {
    if (!options.deleteAPI) {
      ElMessage.error('当前页面未配置删除能力')
      return
    }

    if (!selectedKeys.value.length) {
      ElMessage.warning('请先选择需要删除的数据')
      return
    }

    handleDelete(() => options.deleteAPI?.(selectedKeys.value) as Promise<unknown>, {
      title: '批量删除',
      content: `确认删除已选中的 ${selectedKeys.value.length} 条数据吗？`,
      successTip: '删除成功'
    })
  }

  return {
    tableData,
    getTableData,
    pagination,
    loading,
    search,
    refresh,
    handleDelete,
    onSelectionChange,
    selectedKeys,
    onDelete,
    onBatchDelete
  }
}
