<template>
  <gi-page-layout>
    <template #header>
      <h3>销售订单变更 - {{ order?.code || '--' }}</h3>
    </template>

    <el-descriptions :column="2" border style="margin-bottom: 16px">
      <el-descriptions-item label="订单编号">{{ order?.code || '-' }}</el-descriptions-item>
      <el-descriptions-item label="客户名称">{{ order?.customer_name || '-' }}</el-descriptions-item>
      <el-descriptions-item label="产品名称">{{ order?.material_name || '-' }}</el-descriptions-item>
      <el-descriptions-item label="原数量">{{ order?.qty || 0 }} 件</el-descriptions-item>
      <el-descriptions-item label="原交期">{{ order?.delivery_date || '-' }}</el-descriptions-item>
      <el-descriptions-item label="当前状态">{{ currentStatusText }}</el-descriptions-item>
    </el-descriptions>

    <el-card v-if="showDiff" header="变更对比" shadow="never" style="margin-bottom: 16px">
      <el-table :data="diffData" border stripe size="small">
        <el-table-column prop="field" label="字段" width="120" />
        <el-table-column label="变更前" width="180">
          <template #default="{ row }">
            <span style="color: #f56c6c; text-decoration: line-through">{{ row.old }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更后" width="180">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: 600">{{ row.new }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card header="变更信息" shadow="never">
      <el-form :model="form" label-width="120px" style="max-width: 520px">
        <el-form-item label="变更类型" required>
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="数量调整" value="qty" />
            <el-option label="交期调整" value="date" />
            <el-option label="数量和交期调整" value="both" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type !== 'date'" label="新数量" required>
          <el-input-number v-model="form.new_qty" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item v-if="form.type !== 'qty'" label="新交期" required>
          <el-date-picker v-model="form.new_date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="变更原因" required>
          <el-input v-model="form.reason" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="previewChange">预览变更</el-button>
          <el-button type="success" @click="submitChange">提交变更</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getSalesOrderDetail, updateSalesOrder, type SalesOrder } from '@/api/crm'

const route = useRoute()
const router = useRouter()

const statusTextMap: Record<SalesOrder['status'], string> = {
  approved: '已审批',
  in_production: '生产中',
  pending_delivery: '待发货',
  completed: '已完成'
}

const order = ref<SalesOrder | null>(null)
const showDiff = ref(false)
const diffData = ref<Array<{ field: string; old: string | number; new: string | number }>>([])

const form = reactive({
  type: 'qty' as 'qty' | 'date' | 'both',
  new_qty: 1,
  new_date: '',
  reason: ''
})

const currentStatusText = computed(() => {
  if (!order.value) return '-'
  return statusTextMap[order.value.status]
})

onMounted(async () => {
  const orderId = String(route.query.id || '')
  if (!orderId) return

  const response = await getSalesOrderDetail(orderId)
  if (response.data) {
    order.value = response.data
    form.new_qty = response.data.qty
    form.new_date = response.data.delivery_date
  }
})

function previewChange() {
  if (!order.value) return

  const items: Array<{ field: string; old: string | number; new: string | number }> = []
  if (form.type !== 'date') {
    items.push({ field: '数量', old: `${order.value.qty} 件`, new: `${form.new_qty} 件` })
  }
  if (form.type !== 'qty') {
    items.push({ field: '交期', old: order.value.delivery_date, new: form.new_date })
  }
  diffData.value = items
  showDiff.value = true
}

async function submitChange() {
  if (!order.value) return
  if (!form.reason) {
    ElMessage.warning('请填写变更原因')
    return
  }

  const payload: Partial<SalesOrder> = {}
  if (form.type !== 'date') payload.qty = form.new_qty
  if (form.type !== 'qty') payload.delivery_date = form.new_date

  await updateSalesOrder(order.value.id, payload)
  ElMessage.success('订单变更已提交')
  router.push('/crm/order')
}
</script>
