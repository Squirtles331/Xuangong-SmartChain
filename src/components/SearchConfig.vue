<template>
  <div class="search-config">
    <div class="search-config__body">
      <slot :visible-fields="visibleColumns" :scheme-name="currentScheme" />
    </div>
    <div class="search-config__actions">
      <el-space wrap :size="8">
        <!-- 字段显隐配置 -->
        <el-popover placement="bottom-end" :width="200" trigger="click" transition="el-zoom-in-top">
          <template #reference>
            <el-tooltip content="搜索字段配置" placement="top">
              <el-button bg text circle>
                <el-icon :size="14"><Setting /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
          <div class="search-config__popover">
            <el-scrollbar max-height="200px">
              <div v-for="item in fieldList" :key="item.field" class="search-config__field-item">
                <el-checkbox v-model="item.show" :disabled="item.required" class="search-config__checkbox">
                  {{ item.label }}
                </el-checkbox>
                <el-tag v-if="item.required" size="small" type="danger" style="margin-left: 4px">必选</el-tag>
              </div>
            </el-scrollbar>
            <el-divider style="margin: 8px 0" />
            <el-button size="small" style="width: 100%" @click="resetFields">重置字段</el-button>
          </div>
        </el-popover>

        <!-- 搜索方案保存/加载 -->
        <el-popover placement="bottom-end" :width="240" trigger="click" transition="el-zoom-in-top">
          <template #reference>
            <el-tooltip content="搜索方案" placement="top">
              <el-button bg text circle>
                <el-icon :size="14"><FolderOpened /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
          <div class="search-config__popover">
            <div class="search-config__scheme-title">保存方案</div>
            <el-input v-model="newSchemeName" size="small" placeholder="输入方案名称" style="margin-bottom: 8px">
              <template #append>
                <el-button size="small" @click="saveScheme">保存</el-button>
              </template>
            </el-input>
            <el-divider style="margin: 8px 0" />
            <div class="search-config__scheme-title">已保存方案</div>
            <div v-if="schemes.length === 0" style="color: #C0C4CC; font-size: 12px; padding: 8px 0">暂无保存方案</div>
            <div v-for="s in schemes" :key="s.name" class="search-config__scheme-item">
              <span class="search-config__scheme-name" @click="loadScheme(s)">{{ s.name }}</span>
              <el-button type="danger" link size="small" @click="deleteScheme(s.name)">
                <el-icon :size="12"><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </el-popover>

        <!-- 高级搜索切换 -->
        <el-tooltip :content="advancedMode ? '切换基础搜索' : '切换高级搜索'" placement="top">
          <el-button bg text circle @click="toggleAdvanced">
            <el-icon :size="14"><Search /></el-icon>
          </el-button>
        </el-tooltip>
      </el-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import { Delete, FolderOpened, Search, Setting } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'

interface SearchFieldItem {
  field: string
  label: string
  show: boolean
  required: boolean
}

interface SearchScheme {
  name: string
  fields: string[]
}

interface SearchConfigProps {
  /** gi-form 的 columns 配置 */
  columns?: FormColumnItem[]
  /** 必选字段（始终显示，不可隐藏） */
  requiredFields?: string[]
  /** localStorage 存储 key 前缀 */
  storageKey?: string
}

const props = withDefaults(defineProps<SearchConfigProps>(), {
  columns: () => [],
  requiredFields: () => [],
  storageKey: 'search-config'
})

const emit = defineEmits<{
  'update:visibleFields': [fields: FormColumnItem[]]
  'schemeChange': [name: string]
}>()

// 字段列表
const fieldList = ref<SearchFieldItem[]>([])
const advancedMode = ref(false)
const newSchemeName = ref('')
const currentScheme = ref('默认')
const schemes = ref<SearchScheme[]>([])

// 初始化字段列表
watch(
  () => props.columns,
  (cols) => {
    fieldList.value = cols.map((c) => ({
      field: c.field as string,
      label: (c.label as string) || (c.field as string),
      show: true,
      required: props.requiredFields.includes(c.field as string)
    }))
  },
  { immediate: true }
)

// 可见字段
const visibleColumns = computed(() => {
  const visible = fieldList.value.filter((f) => f.show).map((f) => f.field)
  return (props.columns || []).filter((c) => visible.includes(c.field as string))
})

// 发送可见字段更新
watch(visibleColumns, (val) => emit('update:visibleFields', val), { immediate: true })

// 加载已保存方案
function loadSchemes() {
  try {
    const stored = localStorage.getItem(`${props.storageKey}-schemes`)
    if (stored) schemes.value = JSON.parse(stored)
  } catch {
    schemes.value = []
  }
}
loadSchemes()

function resetFields() {
  fieldList.value = fieldList.value.map((f) => ({ ...f, show: true }))
  currentScheme.value = '默认'
  emit('schemeChange', '默认')
}

function saveScheme() {
  const name = newSchemeName.value.trim()
  if (!name) return
  const fields = fieldList.value.filter((f) => f.show).map((f) => f.field)
  // 去重
  schemes.value = schemes.value.filter((s) => s.name !== name)
  schemes.value.unshift({ name, fields })
  localStorage.setItem(`${props.storageKey}-schemes`, JSON.stringify(schemes.value))
  currentScheme.value = name
  newSchemeName.value = ''
  emit('schemeChange', name)
}

function loadScheme(scheme: SearchScheme) {
  fieldList.value = fieldList.value.map((f) => ({
    ...f,
    show: scheme.fields.includes(f.field)
  }))
  currentScheme.value = scheme.name
  emit('schemeChange', scheme.name)
}

function deleteScheme(name: string) {
  schemes.value = schemes.value.filter((s) => s.name !== name)
  localStorage.setItem(`${props.storageKey}-schemes`, JSON.stringify(schemes.value))
  if (currentScheme.value === name) {
    currentScheme.value = '默认'
    emit('schemeChange', '默认')
  }
}

function toggleAdvanced() {
  advancedMode.value = !advancedMode.value
}
</script>

<style lang="scss" scoped>
.search-config {
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

  &__popover {
    padding: 4px 0;
  }

  &__field-item {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: var(--el-border-radius-small);
    cursor: pointer;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  &__checkbox {
    flex: 1;
    font-size: 12px;

    :deep(.el-checkbox__label) {
      font-size: 12px;
      color: var(--el-text-color-regular);
    }
  }

  &__scheme-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    margin-bottom: 8px;
  }

  &__scheme-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    border-radius: var(--el-border-radius-small);
    cursor: pointer;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  &__scheme-name {
    flex: 1;
    font-size: 12px;
    color: var(--el-text-color-regular);
  }
}
</style>
