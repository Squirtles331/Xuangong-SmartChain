import {
  An as y,
  B as ve,
  Bn as s,
  F as fe,
  H as ge,
  J as ce,
  Kn as _e,
  On as v,
  Xn as C,
  Yn as Q,
  an as W,
  dn as o,
  ft as be,
  ht as ye,
  i as U,
  in as t,
  it as Me,
  mt as Ve,
  nt as Ce,
  on as ke,
  ot as qe,
  pn as Oe,
  q as Be,
  r as we,
  rn as Re,
  rr as k,
  rt as he,
  sn as f,
  sr as u,
  tn as M,
  un as g,
  x as Ee
} from './element-plus-CzL7BOKu.js'
import { I as Pe } from './index-DqMfCNbk.js'
import { t as Se } from './useTable-Hzr4fBAy.js'
import { t as $ } from './StatusTag-DWd3m1xj.js'
import { t as xe } from './CrudPage-7Q0FEhS_.js'
import { t as We } from './CrudRowActions-Dmc4i_Io.js'
var Ue = { class: 'form-section' },
  Ae = { class: 'form-section' },
  Ne = { class: 'form-section' },
  De = { class: 'dialog-footer' },
  Te = { key: 0, class: 'detail-shell' },
  Ie = { class: 'detail-hero' },
  Fe = { class: 'detail-title' },
  Le = { class: 'detail-subtitle' },
  Ke = { class: 'detail-grid' },
  je = { class: 'detail-card' },
  Qe = { class: 'detail-item' },
  $e = { class: 'detail-item' },
  Ge = { class: 'detail-item' },
  He = { class: 'detail-item' },
  Je = { class: 'detail-card' },
  Xe = { class: 'detail-item' },
  Ye = { class: 'detail-item' },
  ze = { class: 'detail-item' },
  Ze = { class: 'detail-item' },
  el = { class: 'detail-item' },
  ll = { class: 'detail-card' },
  tl = { class: 'detail-item' },
  al = { class: 'detail-item' },
  ol = { class: 'detail-item' },
  sl = { class: 'detail-tags' },
  nl = { class: 'detail-card' },
  dl = { class: 'detail-item' },
  ul = { class: 'detail-tags' },
  il = { class: 'detail-item' },
  rl = { class: 'detail-tags' },
  pl = { class: 'detail-card detail-card--full' },
  ml = { class: 'detail-description' },
  vl = Oe({
    __name: 'index',
    setup(fl) {
      const B = [
          { value: 'machining', label: '机加工' },
          { value: 'assembly', label: '装配' },
          { value: 'inspection', label: '检验' },
          { value: 'outsource', label: '委外协同' }
        ],
        w = [
          { value: 'none', label: '无质检关卡' },
          { value: 'sampling', label: '抽检放行' },
          { value: 'required', label: '必检放行' }
        ],
        D = [
          { value: 'single', label: '单件报工' },
          { value: 'batch', label: '批次报工' },
          { value: 'milestone', label: '里程碑报工' }
        ],
        R = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'pending_approval', label: '待审批', type: 'warning' },
          { value: 'active', label: '已发布', type: 'success' },
          { value: 'disabled', label: '已停用', type: 'warning' }
        ],
        G = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工序编码 / 工序名称 / 工作中心' } },
          {
            type: 'select-v2',
            label: '工序分类',
            field: 'operationCategory',
            props: { options: [{ label: '全部', value: '' }, ...B.map((a) => ({ label: a.label, value: a.value }))] }
          },
          {
            type: 'select-v2',
            label: '质检模式',
            field: 'qcMode',
            props: { options: [{ label: '全部', value: '' }, ...w.map((a) => ({ label: a.label, value: a.value }))] }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { options: [{ label: '全部', value: '' }, ...R.map((a) => ({ label: a.label, value: a.value }))] }
          }
        ],
        H = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 } },
        J = [
          { prop: 'code', label: '工序编码', minWidth: 130 },
          { prop: 'name', label: '工序名称', minWidth: 160 },
          { label: '工序分类', minWidth: 110, align: 'center', slotName: 'operationCategory' },
          { prop: 'defaultWorkCenter', label: '默认工作中心', minWidth: 150 },
          { label: '质检模式', minWidth: 120, align: 'center', slotName: 'qcMode' },
          { label: '关联路线', minWidth: 100, align: 'center', slotName: 'routeCount' },
          { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
          { prop: 'updatedBy', label: '维护人', minWidth: 100 },
          { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
        ],
        c = C([
          {
            id: 'OP-010',
            code: 'OP-010',
            name: '壳体清洗',
            operationCategory: 'assembly',
            defaultWorkCenter: '装配清洗工位',
            defaultSkill: '装配钳工',
            setupMinutes: 8,
            runMinutes: 12,
            queueMinutes: 4,
            moveMinutes: 2,
            workers: 1,
            qcMode: 'none',
            reportMode: 'single',
            isOutsourced: !1,
            status: 'active',
            routeCount: 2,
            releasedRoutingCodes: ['RT-2101-V2.0', 'RT-2101-V2.1'],
            linkedBomVersions: ['EBOM V2.4', 'MBOM V1.2'],
            latestChangeOrder: 'ECN-202607-004',
            controlPoints: ['首件确认', '清洗防锈'],
            description: '定义主装前的壳体清洗标准工序，供工艺路线复用并被 MES 报工直接消费。',
            updatedBy: '周工艺',
            updatedAt: '2026-07-14 09:20'
          },
          {
            id: 'OP-020',
            code: 'OP-020',
            name: '核心组件预组',
            operationCategory: 'assembly',
            defaultWorkCenter: '主装工位',
            defaultSkill: '装配钳工',
            setupMinutes: 10,
            runMinutes: 16,
            queueMinutes: 4,
            moveMinutes: 2,
            workers: 2,
            qcMode: 'required',
            reportMode: 'batch',
            isOutsourced: !1,
            status: 'pending_approval',
            routeCount: 1,
            releasedRoutingCodes: ['RT-2101-V2.1'],
            linkedBomVersions: ['EBOM V2.4'],
            latestChangeOrder: 'ECN-202607-001',
            controlPoints: ['中间质检关卡', '扭矩确认'],
            description: '在总成装配前完成关键组件预组与参数确认，后续 QMS 过程检验直接挂接该工序。',
            updatedBy: '李工艺',
            updatedAt: '2026-07-13 16:45'
          },
          {
            id: 'OP-030',
            code: 'OP-030',
            name: '整机联调',
            operationCategory: 'inspection',
            defaultWorkCenter: '测试组',
            defaultSkill: '测试操作',
            setupMinutes: 12,
            runMinutes: 24,
            queueMinutes: 6,
            moveMinutes: 3,
            workers: 2,
            qcMode: 'required',
            reportMode: 'milestone',
            isOutsourced: !1,
            status: 'active',
            routeCount: 2,
            releasedRoutingCodes: ['RT-2101-V2.0', 'RT-1888-V1.8'],
            linkedBomVersions: ['MBOM V1.2', 'EBOM V3.1'],
            latestChangeOrder: 'ECN-202606-017',
            controlPoints: ['性能判定', '终检放行'],
            description: '作为完工前的里程碑工序，用于统一联调、终检和放行的上游工艺定义。',
            updatedBy: '陈工艺',
            updatedAt: '2026-07-12 14:10'
          },
          {
            id: 'OP-040',
            code: 'OP-040',
            name: '热处理委外',
            operationCategory: 'outsource',
            defaultWorkCenter: '热处理协同',
            defaultSkill: '委外协调',
            setupMinutes: 6,
            runMinutes: 0,
            queueMinutes: 30,
            moveMinutes: 15,
            workers: 1,
            qcMode: 'sampling',
            reportMode: 'batch',
            isOutsourced: !0,
            status: 'draft',
            routeCount: 1,
            releasedRoutingCodes: ['RT-1001-V1.0'],
            linkedBomVersions: ['MBOM V1.0'],
            latestChangeOrder: 'ECN-202607-006',
            controlPoints: ['回厂复验', '批次一致性'],
            description: '定义外协热处理工序的默认约束，供 MES 委外任务和回厂质检共同引用。',
            updatedBy: '王工艺',
            updatedAt: '2026-07-14 10:05'
          }
        ])
      let m = Q({ keyword: '', operationCategory: '', qcMode: '', status: '' })
      const V = C(!1),
        h = C('add'),
        E = C(!1),
        d = C(null),
        T = C(),
        n = Q(P()),
        X = {
          code: [{ required: !0, message: '请输入工序编码', trigger: 'blur' }],
          name: [{ required: !0, message: '请输入工序名称', trigger: 'blur' }],
          operationCategory: [{ required: !0, message: '请选择工序分类', trigger: 'change' }],
          defaultWorkCenter: [{ required: !0, message: '请输入默认工作中心', trigger: 'blur' }],
          defaultSkill: [{ required: !0, message: '请输入默认技能要求', trigger: 'blur' }],
          qcMode: [{ required: !0, message: '请选择质检模式', trigger: 'change' }],
          reportMode: [{ required: !0, message: '请选择报工模式', trigger: 'change' }],
          status: [{ required: !0, message: '请选择状态', trigger: 'change' }]
        },
        I = Re(() =>
          c.value.filter((a) => {
            const e = m.keyword.trim().toLowerCase(),
              r = !e || a.code.toLowerCase().includes(e) || a.name.toLowerCase().includes(e) || a.defaultWorkCenter.toLowerCase().includes(e),
              _ = !m.operationCategory || a.operationCategory === m.operationCategory,
              b = !m.qcMode || a.qcMode === m.qcMode,
              i = !m.status || a.status === m.status
            return r && _ && b && i
          })
        ),
        {
          tableData: Y,
          pagination: z,
          loading: Z,
          search: A,
          refresh: ee,
          onDelete: le
        } = Se({
          rowKey: 'id',
          listAPI: async ({ page: a, size: e }) => {
            const r = (a - 1) * e,
              _ = r + e
            return { list: I.value.slice(r, _), total: I.value.length }
          },
          deleteAPI: async (a) => {
            c.value = c.value.filter((e) => !a.includes(String(e.id)))
          }
        })
      function P() {
        return {
          id: '',
          code: '',
          name: '',
          operationCategory: 'assembly',
          defaultWorkCenter: '',
          defaultSkill: '',
          setupMinutes: 0,
          runMinutes: 0,
          queueMinutes: 0,
          moveMinutes: 0,
          workers: 1,
          qcMode: 'none',
          reportMode: 'single',
          isOutsourced: !1,
          status: 'draft',
          routeCount: 0,
          releasedRoutingCodes: [],
          linkedBomVersions: [],
          latestChangeOrder: '待发布',
          controlPoints: [],
          description: '',
          updatedBy: '当前用户',
          updatedAt: '2026-07-14 00:00'
        }
      }
      function q(a, e) {
        return a.find((r) => r.value === e)?.label || e || '-'
      }
      function te(a) {
        return [
          { key: 'detail', label: '查看详情', tone: 'primary' },
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: a.status === 'disabled' ? 'enable' : 'disable', label: a.status === 'disabled' ? '启用' : '停用', tone: 'warning' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      }
      function ae() {
        ;(Object.assign(m, { keyword: '', operationCategory: '', qcMode: '', status: '' }), A())
      }
      function F(a) {
        Object.assign(n, P(), a)
      }
      function oe() {
        ;((h.value = 'add'), F(P()), (V.value = !0))
      }
      function se(a) {
        ;((h.value = 'edit'),
          F({
            ...P(),
            ...a,
            releasedRoutingCodes: [...a.releasedRoutingCodes],
            linkedBomVersions: [...a.linkedBomVersions],
            controlPoints: [...a.controlPoints]
          }),
          (V.value = !0))
      }
      function L(a) {
        ;((d.value = {
          ...a,
          releasedRoutingCodes: [...a.releasedRoutingCodes],
          linkedBomVersions: [...a.linkedBomVersions],
          controlPoints: [...a.controlPoints]
        }),
          (E.value = !0))
      }
      async function ne() {
        if (!(await T.value?.validate().catch(() => !1))) return
        const a = {
          ...n,
          updatedBy: '工艺工程师',
          updatedAt: '2026-07-14 11:30',
          controlPoints: n.qcMode === 'required' ? ['质量放行', '报工校验'] : n.qcMode === 'sampling' ? ['抽样复验'] : ['标准报工'],
          releasedRoutingCodes: n.releasedRoutingCodes.length ? [...n.releasedRoutingCodes] : [],
          linkedBomVersions: n.linkedBomVersions.length ? [...n.linkedBomVersions] : []
        }
        if (c.value.find((e) => e.code === a.code && e.id !== a.id)) {
          U.warning('工序编码已存在，请调整后重试')
          return
        }
        if (h.value === 'add') ((a.id = a.code), (a.latestChangeOrder = '待发布'), c.value.unshift(a), U.success('已新增静态工序定义'))
        else {
          const e = c.value.findIndex((r) => r.id === a.id)
          ;(e >= 0 && (c.value[e] = a), d.value?.id === a.id && (d.value = { ...a }), U.success('已更新静态工序定义'))
        }
        ;((V.value = !1), A())
      }
      async function K(a, e) {
        ;((a.status = e), d.value?.id === a.id && (d.value = { ...a }), U.success(e === 'disabled' ? '已停用工序定义' : '已启用工序定义'))
      }
      async function de(a) {
        ;(await we.confirm(`确认删除工序定义「${a.name}」吗？`, '删除确认', { type: 'warning' }),
          le(a),
          d.value?.id === a.id && ((E.value = !1), (d.value = null)))
      }
      async function ue(a, e) {
        if (a === 'detail') {
          L(e)
          return
        }
        if (a === 'edit') {
          se(e)
          return
        }
        if (a === 'enable') {
          await K(e, 'active')
          return
        }
        if (a === 'disable') {
          await K(e, 'disabled')
          return
        }
        a === 'delete' && (await de(e))
      }
      return (a, e) => {
        const r = Me,
          _ = qe,
          b = be,
          i = ye,
          p = Be,
          S = Ce,
          x = he,
          N = ce,
          O = fe,
          ie = Ee,
          re = Ve,
          pe = ge,
          me = ve
        return (
          v(),
          W(
            xe,
            {
              'search-model': k(m),
              'onUpdate:searchModel': e[18] || (e[18] = (l) => (_e(m) ? (m.value = l) : (m = l))),
              title: '工序定义',
              'search-columns': G,
              'search-grid-item-props': H,
              columns: J,
              data: k(Y),
              pagination: k(z),
              loading: k(Z),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              'add-text': '新增工序定义',
              onSearch: k(A),
              onReset: ae,
              onRefresh: k(ee),
              onAdd: oe
            },
            {
              operationCategory: s(({ row: l }) => [
                o(r, { effect: 'light', round: '' }, { default: s(() => [g(u(q(B, l.operationCategory)), 1)]), _: 2 }, 1024)
              ]),
              qcMode: s(({ row: l }) => [
                o(
                  r,
                  { type: l.qcMode === 'required' ? 'danger' : l.qcMode === 'sampling' ? 'warning' : 'info', effect: 'light', round: '' },
                  { default: s(() => [g(u(q(w, l.qcMode)), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              status: s(({ row: l }) => [o($, { value: l.status, options: R }, null, 8, ['value'])]),
              routeCount: s(({ row: l }) => [
                o(_, { link: '', type: 'primary', onClick: (j) => L(l) }, { default: s(() => [g(u(l.routeCount), 1)]), _: 2 }, 1032, ['onClick'])
              ]),
              actions: s(({ row: l }) => [o(We, { actions: te(l), onAction: (j) => ue(j, l) }, null, 8, ['actions', 'onAction'])]),
              dialog: s(() => [
                o(
                  pe,
                  {
                    modelValue: V.value,
                    'onUpdate:modelValue': e[16] || (e[16] = (l) => (V.value = l)),
                    title: h.value === 'add' ? '新增工序定义' : '编辑工序定义',
                    width: '900px'
                  },
                  {
                    footer: s(() => [
                      t('div', De, [
                        o(
                          _,
                          { onClick: e[15] || (e[15] = (l) => (V.value = !1)) },
                          { default: s(() => [...(e[22] || (e[22] = [g('取消', -1)]))]), _: 1 }
                        ),
                        o(_, { type: 'primary', onClick: ne }, { default: s(() => [...(e[23] || (e[23] = [g('保存', -1)]))]), _: 1 })
                      ])
                    ]),
                    default: s(() => [
                      o(
                        re,
                        { ref_key: 'formRef', ref: T, model: n, rules: X, 'label-width': '110px' },
                        {
                          default: s(() => [
                            t('div', Ue, [
                              e[19] || (e[19] = t('div', { class: 'form-section__title' }, '基础信息', -1)),
                              o(
                                N,
                                { gutter: 16 },
                                {
                                  default: s(() => [
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '工序编码', prop: 'code' },
                                            {
                                              default: s(() => [
                                                o(
                                                  b,
                                                  {
                                                    modelValue: n.code,
                                                    'onUpdate:modelValue': e[0] || (e[0] = (l) => (n.code = l)),
                                                    placeholder: '请输入工序编码'
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '工序名称', prop: 'name' },
                                            {
                                              default: s(() => [
                                                o(
                                                  b,
                                                  {
                                                    modelValue: n.name,
                                                    'onUpdate:modelValue': e[1] || (e[1] = (l) => (n.name = l)),
                                                    placeholder: '请输入工序名称'
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '工序分类', prop: 'operationCategory' },
                                            {
                                              default: s(() => [
                                                o(
                                                  x,
                                                  {
                                                    modelValue: n.operationCategory,
                                                    'onUpdate:modelValue': e[2] || (e[2] = (l) => (n.operationCategory = l)),
                                                    style: { width: '100%' }
                                                  },
                                                  {
                                                    default: s(() => [
                                                      (v(),
                                                      f(
                                                        M,
                                                        null,
                                                        y(B, (l) =>
                                                          o(S, { key: l.value, label: l.label, value: l.value }, null, 8, ['label', 'value'])
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '默认工作中心', prop: 'defaultWorkCenter' },
                                            {
                                              default: s(() => [
                                                o(
                                                  b,
                                                  {
                                                    modelValue: n.defaultWorkCenter,
                                                    'onUpdate:modelValue': e[3] || (e[3] = (l) => (n.defaultWorkCenter = l)),
                                                    placeholder: '请输入默认工作中心'
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '默认技能要求', prop: 'defaultSkill' },
                                            {
                                              default: s(() => [
                                                o(
                                                  b,
                                                  {
                                                    modelValue: n.defaultSkill,
                                                    'onUpdate:modelValue': e[4] || (e[4] = (l) => (n.defaultSkill = l)),
                                                    placeholder: '请输入默认技能要求'
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '状态', prop: 'status' },
                                            {
                                              default: s(() => [
                                                o(
                                                  x,
                                                  {
                                                    modelValue: n.status,
                                                    'onUpdate:modelValue': e[5] || (e[5] = (l) => (n.status = l)),
                                                    style: { width: '100%' }
                                                  },
                                                  {
                                                    default: s(() => [
                                                      (v(),
                                                      f(
                                                        M,
                                                        null,
                                                        y(R, (l) =>
                                                          o(S, { key: l.value, label: l.label, value: l.value }, null, 8, ['label', 'value'])
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
                                    )
                                  ]),
                                  _: 1
                                }
                              )
                            ]),
                            t('div', Ae, [
                              e[20] || (e[20] = t('div', { class: 'form-section__title' }, '工时与资源', -1)),
                              o(
                                N,
                                { gutter: 16 },
                                {
                                  default: s(() => [
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '准备工时(分)' },
                                            {
                                              default: s(() => [
                                                o(
                                                  O,
                                                  {
                                                    modelValue: n.setupMinutes,
                                                    'onUpdate:modelValue': e[6] || (e[6] = (l) => (n.setupMinutes = l)),
                                                    min: 0,
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '加工工时(分)' },
                                            {
                                              default: s(() => [
                                                o(
                                                  O,
                                                  {
                                                    modelValue: n.runMinutes,
                                                    'onUpdate:modelValue': e[7] || (e[7] = (l) => (n.runMinutes = l)),
                                                    min: 0,
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '排队工时(分)' },
                                            {
                                              default: s(() => [
                                                o(
                                                  O,
                                                  {
                                                    modelValue: n.queueMinutes,
                                                    'onUpdate:modelValue': e[8] || (e[8] = (l) => (n.queueMinutes = l)),
                                                    min: 0,
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '转运工时(分)' },
                                            {
                                              default: s(() => [
                                                o(
                                                  O,
                                                  {
                                                    modelValue: n.moveMinutes,
                                                    'onUpdate:modelValue': e[9] || (e[9] = (l) => (n.moveMinutes = l)),
                                                    min: 0,
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '标准人数' },
                                            {
                                              default: s(() => [
                                                o(
                                                  O,
                                                  {
                                                    modelValue: n.workers,
                                                    'onUpdate:modelValue': e[10] || (e[10] = (l) => (n.workers = l)),
                                                    min: 1,
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '委外工序' },
                                            {
                                              default: s(() => [
                                                o(
                                                  ie,
                                                  {
                                                    modelValue: n.isOutsourced,
                                                    'onUpdate:modelValue': e[11] || (e[11] = (l) => (n.isOutsourced = l))
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
                              )
                            ]),
                            t('div', Ne, [
                              e[21] || (e[21] = t('div', { class: 'form-section__title' }, '质量与报工约束', -1)),
                              o(
                                N,
                                { gutter: 16 },
                                {
                                  default: s(() => [
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '质检模式', prop: 'qcMode' },
                                            {
                                              default: s(() => [
                                                o(
                                                  x,
                                                  {
                                                    modelValue: n.qcMode,
                                                    'onUpdate:modelValue': e[12] || (e[12] = (l) => (n.qcMode = l)),
                                                    style: { width: '100%' }
                                                  },
                                                  {
                                                    default: s(() => [
                                                      (v(),
                                                      f(
                                                        M,
                                                        null,
                                                        y(w, (l) =>
                                                          o(S, { key: l.value, label: l.label, value: l.value }, null, 8, ['label', 'value'])
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
                                    o(
                                      p,
                                      { span: 12 },
                                      {
                                        default: s(() => [
                                          o(
                                            i,
                                            { label: '报工模式', prop: 'reportMode' },
                                            {
                                              default: s(() => [
                                                o(
                                                  x,
                                                  {
                                                    modelValue: n.reportMode,
                                                    'onUpdate:modelValue': e[13] || (e[13] = (l) => (n.reportMode = l)),
                                                    style: { width: '100%' }
                                                  },
                                                  {
                                                    default: s(() => [
                                                      (v(),
                                                      f(
                                                        M,
                                                        null,
                                                        y(D, (l) =>
                                                          o(S, { key: l.value, label: l.label, value: l.value }, null, 8, ['label', 'value'])
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
                                    )
                                  ]),
                                  _: 1
                                }
                              ),
                              o(
                                i,
                                { label: '工序说明' },
                                {
                                  default: s(() => [
                                    o(
                                      b,
                                      {
                                        modelValue: n.description,
                                        'onUpdate:modelValue': e[14] || (e[14] = (l) => (n.description = l)),
                                        type: 'textarea',
                                        rows: 4,
                                        placeholder: '请输入工序定义说明'
                                      },
                                      null,
                                      8,
                                      ['modelValue']
                                    )
                                  ]),
                                  _: 1
                                }
                              )
                            ])
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
                o(
                  me,
                  { modelValue: E.value, 'onUpdate:modelValue': e[17] || (e[17] = (l) => (E.value = l)), title: '工序定义详情', size: '760px' },
                  {
                    default: s(() => [
                      d.value
                        ? (v(),
                          f('div', Te, [
                            t('div', Ie, [
                              t('div', null, [
                                t('div', Fe, u(d.value.name), 1),
                                t('div', Le, u(d.value.code) + ' · ' + u(q(B, d.value.operationCategory)), 1)
                              ]),
                              o($, { value: d.value.status, options: R }, null, 8, ['value'])
                            ]),
                            t('div', Ke, [
                              t('section', je, [
                                e[28] || (e[28] = t('div', { class: 'detail-card__title' }, '基础信息', -1)),
                                t('div', Qe, [
                                  e[24] || (e[24] = t('span', null, '默认工作中心', -1)),
                                  t('strong', null, u(d.value.defaultWorkCenter), 1)
                                ]),
                                t('div', $e, [e[25] || (e[25] = t('span', null, '默认技能要求', -1)), t('strong', null, u(d.value.defaultSkill), 1)]),
                                t('div', Ge, [
                                  e[26] || (e[26] = t('span', null, '最新变更单', -1)),
                                  t('strong', null, u(d.value.latestChangeOrder), 1)
                                ]),
                                t('div', He, [
                                  e[27] || (e[27] = t('span', null, '维护人', -1)),
                                  t('strong', null, u(d.value.updatedBy) + ' / ' + u(d.value.updatedAt), 1)
                                ])
                              ]),
                              t('section', Je, [
                                e[34] || (e[34] = t('div', { class: 'detail-card__title' }, '工时与资源', -1)),
                                t('div', Xe, [
                                  e[29] || (e[29] = t('span', null, '准备工时', -1)),
                                  t('strong', null, u(d.value.setupMinutes) + ' 分', 1)
                                ]),
                                t('div', Ye, [
                                  e[30] || (e[30] = t('span', null, '加工工时', -1)),
                                  t('strong', null, u(d.value.runMinutes) + ' 分', 1)
                                ]),
                                t('div', ze, [
                                  e[31] || (e[31] = t('span', null, '排队工时', -1)),
                                  t('strong', null, u(d.value.queueMinutes) + ' 分', 1)
                                ]),
                                t('div', Ze, [
                                  e[32] || (e[32] = t('span', null, '转运工时', -1)),
                                  t('strong', null, u(d.value.moveMinutes) + ' 分', 1)
                                ]),
                                t('div', el, [e[33] || (e[33] = t('span', null, '标准人数', -1)), t('strong', null, u(d.value.workers) + ' 人', 1)])
                              ]),
                              t('section', ll, [
                                e[38] || (e[38] = t('div', { class: 'detail-card__title' }, '质量与报工约束', -1)),
                                t('div', tl, [e[35] || (e[35] = t('span', null, '质检模式', -1)), t('strong', null, u(q(w, d.value.qcMode)), 1)]),
                                t('div', al, [e[36] || (e[36] = t('span', null, '报工模式', -1)), t('strong', null, u(q(D, d.value.reportMode)), 1)]),
                                t('div', ol, [
                                  e[37] || (e[37] = t('span', null, '委外工序', -1)),
                                  t('strong', null, u(d.value.isOutsourced ? '是' : '否'), 1)
                                ]),
                                t('div', sl, [
                                  (v(!0),
                                  f(
                                    M,
                                    null,
                                    y(
                                      d.value.controlPoints,
                                      (l) => (v(), W(r, { key: l, effect: 'light', round: '' }, { default: s(() => [g(u(l), 1)]), _: 2 }, 1024))
                                    ),
                                    128
                                  ))
                                ])
                              ]),
                              t('section', nl, [
                                e[41] || (e[41] = t('div', { class: 'detail-card__title' }, '上下游关联', -1)),
                                t('div', dl, [
                                  e[39] || (e[39] = t('span', null, '关联工艺路线', -1)),
                                  t('strong', null, u(d.value.routeCount) + ' 个版本', 1)
                                ]),
                                t('div', ul, [
                                  (v(!0),
                                  f(
                                    M,
                                    null,
                                    y(
                                      d.value.releasedRoutingCodes,
                                      (l) => (
                                        v(),
                                        W(r, { key: l, type: 'success', effect: 'light', round: '' }, { default: s(() => [g(u(l), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ]),
                                t('div', il, [
                                  e[40] || (e[40] = t('span', null, '影响 BOM 版本', -1)),
                                  t('strong', null, u(d.value.linkedBomVersions.length) + ' 个', 1)
                                ]),
                                t('div', rl, [
                                  (v(!0),
                                  f(
                                    M,
                                    null,
                                    y(
                                      d.value.linkedBomVersions,
                                      (l) => (
                                        v(),
                                        W(r, { key: l, type: 'primary', effect: 'light', round: '' }, { default: s(() => [g(u(l), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ])
                              ])
                            ]),
                            t('section', pl, [
                              e[42] || (e[42] = t('div', { class: 'detail-card__title' }, '工序说明', -1)),
                              t('p', ml, u(d.value.description), 1)
                            ])
                          ]))
                        : ke('', !0)
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
  Vl = Pe(vl, [['__scopeId', 'data-v-054e06b6']])
export { Vl as default }
