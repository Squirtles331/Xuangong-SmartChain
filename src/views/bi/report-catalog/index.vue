<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="报表管理"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
  >
    <template #sourceSystems="{ row }">
      <el-space wrap :size="4">
        <el-tag v-for="system in row.source_systems" :key="system" size="small" effect="plain">
          {{ system }}
        </el-tag>
      </el-space>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="biReportStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  biReportStatusOptions,
  biReportTopicOptions,
  getBiReportCatalogList,
  type BiReportCatalogRecord,
  type BiReportCatalogStatus
} from '@/static/services/bi'

defineOptions({
  name: 'BiReportCatalogPage'
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '报表关键字', field: 'keyword', props: { clearable: true, placeholder: '报表编号 / 名称 / 负责人' } as never },
  {
    type: 'select-v2',
    label: '报表主题',
    field: 'topic',
    props: { clearable: true, options: biReportTopicOptions } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { clearable: true, options: biReportStatusOptions.map((item) => ({ label: item.label, value: item.value })) } as never
  }
]

const columns: TableColumnItem<BiReportCatalogRecord>[] = [
  { prop: 'id', label: '报表编号', minWidth: 130 },
  { prop: 'name', label: '报表名称', minWidth: 170 },
  { prop: 'topic', label: '主题', minWidth: 110, align: 'center' },
  { label: '来源系统', minWidth: 180, slotName: 'sourceSystems' },
  { prop: 'cycle', label: '更新周期', minWidth: 100, align: 'center' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'last_updated_at', label: '最近更新', minWidth: 150, align: 'center' },
  { prop: 'owner', label: '负责人', minWidth: 110 },
  { prop: 'description', label: '目录说明', minWidth: 240 },
  { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
]

const rowActions: CrudRowActionItem[] = [{ key: 'view', label: '查看', tone: 'primary' }]

const queryParams = reactive<{
  keyword: string
  topic: string
  status: '' | BiReportCatalogStatus
}>({
  keyword: '',
  topic: '',
  status: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<BiReportCatalogRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getBiReportCatalogList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      topic: queryParams.topic || undefined,
      status: queryParams.status || undefined
    })
    return response.data
  }
})

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    topic: '',
    status: ''
  })
  search()
}

function handleRowAction(action: string, row: BiReportCatalogRecord) {
  if (action === 'view') {
    ElMessage.success(`已打开 ${row.name} 的静态目录信息`)
  }
}
</script>
