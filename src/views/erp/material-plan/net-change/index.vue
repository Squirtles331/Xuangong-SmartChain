<template>
  <CrudPage
    v-model:search-model="searchModel"
    title="净变更计划"
    :search-columns="[]"
    :columns="affectedColumns"
    :data="affected"
    :loading="loading"
    :show-add-button="false"
    :show-refresh-button="false"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
  >
    <template #tool>
      <el-space wrap>
        <el-select v-model="changeType" clearable placeholder="筛选变更类型" style="width: 200px">
          <el-option v-for="item in changeTypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button @click="loadData">刷新</el-button>
        <el-button type="primary" @click="reloadNetChange">执行净变更重算</el-button>
      </el-space>
    </template>

    <template #beforeTable>
      <el-alert type="info" :closable="false" title="APS 负责扰动重排建议，ERP 只负责物料与供需净变更的承接重算。" class="boundary-alert" />

      <el-card shadow="never" class="table-card" header="变更事件">
        <gi-table :columns="eventColumns" :data="events" border stripe />
      </el-card>
    </template>

    <template #diff="{ row }">
      <span :class="['diff-value', { 'diff-value--up': row.diff > 0, 'diff-value--down': row.diff < 0 }]">
        {{ row.diff > 0 ? '+' : '' }}{{ row.diff }}
      </span>
    </template>

    <template #action="{ row }">
      <StatusTag :value="row.action" :options="actionOptions" />
    </template>

    <template #expand="{ row }">
      <div class="expand-panel">
        <el-table :data="row.details" border size="small">
          <el-table-column prop="source" label="影响来源" min-width="180" />
          <el-table-column prop="oldQty" label="原数量" min-width="90" align="center" />
          <el-table-column prop="newQty" label="新数量" min-width="90" align="center" />
          <el-table-column prop="diff" label="变化值" min-width="90" align="center">
            <template #default="{ row: detail }">
              <span :class="['diff-value', { 'diff-value--up': detail.diff > 0, 'diff-value--down': detail.diff < 0 }]">
                {{ detail.diff > 0 ? '+' : '' }}{{ detail.diff }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="变化原因" min-width="180" />
        </el-table>
      </div>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import { getErpNetChangeOverview, type ErpNetChangeAffectedRecord, type ErpNetChangeEvent } from '@/static/services/erp'

defineOptions({
  name: 'ErpNetChangePage'
})

const changeTypeOptions = ['销售订单增量', 'BOM 用量优化', '安全库存回补']
const actionOptions = [
  { value: 'increase', label: '增加', type: 'success' as const },
  { value: 'decrease', label: '减少', type: 'danger' as const },
  { value: 'keep', label: '保持', type: 'info' as const }
]

const searchModel = reactive({})
const changeType = ref('')
const events = ref<ErpNetChangeEvent[]>([])
const affected = ref<ErpNetChangeAffectedRecord[]>([])
const loading = ref(false)

const eventColumns: TableColumnItem<ErpNetChangeEvent>[] = [
  { prop: 'type', label: '变更类型', minWidth: 140 },
  { prop: 'detail', label: '变更说明', minWidth: 360 },
  { prop: 'time', label: '触发时间', width: 180, align: 'center' }
]

const affectedColumns: TableColumnItem<ErpNetChangeAffectedRecord>[] = [
  { type: 'expand', slotName: 'expand', width: 60 },
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'oldQty', label: '原数量', width: 100, align: 'right' },
  { prop: 'newQty', label: '新数量', width: 100, align: 'right' },
  { label: '变化值', width: 100, align: 'right', slotName: 'diff' },
  { label: '承接动作', width: 100, align: 'center', slotName: 'action' }
]

async function loadData() {
  loading.value = true
  try {
    const response = await getErpNetChangeOverview({
      pageNum: 1,
      pageSize: 100,
      changeType: changeType.value || undefined
    })
    events.value = response.data.events
    affected.value = response.data.affected
  } finally {
    loading.value = false
  }
}

async function reloadNetChange() {
  await loadData()
  ElMessage.success('净变更静态重算已完成')
}

watch(changeType, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.boundary-alert {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.expand-panel {
  padding: 12px 20px;
}

.diff-value {
  color: var(--el-text-color-secondary);
}

.diff-value--up {
  color: #059669;
}

.diff-value--down {
  color: #dc2626;
}
</style>
