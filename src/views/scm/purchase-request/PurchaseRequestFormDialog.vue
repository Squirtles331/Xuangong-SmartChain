<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新建采购申请' : '编辑采购申请'"
    width="700px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
    <el-divider />
    <div class="lines-header">
      <strong>申请明细</strong>
      <el-button type="primary" size="small" @click="addLine">+ 添加物料</el-button>
    </div>
    <el-table :data="lines" border size="small" style="margin-top: 8px">
      <el-table-column prop="material" label="物料编码/名称" minWidth="200">
        <template #default="{ row }">
          <el-input v-model="row.material" size="small" placeholder="搜索选择物料" />
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" width="100">
        <template #default="{ row }">
          <el-input-number v-model="row.qty" :min="1" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="need_date" label="需求日期" width="130">
        <template #default="{ row }">
          <el-date-picker v-model="row.need_date" size="small" type="date" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <template #default="{ $index }">
          <el-button type="danger" link size="small" @click="lines.splice($index, 1)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface PurchaseRequestFormModel {
  id: string
  dept: string
  reason: string
  need_date: string
  remark: string
}

export interface PurchaseRequestLine {
  material: string
  qty: number
  unit: string
  need_date: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PurchaseRequestFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: [lines: PurchaseRequestLine[]]
}>()

const lines = ref<PurchaseRequestLine[]>([{ material: '', qty: 1, unit: '', need_date: '' }])

const formColumns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '申请部门',
    field: 'dept',
    required: true,
    props: {
      options: [
        { label: '生产部', value: '生产部' },
        { label: '设备部', value: '设备部' },
        { label: '研发部', value: '研发部' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '申请原因',
    field: 'reason',
    required: true,
    props: {
      options: [
        { label: '生产需求', value: '生产需求' },
        { label: '安全库存补货', value: '安全库存补货' },
        { label: '研发试制', value: '研发试制' },
        { label: '设备维修', value: '设备维修' },
        { label: '其他', value: '其他' }
      ]
    } as any
  },
  { type: 'date-picker', label: '需求日期', field: 'need_date', required: true },
  { type: 'input', label: '备注', field: 'remark', props: { type: 'textarea', rows: 2 } as any }
]

function addLine() {
  lines.value.push({ material: '', qty: 1, unit: '', need_date: '' })
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit', [...lines.value])
  return false
}
</script>

<style scoped>
.lines-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
</style>
