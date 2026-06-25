<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="设备状态监控" name="monitor">
        <div class="iot-grid">
          <el-card v-for="d in devices" :key="d.id" shadow="hover" class="iot-card" :class="d.online?'online':'offline'">
            <div class="iot-header"><span class="iot-name">{{ d.name }}</span><el-tag :type="d.online?'success':'danger'" size="small">{{ d.online?'在线':'离线' }}</el-tag></div>
            <div class="iot-body">
              <div class="iot-row"><span>运行状态</span><el-tag :type="d.running?'success':'info'" size="small">{{ d.running?'运行中':'已停机' }}</el-tag></div>
              <div class="iot-row"><span>转速</span><strong>{{ d.rpm }} rpm</strong></div>
              <div class="iot-row"><span>温度</span><strong :style="{color:d.temp>60?'#f56c6c':''}">{{ d.temp }}°C</strong></div>
              <div class="iot-row"><span>电流</span><strong>{{ d.current }}A</strong></div>
            </div>
            <div class="iot-footer"><span>最后上报: {{ d.last_report }}</span></div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="采集配置" name="config">
        <gi-table :columns="cfgCols" :data="configs" border stripe size="small">
          <template #protocol="{ row }"><el-tag size="small">{{ row.protocol }}</el-tag></template>
          <template #actions="{ row }"><gi-button type="edit" size="small" @click="editCfg(row)" /></template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'

const tab=ref('monitor')
const devices=ref([{id:'1',name:'数控车床 CK6150',online:true,running:true,rpm:1500,temp:52,current:18.5,last_report:'2025-01-15 14:30:00'},{id:'2',name:'数控车床 CK6150',online:true,running:false,rpm:0,temp:28,current:0.5,last_report:'2025-01-15 14:28:00'},{id:'3',name:'钻床 Z3050',online:true,running:true,rpm:800,temp:45,current:12.3,last_report:'2025-01-15 14:30:00'},{id:'4',name:'磨床 M1432',online:false,running:false,rpm:0,temp:22,current:0,last_report:'2025-01-14 08:00:00'},{id:'5',name:'加工中心 VMC850',online:true,running:true,rpm:3000,temp:65,current:25.8,last_report:'2025-01-15 14:29:00'}])
const configs=ref([{id:'1',name:'数控车床 CK6150',protocol:'OPC UA',address:'opc.tcp://192.168.1.10:4840',interval:'1s'},{id:'2',name:'钻床 Z3050',protocol:'MQTT',address:'mqtt://192.168.1.11:1883/topics/z3050',interval:'5s'},{id:'3',name:'加工中心 VMC850',protocol:'OPC UA',address:'opc.tcp://192.168.1.12:4840',interval:'1s'}])
const cfgCols:TableColumnItem<any>[]=[{prop:'name',label:'设备名称',width:180},{label:'协议',width:80,slotName:'protocol',align:'center'},{prop:'address',label:'采集地址',minWidth:280},{prop:'interval',label:'采集间隔',width:80,align:'center'},{label:'操作',width:100,slotName:'actions',align:'center'}]
function editCfg(_r:any){}
</script>
<style scoped>
.iot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.iot-card{border-left:4px solid #67c23a}.iot-card.offline{border-left-color:#f56c6c}
.iot-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.iot-name{font-weight:600;font-size:15px}
.iot-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #f0f0f0}
.iot-row span{color:#909399}.iot-footer{font-size:11px;color:#c0c4cc;margin-top:8px}
</style>
