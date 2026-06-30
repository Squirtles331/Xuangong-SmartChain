<template>
  <gi-page-layout>
    <template #header>
      <div class="editor-header">
        <div>
          <h2>{{ routingTitle }}</h2>
          <p class="header-desc">物料编码：{{ routingForm.material_code || '-' }} ｜ 版本：{{ routingForm.version || '-' }}</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <div class="editor-layout">
      <div class="left-panel">
        <el-card shadow="never" class="summary-card">
          <template #header>
            <div class="card-header">
              <span>工艺信息</span>
            </div>
          </template>

          <el-form :model="routingForm" label-width="92px">
            <el-form-item label="工艺路线">
              <el-input v-model="routingForm.routing_name" />
            </el-form-item>
            <el-form-item label="物料编码">
              <el-input v-model="routingForm.material_code" />
            </el-form-item>
            <el-form-item label="物料名称">
              <el-input v-model="routingForm.material_name" />
            </el-form-item>
            <el-form-item label="版本">
              <el-input v-model="routingForm.version" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="routingForm.status" style="width: 100%">
                <el-option label="启用" value="enabled" />
                <el-option label="停用" value="disabled" />
              </el-select>
            </el-form-item>
            <el-form-item label="说明">
              <el-input v-model="routingForm.description" type="textarea" :rows="4" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" class="summary-card">
          <template #header>
            <div class="card-header">
              <span>工时汇总</span>
            </div>
          </template>

          <div class="summary-item">
            <span>准备工时</span>
            <strong>{{ totalSetup }} 分钟</strong>
          </div>
          <div class="summary-item">
            <span>加工工时</span>
            <strong>{{ totalRun }} 分钟</strong>
          </div>
          <div class="summary-item">
            <span>排队与转运</span>
            <strong>{{ totalFlow }} 分钟</strong>
          </div>
          <div class="summary-item total">
            <span>总工时</span>
            <strong>{{ totalDuration }} 分钟</strong>
          </div>
        </el-card>
      </div>

      <div class="right-panel">
        <div class="toolbar">
          <el-button type="primary" @click="addOperation">新增工序</el-button>
        </div>

        <el-table :data="operations" border style="width: 100%">
          <el-table-column label="工序号" width="90" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.operation_no" :min="10" :step="10" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="工序名称" min-width="130">
            <template #default="{ row }">
              <el-input v-model="row.name" />
            </template>
          </el-table-column>
          <el-table-column label="工作中心" min-width="140">
            <template #default="{ row }">
              <el-select v-model="row.work_center" style="width: 100%">
                <el-option v-for="item in workCenterOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="准备工时" width="110" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.setup_hours" :min="0" :precision="0" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="加工工时" width="110" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.run_hours" :min="0" :precision="0" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="排队工时" width="110" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.queue_hours" :min="0" :precision="0" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="转运工时" width="110" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.move_hours" :min="0" :precision="0" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="人数" width="80" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.workers" :min="1" :precision="0" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column label="技能要求" min-width="140">
            <template #default="{ row }">
              <el-select v-model="row.skill" style="width: 100%">
                <el-option v-for="item in skillOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="质检关卡" width="100" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.is_qc_gate" />
            </template>
          </el-table-column>
          <el-table-column label="委外" width="90" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.is_outsourced" />
            </template>
          </el-table-column>
          <el-table-column label="操作说明" min-width="220">
            <template #default="{ row }">
              <el-input v-model="row.instruction" type="textarea" :rows="2" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" fixed="right" align="center">
            <template #default="{ $index }">
              <el-button link type="primary" @click="moveUp($index)" :disabled="$index === 0">上移</el-button>
              <el-button link type="primary" @click="moveDown($index)" :disabled="$index === operations.length - 1">下移</el-button>
              <el-button link type="danger" @click="removeOperation($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { getRoutingDetail, getRoutingList, saveRouting, type RoutingDetail, type RoutingOperation } from '@/api/routing'

const route = useRoute()

const workCenterOptions = ['下料组', '数控车组', '钻床组', '热处理组', '磨床组', '装配组', '测试组', '加工中心']
const skillOptions = ['下料操作', '数控车床操作', '钻床操作', '热处理操作', '磨床操作', '装配钳工', '测试操作', '加工中心操作']

