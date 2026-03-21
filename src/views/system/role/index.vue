<template>
  <gi-page-layout :bordered="true">
    <template #header> </template>
    <template #left>
      <Tree />
    </template>
    <template #tool>
      <Form />
    </template>
    <Table />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import Tree from './component/tree.vue'
import Table from '@/views/system/role/component/table.vue'
import Form from '@/views/system/role/component/form.vue'
</script>
