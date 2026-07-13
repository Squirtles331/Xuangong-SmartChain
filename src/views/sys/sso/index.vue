<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="单点登录配置"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #protocol="{ row }">
      {{ protocolLabelMap[row.protocol] }}
    </template>

    <template #enabled="{ row }">
      <StatusTag :value="row.enabled" :options="enabledOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <SsoFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { SsoConfig } from '@/api/system'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { sysSsoConfigRecords } from '../static-data'
import SsoFormDialog, { type SsoFormModel } from './SsoFormDialog.vue'

const protocolOptions = [
  { label: 'OAuth 2.0', value: 'oauth2' },
  { label: 'OIDC', value: 'oidc' },
  { label: 'SAML 2.0', value: 'saml' },
  { label: 'LDAP/AD', value: 'ldap' }
]

const enabledOptions = [
  { label: '启用', value: true, type: 'success' as const },
  { label: '停用', value: false, type: 'info' as const }
]

const statusOptions = [
  { label: '在线', value: 'online', type: 'success' as const },
  { label: '离线', value: 'offline', type: 'danger' as const }
]

const protocolLabelMap: Record<SsoConfig['protocol'], string> = {
  oauth2: 'OAuth 2.0',
  oidc: 'OIDC',
  saml: 'SAML 2.0',
  ldap: 'LDAP/AD'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '配置名称 / 认证地址 / Client ID', clearable: true } as any },
  { type: 'select-v2', label: '协议', field: 'protocol', props: { options: protocolOptions, clearable: true } as any },
  { type: 'select-v2', label: '启用状态', field: 'enabled', props: { options: enabledOptions, clearable: true } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SsoConfig>[] = [
  { prop: 'name', label: '配置名称', minWidth: 160 },
  { prop: 'protocol', label: '协议', minWidth: 120, slotName: 'protocol' },
  { prop: 'url', label: '认证地址', minWidth: 240 },
  { prop: 'defaultRole', label: '默认角色', minWidth: 120 },
  { prop: 'enabled', label: '启用状态', minWidth: 100, slotName: 'enabled', align: 'center' },
  { prop: 'status', label: '连接状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'lastSyncAt', label: '最后同步时间', minWidth: 180 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  protocol: '' | SsoConfig['protocol']
  enabled: '' | boolean
}>({
  keyword: '',
  protocol: '',
  enabled: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SsoFormModel>(createDefaultFormModel())
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'test', label: '测试连接', tone: 'secondary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const filteredRecords = computed(() =>
  sysSsoConfigRecords.value.filter((item) => {
    const matchKeyword =
      !queryParams.keyword ||
      item.name.includes(queryParams.keyword) ||
      item.url.includes(queryParams.keyword) ||
      item.clientId.includes(queryParams.keyword)
    const matchProtocol = !queryParams.protocol || item.protocol === queryParams.protocol
    const matchEnabled = queryParams.enabled === '' || item.enabled === queryParams.enabled
    return matchKeyword && matchProtocol && matchEnabled
  })
)

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SsoConfig>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    sysSsoConfigRecords.value = sysSsoConfigRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function createDefaultFormModel(): SsoFormModel {
  return {
    id: '',
    name: '',
    protocol: 'oauth2',
    url: '',
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    defaultRole: '',
    enabled: false
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    protocol: '',
    enabled: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SsoConfig) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    name: row.name,
    protocol: row.protocol,
    url: row.url,
    clientId: row.clientId,
    clientSecret: row.clientSecret,
    redirectUri: row.redirectUri,
    defaultRole: row.defaultRole,
    enabled: row.enabled
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: SsoConfig) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'test') {
    handleTest(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.url || !formModel.value.clientId) {
    ElMessage.warning('请填写配置名称、认证地址和 Client ID')
    return
  }

  const payload = {
    name: formModel.value.name,
    protocol: formModel.value.protocol,
    url: formModel.value.url,
    clientId: formModel.value.clientId,
    clientSecret: formModel.value.clientSecret,
    redirectUri: formModel.value.redirectUri,
    defaultRole: formModel.value.defaultRole,
    enabled: formModel.value.enabled,
    status: formModel.value.enabled ? 'online' : 'offline',
    lastSyncAt: formModel.value.enabled ? '2026-07-13 16:35' : ''
  } satisfies Omit<SsoConfig, 'id'>

  if (dialogMode.value === 'add') {
    sysSsoConfigRecords.value.unshift({
      id: `SSO-${String(sysSsoConfigRecords.value.length + 1).padStart(3, '0')}`,
      ...payload
    })
  } else {
    sysSsoConfigRecords.value = sysSsoConfigRecords.value.map((item) => (item.id === formModel.value.id ? { id: item.id, ...payload } : item))
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '已新增静态单点登录配置' : '已更新静态单点登录配置')
}

async function handleTest(row: SsoConfig) {
  row.status = row.enabled ? 'online' : 'offline'
  row.lastSyncAt = row.enabled ? '2026-07-13 16:40' : row.lastSyncAt
  ElMessage.success(`连接测试完成：${row.name}`)
  await refresh()
}
</script>
