<template>
  <gi-page-layout>
    <gi-table :columns="columns" :data="costDetails" border stripe size="small" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import { getCostDetails } from '@/api/finance'

const costDetails = ref<any[]>([])

const columns: TableColumnItem<any>[] = [
  { prop: 'product', label: 'Product', minWidth: 180 },
  { prop: 'material_cost', label: 'Material Cost', minWidth: 120, align: 'right' },
  { prop: 'labor_cost', label: 'Labor Cost', minWidth: 120, align: 'right' },
  { prop: 'overhead', label: 'Overhead', minWidth: 100, align: 'right' },
  { prop: 'total', label: 'Total Cost', minWidth: 120, align: 'right' },
  { prop: 'period', label: 'Period', minWidth: 100, align: 'center' }
]

async function loadData() {
  const res = await getCostDetails()
  costDetails.value = res.data || []
}

onMounted(() => {
  loadData()
})
</script>
