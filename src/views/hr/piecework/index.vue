<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <!-- 工资月度汇总卡片 -->
    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="6" v-for="c in summaryCards" :key="c.title">
        <el-card shadow="hover">
          <div class="card-title">{{ c.title }}</div>
          <div class="card-value">{{ c.value.toLocaleString() }}<span class="card-unit"> 元</span></div>
          <div class="card-trend" :style="{ color: c.trend > 0 ? '#f56c6c' : '#67c23a' }">
            {{ c.trend > 0 ? '↑' : '↓' }}{{ Math.abs(c.trend) }}% 较上月
          </div>
        </el-card>
      </el-col>
    </el-row>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
      </template>
    </gi-table>

    <PieceworkFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { useTable } from '@/hooks/useTable'
import PieceworkFormDialog, { type PieceworkFormModel } from './PieceworkFormDialog.vue'

interface PieceworkRow {
  id: string
  operation: string
  unit_price: number
  unit: string
  qualified_bonus: number
  defective_penalty: number
}

const summaryCards = ref([
  { title: '本月计件工资总额', value: 186500, trend: 8.5 },
  { title: '人均工资', value: 9325, trend: 3.2 },
  { title: '合格奖励总额', value: 28500, trend: -2.1 },
  { title: '不良扣款总额', value: 4200, trend: -15.3 }
])

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PieceworkFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '工序名称', field: 'keyword' } as any]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<PieceworkRow>[] = [
  { prop: 'operation', label: '工序名称', minWidth: 120 },
  { prop: 'unit_price', label: '计件单价(元)', minWidth: 120, align: 'right' },
  { prop: 'unit', label: '单位', minWidth: 60, align: 'center' },
  { prop: 'qualified_bonus', label: '合格奖励(元)', minWidth: 120, align: 'right' },
  { prop: 'defective_penalty', label: '不良扣款(元)', minWidth: 120, align: 'right' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const mockData = ref<PieceworkRow[]>([
  { id: '1', operation: '下料', unit_price: 2.5, unit: '件', qualified_bonus: 0.5, defective_penalty: 5 },
  { id: '2', operation: '粗车', unit_price: 8.0, unit: '件', qualified_bonus: 1.0, defective_penalty: 15 },
  { id: '3', operation: '精车', unit_price: 12.0, unit: '件', qualified_bonus: 1.5, defective_penalty: 20 },
  { id: '4', operation: '钻孔', unit_price: 3.0, unit: '件', qualified_bonus: 0.3, defective_penalty: 8 },
  { id: '5', operation: '磨削', unit_price: 10.0, unit: '件', qualified_bonus: 1.0, defective_penalty: 18 },
  { id: '6', operation: '装配', unit_price: 15.0, unit: '台', qualified_bonus: 2.0, defective_penalty: 30 }
])

const { tableData, pagination, loading, search, refresh } = useTable<PieceworkRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = mockData.value
    if (searchForm.value.keyword) filtered = filtered.filter((r) => r.operation.includes(searchForm.value.keyword))
    const start = (page - 1) * size
    return { list: filtered.slice(start, start + size), total: filtered.length }
  }
})

function createDefaultFormModel(): PieceworkFormModel {
  return { id: '', operation: '', unit_price: 0, unit: '件', qualified_bonus: 0, defective_penalty: 0 }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PieceworkRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.operation) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    mockData.value.unshift({ ...formModel.value, id: Date.now().toString() } as PieceworkRow)
  } else {
    const i = mockData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(mockData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
.card-title {
  font-size: 13px;
  color: #909399;
}
.card-value {
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0;
}
.card-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}
.card-trend {
  font-size: 12px;
}
</style>
