<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增采购申请' : '编辑采购申请'"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    width="760px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />

    <el-divider />

    <div class="lines-header">
      <span class="lines-title">申请明细</span>
      <el-button type="primary" size="small" @click="addLine">新增物料</el-button>
    </div>

    <el-table :data="lines" border size="small" style="margin-top: 12px">
      <el-table-column prop="material" label="物料名称" min-width="220">
        <template #default="{ row }">
          <el-input v-model="row.material" size="small" placeholder="请输入物料名称" />
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" width="110">
        <template #default="{ row }">
          <el-input-number v-model="row.qty" :min="1" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="100">
        <template #default="{ row }">
          <el-input v-model="row.unit" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="need_date" label="需求日期" width="150">
        <template #default="{ row }">
          <el-date-picker v-model="row.need_date" size="small" type="date" value-format="YYYY-MM-DD" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="{ $index }">
          <el-button type="danger" link size="small" @click="removeLine($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
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

const lines = ref<PurchaseRequestLine[]>([])

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
  { type: 'date-picker', label: '需求日期', field: 'need_date', required: true, props: { valueFormat: 'YYYY-MM-DD' } as any },
  { type: 'input', label: '备注', field: 'remark', props: { type: 'textarea', rows: 2 } as any }
]

watch(
  () => visible.value,
  (value) => {
    if (!value) return
    lines.value = [
      {
        material: '',
        qty: 1,
        unit: '件',
        need_date: formData.value.need_date || ''
      }
    ]
  }
)

function addLine() {
  lines.value.push({
    material: '',
    qty: 1,
    unit: '件',
    need_date: formData.value.need_date || ''
  })
}

function removeLine(index: number) {
  if (lines.value.length === 1) {
    ElMessage.warning('至少保留一条申请明细')
    return
  }
  lines.value.splice(index, 1)
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.need_date) {
    ElMessage.warning('请填写需求日期')
    return false
  }

  const invalidLine = lines.value.find((item) => !item.material || !item.need_date || item.qty <= 0)
  if (invalidLine) {
    ElMessage.warning('请完善申请明细')
    return false
  }

  emit('submit', [...lines.value])
  return false
}
</script>

<style scoped>
.lines-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lines-title {
  font-weight: 600;
}
</style>
