<template>
  <gi-page-layout :bordered="true">
    <div class="mdm-layout">
      <div class="mdm-tree"><el-tree :data="orgTree" :props="{children:'children',label:'name'}" node-key="id" default-expand-all highlight-current @node-click="onNodeClick"/></div>
      <div class="mdm-form">
        <div v-if="!cur"><el-empty description="选择左侧组织节点"/></div>
        <gi-form v-else v-model="cur" :columns="orgCols" :label-width="120"><template #footer><el-button type="primary" @click="save">保存</el-button></template></gi-form>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue';import { ElMessage } from 'element-plus';import type { FormColumnItem } from 'gi-component';

const orgTree=ref([{id:'1',name:'XX集团有限公司',type:'group',children:[{id:'2',name:'XX重工有限公司',type:'company',children:[{id:'3',name:'一工厂',type:'plant',children:[{id:'4',name:'机加工一车间',type:'workshop'},{id:'5',name:'机加工二车间',type:'workshop'},{id:'6',name:'装配车间',type:'workshop'}]}]}]}])
const cur=ref<any>(null);const orgCols:FormColumnItem[]=[{type:'input',label:'名称',field:'name',required:true},{type:'select-v2',label:'类型',field:'type',required:true,props:{options:[{label:'集团',value:'group'},{label:'公司',value:'company'},{label:'工厂',value:'plant'},{label:'车间',value:'workshop'},{label:'产线',value:'line'},{label:'工位',value:'workstation'}]} as any}]
function onNodeClick(d:any){cur.value={...d}}
function save(){ElMessage.success('保存成功')}
</script>
<style scoped>.mdm-layout{display:flex;height:calc(100vh - 180px)}.mdm-tree{width:300px;border-right:1px solid #eee;overflow:auto;padding:12px}.mdm-form{flex:1;padding:16px;overflow:auto}</style>
