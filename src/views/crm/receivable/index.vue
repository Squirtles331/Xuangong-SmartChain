<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="receivable-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="searchFormRef" v-model="searchForm" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openReceipt">登记回款</gi-button>
    </template>

    <gi-table :columns="columns" :data="pagedAR" :pagination="pagination" border stripe style="height: 100%">
      <template #aging="{ row }">
        <el-tag v-if="row.aging <= 0" type="success" size="small">未到期</el-tag>
        <el-tag v-else-if="row.aging <= 30" type="success" size="small">逾期{{ row.aging }}天</el-tag>
        <el-tag v-else-if="row.aging <= 60" type="warning" size="small">逾期{{ row.aging }}天</el-tag>
        <el-tag v-else-if="row.aging <= 90" type="warning" size="small" color="#e6a23c" style="color: #fff">逾期{{ row.aging }}天</el-tag>
        <el-tag v-else type="danger" size="small">逾期{{ row.aging }}天</el-tag>
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

    <!-- 回款登记弹窗 -->
    <el-dialog v-model="receiptVisible" title="登记回款" width="500px">
      <el-form :model="receiptForm" label-width="100px">
        <el-form-item label="客户" required
          ><el-select v-model="receiptForm.customer" style="width: 100%"
            ><el-option v-for="c in customerNames" :key="c" :label="c" :value="c" /></el-select
        ></el-form-item>
        <el-form-item label="回款金额" required><el-input-number v-model="receiptForm.amount" :min="0" style="width: 100%" /></el-form-item>
        <el-form-item label="回款日期" required><el-date-picker v-model="receiptForm.date" style="width: 100%" /></el-form-item>
        <el-form-item label="回款方式" required
          ><el-select v-model="receiptForm.method" style="width: 100%"
            ><el-option label="银行转账" value="bank" /><el-option label="现金" value="cash" /><el-option label="承兑汇票" value="draft" /></el-select
        ></el-form-item>
      </el-form>
      <template #footer
        ><el-button @click="receiptVisible = false">取消</el-button><el-button type="primary" @click="submitReceipt">确认</el-button></template
      >
    </el-dialog>

    <!-- 核销弹窗 -->
    <el-dialog v-model="settleVisible" title="回款核销" width="650px">
      <p>
        当前回款余额: <strong>{{ receiptForm.amount.toLocaleString() }} 元</strong>
      </p>
      <el-table :data="settleList" border @selection-change="onSettleSelect">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="code" label="应收单号" width="160" />
        <el-table-column prop="amount" label="金额" width="120" align="right" />
        <el-table-column prop="balance" label="余额" width="120" align="right" />
        <el-table-column prop="aging" label="账龄" width="100" />
        <el-table-column label="核销金额" minWidth="120" align="center">
          <template #default="{ row }">
            <el-input-number
              v-model="settleAmountMap[row.id]"
              :min="0"
              :max="row.balance"
              :precision="2"
              size="small"
              controls-position="right"
              style="width: 100%"
            />
          </template>
        </el-table-column>
      </el-table>
      <template #footer
        ><el-button @click="settleVisible = false">取消</el-button><el-button type="primary" @click="submitSettle">确认核销</el-button></template
      >
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getReceivableList, createReceipt } from '@/api/crm'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

interface AR {
  id: string
  code: string
  customer: string
  amount: number
  settled: number
  balance: number
  due_date: string
  aging: number
}

const ars = ref<AR[]>([])

const searchForm = reactive({ customer: '', aging: '' })
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
        { label: '逾期1-30天', value: '1' },
        { label: '逾期31-60天', value: '2' },
        { label: '逾期61-90天', value: '3' },
        { label: '逾期>90天', value: '4' }
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

const columns: TableColumnItem<AR>[] = [
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

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pagedAR = ref<AR[]>([])

onMounted(() => {
  fetchData()
})

async function fetchData() {
  // Map aging filter to API status param
  let statusParam: 'overdue' | 'settled' | 'pending' | undefined
  if (searchForm.aging) {
    if (searchForm.aging === '0') statusParam = 'pending'
    else statusParam = 'overdue'
  }
  const params = {
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    customer: searchForm.customer || undefined,
    status: statusParam
  }
  const res = await getReceivableList(params)
  ars.value = res.data.items
  pagination.total = res.data.total
  pagedAR.value = res.data.items
}

function handleSearch() {
  pagination.currentPage = 1
  fetchData()
}
function handleReset() {
  searchForm.customer = ''
  searchForm.aging = ''
  pagination.currentPage = 1
  fetchData()
}

const customerNames = ['XX重工集团', 'YY机械设备', 'ZZ泵业科技']

const receiptVisible = ref(false)
const receiptForm = reactive({ customer: 'XX重工集团', amount: 0, date: new Date().toISOString().slice(0, 10), method: 'bank' })
function openReceipt() {
  receiptVisible.value = true
}
async function submitReceipt() {
  await createReceipt({
    customer: receiptForm.customer,
    amount: receiptForm.amount
  })
  receiptVisible.value = false
  ElMessage.success('回款已登记，请核销')
  await fetchData()
}

const settleVisible = ref(false)
const settleList = ref<AR[]>([])
const selectedSettle = ref<AR[]>([])
const settleAmountMap = reactive<Record<string, number>>({})
function openSettle(row: AR) {
  settleList.value = ars.value.filter((a) => a.customer === row.customer && a.balance > 0)
  selectedSettle.value = []
  // Initialize settle amounts to 0 for each row
  settleList.value.forEach((a) => {
    settleAmountMap[a.id] = 0
  })
  settleVisible.value = true
}
function onSettleSelect(rows: AR[]) {
  selectedSettle.value = rows
}
function submitSettle() {
  let totalSettled = 0
  settleList.value.forEach((a) => {
    const settleAmount = settleAmountMap[a.id] || 0
    if (settleAmount > 0) {
      a.settled += settleAmount
      a.balance -= settleAmount
      totalSettled += settleAmount
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
