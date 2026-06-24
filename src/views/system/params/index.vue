<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="pagedData" :pagination="pagination" border style="height: 100%">
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
      </template>
    </gi-table>

    <gi-dialog v-model="dialogVisible" :footer="true" :on-before-ok="submitDialog" :title="dialogMode === 'add' ? '新增参数' : '编辑参数'">
      <gi-form v-model="form" :columns="formColumns" :label-width="120" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface Param {
  id: string; code: string; name: string; value: string; description: string
}

const params = ref<Param[]>([
  { id: '1', code: 'login_lock_count', name: '登录失败锁定次数', value: '5', description: '连续登录失败N次后锁定账号' },
  { id: '2', code: 'login_lock_minutes', name: '登录锁定时间(分钟)', value: '30', description: '锁定后自动解锁时间' },
  { id: '3', code: 'token_expire_minutes', name: 'Token有效期(分钟)', value: '120', description: 'JWT Token过期时间' },
  { id: '4', code: 'mrp_horizon_days', name: 'MRP展望期(天)', value: '90', description: 'MRP计算的时间范围' },
  { id: '5', code: 'stock_count_approval_threshold', name: '盘点差异审批阈值(元)', value: '1000', description: '超过此金额需升级审批' },
  { id: '6', code: 'work_center_overload_pct', name: '工作中心超负荷阈值(%)', value: '90', description: '负荷率超过此值标记为超负荷' },
  { id: '7', code: 'ar_aging_warn_days', name: '应收账龄警告天数', value: '30', description: '逾期超过此天数标记为警告' },
  { id: '8', code: 'file_upload_max_mb', name: '文件上传大小限制(MB)', value: '10', description: '单个文件最大上传大小' }
])

const searchForm = reactive({ keyword: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '编码/名称', clearable: true } as any }
]

const columns: TableColumnItem<Param>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '参数编码', minWidth: 200 },
  { prop: 'name', label: '参数名称', minWidth: 180 },
  { prop: 'value', label: '参数值', width: 120, align: 'center' },
  { prop: 'description', label: '说明', minWidth: 250 },
  { label: '操作', width: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const filteredData = computed(() => {
  const kw = searchForm.keyword?.toLowerCase() || ''
  return kw ? params.value.filter(p => p.code.toLowerCase().includes(kw) || p.name.toLowerCase().includes(kw)) : params.value
})
const pagedData = computed(() => {
  pagination.total = filteredData.value.length
  const s = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(s, s + pagination.pageSize)
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const form = reactive({ code: '', name: '', value: '', description: '' })
const formColumns: FormColumnItem[] = [
  { type: 'input', label: '参数编码', field: 'code', required: true },
  { type: 'input', label: '参数名称', field: 'name', required: true },
  { type: 'input', label: '参数值', field: 'value', required: true },
  { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 2 } as any }
]

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { searchForm.keyword = ''; pagination.currentPage = 1 }
function refresh() { handleReset() }

function openAdd() { dialogMode.value = 'add'; form.code = ''; form.name = ''; form.value = ''; form.description = ''; dialogVisible.value = true }
function openEdit(row: Param) { dialogMode.value = 'edit'; editingId.value = row.id; form.code = row.code; form.name = row.name; form.value = row.value; form.description = row.description; dialogVisible.value = true }

async function submitDialog() {
  if (!form.code || !form.name) { ElMessage.warning('请填写必填项'); return false }
  if (dialogMode.value === 'add') {
    params.value.unshift({ id: Date.now().toString(), ...form })
    ElMessage.success('新增成功')
  } else {
    const p = params.value.find(p => p.id === editingId.value)
    if (p) Object.assign(p, form)
    ElMessage.success('保存成功')
  }
  return true
}
</script>
