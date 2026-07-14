<template>
  <gi-page-layout v-bind="pageAttrs">
    <template v-if="$slots.left" #left>
      <slot name="left" />
    </template>

    <template #header>
      <div class="crud-page__header">
        <slot name="headerTop" />

        <div v-if="showSegmented" class="crud-page__segmented">
          <slot name="segmented">
            <el-segmented v-model="segmentedValue" :options="props.segmentedOptions" size="large" v-bind="props.segmentedProps" />
          </slot>
        </div>

        <SearchSetting
          v-if="showSearchSetting"
          :columns="searchColumns"
          :required-fields="requiredSearchFields"
          @update:visible-fields="onSearchFieldsChange"
        >
          <gi-form
            v-model="searchModel"
            :columns="visibleSearchColumns"
            :grid-item-props="searchGridItemProps"
            search
            @search="emit('search')"
            @reset="emit('reset')"
          />
        </SearchSetting>
      </div>
    </template>

    <template #tool>
      <slot name="tool">
        <CrudToolbarActions
          :actions="toolbarActions"
          :show-add-button="showAddButton"
          :show-refresh-button="showRefreshButton"
          :add-text="addText"
          :refresh-text="refreshText"
          @add="emit('add')"
          @refresh="emit('refresh')"
          @action="emit('toolbarAction', $event)"
        />
      </slot>
    </template>

    <slot name="beforeTable" />

    <TableSetting :title="title" :columns="columns" :disabled-column-keys="disabledColumnKeys" @refresh="emit('refresh')">
      <template v-if="$slots.tableToolbarLeft" #toolbar-left>
        <slot name="tableToolbarLeft" />
      </template>

      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="data"
          :pagination="pagination"
          :loading="loading"
          v-bind="{ ...tableProps, ...tableAttrs }"
          @selection-change="handleSelectionChange"
        >
          <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <slot name="dialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup generic="T extends object = any">
import { computed, ref, useSlots, watch } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import CrudToolbarActions from '@/components/crud/CrudToolbarActions/index.vue'
import type { CrudSegmentedOption, CrudSegmentedValue, CrudToolbarActionItem } from '../types'

defineOptions({
  name: 'CrudPage'
})

type TablePagination = {
  currentPage: number
  pageSize: number
  total: number
  onCurrentChange: (page: number) => void
  onSizeChange: (size: number) => void
}

interface CrudPageProps {
  title: string
  searchColumns: FormColumnItem[]
  columns: TableColumnItem<T>[]
  data: T[]
  pagination?: TablePagination
  loading?: boolean
  pageAttrs?: Record<string, any>
  searchGridItemProps?: Record<string, any>
  requiredSearchFields?: string[]
  disabledColumnKeys?: string[]
  tableAttrs?: Record<string, any>
  showAddButton?: boolean
  showRefreshButton?: boolean
  addText?: string
  refreshText?: string
  toolbarActions?: CrudToolbarActionItem[]
  segmentedOptions?: CrudSegmentedOption[]
  segmentedProps?: Record<string, any>
  segmentedAutoSearch?: boolean
}

const props = withDefaults(defineProps<CrudPageProps>(), {
  searchColumns: () => [],
  columns: () => [],
  data: () => [],
  pagination: undefined,
  loading: false,
  pageAttrs: () => ({}),
  searchGridItemProps: () => ({
    span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
  }),
  requiredSearchFields: () => [],
  disabledColumnKeys: () => [],
  tableAttrs: () => ({
    border: true,
    style: 'height: 100%'
  }),
  showAddButton: true,
  showRefreshButton: true,
  addText: '新增',
  refreshText: '刷新',
  toolbarActions: () => [],
  segmentedOptions: () => [],
  segmentedProps: () => ({}),
  segmentedAutoSearch: false
})

const searchModel = defineModel<Record<string, any>>('searchModel', { required: true })
const segmentedValue = defineModel<CrudSegmentedValue | ''>('segmentedValue', { default: '' })
const slots = useSlots()

const emit = defineEmits<{
  search: []
  reset: []
  refresh: []
  add: []
  toolbarAction: [key: string]
  selectionChange: [rows: T[]]
  segmentedChange: [value: CrudSegmentedValue | '']
}>()

const visibleSearchColumns = ref<FormColumnItem[]>([...props.searchColumns])
const segmentedReady = ref(false)

const showSegmented = computed(() => props.segmentedOptions.length > 0 || Boolean(slots.segmented))
const showSearchSetting = computed(() => props.searchColumns.length > 0)
const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter((name) => !['left', 'tool', 'dialog', 'tableToolbarLeft', 'headerTop', 'beforeTable', 'segmented'].includes(name))
)

watch(
  () => props.searchColumns,
  (columns) => {
    visibleSearchColumns.value = [...columns]
  },
  { deep: true }
)

watch(segmentedValue, (value) => {
  if (!segmentedReady.value) {
    segmentedReady.value = true
    return
  }

  emit('segmentedChange', value)

  if (props.segmentedAutoSearch) {
    emit('search')
  }
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSelectionChange(rows: T[]) {
  emit('selectionChange', rows)
}
</script>

<style scoped>
.crud-page__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.crud-page__segmented {
  display: flex;
  align-items: center;
  overflow-x: auto;
}
</style>
