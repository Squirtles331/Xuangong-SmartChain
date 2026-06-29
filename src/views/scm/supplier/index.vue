<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="columns" :data="suppliers" border stripe style="height: 100%">
      <template #score="{ row }">
        <div class="score-cell">
          <el-progress :percentage="row.score || 0" :stroke-width="8" :color="scoreColor(row.score || 0)" />
          <span class="score-text" :class="scoreClass(row.score || 0)">{{ row.score || 0 }}分</span>
        </div>
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="SUPPLIER_STATUS" />
      </template>
      <template #qualified="{ row }"
        ><el-tag :type="row.qualified ? 'success' : 'info'" size="small">{{ row.qualified ? '合格' : '待审核' }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增供应商' : '编辑供应商'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="120" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { suppliers as mockSuppliers } from '@/mock'
import StatusTag from '@/components/StatusTag.vue'
import { CUSTOMER_STATUS } from '@/common/status-maps'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

const SUPPLIER_STATUS = [
  { value: 'active', label: '正常', type: 'success' as const },
  { value: 'frozen', label: '冻结', type: 'warning' as const },
  { value: 'eliminated', label: '淘汰', type: 'danger' as const }
]

interface S {
  id: string
  code: string
  name: string
  contact: string
  phone: string
  terms: string
  status: string
  qualified: boolean
  score?: number
}
const suppliers = ref<S[]>(
  (mockSuppliers as any).map((s: any, i: number) => ({
    ...s,
    score: [95, 88, 72, 60, 91, 85][i] || 75
  }))
)
const columns: TableColumnItem<S>[] = [
  { prop: 'code', label: '编码', width: 150 },
  { prop: 'name', label: '名称', minWidth: 180 },
  { prop: 'contact', label: '联系人', width: 100 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'terms', label: '付款条款', width: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '评分', minWidth: 140, slotName: 'score', align: 'center' },
  { label: '资质', minWidth: 80, slotName: 'qualified', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ code: '', name: '', contact: '', phone: '', terms: '月结30天' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '联系人', field: 'contact' },
  { type: 'input', label: '电话', field: 'phone' },
  { type: 'input', label: '付款条款', field: 'terms' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', name: '', contact: '', phone: '', terms: '月结30天' })
  vis.value = true
}
function openEdit(r: S) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.code || !form.name) {
    ElMessage.warning('请填写编码和名称')
    return false
  }
  ElMessage.success('保存成功')
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      suppliers.value = suppliers.value.filter((s) => s.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function scoreColor(score: number) {
  if (score >= 90) return '#67c23a'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

function scoreClass(score: number) {
  if (score >= 90) return 'score-good'
  if (score >= 70) return 'score-warn'
  return 'score-bad'
}
</script>
<style scoped>
.score-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}
.score-text {
  font-size: 12px;
  white-space: nowrap;
}
.score-good {
  color: #67c23a;
  font-weight: 600;
}
.score-warn {
  color: #e6a23c;
  font-weight: 600;
}
.score-bad {
  color: #f56c6c;
  font-weight: 600;
}
</style>
