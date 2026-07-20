<template>
  <el-dialog v-model="visible" :title="snapshot?.equipment_name || '监控详情'" width="760px" :lock-scroll="false">
    <el-descriptions v-if="snapshot" :column="2" border>
      <el-descriptions-item label="设备编码">{{ snapshot.equipment_code }}</el-descriptions-item>
      <el-descriptions-item label="设备名称">{{ snapshot.equipment_name }}</el-descriptions-item>
      <el-descriptions-item label="所属车间">{{ snapshot.workshop }}</el-descriptions-item>
      <el-descriptions-item label="产线/单元">{{ snapshot.line }}</el-descriptions-item>
      <el-descriptions-item label="连接状态">
        <StatusTag :value="snapshot.connection_status" :options="connectionStatusOptions" />
      </el-descriptions-item>
      <el-descriptions-item label="运行状态">
        <StatusTag :value="snapshot.run_status" :options="runStatusOptions" />
      </el-descriptions-item>
      <el-descriptions-item label="边缘网关">{{ snapshot.gateway }}</el-descriptions-item>
      <el-descriptions-item label="采样时间">{{ snapshot.sample_time }}</el-descriptions-item>
    </el-descriptions>

    <gi-table :columns="sampleColumns" :data="samples" border stripe size="small" style="margin-top: 16px">
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="sampleStatusOptions" />
      </template>
    </gi-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import { iotConnectionStatusOptions, iotRunStatusOptions, type IotMonitorSnapshot, type IotPointSample } from '@/static/services/iot'

interface Props {
  snapshot: IotMonitorSnapshot | null
  samples: IotPointSample[]
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const connectionStatusOptions = [...iotConnectionStatusOptions]
const runStatusOptions = [...iotRunStatusOptions]
const sampleStatusOptions = [
  { value: 'normal', label: '正常', type: 'success' as const },
  { value: 'warning', label: '预警', type: 'warning' as const },
  { value: 'error', label: '异常', type: 'danger' as const }
]

const sampleColumns: TableColumnItem<IotPointSample>[] = [
  { prop: 'point_code', label: '点位编码', minWidth: 140 },
  { prop: 'point_name', label: '点位名称', minWidth: 150 },
  { prop: 'value', label: '采样值', minWidth: 100, align: 'right' },
  { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 90, align: 'center', slotName: 'status' },
  { prop: 'sampled_at', label: '采样时间', minWidth: 160 }
]
</script>
