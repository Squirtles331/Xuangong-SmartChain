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

    <TableSetting title="并行工序配置" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          stripe
          style="height: 100%"
        >
          <template #operations="{ row }">
            <el-tag v-for="item in row.operations" :key="item" size="small" style="margin: 2px 6px 2px 0">
              {{ item }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="remove(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ParallelFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  deleteRoutingParallel,
  getRoutingParallelList,
  saveRoutingParallel,
  type RoutingParallelGroup,
  type RoutingParallelQuery
} from '@/api/routing'
import { useTable } from '@/hooks/useTable'
import ParallelFormDialog, { type ParallelFormModel } from './ParallelFormDialog.vue'

const mergeRuleOptions = [
  { label: '全部完成后继续', value: '全部完成后继续' },
  { label: '任一完成后继续', value: '任一完成后继续' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工艺路线', field: 'routingName', props: { placeholder: '请输入工艺路线名称' } as any },
  {
    type: 'select-v2',
    label: '汇合规则',
    field: 'mergeRule',
    props: {
      options: [{ label: '全部', value: '' }, ...mergeRuleOptions]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<RoutingParallelGroup>[] = [
  { prop: 'routing_name', label: '工艺路线', minWidth: 220 },
  { label: '并行工序', minWidth: 260, slotName: 'operations' },
  { prop: 'merge_rule', label: '汇合规则', minWidth: 140, align: 'center' },
  { prop: 'remark', label: '备注', minWidth: 220 },
  { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
]

const queryParams = reactive({
  routingName: '',
  mergeRule: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ParallelFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<RoutingParallelGroup>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: RoutingParallelQuery = {
      pageNum: page,
      pageSize: size,
      routingName: queryParams.routingName || undefined,
      mergeRule: queryParams.mergeRule || undefined
    }
    const response = await getRoutingParallelList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteRoutingParallel(id)))
})

function createDefaultFormModel(): ParallelFormModel {
  return {
    id: '',
    routing_id: '',
    routing_name: '',
    operations: [],
    merge_rule: '全部完成后继续',
    remark: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    routingName: '',
    mergeRule: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: RoutingParallelGroup) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    routing_id: row.routing_id,
    routing_name: row.routing_name,
    operations: [...row.operations],
    merge_rule: row.merge_rule,
    remark: row.remark || ''
  }
  dialogVisible.value = true
}

async function submitDialog() {
  await saveRoutingParallel({
    ...formModel.value
  })
  dialogVisible.value = false
  await refresh()
}

function remove(row: RoutingParallelGroup) {
  onDelete(row)
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
