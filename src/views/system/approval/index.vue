<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
    </template>

    <gi-table :columns="columns" :data="flows" border style="height: 100%">
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
        <gi-button type="delete" @click="deleteFlow(row.id)" />
      </template>
    </gi-table>

    <gi-dialog
      v-model="dialogVisible"
      :footer="true"
      :on-before-ok="submitDialog"
      :title="dialogMode === 'add' ? '新增审批流' : '编辑审批流'"
      width="600px"
    >
      <gi-form v-model="form" :columns="formColumns" :label-width="120" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { approvalFlows as mockFlows } from '@/mock'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface ApprovalFlow {
  id: string
  name: string
  business_type: string
  nodes: string[]
  status: string
}

const flows = ref<ApprovalFlow[]>(mockFlows as any)

const columns: TableColumnItem<ApprovalFlow>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'name', label: '审批流名称', minWidth: 160 },
  { prop: 'business_type', label: '关联业务', width: 160 },
  { label: '审批节点', minWidth: 250, slotName: 'nodes' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const form = reactive({ name: '', business_type: '', nodes: '车间主任' })
const formColumns: FormColumnItem[] = [
  { type: 'input', label: '审批流名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '关联业务',
    field: 'business_type',
    required: true,
    props: {
      options: [
        { label: '普通工单', value: 'work_order_normal' },
        { label: '紧急工单', value: 'work_order_urgent' },
        { label: 'BOM/工艺', value: 'bom_routing' },
        { label: 'ECN变更', value: 'ecn' },
        { label: '销售订单', value: 'sales_order' },
        { label: '采购订单', value: 'purchase_order' }
      ]
    } as any
  },
  { type: 'input', label: '审批节点', field: 'nodes', required: true, props: { placeholder: '多个节点用逗号分隔，如：车间主任,生产部长' } as any }
]

function openAdd() {
  dialogMode.value = 'add'
  form.name = ''
  form.business_type = ''
  form.nodes = ''
  dialogVisible.value = true
}
function openEdit(row: ApprovalFlow) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  form.name = row.name
  form.business_type = row.business_type
  form.nodes = row.nodes.join(',')
  dialogVisible.value = true
}

async function submitDialog() {
  if (!form.name || !form.business_type || !form.nodes) {
    ElMessage.warning('请填写必填项')
    return false
  }
  const nodes = form.nodes
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (dialogMode.value === 'add') {
    flows.value.unshift({ id: Date.now().toString(), ...form, nodes, status: 'active' })
    ElMessage.success('新增成功')
  } else {
    const f = flows.value.find((f) => f.id === editingId.value)
    if (f) {
      f.name = form.name
      f.business_type = form.business_type
      f.nodes = nodes
    }
    ElMessage.success('保存成功')
  }
  return true
}

function toggleStatus(row: ApprovalFlow) {
  row.status = row.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(row.status === 'active' ? '已启用' : '已停用')
}

function deleteFlow(id: string) {
  ElMessageBox.confirm('确定删除该审批流？', '提示', { type: 'warning' })
    .then(() => {
      flows.value = flows.value.filter((f) => f.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
