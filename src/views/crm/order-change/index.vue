<template>
  <gi-page-layout :bordered="true">
    <template #header><h3>销售订单变更 — {{ order?.code }}</h3></template>
    <el-descriptions :column="2" border style="margin-bottom:16px">
      <el-descriptions-item label="订单编号">{{ order?.code }}</el-descriptions-item>
      <el-descriptions-item label="客户">{{ order?.customer }}</el-descriptions-item>
      <el-descriptions-item label="产品">{{ order?.material }}</el-descriptions-item>
      <el-descriptions-item label="原数量">{{ order?.qty }} 台</el-descriptions-item>
      <el-descriptions-item label="原交期">{{ order?.delivery_date }}</el-descriptions-item>
      <el-descriptions-item label="当前状态">{{ order?.status }}</el-descriptions-item>
    </el-descriptions>
    <el-card header="变更信息" shadow="never">
      <el-form :model="form" label-width="120px" style="max-width:500px">
        <el-form-item label="变更类型" required><el-select v-model="form.type" style="width:100%"><el-option label="数量调整" value="qty" /><el-option label="交期调整" value="date" /><el-option label="数量+交期" value="both" /></el-select></el-form-item>
        <el-form-item v-if="form.type!=='date'" label="新数量" required><el-input-number v-model="form.new_qty" :min="1" style="width:100%" /></el-form-item>
        <el-form-item v-if="form.type!=='qty'" label="新交期" required><el-date-picker v-model="form.new_date" style="width:100%" /></el-form-item>
        <el-form-item label="变更原因" required><el-input v-model="form.reason" type="textarea" :rows="2" /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitChange">提交变更</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref,reactive } from 'vue';import { ElMessage } from 'element-plus';import { useRouter } from 'vue-router'
const router=useRouter()
const order=ref({code:'SO202501150001',customer:'XX重工集团',material:'离心泵 XJP-100',qty:50,delivery_date:'2025-02-15',status:'approved'})
const form=reactive({type:'qty',new_qty:60,new_date:'2025-02-20',reason:''})
function submitChange(){ElMessage.success('变更已提交审批');router.push('/crm/order')}
</script>
