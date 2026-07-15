import {
  An as y,
  B as ce,
  Bn as r,
  C as ve,
  G as me,
  H as fe,
  J as ge,
  Kn as be,
  On as v,
  S as _e,
  Xn as f,
  Yn as q,
  an as C,
  dn as s,
  ft as ye,
  ht as Ve,
  i as M,
  in as a,
  it as ke,
  mt as Oe,
  nt as he,
  on as Te,
  ot as Re,
  pn as Ce,
  q as we,
  rn as Ee,
  rr as g,
  rt as xe,
  sn as b,
  sr as d,
  tn as V,
  un as w
} from './element-plus-CzL7BOKu.js'
import { I as Le } from './index-DqMfCNbk.js'
import { t as De } from './useTable-Hzr4fBAy.js'
import { t as E } from './StatusTag-DWd3m1xj.js'
import { t as Ue } from './CrudPage-7Q0FEhS_.js'
import { t as Me } from './CrudRowActions-Dmc4i_Io.js'
var Be = { key: 0, class: 'detail-shell' },
  je = { class: 'detail-hero' },
  Se = { class: 'detail-title' },
  Ne = { class: 'detail-subtitle' },
  Ae = { class: 'detail-grid' },
  Ie = { class: 'detail-card' },
  We = { class: 'detail-item' },
  qe = { class: 'detail-item' },
  Fe = { class: 'detail-item' },
  Pe = { class: 'detail-item' },
  Ye = { class: 'detail-card' },
  Ke = { class: 'detail-item' },
  Ge = { class: 'detail-item' },
  He = { class: 'detail-item' },
  Je = { class: 'detail-item' },
  Xe = { class: 'detail-card' },
  $e = { class: 'detail-tags' },
  ze = { class: 'detail-description' },
  Qe = { class: 'detail-card' },
  Ze = { class: 'detail-tags' },
  et = { class: 'detail-card detail-card--full' },
  tt = Ce({
    __name: 'index',
    setup(lt) {
      const k = [
          { value: 'bom', label: 'BOM切换', type: 'primary' },
          { value: 'routing', label: '工艺路线切换', type: 'success' },
          { value: 'bom_routing', label: 'BOM+工艺切换', type: 'warning' }
        ],
        O = [
          { value: 'low', label: '低', type: 'info' },
          { value: 'medium', label: '中', type: 'warning' },
          { value: 'high', label: '高', type: 'danger' }
        ],
        x = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'approval', label: '待审批', type: 'warning' },
          { value: 'approved', label: '已放行', type: 'primary' },
          { value: 'executing', label: '执行中', type: 'warning' },
          { value: 'verified', label: '已验证', type: 'success' },
          { value: 'closed', label: '已关闭', type: 'info' }
        ],
        h = f([
          {
            id: 'CUT-001',
            code: 'CUT-202607-001',
            material: '供液控制总成',
            cutoverType: 'bom_routing',
            currentVersion: 'EBOM V2.3 / RT V2.0',
            targetVersion: 'EBOM V2.4 / RT V2.1',
            status: 'approval',
            riskLevel: 'high',
            plannedDate: '2026-07-18',
            owner: '李工艺',
            changeOrder: 'ECN-202607-001',
            workOrderCount: 2,
            inventoryImpact: '旧版库存 86 件，新版辅料待齐套',
            impactObjects: ['在制工单', '旧版库存', '工艺路线', '首件检验'],
            closureRecords: ['待审批放行', '待现场切换'],
            steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
            description: '新增密封结构后需要同步切换 BOM、工艺路线、首件确认和现场投料口径。'
          },
          {
            id: 'CUT-002',
            code: 'CUT-202607-002',
            material: '壳体粗加工件',
            cutoverType: 'routing',
            currentVersion: 'RT V1.0',
            targetVersion: 'RT V1.1',
            status: 'approved',
            riskLevel: 'medium',
            plannedDate: '2026-07-16',
            owner: '周制造',
            changeOrder: 'ECN-202607-002',
            workOrderCount: 1,
            inventoryImpact: '不影响库存，仅调整工序顺序和质检关卡',
            impactObjects: ['工艺路线', '工时参数', '过程检验'],
            closureRecords: ['审批已放行', '等待现场执行'],
            steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
            description: '缩短排队工时并新增中间检验点，切换后 APS 和 MES 按新路线消费。'
          },
          {
            id: 'CUT-003',
            code: 'CUT-202607-003',
            material: '真空模组总成',
            cutoverType: 'bom',
            currentVersion: 'EBOM V3.1',
            targetVersion: 'EBOM V3.2',
            status: 'executing',
            riskLevel: 'medium',
            plannedDate: '2026-07-20',
            owner: '陈设计',
            changeOrder: 'ECN-202607-003',
            workOrderCount: 3,
            inventoryImpact: '替代辅料需冻结旧版领料',
            impactObjects: ['采购替代料', '装配辅料', '现场切换'],
            closureRecords: ['已放行', '执行日志待收口'],
            steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
            description: '替换老版本密封辅料，现场按新 EBOM 版本完成齐套和投料切换。'
          },
          {
            id: 'CUT-004',
            code: 'CUT-202607-004',
            material: '供液控制总成',
            cutoverType: 'bom',
            currentVersion: 'MBOM V1.1',
            targetVersion: 'MBOM V1.2',
            status: 'verified',
            riskLevel: 'low',
            plannedDate: '2026-07-14',
            owner: '周制造',
            changeOrder: 'ECN-202607-004',
            workOrderCount: 0,
            inventoryImpact: '制造投料口径已同步',
            impactObjects: ['领料口径', '制造版本'],
            closureRecords: ['现场已切换', '首件已验证'],
            steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
            description: '制造口径结构与现场投料同步修正，等待最终关闭。'
          }
        ]),
        F = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '切换单号 / 对象 / 责任人' } },
          {
            type: 'select-v2',
            label: '切换类型',
            field: 'cutoverType',
            props: { options: [{ label: '全部', value: '' }, ...k.map((t) => ({ label: t.label, value: t.value }))] }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { options: [{ label: '全部', value: '' }, ...x.map((t) => ({ label: t.label, value: t.value }))] }
          },
          {
            type: 'select-v2',
            label: '风险等级',
            field: 'riskLevel',
            props: { options: [{ label: '全部', value: '' }, ...O.map((t) => ({ label: t.label, value: t.value }))] }
          }
        ],
        P = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 } },
        Y = [
          { prop: 'code', label: '切换单号', minWidth: 150 },
          { prop: 'material', label: '切换对象', minWidth: 170 },
          { label: '切换类型', minWidth: 120, align: 'center', slotName: 'cutoverType' },
          { prop: 'currentVersion', label: '当前版本', minWidth: 170 },
          { prop: 'targetVersion', label: '目标版本', minWidth: 170 },
          { label: '风险', minWidth: 90, align: 'center', slotName: 'riskLevel' },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { prop: 'plannedDate', label: '计划切换日', minWidth: 120 },
          { prop: 'owner', label: '责任人', minWidth: 100 },
          { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
        ]
      let p = q({ keyword: '', cutoverType: '', status: '', riskLevel: '' })
      const m = f(!1),
        T = f('add'),
        L = f(!1),
        n = f(null),
        B = f(),
        o = q(U()),
        K = {
          code: [{ required: !0, message: '请输入切换单号', trigger: 'blur' }],
          material: [{ required: !0, message: '请输入切换对象', trigger: 'blur' }],
          cutoverType: [{ required: !0, message: '请选择切换类型', trigger: 'change' }],
          currentVersion: [{ required: !0, message: '请输入当前版本', trigger: 'blur' }],
          targetVersion: [{ required: !0, message: '请输入目标版本', trigger: 'blur' }],
          plannedDate: [{ required: !0, message: '请选择计划切换日', trigger: 'change' }],
          owner: [{ required: !0, message: '请输入责任人', trigger: 'blur' }]
        },
        j = Ee(() =>
          h.value.filter((t) => {
            const e = p.keyword.trim().toLowerCase(),
              u = !e || t.code.toLowerCase().includes(e) || t.material.toLowerCase().includes(e) || t.owner.toLowerCase().includes(e),
              i = !p.cutoverType || t.cutoverType === p.cutoverType,
              c = !p.status || t.status === p.status,
              R = !p.riskLevel || t.riskLevel === p.riskLevel
            return u && i && c && R
          })
        ),
        {
          tableData: G,
          pagination: H,
          loading: J,
          search: D,
          refresh: X
        } = De({
          rowKey: 'id',
          listAPI: async ({ page: t, size: e }) => {
            const u = (t - 1) * e,
              i = u + e
            return { list: j.value.slice(u, i), total: j.value.length }
          }
        })
      function U() {
        return {
          id: '',
          code: '',
          material: '',
          cutoverType: 'bom_routing',
          currentVersion: '',
          targetVersion: '',
          status: 'draft',
          riskLevel: 'medium',
          plannedDate: '',
          owner: '',
          changeOrder: '待关联',
          workOrderCount: 0,
          inventoryImpact: '待扫描',
          impactObjects: ['待影响扫描'],
          closureRecords: ['待创建'],
          steps: ['影响扫描', '审批放行', '现场切换', '验证收口'],
          description: ''
        }
      }
      function S(t, e) {
        return t.find((u) => u.value === e)?.label || e || '-'
      }
      function $(t) {
        return { draft: 0, approval: 1, approved: 2, executing: 3, verified: 4, closed: 4 }[t]
      }
      function z(t) {
        return [
          { key: 'detail', label: '查看详情', tone: 'primary' },
          { key: 'edit', label: '编辑', tone: 'secondary', hidden: t.status !== 'draft' },
          { key: 'submit', label: '提交审批', tone: 'warning', hidden: t.status !== 'draft' },
          { key: 'approve', label: '审批放行', tone: 'success', hidden: t.status !== 'approval' },
          { key: 'execute', label: '开始切换', tone: 'warning', hidden: t.status !== 'approved' },
          { key: 'verify', label: '验证收口', tone: 'success', hidden: t.status !== 'executing' },
          { key: 'close', label: '关闭', tone: 'danger', hidden: t.status !== 'verified' }
        ]
      }
      function Q() {
        ;(Object.assign(p, { keyword: '', cutoverType: '', status: '', riskLevel: '' }), D())
      }
      function N(t) {
        Object.assign(o, U(), t)
      }
      function Z() {
        ;((T.value = 'add'), N(U()), (m.value = !0))
      }
      function ee(t) {
        ;((T.value = 'edit'),
          N({ ...t, impactObjects: [...t.impactObjects], closureRecords: [...t.closureRecords], steps: [...t.steps] }),
          (m.value = !0))
      }
      function te(t) {
        ;((n.value = { ...t, impactObjects: [...t.impactObjects], closureRecords: [...t.closureRecords], steps: [...t.steps] }), (L.value = !0))
      }
      async function le() {
        if (!(await B.value?.validate().catch(() => !1))) return
        const t = {
          ...o,
          id: o.id || `CUT-${Date.now()}`,
          impactObjects: [...o.impactObjects],
          closureRecords: [...o.closureRecords],
          steps: [...o.steps]
        }
        ;(T.value === 'add'
          ? (h.value.unshift(t), M.success('已新增静态切换任务'))
          : ((h.value = h.value.map((e) => (e.id === t.id ? t : e))), n.value?.id === t.id && (n.value = { ...t }), M.success('已更新静态切换任务')),
          (m.value = !1),
          D())
      }
      function _(t, e, u, i) {
        ;((t.status = e),
          t.closureRecords.includes(i) || t.closureRecords.push(i),
          n.value?.id === t.id &&
            (n.value = { ...t, impactObjects: [...t.impactObjects], closureRecords: [...t.closureRecords], steps: [...t.steps] }),
          M.success(u))
      }
      function ae(t, e) {
        if (t === 'detail') {
          te(e)
          return
        }
        if (t === 'edit') {
          ee(e)
          return
        }
        if (t === 'submit') {
          _(e, 'approval', '已提交切换审批', '已提交审批')
          return
        }
        if (t === 'approve') {
          _(e, 'approved', '已审批放行', '审批已放行')
          return
        }
        if (t === 'execute') {
          _(e, 'executing', '已进入现场切换执行', '现场切换执行中')
          return
        }
        if (t === 'verify') {
          _(e, 'verified', '已完成切换验证', '切换已验证')
          return
        }
        t === 'close' && _(e, 'closed', '已关闭切换任务', '任务已关闭')
      }
      return (t, e) => {
        const u = ye,
          i = Ve,
          c = we,
          R = he,
          A = xe,
          se = me,
          re = ge,
          oe = Oe,
          I = Re,
          ne = fe,
          W = ke,
          ie = _e,
          ue = ve,
          de = ce
        return (
          v(),
          C(
            Ue,
            {
              'search-model': g(p),
              'onUpdate:searchModel': e[12] || (e[12] = (l) => (be(p) ? (p.value = l) : (p = l))),
              title: '版本切换',
              'search-columns': F,
              'search-grid-item-props': P,
              columns: Y,
              data: g(G),
              pagination: g(H),
              loading: g(J),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              'add-text': '新建切换任务',
              onSearch: g(D),
              onReset: Q,
              onRefresh: g(X),
              onAdd: Z
            },
            {
              cutoverType: r(({ row: l }) => [s(E, { value: l.cutoverType, options: k }, null, 8, ['value'])]),
              riskLevel: r(({ row: l }) => [s(E, { value: l.riskLevel, options: O }, null, 8, ['value'])]),
              status: r(({ row: l }) => [s(E, { value: l.status, options: x }, null, 8, ['value'])]),
              actions: r(({ row: l }) => [s(Me, { actions: z(l), onAction: (pe) => ae(pe, l) }, null, 8, ['actions', 'onAction'])]),
              dialog: r(() => [
                s(
                  ne,
                  {
                    modelValue: m.value,
                    'onUpdate:modelValue': e[10] || (e[10] = (l) => (m.value = l)),
                    title: T.value === 'add' ? '新建切换任务' : '编辑切换任务',
                    width: '820px'
                  },
                  {
                    footer: r(() => [
                      s(
                        I,
                        { onClick: e[9] || (e[9] = (l) => (m.value = !1)) },
                        { default: r(() => [...(e[13] || (e[13] = [w('取消', -1)]))]), _: 1 }
                      ),
                      s(I, { type: 'primary', onClick: le }, { default: r(() => [...(e[14] || (e[14] = [w('保存', -1)]))]), _: 1 })
                    ]),
                    default: r(() => [
                      s(
                        oe,
                        { ref_key: 'formRef', ref: B, model: o, rules: K, 'label-width': '110px' },
                        {
                          default: r(() => [
                            s(
                              re,
                              { gutter: 16 },
                              {
                                default: r(() => [
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '切换单号', prop: 'code' },
                                          {
                                            default: r(() => [
                                              s(
                                                u,
                                                {
                                                  modelValue: o.code,
                                                  'onUpdate:modelValue': e[0] || (e[0] = (l) => (o.code = l)),
                                                  placeholder: '请输入切换单号'
                                                },
                                                null,
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '切换对象', prop: 'material' },
                                          {
                                            default: r(() => [
                                              s(
                                                u,
                                                {
                                                  modelValue: o.material,
                                                  'onUpdate:modelValue': e[1] || (e[1] = (l) => (o.material = l)),
                                                  placeholder: '请输入产品或对象名称'
                                                },
                                                null,
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '切换类型', prop: 'cutoverType' },
                                          {
                                            default: r(() => [
                                              s(
                                                A,
                                                {
                                                  modelValue: o.cutoverType,
                                                  'onUpdate:modelValue': e[2] || (e[2] = (l) => (o.cutoverType = l)),
                                                  style: { width: '100%' }
                                                },
                                                {
                                                  default: r(() => [
                                                    (v(),
                                                    b(
                                                      V,
                                                      null,
                                                      y(k, (l) =>
                                                        s(R, { key: l.value, label: l.label, value: l.value }, null, 8, ['label', 'value'])
                                                      ),
                                                      64
                                                    ))
                                                  ]),
                                                  _: 1
                                                },
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '风险等级', prop: 'riskLevel' },
                                          {
                                            default: r(() => [
                                              s(
                                                A,
                                                {
                                                  modelValue: o.riskLevel,
                                                  'onUpdate:modelValue': e[3] || (e[3] = (l) => (o.riskLevel = l)),
                                                  style: { width: '100%' }
                                                },
                                                {
                                                  default: r(() => [
                                                    (v(),
                                                    b(
                                                      V,
                                                      null,
                                                      y(O, (l) =>
                                                        s(R, { key: l.value, label: l.label, value: l.value }, null, 8, ['label', 'value'])
                                                      ),
                                                      64
                                                    ))
                                                  ]),
                                                  _: 1
                                                },
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '当前版本', prop: 'currentVersion' },
                                          {
                                            default: r(() => [
                                              s(
                                                u,
                                                {
                                                  modelValue: o.currentVersion,
                                                  'onUpdate:modelValue': e[4] || (e[4] = (l) => (o.currentVersion = l)),
                                                  placeholder: '如 EBOM V2.3 / RT V2.0'
                                                },
                                                null,
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '目标版本', prop: 'targetVersion' },
                                          {
                                            default: r(() => [
                                              s(
                                                u,
                                                {
                                                  modelValue: o.targetVersion,
                                                  'onUpdate:modelValue': e[5] || (e[5] = (l) => (o.targetVersion = l)),
                                                  placeholder: '如 EBOM V2.4 / RT V2.1'
                                                },
                                                null,
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '计划切换日', prop: 'plannedDate' },
                                          {
                                            default: r(() => [
                                              s(
                                                se,
                                                {
                                                  modelValue: o.plannedDate,
                                                  'onUpdate:modelValue': e[6] || (e[6] = (l) => (o.plannedDate = l)),
                                                  type: 'date',
                                                  'value-format': 'YYYY-MM-DD',
                                                  style: { width: '100%' }
                                                },
                                                null,
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  s(
                                    c,
                                    { span: 12 },
                                    {
                                      default: r(() => [
                                        s(
                                          i,
                                          { label: '责任人', prop: 'owner' },
                                          {
                                            default: r(() => [
                                              s(
                                                u,
                                                {
                                                  modelValue: o.owner,
                                                  'onUpdate:modelValue': e[7] || (e[7] = (l) => (o.owner = l)),
                                                  placeholder: '请输入责任人'
                                                },
                                                null,
                                                8,
                                                ['modelValue']
                                              )
                                            ]),
                                            _: 1
                                          }
                                        )
                                      ]),
                                      _: 1
                                    }
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            s(
                              i,
                              { label: '切换说明' },
                              {
                                default: r(() => [
                                  s(
                                    u,
                                    {
                                      modelValue: o.description,
                                      'onUpdate:modelValue': e[8] || (e[8] = (l) => (o.description = l)),
                                      type: 'textarea',
                                      rows: 4,
                                      maxlength: '180',
                                      'show-word-limit': ''
                                    },
                                    null,
                                    8,
                                    ['modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        },
                        8,
                        ['model']
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue', 'title']
                ),
                s(
                  de,
                  { modelValue: L.value, 'onUpdate:modelValue': e[11] || (e[11] = (l) => (L.value = l)), title: '版本切换详情', size: '820px' },
                  {
                    default: r(() => [
                      n.value
                        ? (v(),
                          b('div', Be, [
                            a('div', je, [
                              a('div', null, [
                                a('div', Se, d(n.value.material), 1),
                                a('div', Ne, d(n.value.code) + ' · ' + d(n.value.currentVersion) + ' -> ' + d(n.value.targetVersion), 1)
                              ]),
                              s(E, { value: n.value.status, options: x }, null, 8, ['value'])
                            ]),
                            a('div', Ae, [
                              a('section', Ie, [
                                e[19] || (e[19] = a('div', { class: 'detail-card__title' }, '切换基础', -1)),
                                a('div', We, [
                                  e[15] || (e[15] = a('span', null, '切换类型', -1)),
                                  a('strong', null, d(S(k, n.value.cutoverType)), 1)
                                ]),
                                a('div', qe, [e[16] || (e[16] = a('span', null, '风险等级', -1)), a('strong', null, d(S(O, n.value.riskLevel)), 1)]),
                                a('div', Fe, [e[17] || (e[17] = a('span', null, '计划切换日', -1)), a('strong', null, d(n.value.plannedDate), 1)]),
                                a('div', Pe, [e[18] || (e[18] = a('span', null, '责任人', -1)), a('strong', null, d(n.value.owner), 1)])
                              ]),
                              a('section', Ye, [
                                e[24] || (e[24] = a('div', { class: 'detail-card__title' }, '版本来源', -1)),
                                a('div', Ke, [e[20] || (e[20] = a('span', null, '当前版本', -1)), a('strong', null, d(n.value.currentVersion), 1)]),
                                a('div', Ge, [e[21] || (e[21] = a('span', null, '目标版本', -1)), a('strong', null, d(n.value.targetVersion), 1)]),
                                a('div', He, [e[22] || (e[22] = a('span', null, '来源变更单', -1)), a('strong', null, d(n.value.changeOrder), 1)]),
                                a('div', Je, [
                                  e[23] || (e[23] = a('span', null, '影响工单', -1)),
                                  a('strong', null, d(n.value.workOrderCount) + ' 张', 1)
                                ])
                              ]),
                              a('section', Xe, [
                                e[25] || (e[25] = a('div', { class: 'detail-card__title' }, '影响对象', -1)),
                                a('div', $e, [
                                  (v(!0),
                                  b(
                                    V,
                                    null,
                                    y(
                                      n.value.impactObjects,
                                      (l) => (
                                        v(),
                                        C(W, { key: l, type: 'warning', effect: 'light', round: '' }, { default: r(() => [w(d(l), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ]),
                                a('p', ze, d(n.value.description), 1)
                              ]),
                              a('section', Qe, [
                                e[26] || (e[26] = a('div', { class: 'detail-card__title' }, '收口记录', -1)),
                                a('div', Ze, [
                                  (v(!0),
                                  b(
                                    V,
                                    null,
                                    y(
                                      n.value.closureRecords,
                                      (l) => (
                                        v(),
                                        C(W, { key: l, type: 'success', effect: 'light', round: '' }, { default: r(() => [w(d(l), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ])
                              ])
                            ]),
                            a('section', et, [
                              e[27] || (e[27] = a('div', { class: 'detail-card__title' }, '切换步骤', -1)),
                              s(
                                ue,
                                { active: $(n.value.status), 'finish-status': 'success', 'align-center': '' },
                                {
                                  default: r(() => [
                                    (v(!0),
                                    b(
                                      V,
                                      null,
                                      y(n.value.steps, (l) => (v(), C(ie, { key: l, title: l }, null, 8, ['title']))),
                                      128
                                    ))
                                  ]),
                                  _: 1
                                },
                                8,
                                ['active']
                              )
                            ])
                          ]))
                        : Te('', !0)
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  ut = Le(tt, [['__scopeId', 'data-v-44418600']])
export { ut as default }
