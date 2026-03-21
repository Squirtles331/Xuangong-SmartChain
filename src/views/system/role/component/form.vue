<template>
  <gi-form
    ref="GiFormRef"
    v-model="form"
    :columns="columns"
    :grid-item-props="{
      span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
    }"
    @reset="reset"
    @search="search"
  >
  </gi-form>
</template>

<script lang="ts" setup>
import type { FormColumnItem, FormInstance } from 'gi-component'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

const GiFormRef = ref<FormInstance | null>()

function search() {
  ElMessage.success('点击了搜索')
}

function reset() {
  ElMessage.info('点击了重置')
}

const form = reactive({})

const columns = computed(() => {
  return [
    {
      type: 'input',
      label: '权限名称',
      field: 'name'
    }
  ] as FormColumnItem[]
})
</script>

<style lang="scss" scoped></style>
