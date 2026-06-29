<template>
  <gi-page-layout :bordered="true">
    <el-row :gutter="24">
      <!-- 产品介绍 -->
      <el-col :span="16">
        <el-card header="产品介绍" shadow="hover">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="产品名称">璇链智造 MES 系统</el-descriptions-item>
            <el-descriptions-item label="产品类型">制造执行系统 / Manufacturing Execution System</el-descriptions-item>
            <el-descriptions-item label="技术栈" :span="2">Vue 3 + TypeScript + Element Plus + ECharts + gi-component</el-descriptions-item>
            <el-descriptions-item label="主要功能" :span="2">
              订单管理、物料管理(BOM)、工艺路线、生产排程、质量管理、设备管理(OEE)、能源管理、人力资源管理、财务管理、系统管理
            </el-descriptions-item>
            <el-descriptions-item label="适用行业" :span="2">离散制造、机械加工、装配制造</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 版本信息 + 联系方式 -->
      <el-col :span="8">
        <el-card header="版本信息" shadow="hover" style="margin-bottom: 16px">
          <el-timeline>
            <el-timeline-item timestamp="v1.2.0" placement="top" color="#409eff"> 当前版本 - 功能模块完善 </el-timeline-item>
            <el-timeline-item timestamp="v1.1.0" placement="top" color="#67c23a"> 新增能源管理、财务管理 </el-timeline-item>
            <el-timeline-item timestamp="v1.0.0" placement="top" color="#909399"> 初始版本发布 </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card header="联系方式" shadow="hover">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="技术支持">
              <el-link type="primary" :underline="false">support@xuanlian.com</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="服务热线">400-888-8888</el-descriptions-item>
            <el-descriptions-item label="工作时间">周一至周五 9:00-18:00</el-descriptions-item>
            <el-descriptions-item label="公司地址">XX省XX市XX区XX路XX号</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </gi-page-layout>
</template>

<script setup lang="ts"></script>
