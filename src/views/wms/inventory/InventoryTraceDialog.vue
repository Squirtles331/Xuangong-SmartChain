<template>
  <el-dialog v-model="visible" title="批次追溯" width="700px" :lock-scroll="false">
    <div v-if="traceData.length">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in traceData" :key="index" :timestamp="item.time" :type="item.type">
          {{ item.desc }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface InventoryTraceItem {
  time: string
  type: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  desc: string
}

const visible = defineModel<boolean>('visible', { required: true })
const traceData = defineModel<InventoryTraceItem[]>('traceData', { required: true })
</script>
