import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export interface CrudOptions<T extends { id: string | number }> {
  /** 数据源（ref） */
  dataSource: import('vue').Ref<T[]>
  /** 默认搜索表单值 */
  defaultSearchForm: () => Record<string, any>
  /** 自定义搜索过滤函数 */
  filterFn?: (item: T, searchForm: Record<string, any>) => boolean
  /** 默认表单值（新增时） */
  defaultForm: () => Partial<T>
  /** 每页条数 */
  pageSize?: number
  /** ID 字段名 */
  idField?: string
  /** 删除确认消息 */
  deleteMsg?: string
}

export function useCrud<T extends { id: string | number }>(options: CrudOptions<T>) {
  const { dataSource, defaultSearchForm, filterFn, defaultForm, pageSize = 10, idField = 'id', deleteMsg = '确定删除？' } = options

  // ========== 分页 ==========
  const pagination = reactive({
    currentPage: 1,
    pageSize,
    total: 0
  })

  // ========== 搜索 ==========
  const searchForm = reactive(defaultSearchForm())

  function defaultFilter(item: T, sf: Record<string, any>): boolean {
    return Object.entries(sf).every(([key, val]) => {
      if (val === '' || val === null || val === undefined) return true
      if (Array.isArray(val) && val.length === 0) return true
      const itemVal = (item as any)[key]
      if (typeof itemVal === 'string') {
        return itemVal.toLowerCase().includes(String(val).toLowerCase())
      }
      return itemVal === val
    })
  }

  const filteredData = computed(() => {
    const fn = filterFn || defaultFilter
    return dataSource.value.filter((item) => fn(item, { ...searchForm }))
  })

  const pagedData = computed(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize
    return filteredData.value.slice(start, start + pagination.pageSize)
  })

  watch(
    filteredData,
    (val) => {
      pagination.total = val.length
    },
    { immediate: true }
  )

  function handleSearch() {
    pagination.currentPage = 1
  }

  function handleReset() {
    Object.assign(searchForm, defaultSearchForm())
    pagination.currentPage = 1
  }

  // ========== 对话框 ==========
  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editingId = ref<string | number>('')
  const formModel = reactive(defaultForm()) as T

  function openAdd() {
    dialogMode.value = 'add'
    editingId.value = ''
    Object.assign(formModel, defaultForm())
    dialogVisible.value = true
  }

  function openEdit(row: T) {
    dialogMode.value = 'edit'
    editingId.value = row[idField]
    Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    dialogVisible.value = true
  }

  function closeDialog() {
    dialogVisible.value = false
  }

  async function submitDialog(validate?: () => boolean): Promise<boolean> {
    if (validate && !validate()) return false

    try {
      if (dialogMode.value === 'add') {
        const newItem = { ...formModel, [idField]: Date.now() } as T
        dataSource.value.unshift(newItem)
        ElMessage.success('新增成功')
      } else {
        const idx = dataSource.value.findIndex((item: any) => item[idField] === editingId.value)
        if (idx > -1) {
          Object.assign(dataSource.value[idx], JSON.parse(JSON.stringify(formModel)))
          ElMessage.success('保存成功')
        }
      }
      return true
    } catch {
      ElMessage.error('操作失败')
      return false
    }
  }

  function remove(id: string | number) {
    ElMessageBox.confirm(deleteMsg, '警告', { type: 'warning' })
      .then(() => {
        dataSource.value = dataSource.value.filter((item: any) => item[idField] !== id)
        if ((pagination.currentPage - 1) * pagination.pageSize >= dataSource.value.length) {
          pagination.currentPage = Math.max(1, pagination.currentPage - 1)
        }
        ElMessage.success('删除成功')
      })
      .catch(() => {})
  }

  function refresh() {
    handleReset()
  }

  return {
    // 分页
    pagination,
    // 搜索
    searchForm,
    filteredData,
    pagedData,
    handleSearch,
    handleReset,
    // 对话框
    dialogVisible,
    dialogMode,
    editingId,
    formModel,
    openAdd,
    openEdit,
    closeDialog,
    submitDialog,
    // 删除
    remove,
    // 刷新
    refresh
  }
}