const routingForm = reactive<RoutingDetail>({
  id: '',
  material_code: '',
  material_name: '',
  routing_name: '',
  version: 'V1.0',
  status: 'enabled',
  description: '',
  operations: []
})

const operations = ref<RoutingOperation[]>([])

const routingTitle = computed(() => routingForm.routing_name || '工艺路线编辑')
const totalSetup = computed(() => operations.value.reduce((sum, item) => sum + Number(item.setup_hours || 0), 0))
const totalRun = computed(() => operations.value.reduce((sum, item) => sum + Number(item.run_hours || 0), 0))
const totalFlow = computed(() => operations.value.reduce((sum, item) => sum + Number(item.queue_hours || 0) + Number(item.move_hours || 0), 0))
const totalDuration = computed(() => totalSetup.value + totalRun.value + totalFlow.value)

function createOperation(): RoutingOperation {
  const nextNo = operations.value.length ? Math.max(...operations.value.map((item) => item.operation_no)) + 10 : 10
  return {
    id: `temp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    routing_id: routingForm.id,
    routing_name: routingForm.routing_name,
    material_code: routingForm.material_code,
    material_name: routingForm.material_name,
    version: routingForm.version,
    status: routingForm.status,
    operation_no: nextNo,
    name: '',
    work_center: workCenterOptions[0],
    setup_hours: 0,
    run_hours: 0,
    queue_hours: 0,
    move_hours: 0,
    workers: 1,
    skill: skillOptions[0],
    is_qc_gate: false,
    is_outsourced: false,
    instruction: ''
  }
}

function normalizeOrder() {
  operations.value = [...operations.value].sort((a, b) => a.operation_no - b.operation_no)
  operations.value.forEach((item, index) => {
    item.operation_no = (index + 1) * 10
  })
}

function addOperation() {
  operations.value.push(createOperation())
  normalizeOrder()
}

function moveUp(index: number) {
  if (index === 0) return
  ;[operations.value[index - 1], operations.value[index]] = [operations.value[index], operations.value[index - 1]]
  normalizeOrder()
}

function moveDown(index: number) {
  if (index >= operations.value.length - 1) return
  ;[operations.value[index], operations.value[index + 1]] = [operations.value[index + 1], operations.value[index]]
  normalizeOrder()
}

function removeOperation(index: number) {
  operations.value.splice(index, 1)
  normalizeOrder()
}

async function loadDetail() {
  const id = String(route.params.id || '')
  if (!id) return

  const response = await getRoutingDetail(id)
  if (response.data) {
    Object.assign(routingForm, response.data)
    operations.value = response.data.operations.map((item) => ({ ...item }))
    normalizeOrder()
    return
  }

  const listResponse = await getRoutingList({ pageNum: 1, pageSize: 100 })
  const related = listResponse.data.list.filter((item) => item.routing_id === id || item.id === id)
  if (related.length) {
    const first = related[0]
    Object.assign(routingForm, {
      id: first.routing_id || id,
      material_code: first.material_code || '',
      material_name: first.material_name || '',
      routing_name: first.routing_name || '工艺路线',
      version: first.version || 'V1.0',
      status: first.status || 'enabled',
      description: ''
    })
    operations.value = related.map((item) => ({ ...item }))
    normalizeOrder()
  }
}

async function handleSave() {
  if (!routingForm.routing_name || !routingForm.material_name) {
    ElMessage.warning('请填写工艺路线名称和物料名称')
    return
  }

  if (!operations.value.length) {
    ElMessage.warning('请至少维护一条工序')
    return
  }

  Object.assign(routingForm, {
    operations: operations.value.map((item) => ({
      ...item,
      routing_id: routingForm.id,
      routing_name: routingForm.routing_name,
      material_code: routingForm.material_code,
      material_name: routingForm.material_name,
      version: routingForm.version,
      status: routingForm.status
    }))
  })

  await saveRouting({
    ...routingForm,
    operations: routingForm.operations
  })

  ElMessage.success('工艺路线保存成功')
}

onMounted(async () => {
  await loadDetail()
  if (!operations.value.length) addOperation()
})
</script>

<style scoped>
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.editor-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-desc {
  margin: 6px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.editor-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.summary-item:last-child {
  border-bottom: 0;
}

.summary-item.total {
  color: var(--el-color-primary);
}

.right-panel {
  min-width: 0;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
</style>
