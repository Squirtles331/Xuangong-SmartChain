<template>
  <gi-page-layout :bordered="true">
    <el-row :gutter="16"><el-col :span="8" v-for="c in costs" :key="c.title"><el-card shadow="hover"><div class="cost-title">{{ c.title }}</div><div class="cost-value">{{ c.value.toLocaleString() }} 元</div></el-card></el-col></el-row>
  </gi-page-layout>
</template>
<script lang="ts" setup>
const costs=[{title:'本月材料成本',value:380000},{title:'本月人工成本',value:150000},{title:'本月制造费用',value:90000}]
</script>
<style scoped>.cost-title{font-size:13px;color:#909399}.cost-value{font-size:24px;font-weight:700;margin-top:8px}</style>
