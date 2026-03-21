<template>
  <el-tree ref="treeRef1" :data="dataSource" :expand-on-click-node="false" />
</template>

<script lang="ts" setup>
interface Tree {
  id: number
  label: string
}
const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: '超级管理员'
  },
  {
    id: 2,
    label: '管理员'
  },
  {
    id: 3,
    label: '普通用户'
  }
])
</script>
