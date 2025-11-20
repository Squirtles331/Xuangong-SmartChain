<template>
  <gi-page-layout :size="160" :style="{ height: '500px' }" bordered>
    <template #left>
      <el-scrollbar max-height="100%">
        <el-tree :data="data" :props="defaultProps" default-expand-all @node-click="handleNodeClick" />
      </el-scrollbar>
    </template>

    <template #header>
      <gi-form
        ref="GiFormRef"
        v-model="form"
        :columns="formColumns"
        :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
        search
        @reset="onReset"
        @search="onSearch"
      />
    </template>
    <template #tool>
      <el-space>
        <el-button type="primary">新增</el-button>
        <el-button type="primary">导出</el-button>
      </el-space>
    </template>
    <!-- 模拟真实接口：loading -->
    <gi-table v-loading="loading" :columns="tableColumns" :data="tableData" :pagination="pagination" border max-height="400px">
      <template #action="scope">
        <el-space>
          <ElButton size="small" type="primary" @click="onEdit(scope)">编辑</ElButton>
          <ElButton size="small" type="danger">删除</ElButton>
          <ElButton size="small" type="primary">重置密码</ElButton>
          <ElButton size="small" type="danger">分配角色</ElButton>
        </el-space>
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import type { TableColumnItem } from 'gi-component'
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

/* ========= 查询表单 ========= */

/* ========= 查询表单 ========= */
const form = reactive({
  name: '', // 用户名称
  phone: '', // 手机号
  status: '' // 状态
})
const formColumns = computed(() => {
  return [
    { type: 'input', label: '用户名称', field: 'name' },
    { type: 'input', label: '手机号', field: 'phone' },
    {
      type: 'select',
      label: '状态',
      field: 'status',
      props: {
        options: [
          { label: '正常', value: 'active' },
          { label: '停用', value: 'inactive' }
        ]
      }
    }
  ]
})

/* ========= 表格 ========= */
const loading = ref(false)
const tableData = ref<any[]>([]) // 只存当前一页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  onCurrentChange: (size: number) => {
    pagination.currentPage = size
    fetchTableData()
  },
  onSizeChange: (size: number) => {
    pagination.pageSize = size
    fetchTableData()
  }
})

const tableColumns: TableColumnItem[] = [
  { type: 'selection', width: 55, align: 'center', fixed: 'left' },
  { prop: 'index', label: '序号', width: 100, align: 'center' },
  { prop: 'userName', label: '用户名称', width: 100, align: 'center', showOverflowTooltip: true },
  { prop: 'nickName', label: '用户昵称', width: 100, align: 'center', showOverflowTooltip: true },
  { prop: 'deptName', label: '部门', width: 100, align: 'center', showOverflowTooltip: true },
  { prop: 'phone', label: '手机号', width: 100, align: 'center', showOverflowTooltip: true },
  { prop: 'status', label: '状态', width: 100, align: 'center' },
  { prop: 'createTime', width: 100, label: '创建时间' },
  { prop: 'action', label: '操作', align: 'center', minWidth: '300', slotName: 'action', fixed: 'right' }
]

/* ========= 模拟数据库 & 接口 ========= */
// 1. 生成 200 条假数据，当数据库
const fullList = Array.from({ length: 200 }, (_, i) => {
  const userNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']
  const nickNames = ['星星', '月亮', '太阳', '云朵', '花朵', '树木', '山峰', '河流', '海洋', '大地']
  const deptNames = ['技术部', '市场部', '人事部', '财务部', '运营部', '设计部', '产品部', '客服部', '法务部', '行政部']
  const statuses = ['active', 'inactive', 'pending', 'banned']
  return {
    index: i + 1,
    userName: userNames[i % 10] + (i + 1),
    nickName: nickNames[i % 10],
    deptName: deptNames[i % 10],
    phone: `1${Math.floor(Math.random() * 9) + 3}${Math.floor(Math.random() * 90000000) + 10000000}`,
    status: statuses[i % 4],
    createTime: new Date(2020, i % 12, (i % 28) + 1).toISOString().split('T')[0]
  }
})

// 2. 模拟接口（带 300ms 延迟）
interface PageReq {
  currentPage: number
  pageSize: number
  name?: string
  phone?: string
  status?: string
}
interface PageRes {
  records: any[]
  total: number
}
const mockApi = (req: PageReq): Promise<PageRes> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 先过滤
      let data = fullList
      if (req.name) data = data.filter((v) => v.userName.includes(req.name))
      if (req.phone) data = data.filter((v) => v.phone.includes(req.phone))
      if (req.status) data = data.filter((v) => v.status === req.status)

      // 再分页
      const start = (req.currentPage - 1) * req.pageSize
      const end = start + req.pageSize
      resolve({
        records: data.slice(start, end),
        total: data.length
      })
    }, 300)
  })
}

/* ========= 获取数据 ========= */
const fetchTableData = async () => {
  loading.value = true
  try {
    const res = await mockApi({
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...form
    })
    tableData.value = res.records
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

/* ========= 事件 ========= */
const onSearch = () => {
  pagination.currentPage = 1
  fetchTableData()
}
const onReset = () => {
  Object.keys(form).forEach((k) => (form[k] = ''))
  onSearch()
}

const onEdit = (scope: any) => {
  ElMessage.success(`编辑 ${scope.row.userName}`)
}

interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: '总公司',
    id: 'C1',
    children: [
      {
        label: '行政部',
        id: 'C1-1',
        children: [
          {
            label: '行政综合组',
            id: 'C1-1-1'
          },
          {
            label: '后勤保障组',
            id: 'C1-1-2'
          }
        ]
      },
      {
        label: '技术部',
        id: 'C1-2',
        children: [
          {
            label: '前端开发组',
            id: 'C1-2-1',
            children: [
              {
                label: 'Web前端小组',
                id: 'C1-2-1-1'
              },
              {
                label: '移动端小组',
                id: 'C1-2-1-2'
              }
            ]
          },
          {
            label: '后端开发组',
            id: 'C1-2-2',
            children: [
              {
                label: 'API开发小组',
                id: 'C1-2-2-1'
              },
              {
                label: '数据库小组',
                id: 'C1-2-2-2'
              }
            ]
          },
          {
            label: '测试组',
            id: 'C1-2-3'
          }
        ]
      },
      {
        label: '市场部',
        id: 'C1-3',
        children: [
          {
            label: '品牌推广组',
            id: 'C1-3-1'
          },
          {
            label: '渠道拓展组',
            id: 'C1-3-2'
          }
        ]
      }
    ]
  },
  {
    label: '分公司',
    id: 'C2',
    children: [
      {
        label: '销售一部',
        id: 'C2-1',
        children: [
          {
            label: '华东区域组',
            id: 'C2-1-1'
          },
          {
            label: '华南区域组',
            id: 'C2-1-2'
          }
        ]
      },
      {
        label: '销售二部',
        id: 'C2-2',
        children: [
          {
            label: '华北区域组',
            id: 'C2-2-1'
          },
          {
            label: '西部区域组',
            id: 'C2-2-2'
          }
        ]
      },
      {
        label: '客服部',
        id: 'C2-3',
        children: [
          {
            label: '售前咨询组',
            id: 'C2-3-1'
          },
          {
            label: '售后服务组',
            id: 'C2-3-2'
          }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

/* ========= 首次加载 ========= */
onMounted(() => fetchTableData())
</script>

<style lang="scss" scoped></style>
