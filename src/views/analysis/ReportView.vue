<template>
  <div class="report-view">
    <div class="page-header">
      <h2>报表管理</h2>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新增报表
      </el-button>
    </div>

    <div class="page-content">
      <el-card>
        <div class="filter-bar">
          <el-form :inline="true" :model="filterForm">
            <el-form-item label="报表名称">
              <el-input v-model="filterForm.name" placeholder="请输入报表名称" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="filterForm.type" placeholder="请选择类型">
                <el-option label="统计报表" value="statistics" />
                <el-option label="分析报表" value="analysis" />
                <el-option label="汇总报表" value="summary" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table :data="reports" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="报表名称" />
          <el-table-column prop="type" label="报表类型" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column label="操作" width="200">
            <template #default>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">导出</el-button>
              <el-button type="text" size="small" style="color: #f56c6c">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'

interface Report {
  id: number
  name: string
  type: string
  description: string
  createTime: string
}

const filterForm = reactive({
  name: '',
  type: ''
})

const reports = ref<Report[]>([
  {
    id: 1,
    name: '用户统计报表',
    type: '统计报表',
    description: '用户注册、活跃度等统计信息',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '销售分析报表',
    type: '分析报表',
    description: '销售额、订单量等分析数据',
    createTime: '2024-01-14 15:20:00'
  },
  {
    id: 3,
    name: '月度汇总报表',
    type: '汇总报表',
    description: '月度业务数据汇总',
    createTime: '2024-01-13 09:00:00'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const handleSizeChange = (val: number) => {
  pageSize.value = val
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}
</script>

<style scoped>
.report-view {
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.page-content {
  background-color: #fff;
}

.filter-bar {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
