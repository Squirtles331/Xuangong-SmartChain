<template>
  <div class="search-setting">
    <div v-if="bodyVisible" class="search-setting__body">
      <slot :visible-fields="visibleColumns" />
    </div>

    <div class="search-setting__actions">
      <el-tooltip content="查询条件配置" placement="top">
        <el-button class="search-setting__icon-btn" bg text circle @click="openDrawer">
          <el-icon :size="14">
            <Setting />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <el-drawer v-model="drawerVisible" title="查询条件配置" direction="rtl" size="360px" append-to-body :lock-scroll="false">
      <div class="search-setting__drawer">
        <div class="search-setting__drawer-header">
          <div class="search-setting__drawer-title">已显示 {{ draftVisibleCount }} / {{ draftFieldList.length }}</div>
          <div class="search-setting__drawer-actions">
            <el-button link type="primary" @click="selectAllDraftFields">全选</el-button>
            <el-button link @click="resetDraftFields">重置</el-button>
          </div>
        </div>

        <el-alert
          title="默认展示全部查询条件，可勾选控制显示，并拖拽调整查询条件顺序。"
          type="info"
          :closable="false"
          show-icon
          class="search-setting__drawer-tip"
        />

        <el-scrollbar class="search-setting__draggable" :wrap-style="{ overflowX: 'hidden' }">
          <VueDraggable v-model="draftFieldList" :animation="150" handle=".search-setting__drag-handle">
            <div v-for="item in draftFieldList" :key="item.key" class="search-setting__draggable-item">
              <span class="search-setting__drag-handle">
                <el-icon :size="14">
                  <Rank />
                </el-icon>
              </span>
              <el-checkbox v-model="item.show" :disabled="item.disabled" class="search-setting__checkbox">
                {{ item.title }}
              </el-checkbox>
              <el-tag v-if="item.disabled" size="small" type="danger">必选</el-tag>
            </div>
          </VueDraggable>
        </el-scrollbar>
      </div>

      <template #footer>
        <div class="search-setting__drawer-footer">
          <el-button @click="closeDrawer">取消</el-button>
          <el-button type="primary" @click="applyDraftFields">应用</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import { Rank, Setting } from '@element-plus/icons-vue'
import { computed, nextTick, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

interface SearchSettingFieldItem {
  key: string
  title: string
  show: boolean
  disabled: boolean
}

interface SearchSettingProps {
  columns?: FormColumnItem[]
  requiredFields?: string[]
}

const props = withDefaults(defineProps<SearchSettingProps>(), {
  columns: () => [],
  requiredFields: () => []
})

const emit = defineEmits<{
  'update:visibleFields': [fields: FormColumnItem[]]
}>()

const drawerVisible = ref(false)
const bodyVisible = ref(true)
const appliedFieldList = ref<SearchSettingFieldItem[]>([])
const draftFieldList = ref<SearchSettingFieldItem[]>([])

function getFieldKey(column: FormColumnItem, index: number): string {
  if (column.field != null && column.field !== '') return String(column.field)
  if (typeof column.label === 'string' && column.label) return column.label
  return `__search_${index}__`
}

function fieldTitle(column: FormColumnItem): string {
  const label = column.label
  if (typeof label === 'string' && label) return label
  if (column.field != null) return String(column.field)
  return ''
}

function isFieldInSettingList(column: FormColumnItem): boolean {
  return Boolean(column.field)
}

const initialSettingFields = computed<SearchSettingFieldItem[]>(() => {
  const list = props.columns ?? []
  const out: SearchSettingFieldItem[] = []
  list.forEach((column, index) => {
    if (!isFieldInSettingList(column)) return
    const key = getFieldKey(column, index)
    out.push({
      key,
      title: fieldTitle(column),
      show: true,
      disabled: props.requiredFields.includes(key)
    })
  })
  return out
})

function cloneFieldList(list: SearchSettingFieldItem[]) {
  return list.map((item) => ({ ...item }))
}

function isFieldStructureMatch(current: SearchSettingFieldItem[], initial: SearchSettingFieldItem[]): boolean {
  if (current.length === 0 || current.length !== initial.length) return false
  const currentKeys = new Set(current.map((item) => item.key))
  const initialKeys = new Set(initial.map((item) => item.key))
  return currentKeys.size === initialKeys.size && [...initialKeys].every((key) => currentKeys.has(key))
}

watch(
  initialSettingFields,
  (next) => {
    if (next.length === 0) {
      appliedFieldList.value = []
      draftFieldList.value = []
      return
    }

    if (!isFieldStructureMatch(appliedFieldList.value, next)) {
      appliedFieldList.value = cloneFieldList(next)
    } else {
      const nextMap = new Map(next.map((item) => [item.key, item]))
      appliedFieldList.value = appliedFieldList.value.map((item) => {
        const latest = nextMap.get(item.key)
        return latest ? { ...item, title: latest.title, disabled: latest.disabled } : item
      })
    }

    if (!drawerVisible.value) {
      draftFieldList.value = cloneFieldList(appliedFieldList.value)
    }
  },
  { immediate: true }
)

const fieldMap = computed(() => {
  const list = props.columns ?? []
  return new Map(list.map((column, index) => [getFieldKey(column, index), column]))
})

const visibleColumns = computed(() => {
  return appliedFieldList.value
    .filter((item) => item.show)
    .map((item) => fieldMap.value.get(item.key))
    .filter(Boolean) as FormColumnItem[]
})

const draftVisibleCount = computed(() => draftFieldList.value.filter((item) => item.show).length)

watch(
  visibleColumns,
  (value) => {
    emit('update:visibleFields', value)
  },
  { immediate: true }
)

function openDrawer() {
  syncDraftFieldList()
  drawerVisible.value = true
}

function closeDrawer() {
  drawerVisible.value = false
}

function syncDraftFieldList() {
  draftFieldList.value = cloneFieldList(appliedFieldList.value)
}

function selectAllDraftFields() {
  draftFieldList.value = draftFieldList.value.map((item) => ({
    ...item,
    show: true
  }))
}

function resetDraftFields() {
  draftFieldList.value = cloneFieldList(initialSettingFields.value)
}

async function remountBody() {
  bodyVisible.value = false
  await nextTick()
  bodyVisible.value = true
}

async function applyDraftFields() {
  appliedFieldList.value = cloneFieldList(draftFieldList.value)
  drawerVisible.value = false
  await remountBody()
}
</script>

<style lang="scss" scoped>
.search-setting {
  position: relative;

  &__body {
    flex: 1;
  }

  &__actions {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }

  &__icon-btn {
    color: var(--el-color-primary);
  }

  &__drawer {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__drawer-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__drawer-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__drawer-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__drawer-tip {
    margin-bottom: 4px;
  }

  &__draggable {
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    padding: 2px 0;

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden !important;
    }

    :deep(.el-scrollbar__view) {
      box-sizing: border-box;
      min-width: 0;
      overflow-x: hidden;
    }
  }

  &__draggable-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    margin-bottom: 8px;
    border-radius: var(--el-border-radius-small);
    border: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-blank);
    box-sizing: border-box;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  &__drag-handle {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    box-sizing: border-box;
    color: var(--el-text-color-secondary);
    cursor: move;
  }

  &__checkbox {
    flex: 1;
    min-width: 0;
    font-size: 12px;

    :deep(.el-checkbox__label) {
      font-size: 12px;
      color: var(--el-text-color-regular);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  :deep(.el-checkbox.is-disabled .el-checkbox__label) {
    color: var(--el-text-color-placeholder);
  }

  &__drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
