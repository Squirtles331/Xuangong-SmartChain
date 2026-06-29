<template>
  <gi-page-layout>
    <template #header>
      <h3>销售订单变更 — {{ order?.code }}</h3>
    </template>

    <el-descriptions :column="2" border style="margin-bottom: 16px">
      <el-descriptions-item label="订单编号">{{ order?.code }}</el-descriptions-item>
      <el-descriptions-item label="客户">{{ order?.customer }}</el-descriptions-item>
      <el-descriptions-item label="产品">{{ order?.material }}</el-descriptions-item>
      <el-descriptions-item label="原数量">{{ order?.qty }} 台</el-descriptions-item>
      <el-descriptions-item label="原交期">{{ order?.delivery_date }}</el-descriptions-item>
      <el-descriptions-item label="当前状态">{{ order?.status }}</el-descriptions-item>
    </el-descriptions>

    <!-- 变更前后 diff 对比视图 -->
    <el-card v-if="showDiff" header="变更对比" shadow="never" style="margin-bottom: 16px">
      <el-table :data="diffData" border stripe size="small">
        <el-table-column prop="field" label="字段" width="120" />
        <el-table-column label="变更前" width="160">
          <template #default="{ row }">
            <span style="color: #f56c6c; text-decoration: line-through">{{ row.old }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更后" width="160">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: 600">{{ row.new }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card header="变更信息" shadow="never">
      <el-form :model="form" label-width="120px" style="max-width: 500px">
        <el-form-item label="变更类型" required>
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="数量调整" value="qty" />
            <el-option label="交期调整" value="date" />
            <el-option label="数量+交期" value="both" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type !== 'date'" label="新数量" required>
          <el-input-number v-model="form.new_qty" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item v-if="form.type !== 'qty'" label="新交期" required>
          <el-date-picker v-model="form.new_date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="变更原因" required>
          <el-input v-model="form.reason" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="previewChange">预览变更</el-button>
          <el-button type="success" @click="submitChange">提交变更</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface OrderInfo {
  code: string
  customer: string
  material: string
  qty: number
  delivery_date: string
  status: string
}

const order = ref<OrderInfo>({
  code: '',
  customer: '',
  material: '',
  qty: 0,
  delivery_date: '',
  status: ''
})

onMounted(() => {
  const orderId = route.query.id as string
  if (orderId) {
    loadOrder(orderId)
  }
})

function loadOrder(id: string) {
  order.value = {
    code: id || 'SO202501150001',
    customer: 'XX重工集团',
    material: '离心泵 XJP-100',
    qty: 50,
    delivery_date: '2025-02-15',
    status: 'approved'
  }
}

const form = reactive({
  type: 'qty' as 'qty' | 'date' | 'both',
  new_qty: 60,
  new_date: '2025-02-20',
  reason: ''
})

const showDiff = ref(false)
const diffData = ref<{ field: string; old: string | number; new: string | number }[]>([])

function previewChange() {
  const items: { field: string; old: string | number; new: string | number }[] = []
  if (form.type !== 'date') {
    items.push({ field: '数量', old: `${order.value.qty} 台`, new: `${form.new_qty} 台` })
  }
  if (form.type !== 'qty') {
    items.push({ field: '交期', old: order.value.delivery_date, new: form.new_date })
  }
  diffData.value = items
  showDiff.value = true
}

function submitChange() {
  ElMessage.success('变更已提交审批')
  router.push('/crm/order')
}
</script>
