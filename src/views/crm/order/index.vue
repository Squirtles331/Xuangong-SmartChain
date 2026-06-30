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
      <gi-button type="reset" @click="refresh" />
    </template>

    <TableSetting title="销售订单列表" :columns="columns" @refresh="refresh">
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
          <template #amount="{ row }">
            {{ row.amount.toLocaleString('zh-CN') }}
          </template>

          <template #status="{ row }">
            <el-tag :type="statusTagType[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="viewChange(row)">订单变更</el-button>
            <el-button v-if="row.status === 'pending_delivery'" type="success" link size="small" @click="createDelivery(row)">发货完成</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getSalesOrderList, updateSalesOrder, type SalesOrder, type SalesOrderQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'

const router = useRouter()

const statusTextMap: Record<SalesOrder['status'], string> = {
  approved: '已审批',
  in_production: '生产中',
  pending_delivery: '待发货',
  completed: '已完成'
}

const statusTagType: Record<SalesOrder['status'], '' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
  approved: 'primary',
  in_production: 'warning',
  pending_delivery: 'success',
  completed: 'info'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '订单编号', field: 'code' },
  { type: 'input', label: '客户名称', field: 'customer_name' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '已审批', value: 'approved' },
        { label: '生产中', value: 'in_production' },
        { label: '待发货', value: 'pending_delivery' },
        { label: '已完成', value: 'completed' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SalesOrder>[] = [
  { prop: 'code', label: '订单编号', minWidth: 160 },
  { prop: 'customer_name', label: '客户名称', minWidth: 160 },
  { prop: 'material_name', label: '产品名称', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '金额(元)', minWidth: 120, align: 'right', slotName: 'amount' },
  { prop: 'delivery_date', label: '交期', minWidth: 120 },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  code: '',
  customer_name: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const { tableData, pagination, loading, search, refresh } = useTable<SalesOrder>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SalesOrderQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      customerName: queryParams.customer_name || undefined,
      status: queryParams.status || undefined
    }
    const response = await getSalesOrderList(params)
    return response.data
  }
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    customer_name: '',
    status: ''
  })
  search()
}

function viewChange(row: SalesOrder) {
  router.push(`/crm/order-change?id=${row.id}`)
}

async function createDelivery(row: SalesOrder) {
  await updateSalesOrder(row.id, { status: 'completed' })
  ElMessage.success('订单已更新为已完成')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
