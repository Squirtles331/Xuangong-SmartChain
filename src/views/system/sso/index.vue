<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="单点登录配置" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #protocol="{ row }">
            {{ protocolLabelMap[row.protocol] }}
          </template>

          <template #enabled="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '启用' : '停用' }}</el-tag>
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'online' ? 'success' : 'danger'">{{ row.status === 'online' ? '在线' : '离线' }}</el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button type="primary" link size="small" @click="handleTest(row)">测试连接</el-button>
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <SsoFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createSsoConfig,
  deleteSsoConfig,
  getSsoConfigs,
  testSsoConfig,
  updateSsoConfig,
  type SsoConfig,
  type SsoConfigQuery
} from '@/api/system'
import { useTable } from '@/hooks/useTable'
import SsoFormDialog, { type SsoFormModel } from './SsoFormDialog.vue'

const protocolOptions = [
  { label: 'OAuth 2.0', value: 'oauth2' },
  { label: 'OIDC', value: 'oidc' },
  { label: 'SAML 2.0', value: 'saml' },
  { label: 'LDAP/AD', value: 'ldap' }
]

const enabledOptions = [
  { label: '启用', value: true },
  { label: '停用', value: false }
]

const protocolLabelMap: Record<SsoConfig['protocol'], string> = {
  oauth2: 'OAuth 2.0',
  oidc: 'OIDC',
  saml: 'SAML 2.0',
  ldap: 'LDAP/AD'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '配置名称/认证地址/Client ID' } as any },
  { type: 'select-v2', label: '协议', field: 'protocol', props: { options: protocolOptions, clearable: true } as any },
  { type: 'select-v2', label: '启用状态', field: 'enabled', props: { options: enabledOptions, clearable: true } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SsoConfig>[] = [
  { type: 'index', label: '#', width: 60 },
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

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SsoFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SsoConfig>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SsoConfigQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      protocol: queryParams.protocol || undefined,
      enabled: queryParams.enabled === '' ? undefined : queryParams.enabled
    }

    const response = await getSsoConfigs(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSsoConfig(id)))
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

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.url || !formModel.value.clientId) {
    ElMessage.warning('请填写配置名称、认证地址和 Client ID')
    return
  }

  const status: SsoConfig['status'] = formModel.value.enabled ? 'online' : 'offline'

  const payload = {
    name: formModel.value.name,
    protocol: formModel.value.protocol,
    url: formModel.value.url,
    clientId: formModel.value.clientId,
    clientSecret: formModel.value.clientSecret,
    redirectUri: formModel.value.redirectUri,
    defaultRole: formModel.value.defaultRole,
    enabled: formModel.value.enabled,
    status
  }

  if (dialogMode.value === 'add') {
    await createSsoConfig(payload)
  } else {
    await updateSsoConfig(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}

async function handleTest(row: SsoConfig) {
  await testSsoConfig(row.id)
  ElMessage.success(`连接测试成功：${row.name}`)
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
