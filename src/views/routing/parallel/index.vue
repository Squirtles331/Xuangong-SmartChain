<template>
  <gi-page-layout>
    <template #header><h3>并行工序配置</h3></template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe size="small">
      <template #operations="{ row }">
        <el-tag v-for="(op, i) in row.operations" :key="i" size="small" style="margin: 2px">{{ op }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <ParallelFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import ParallelFormDialog, { type ParallelFormModel } from './ParallelFormDialog.vue'

interface ParallelGroupRow {
  id: string
  routing_name: string
  operations: string[]
  merge_rule: string
}

const cols: TableColumnItem<ParallelGroupRow>[] = [
  { prop: 'routing_name', label: '工艺路线', minWidth: 220 },
  { label: '并行工序', minWidth: 200, slotName: 'operations' },
  { prop: 'merge_rule', label: '汇合规则', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, refresh, onDelete } = useTable<ParallelGroupRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    // Mock data
    const all: ParallelGroupRow[] = [
      { id: '1', routing_name: '离心泵 XJP-100 标准工艺', operations: ['工序40:钻孔', '工序50:热处理'], merge_rule: '全部完成后继续' },
      { id: '2', routing_name: '齿轮箱 GBX-200 标准工艺', operations: ['工序30:精车', '工序40:磨削'], merge_rule: '任一完成后继续' }
    ]
    const start = (page - 1) * size
    return { list: all.slice(start, start + size), total: all.length }
  },
  deleteAPI: undefined
})

// Dialog
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ParallelFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ParallelFormModel {
  return { id: '', routing_name: '', operations: [], merge_rule: '全部完成后继续' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ParallelGroupRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    routing_name: row.routing_name,
    operations: [...row.operations],
    merge_rule: row.merge_rule
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.routing_name || formModel.value.operations.length === 0) {
    ElMessage.warning('请填写必填项')
    return
  }
  const ops = [...formModel.value.operations]
  if (dialogMode.value === 'add') {
    tableData.value.unshift({
      id: Date.now().toString(),
      routing_name: formModel.value.routing_name,
      operations: ops,
      merge_rule: formModel.value.merge_rule
    } as ParallelGroupRow)
  } else {
    const idx = tableData.value.findIndex((e) => e.id === formModel.value.id)
    if (idx > -1) {
      tableData.value[idx].routing_name = formModel.value.routing_name
      tableData.value[idx].operations = ops
      tableData.value[idx].merge_rule = formModel.value.merge_rule
    }
  }
  dialogVisible.value = false
}
</script>
