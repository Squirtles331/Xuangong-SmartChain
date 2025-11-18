<template>
  <div class="log-view">
    <div class="page-header">
      <h2>操作日志</h2>
    </div>

    <div class="page-content">
      <el-card>
        <div class="filter-bar">
          <el-form :inline="true" :model="filterForm">
            <el-form-item label="用户">
              <el-input v-model="filterForm.user" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="操作类型">
              <el-select v-model="filterForm.type" placeholder="请选择操作类型">
                <el-option label="新增" value="create" />
                <el-option label="修改" value="update" />
                <el-option label="删除" value="delete" />
                <el-option label="查询" value="read" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table :data="logs" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="user" label="用户" />
          <el-table-column prop="operation" label="操作" />
          <el-table-column prop="module" label="模块" />
          <el-table-column prop="ip" label="IP地址" />
          <el-table-column prop="time" label="操作时间" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
                {{ row.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="viewLog(row)">详情</el-button>
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

interface Log {
  id: number
  user: string
  operation: string
  module: string
  ip: string
  time: string
  status: 'success' | 'failed'
}

const filterForm = reactive({
  user: '',
  type: '',
  dateRange: []
})

const logs = ref<Log[]>([
  {
    id: 1,
    user: 'admin',
    operation: '新增用户',
    module: '用户管理',
    ip: '192.168.1.100',
    time: '2024-01-15 14:30:00',
    status: 'success'
  },
  {
    id: 2,
    user: 'user1',
    operation: '修改角色',
    module: '角色管理',
    ip: '192.168.1.101',
    time: '2024-01-15 13:20:00',
    status: 'success'
  },
  {
    id: 3,
    user: 'user2',
    operation: '删除菜单',
    module: '菜单管理',
    ip: '192.168.1.102',
    time: '2024-01-15 12:15:00',
    status: 'failed'
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

function viewLog(log: Log) {
  console.log('查看日志详情', log)
}
</script>

<style scoped>
.log-view {
  height: 100%;
}

.page-header {
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
