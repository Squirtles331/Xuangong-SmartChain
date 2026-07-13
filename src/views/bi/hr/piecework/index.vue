<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col v-for="card in summaryCards" :key="card.title" :span="6">
        <el-card shadow="hover">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">
            {{ formatAmount(card.value) }}
            <span class="card-unit">元</span>
          </div>
          <div class="card-trend" :style="{ color: card.trend > 0 ? '#f56c6c' : '#67c23a' }">
            {{ card.trend > 0 ? '上升' : '下降' }} {{ Math.abs(card.trend) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <TableSetting title="计件单价列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #unit_price="{ row }">
            {{ formatAmount(row.unit_price) }}
          </template>

          <template #qualified_bonus="{ row }">
            {{ formatAmount(row.qualified_bonus) }}
          </template>

          <template #defective_penalty="{ row }">
            {{ formatAmount(row.defective_penalty) }}
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PieceworkFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createHrPiecework,
  getHrPieceworkList,
  getHrPieceworkSummary,
  updateHrPiecework,
  type HrPieceworkQuery,
  type HrPieceworkRule,
  type HrPieceworkSummaryCard
} from '@/api/hr'
import { useTable } from '@/hooks/useTable'
import PieceworkFormDialog, { type PieceworkFormModel } from './PieceworkFormDialog.vue'

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '工序名称', field: 'keyword' }]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<HrPieceworkRule>[] = [
  { prop: 'operation', label: '工序名称', minWidth: 140 },
  { prop: 'unit_price', label: '计件单价(元)', minWidth: 120, align: 'right', slotName: 'unit_price' },
  { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
  { prop: 'qualified_bonus', label: '合格奖励(元)', minWidth: 120, align: 'right', slotName: 'qualified_bonus' },
  { prop: 'defective_penalty', label: '不良扣款(元)', minWidth: 120, align: 'right', slotName: 'defective_penalty' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const summaryCards = ref<HrPieceworkSummaryCard[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PieceworkFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<HrPieceworkRule>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: HrPieceworkQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined
    }

    const response = await getHrPieceworkList(params)
    return response.data
  }
})

function createDefaultFormModel(): PieceworkFormModel {
  return {
    id: '',
    operation: '',
    unit_price: 0,
    unit: '件',
    qualified_bonus: 0,
    defective_penalty: 0
  }
}

function formatAmount(value: number) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, { keyword: '' })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: HrPieceworkRule) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function loadSummary() {
  const response = await getHrPieceworkSummary()
  summaryCards.value = response.data
}

async function submitDialog() {
  if (!formModel.value.operation) {
    ElMessage.warning('请填写工序名称')
    return
  }

  if (dialogMode.value === 'add') {
    await createHrPiecework(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateHrPiecework(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await Promise.all([refresh(), loadSummary()])
}

onMounted(() => {
  loadSummary()
})
</script>

<style scoped>
.card-title {
  font-size: 13px;
  color: #909399;
}

.card-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 700;
}

.card-unit {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}

.card-trend {
  margin-top: 8px;
  font-size: 12px;
}

:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
