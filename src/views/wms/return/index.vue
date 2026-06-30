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

    <TableSetting title="退料/退货单列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #type="{ row }">
            <el-tag :type="row.type === 'return' ? 'danger' : 'warning'" size="small">
              {{ row.type === 'return' ? '生产退料' : '采购退货' }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ row.status === 'pending' ? '待处理' : '已完成' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmReturn(row)">确认</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ReturnFormDialog v-model:visible="dialogVisible" v-model:form="formModel" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getReturnList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import ReturnFormDialog, { type ReturnFormModel } from './ReturnFormDialog.vue'

interface ReturnRow {
  id: string
  code: string
  type: string
  source: string
  material: string
  qty: number
  reason: string
  status: string
}

const queryParams = reactive({
  code: '',
  reason: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '单号', field: 'code', props: { clearable: true } as any },
  { type: 'input', label: '原因', field: 'reason', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '待处理', value: 'pending' },
        { label: '已完成', value: 'completed' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<ReturnRow>[] = [
  { prop: 'code', label: '单号', width: 160 },
  { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'source', label: '来源单号', width: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'reason', label: '原因', width: 140 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 90, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ReturnRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getReturnList({
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      reason: queryParams.reason || undefined,
      status: queryParams.status || undefined
    })
    return {
      list: res.data.list.map(mapRow),
      total: res.data.total
    }
  }
})

function mapRow(item: any): ReturnRow {
  return {
    id: String(item.id),
    code: item.code || '',
    type: item.type || '',
    source: item.source || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    reason: item.reason || '',
    status: item.status || ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, { code: '', reason: '', status: '' })
  search()
}

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const formModel = ref<ReturnFormModel>(createDefaultForm())

function createDefaultForm(): ReturnFormModel {
  return { type: 'return', source: '', material: '', qty: 1, reason: '多余退料' }
}

function openAdd() {
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

async function submitDialog() {
  tableData.value.unshift({
    id: `${Date.now()}`,
    code: `RT${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-4)}`,
    type: formModel.value.type,
    source: formModel.value.source,
    material: formModel.value.material,
    qty: formModel.value.qty,
    reason: formModel.value.reason,
    status: 'pending'
  })
  dialogVisible.value = false
  ElMessage.success('退料/退货单已创建')
}

function confirmReturn(row: ReturnRow) {
  row.status = 'completed'
  ElMessage.success(row.type === 'return' ? '生产退料处理成功' : '采购退货处理成功')
}
</script>
