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
      <gi-button type="add" @click="openReceipt">登记回款</gi-button>
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="应收台账" :columns="columns" @refresh="refresh">
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

          <template #settled="{ row }">
            {{ row.settled.toLocaleString('zh-CN') }}
          </template>

          <template #balance="{ row }">
            {{ row.balance.toLocaleString('zh-CN') }}
          </template>

          <template #aging="{ row }">
            <el-tag v-if="row.aging <= 0" type="success">未到期</el-tag>
            <el-tag v-else-if="row.aging <= 30" type="warning">逾期 {{ row.aging }} 天</el-tag>
            <el-tag v-else type="danger">逾期 {{ row.aging }} 天</el-tag>
          </template>

          <template #status="{ row }">
            <el-tag v-if="row.balance === 0" type="success">已结清</el-tag>
            <el-tag v-else-if="row.settled > 0" type="warning">部分核销</el-tag>
            <el-tag v-else type="info">未结清</el-tag>
          </template>

          <template #actions="{ row }">
            <el-button v-if="row.balance > 0" type="primary" link size="small" @click="openSettle(row)">核销</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

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
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createReceiptRecord, getReceivableList, settleReceivables, type Receivable, type ReceivableQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import ReceiptDialog, { type ReceiptFormModel } from './ReceiptDialog.vue'
import ReceivableSettleDialog from './ReceivableSettleDialog.vue'

const customerNames = ['华东重工集团', '启明精密制造', '鼎盛动力设备']

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '客户名称', field: 'customer' },
  {
    type: 'select-v2',
    label: '账龄',
    field: 'agingRange',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '未到期', value: '0' },
        { label: '逾期 1-30 天', value: '1' },
        { label: '逾期 31-60 天', value: '2' },
        { label: '逾期 61-90 天', value: '3' },
        { label: '逾期 90 天以上', value: '4' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Receivable>[] = [
  { prop: 'code', label: '应收单号', minWidth: 160 },
  { prop: 'customer', label: '客户名称', minWidth: 160 },
  { label: '应收金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
  { label: '已核销(元)', minWidth: 120, align: 'right', slotName: 'settled' },
  { label: '余额(元)', minWidth: 120, align: 'right', slotName: 'balance' },
  { prop: 'due_date', label: '到期日期', minWidth: 120 },
  { label: '账龄', minWidth: 120, align: 'center', slotName: 'aging' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 100, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  customer: '',
  agingRange: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const receiptVisible = ref(false)
const settleVisible = ref(false)
const settleList = ref<Receivable[]>([])
const selectedSettle = ref<Receivable[]>([])
const settleAmountMap = reactive<Record<string, number>>({})

const receiptForm = ref<ReceiptFormModel>({
  customer: customerNames[0],
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  method: 'bank'
})

const { tableData, pagination, loading, search, refresh } = useTable<Receivable>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: ReceivableQuery = {
      pageNum: page,
      pageSize: size,
      customer: queryParams.customer || undefined,
      agingRange: (queryParams.agingRange || undefined) as ReceivableQuery['agingRange']
    }
    const response = await getReceivableList(params)
    return response.data
  }
})

const availableSettleRows = computed(() => settleList.value.filter((item) => item.balance > 0))

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    customer: '',
    agingRange: ''
  })
  search()
}

function openReceipt() {
  receiptVisible.value = true
}

async function submitReceipt() {
  if (!receiptForm.value.customer || receiptForm.value.amount <= 0) {
    ElMessage.warning('请填写客户名称和回款金额')
    return
  }

  await createReceiptRecord({
    customer: receiptForm.value.customer,
    amount: receiptForm.value.amount
  })
  receiptVisible.value = false
  ElMessage.success('回款登记成功')
  await refresh()
}

function openSettle(row: Receivable) {
  settleList.value = tableData.value.filter((item) => item.customer === row.customer && item.balance > 0)
  selectedSettle.value = [...settleList.value]
  Object.keys(settleAmountMap).forEach((key) => delete settleAmountMap[key])
  settleList.value.forEach((item) => {
    settleAmountMap[item.id] = 0
  })
  settleVisible.value = true
}

async function submitSettle() {
  const items = availableSettleRows.value
    .map((item) => ({
      id: item.id,
      amount: settleAmountMap[item.id] || 0
    }))
    .filter((item) => item.amount > 0)

  if (!items.length) {
    ElMessage.warning('请输入核销金额')
    return
  }

  await settleReceivables({ items })
  settleVisible.value = false
  ElMessage.success('应收核销成功')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
