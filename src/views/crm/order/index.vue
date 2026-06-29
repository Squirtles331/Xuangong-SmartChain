<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="order-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="searchFormRef" v-model="searchForm" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="router.push('/crm/order/create')">新建订单</gi-button>
    </template>
    <gi-table :columns="columns" :data="pagedOrders" :pagination="pagination" border stripe style="height: 100%">
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

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { salesOrders as mockOrders } from '@/mock'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

interface Order {
  id: string
  code: string
  customer_name: string
  material_name: string
  qty: number
  amount: number
  delivery_date: string
  status: string
}

const orders = ref<Order[]>(mockOrders as any)

const router = useRouter()

const searchForm = reactive({ code: '', customer_name: '', status: '' })
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
        { label: '已发货', value: 'delivered' },
        { label: '已完成', value: 'completed' }
      ]
    }
  } as any
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => searchColumns)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const searchFormRef = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<Order>[] = [
  { prop: 'code', label: '订单编号', width: 160 },
  { prop: 'customer_name', label: '客户', minWidth: 140 },
  { prop: 'material_name', label: '产品', minWidth: 140 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'amount', label: '金额(元)', minWidth: 120, align: 'right', formatter: (row: Order) => row.amount.toLocaleString() },
  { prop: 'delivery_date', label: '交期', width: 110 },
  { label: '进度', minWidth: 320, slotName: 'status' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const filtered = computed(() =>
  orders.value.filter((o) => {
    if (searchForm.code && !o.code.includes(searchForm.code)) return false
    if (searchForm.customer_name && !o.customer_name.includes(searchForm.customer_name)) return false
    if (searchForm.status && o.status !== searchForm.status) return false
    return true
  })
)
const pagedOrders = computed(() => {
  return filtered.value.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)
})

watch(
  filtered,
  (val) => {
    pagination.total = val.length
  },
  { immediate: true }
)

function statusStep(s: string) {
  const map: Record<string, number> = { approved: 1, in_production: 2, pending_delivery: 3, delivered: 4, completed: 5 }
  return map[s] || 0
}
function handleSearch() {
  pagination.currentPage = 1
}
function handleReset() {
  searchForm.code = ''
  searchForm.customer_name = ''
  searchForm.status = ''
  pagination.currentPage = 1
}
function viewDetail(row: Order) {
  router.push('/crm/order/' + row.id)
}
function createDelivery(row: Order) {
  row.status = 'completed'
  ElMessage.success('已生成发货通知')
}
</script>
