<template>
  <CrudFormDialog
    v-model:visible="visible"
    :title="mode === 'add' ? '新增单点登录配置' : '编辑单点登录配置'"
    v-model:form="formData"
    :columns="formColumns"
    :label-width="120"
    width="680px"
    :before-submit="beforeSubmit"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'
import type { FormColumnItem } from 'gi-component'

export interface SsoFormModel {
  id: string
  name: string
  protocol: 'oauth2' | 'oidc' | 'saml' | 'ldap'
  url: string
  clientId: string
  clientSecret: string
  redirectUri: string
  defaultRole: string
  enabled: boolean
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<SsoFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '配置名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: 'SSO 协议',
    field: 'protocol',
    required: true,
    props: {
      options: [
        { label: 'OAuth 2.0', value: 'oauth2' },
        { label: 'OIDC', value: 'oidc' },
        { label: 'SAML 2.0', value: 'saml' },
        { label: 'LDAP/AD', value: 'ldap' }
      ]
    } as any
  },
  { type: 'input', label: '认证服务地址', field: 'url', required: true },
  { type: 'input', label: 'Client ID', field: 'clientId', required: true },
  { type: 'input', label: 'Client Secret', field: 'clientSecret' },
  { type: 'input', label: '回调地址', field: 'redirectUri' },
  { type: 'input', label: '默认角色', field: 'defaultRole' },
  { type: 'switch', label: '启用', field: 'enabled' }
])

function beforeSubmit() {
  if (!formData.value.name || !formData.value.url || !formData.value.clientId) {
    ElMessage.warning('请完善单点登录配置')
    return false
  }
  return true
}
</script>
