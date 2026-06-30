<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="router.push('/crm/order/create')">新建订单</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe style="height: 100%">
      <template #status="{ row }">
        <el-steps :active="statusStep(row.status)" align-center style="min-width: 280px">
          <el-step title="审批" />
          <el-step title="生产" />
          <el-step title="发货" />
          <el-step title="收货" />
          <el-step title="完成" />
        </el-steps>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button>
        <el-button v-if="row.status === 'pending_delivery'" type="success" link size="small" @click="createDelivery(row)">发货</el-button>
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getSalesOrderList, updateSalesOrder, type SalesOrder, type SalesOrderQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'

type OrderRow = SalesOrder

const router = useRouter()
const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  code: '',
  customer_name: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '订单编号', field: 'code' } as any,
  { type: 'input', label: '客户', field: 'customer_name' } as any,
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
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<OrderRow>[] = [
  { prop: 'code', label: '订单编号', width: 160 },
  { prop: 'customer_name', label: '客户', minWidth: 140 },
  { prop: 'material_name', label: '产品', minWidth: 140 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'amount', label: '金额(元)', minWidth: 120, align: 'right', formatter: (row: OrderRow) => row.amount.toLocaleString() },
  { prop: 'delivery_date', label: '交期', width: 110 },
  { label: '进度', minWidth: 320, slotName: 'status' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<OrderRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SalesOrderQuery = {
      pageNum: page,
      pageSize: size,
      code: searchForm.value.code || undefined,
      customerName: searchForm.value.customer_name || undefined,
      status: searchForm.value.status || undefined
    }
    const response = await getSalesOrderList(params)
    return {
      list: response.data.list,
      total: response.data.total
    }
  }
})

function statusStep(status: string) {
  const map: Record<string, number> = { approved: 1, in_production: 2, pending_delivery: 3, delivered: 4, completed: 5 }
  return map[status] || 0
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', customer_name: '', status: '' }
  search()
}

function viewDetail(row: OrderRow) {
  router.push('/crm/order/' + row.id)
}

async function createDelivery(row: OrderRow) {
  await updateSalesOrder(row.id, { status: 'completed' as const })
  row.status = 'completed'
  ElMessage.success('已生成发货通知')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
