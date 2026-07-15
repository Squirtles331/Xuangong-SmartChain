import {
  Bn as p,
  Fn as D,
  Kn as z,
  On as O,
  Xn as b,
  Yn as E,
  an as W,
  dn as N,
  i as A,
  pn as q,
  rn as F,
  rr as u,
  sr as S,
  un as C,
  yn as M
} from './element-plus-CzL7BOKu.js'
import { t as L } from './useTable-Hzr4fBAy.js'
import { t as G } from './StatusTag-DWd3m1xj.js'
import { t as X } from './CrudFormDialog-1OgQthWb.js'
import { t as Y } from './CrudPage-7Q0FEhS_.js'
import { t as $ } from './CrudRowActions-Dmc4i_Io.js'
var H = q({
    __name: 'UserFormDialog',
    props: M(
      { mode: {}, roleOptions: {}, statusOptions: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: M(['submit'], ['update:visible', 'update:form']),
    setup(d, { emit: c }) {
      const i = d,
        r = D(d, 'visible'),
        v = D(d, 'form'),
        g = c,
        y = F(() => [
          { type: 'input', label: '账号', field: 'username', required: !0 },
          { type: 'input', label: '姓名', field: 'realName', required: !0 },
          { type: 'input', label: '归属部门', field: 'department', props: { placeholder: '如：制造执行部' } },
          {
            type: 'select-v2',
            label: '角色',
            field: 'roles',
            required: !0,
            props: { multiple: !0, collapseTags: !0, collapseTagsTooltip: !0, options: i.roleOptions }
          },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: i.statusOptions } }
        ])
      return (s, o) => (
        O(),
        W(
          X,
          {
            visible: r.value,
            'onUpdate:visible': o[0] || (o[0] = (n) => (r.value = n)),
            form: v.value,
            'onUpdate:form': o[1] || (o[1] = (n) => (v.value = n)),
            title: d.mode === 'add' ? '新增用户' : '编辑用户',
            columns: y.value,
            'label-width': 100,
            onSubmit: o[2] || (o[2] = (n) => g('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  J = H,
  Q = q({
    __name: 'index',
    setup(d) {
      const c = [
          { label: '平台管理员', value: '平台管理员' },
          { label: '计划专员', value: '计划专员' },
          { label: '生产主管', value: '生产主管' },
          { label: '班组长', value: '班组长' },
          { label: '质量工程师', value: '质量工程师' },
          { label: '仓储专员', value: '仓储专员' },
          { label: '采购专员', value: '采购专员' },
          { label: '销售经理', value: '销售经理' }
        ],
        i = [
          { label: '启用', value: 1, type: 'success' },
          { label: '停用', value: 0, type: 'info' }
        ],
        r = b([
          {
            id: 'U-001',
            username: 'admin',
            realName: '系统管理员',
            roles: ['平台管理员'],
            department: '系统平台部',
            status: 1,
            createdAt: '2026-07-01 09:12'
          },
          {
            id: 'U-002',
            username: 'plan.zhang',
            realName: '张计划',
            roles: ['计划专员'],
            department: '计划管理部',
            status: 1,
            createdAt: '2026-07-03 10:36'
          },
          {
            id: 'U-003',
            username: 'mes.li',
            realName: '李生产',
            roles: ['生产主管', '班组长'],
            department: '制造执行部',
            status: 1,
            createdAt: '2026-07-04 14:20'
          },
          {
            id: 'U-004',
            username: 'qms.wang',
            realName: '王质量',
            roles: ['质量工程师'],
            department: '质量管理部',
            status: 0,
            createdAt: '2026-07-05 16:05'
          },
          {
            id: 'U-005',
            username: 'wms.zhao',
            realName: '赵仓储',
            roles: ['仓储专员'],
            department: '仓储物流部',
            status: 1,
            createdAt: '2026-07-06 08:48'
          },
          {
            id: 'U-006',
            username: 'srm.sun',
            realName: '孙采购',
            roles: ['采购专员'],
            department: '供应协同部',
            status: 1,
            createdAt: '2026-07-07 11:13'
          }
        ]),
        v = [
          { type: 'input', label: '账号', field: 'username', props: { placeholder: '请输入账号或姓名' } },
          { type: 'select-v2', label: '角色', field: 'role', props: { options: c, clearable: !0 } },
          { type: 'select-v2', label: '状态', field: 'status', props: { options: i, clearable: !0 } }
        ],
        g = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } },
        y = [
          { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
          { prop: 'username', label: '账号', minWidth: 140 },
          { prop: 'realName', label: '姓名', minWidth: 120 },
          { prop: 'department', label: '归属部门', minWidth: 150 },
          { prop: 'roles', label: '角色', minWidth: 200, slotName: 'roles' },
          { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'createdAt', label: '创建时间', minWidth: 160 },
          { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let s = E({ username: '', role: '', status: '' })
      const o = [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ],
        n = b(!1),
        f = b('add'),
        t = b(R()),
        x = F(() =>
          r.value.filter((e) => {
            const l = !s.username || e.username.toLowerCase().includes(s.username.toLowerCase()) || e.realName.includes(s.username),
              a = !s.role || e.roles.includes(s.role),
              m = s.status === '' || e.status === s.status
            return l && a && m
          })
        ),
        {
          tableData: P,
          pagination: h,
          loading: T,
          search: U,
          refresh: _,
          onDelete: k
        } = L({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) => {
            const a = (e - 1) * l,
              m = a + l
            return { list: x.value.slice(a, m), total: x.value.length }
          },
          deleteAPI: async (e) => {
            r.value = r.value.filter((l) => !e.includes(l.id))
          }
        })
      function R() {
        return { id: '', username: '', realName: '', roles: [], department: '', status: 1 }
      }
      function w() {
        ;(Object.assign(s, { username: '', role: '', status: '' }), U())
      }
      function B() {
        ;((f.value = 'add'), (t.value = R()), (n.value = !0))
      }
      function I(e) {
        ;((f.value = 'edit'),
          (t.value = {
            id: e.id,
            username: e.username,
            realName: e.realName,
            roles: Array.isArray(e.roles) ? [...e.roles] : [],
            department: e.department,
            status: e.status
          }),
          (n.value = !0))
      }
      function K(e) {
        return !Array.isArray(e?.roles) || e.roles.length === 0 ? '-' : e.roles.join(' / ')
      }
      function V(e, l) {
        if (e === 'edit') {
          I(l)
          return
        }
        e === 'delete' && k(l)
      }
      async function j() {
        if (!t.value.username || !t.value.realName || !t.value.roles.length) {
          A.warning('请完整填写账号、姓名和角色')
          return
        }
        ;(f.value === 'add'
          ? (r.value.unshift({
              id: `U-${String(r.value.length + 1).padStart(3, '0')}`,
              username: t.value.username,
              realName: t.value.realName,
              roles: [...t.value.roles],
              department: t.value.department || '待分配部门',
              status: t.value.status,
              createdAt: '2026-07-13 10:00'
            }),
            A.success('已新增静态用户数据'))
          : ((r.value = r.value.map((e) =>
              e.id === t.value.id
                ? {
                    ...e,
                    username: t.value.username,
                    realName: t.value.realName,
                    roles: [...t.value.roles],
                    department: t.value.department || '待分配部门',
                    status: t.value.status
                  }
                : e
            )),
            A.success('已更新静态用户数据')),
          (n.value = !1),
          await _())
      }
      return (e, l) => (
        O(),
        W(
          Y,
          {
            'search-model': u(s),
            'onUpdate:searchModel': l[2] || (l[2] = (a) => (z(s) ? (s.value = a) : (s = a))),
            title: '用户管理',
            'search-columns': v,
            'search-grid-item-props': g,
            columns: y,
            data: u(P),
            pagination: u(h),
            loading: u(T),
            onSearch: u(U),
            onReset: w,
            onRefresh: u(_),
            onAdd: B
          },
          {
            index: p(({ $index: a }) => [C(S(a + 1 + (u(h).currentPage - 1) * u(h).pageSize), 1)]),
            roles: p(({ row: a }) => [C(S(K(a)), 1)]),
            status: p(({ row: a }) => [N(G, { value: a.status, options: i }, null, 8, ['value'])]),
            actions: p(({ row: a }) => [N($, { actions: o, onAction: (m) => V(m, a) }, null, 8, ['onAction'])]),
            dialog: p(() => [
              N(
                J,
                {
                  visible: n.value,
                  'onUpdate:visible': l[0] || (l[0] = (a) => (n.value = a)),
                  form: t.value,
                  'onUpdate:form': l[1] || (l[1] = (a) => (t.value = a)),
                  mode: f.value,
                  'role-options': c,
                  'status-options': i,
                  onSubmit: j
                },
                null,
                8,
                ['visible', 'form', 'mode']
              )
            ]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  re = Q
export { re as default }
