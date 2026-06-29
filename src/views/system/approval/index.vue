<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border style="height: 100%">
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
      </template>
      <template #nodes="{ row }">
        <el-steps :active="row.nodes.length" align-center style="max-width: 600px">
          <el-step
            v-for="(node, i) in row.nodes"
            :key="i"
            :title="node"
            :description="i === 0 ? '发起' : i === row.nodes.length - 1 ? '终审' : `第${i + 1}级`"
          />
        </el-steps>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggleStatus(row)">
          {{ row.status === 'active' ? '停用' : '启用' }}
        </el-button>
        <gi-button type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <ApprovalFlowFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { getApprovalFlows, createApprovalFlow, updateApprovalFlow, deleteApprovalFlow } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import ApprovalFlowFormDialog, { type ApprovalFlowFormModel } from './ApprovalFlowFormDialog.vue'

interface ApprovalFlow {
  id: string
  name: string
  business_type: string
  nodes: string[]
  status: string
}

const columns: TableColumnItem<ApprovalFlow>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'name', label: '审批流名称', minWidth: 160 },
  { prop: 'business_type', label: '关联业务', width: 160 },
  { label: '审批节点', minWidth: 250, slotName: 'nodes' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ApprovalFlow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getApprovalFlows()
    const allItems = (response.data || []) as ApprovalFlow[]
    const start = (page - 1) * size
    return {
      list: allItems.slice(start, start + size),
      total: allItems.length
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteApprovalFlow(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ApprovalFlowFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ApprovalFlowFormModel {
  return { id: '', name: '', business_type: '', nodes: '' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ApprovalFlow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    name: row.name,
    business_type: row.business_type,
    nodes: row.nodes.join(',')
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.business_type || !formModel.value.nodes) {
    ElMessage.warning('请填写必填项')
    return
  }
  const nodes = formModel.value.nodes
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (dialogMode.value === 'add') {
    await createApprovalFlow({ name: formModel.value.name, business_type: formModel.value.business_type, nodes, status: 'active' })
    ElMessage.success('新增成功')
  } else {
    await updateApprovalFlow(formModel.value.id, { name: formModel.value.name, business_type: formModel.value.business_type, nodes })
    ElMessage.success('保存成功')
  }
  dialogVisible.value = false
  await refresh()
}

function toggleStatus(row: ApprovalFlow) {
  row.status = row.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(row.status === 'active' ? '已启用' : '已停用')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
