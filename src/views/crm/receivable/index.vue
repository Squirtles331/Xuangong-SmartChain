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
      <gi-button type="add" @click="openReceipt">登记回款</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe style="height: 100%">
      <template #aging="{ row }">
        <el-tag v-if="row.aging <= 0" type="success" size="small">未到期</el-tag>
        <el-tag v-else-if="row.aging <= 30" type="success" size="small">逾期 {{ row.aging }} 天</el-tag>
        <el-tag v-else-if="row.aging <= 60" type="warning" size="small">逾期 {{ row.aging }} 天</el-tag>
        <el-tag v-else-if="row.aging <= 90" type="warning" size="small" color="#e6a23c" style="color: #fff">逾期 {{ row.aging }} 天</el-tag>
        <el-tag v-else type="danger" size="small">逾期 {{ row.aging }} 天</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag v-if="row.balance === 0" type="success" size="small">已结</el-tag>
        <el-tag v-else-if="row.settled > 0" type="warning" size="small">部分核销</el-tag>
        <el-tag v-else type="info" size="small">未结</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button v-if="row.balance > 0" type="primary" link size="small" @click="openSettle(row)">核销</el-button>
      </template>
    </gi-table>

    <ReceiptDialog v-model:visible="receiptVisible" v-model:form="receiptForm" :customer-names="customerNames" @submit="submitReceipt" />
    <ReceivableSettleDialog
      v-model:visible="settleVisible"
      v-model:rows="settleList"
      v-model:selected-rows="selectedSettle"
      v-model:amount-map="settleAmountMap"
      :receipt-amount="receiptForm.amount"
      @submit="submitSettle"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { createReceipt, getReceivableList, type Receivable, type ReceivableQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import ReceiptDialog, { type ReceiptFormModel } from './ReceiptDialog.vue'
import ReceivableSettleDialog from './ReceivableSettleDialog.vue'

type ARRow = Receivable

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  customer: '',
  aging: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '客户', field: 'customer' } as any,
  {
    type: 'select-v2',
    label: '账龄',
    field: 'aging',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '未到期', value: '0' },
        { label: '逾期 1-30 天', value: '1' },
        { label: '逾期 31-60 天', value: '2' },
        { label: '逾期 61-90 天', value: '3' },
        { label: '逾期 >90 天', value: '4' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<ARRow>[] = [
  { prop: 'code', label: '应收单号', width: 160 },
  { prop: 'customer', label: '客户', minWidth: 140 },
  { prop: 'amount', label: '应收金额', minWidth: 120, align: 'right' },
  { prop: 'settled', label: '已核销', minWidth: 120, align: 'right' },
  { prop: 'balance', label: '余额', minWidth: 120, align: 'right' },
  { prop: 'due_date', label: '到期日', width: 110 },
  { label: '账龄', minWidth: 100, slotName: 'aging', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 80, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ARRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let status: 'overdue' | 'settled' | 'pending' | undefined
    if (searchForm.value.aging) {
      status = searchForm.value.aging === '0' ? 'pending' : 'overdue'
    }
    const params: ReceivableQuery = {
      pageNum: page,
      pageSize: size,
      customer: searchForm.value.customer || undefined,
      status
    }
    const response = await getReceivableList(params)
    return {
      list: response.data.list,
      total: response.data.total
    }
  }
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { customer: '', aging: '' }
  search()
}

const customerNames = ['XX重工集团', 'YY机械设备', 'ZZ泵业科技']
const receiptVisible = ref(false)
const receiptForm = ref<ReceiptFormModel>({
  customer: 'XX重工集团',
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  method: 'bank'
})

function openReceipt() {
  receiptVisible.value = true
}

async function submitReceipt() {
  await createReceipt({
    customer: receiptForm.value.customer,
    amount: receiptForm.value.amount
  })
  receiptVisible.value = false
  ElMessage.success('回款已登记，请继续核销')
  await refresh()
}

const settleVisible = ref(false)
const settleList = ref<ARRow[]>([])
const selectedSettle = ref<ARRow[]>([])
const settleAmountMap = reactive<Record<string, number>>({})

function openSettle(row: ARRow) {
  settleList.value = tableData.value.filter((item) => item.customer === row.customer && item.balance > 0)
  selectedSettle.value = []
  Object.keys(settleAmountMap).forEach((key) => delete settleAmountMap[key])
  settleList.value.forEach((item) => {
    settleAmountMap[item.id] = 0
  })
  settleVisible.value = true
}

function submitSettle() {
  let totalSettled = 0
  settleList.value.forEach((item) => {
    const amount = settleAmountMap[item.id] || 0
    if (amount > 0) {
      item.settled += amount
      item.balance -= amount
      totalSettled += amount
    }
  })

  if (totalSettled === 0) {
    ElMessage.warning('请输入核销金额')
    return
  }

  settleVisible.value = false
  ElMessage.success(`已核销 ${totalSettled.toLocaleString()} 元`)
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
