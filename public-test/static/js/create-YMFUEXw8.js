import {
  An as q,
  Bn as t,
  C as ae,
  Kn as te,
  Mn as F,
  On as d,
  Qt as O,
  S as re,
  U as oe,
  Vn as $,
  W as ne,
  Xn as h,
  Yn as U,
  an as v,
  b as ie,
  dn as l,
  gt as ue,
  i as w,
  in as b,
  it as se,
  nt as pe,
  on as D,
  or as T,
  ot as de,
  pn as me,
  rn as S,
  rr as p,
  rt as ve,
  sn as E,
  sr as i,
  tn as z,
  tt as be,
  un as o,
  y as fe
} from './element-plus-CzL7BOKu.js'
import { i as _e } from './vue-chunks-CWn_TkJU.js'
import { I as ce } from './index-DqMfCNbk.js'
import { i as ye } from './work-order-Clsu8Szn.js'
import { n as ge, t as we } from './bom-BNit2RjS.js'
import { i as Ve } from './routing-hHkMRJQX.js'
var ke = { class: 'step-footer' },
  Ce = { key: 1 },
  he = { class: 'step-footer' },
  Se = { class: 'step-footer' },
  Ee = me({
    __name: 'index',
    setup(xe) {
      const R = _e(),
        f = h(0)
      let e = U({
        woType: 'production',
        materialCode: '',
        materialName: '',
        materialSpec: '',
        unit: '件',
        plannedQty: 100,
        priority: 'normal',
        workshop: '机加工一车间',
        line: '',
        plannedStart: '2025-01-16',
        plannedEnd: '2025-01-25',
        customerPo: '',
        remark: ''
      })
      const I = [
          {
            type: 'select-v2',
            label: '工单类型',
            field: 'woType',
            required: !0,
            props: {
              options: [
                { label: '生产工单', value: 'production' },
                { label: '返工工单', value: 'rework' },
                { label: '样品工单', value: 'sample' }
              ]
            }
          },
          { type: 'input', label: '产品物料编码', field: 'materialCode', required: !0, props: { placeholder: '请输入产品物料编码', clearable: !0 } },
          { type: 'input', label: '产品名称', field: 'materialName', props: { disabled: !0, placeholder: '输入编码后自动带出' } },
          { type: 'input-number', label: '计划数量', field: 'plannedQty', required: !0, props: { min: 1 } },
          {
            type: 'select-v2',
            label: '优先级',
            field: 'priority',
            required: !0,
            props: {
              options: [
                { label: '紧急', value: 'urgent' },
                { label: '高', value: 'high' },
                { label: '普通', value: 'normal' },
                { label: '低', value: 'low' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '生产车间',
            field: 'workshop',
            required: !0,
            props: {
              options: [
                { label: '机加工一车间', value: '机加工一车间' },
                { label: '机加工二车间', value: '机加工二车间' },
                { label: '装配车间', value: '装配车间' }
              ]
            }
          },
          { type: 'date-picker', label: '计划开工', field: 'plannedStart', required: !0, props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'date-picker', label: '计划完工', field: 'plannedEnd', required: !0, props: { valueFormat: 'YYYY-MM-DD' } },
          { type: 'input', label: '客户订单号', field: 'customerPo', props: { clearable: !0 } },
          { type: 'input', label: '备注', field: 'remark', props: { type: 'textarea', rows: 2 } }
        ],
        s = U({ bomVersion: '', routingVersion: '' }),
        y = h([]),
        V = h([]),
        k = h([]),
        x = S(() => [
          { label: '标准工艺 V1.1（生效中）', value: '标准工艺 V1.1' },
          { label: '标准工艺 V1.0（已归档）', value: '标准工艺 V1.0' }
        ]),
        W = [
          { label: '产线A（日产能 20 件）', value: '产线A' },
          { label: '产线B（日产能 15 件）', value: '产线B' },
          { label: '产线C（日产能 10 件）', value: '产线C' }
        ],
        X = { 产线A: 75, 产线B: 40, 产线C: 95 },
        g = S(() => {
          if (!e.line) return { rate: 0, text: '请先选择产线', color: '#909399', overloaded: !1 }
          const n = X[e.line] || 0
          return n >= 90
            ? { rate: n, text: `超负荷（${n}%）`, color: '#f56c6c', overloaded: !0 }
            : n >= 70
              ? { rate: n, text: `负荷偏高（${n}%）`, color: '#e6a23c', overloaded: !1 }
              : { rate: n, text: `负荷正常（${n}%）`, color: '#67c23a', overloaded: !1 }
        }),
        J = S(() => (e.woType === 'production' ? '生产工单' : e.woType === 'rework' ? '返工工单' : '样品工单')),
        K = S(() => (e.priority === 'urgent' ? '紧急' : e.priority === 'high' ? '高' : e.priority === 'normal' ? '普通' : '低'))
      async function j() {
        try {
          y.value = ((await we({ pageNum: 1, pageSize: 100, materialCode: e.materialCode || void 0 })).data.list || []).map((n) => ({
            label: `${n.bom_type} ${n.version}（${n.status === 'active' ? '生效中' : n.status === 'draft' ? '草稿' : '已归档'}）`,
            value: `${n.bom_type} ${n.version}`
          }))
        } catch {
          y.value = []
        }
      }
      async function Y(n) {
        if (!n) {
          V.value = []
          return
        }
        try {
          const a = await ge(e.materialCode)
          V.value = (Array.isArray(a.data) ? a.data : a.data?.list || []).map((_, B) => ({
            ..._,
            material: _.material || _.material_name || e.materialName,
            available: _.available ?? Math.floor(Math.random() * 200) + B * 30
          }))
        } catch {
          V.value = []
        }
      }
      async function P(n) {
        if (!n) {
          k.value = []
          return
        }
        try {
          k.value = ((await Ve({ pageNum: 1, pageSize: 100, materialCode: e.materialCode })).data.list || []).map((a) => ({
            opNo: a.operation_no,
            name: a.name,
            workCenter: a.work_center,
            setup: a.setup_hours,
            setupVal: a.setup_hours,
            run: a.run_hours,
            runVal: a.run_hours,
            qc: a.is_qc_gate
          }))
        } catch {
          k.value = []
        }
      }
      async function G() {
        if (!e.materialCode) {
          w.warning('请输入产品物料编码')
          return
        }
        if (e.plannedStart && e.plannedEnd && new Date(e.plannedEnd) < new Date(e.plannedStart)) {
          w.warning('计划完工日期不能早于计划开工日期')
          return
        }
        ;(e.materialCode === '04.01.001-00001'
          ? ((e.materialName = '离心泵 XJP-100'), (e.materialSpec = '流量 100m3/h'))
          : e.materialName || (e.materialName = e.materialCode),
          await j(),
          !s.bomVersion && y.value.length > 0 && ((s.bomVersion = y.value[0].value), await Y(s.bomVersion)),
          !s.routingVersion && x.value.length > 0 && ((s.routingVersion = x.value[0].value), await P(s.routingVersion)),
          (f.value = 1))
      }
      async function H() {
        if (g.value.overloaded) {
          w.warning('所选产线已超负荷，请调整计划后再提交')
          return
        }
        try {
          ;(await ye({
            wo_type: e.woType,
            material_code: e.materialCode,
            material_name: e.materialName,
            material_spec: e.materialSpec,
            planned_qty: e.plannedQty,
            priority: e.priority,
            workshop_name: e.workshop,
            line_name: e.line,
            planned_start_date: e.plannedStart,
            planned_end_date: e.plannedEnd,
            bom_version: s.bomVersion,
            routing_version: s.routingVersion,
            customer_po: e.customerPo,
            remark: e.remark,
            status: 'draft',
            completed_qty: 0,
            defective_qty: 0
          }),
            w.success('工单创建成功'),
            R.push('/mes/work-order/list'))
        } catch {
          w.error('工单创建失败')
        }
      }
      return (n, a) => {
        const _ = re,
          B = ae,
          Z = F('gi-form'),
          c = de,
          u = ne,
          M = pe,
          N = ve,
          A = oe,
          ee = ue,
          m = ie,
          C = se,
          L = fe,
          Q = be,
          le = F('gi-page-layout')
        return (
          d(),
          v(le, null, {
            header: t(() => [
              l(
                B,
                { active: f.value, 'align-center': '', style: { 'margin-bottom': '24px' } },
                { default: t(() => [l(_, { title: '基本信息' }), l(_, { title: '选择BOM和工艺' }), l(_, { title: '确认提交' })]), _: 1 },
                8,
                ['active']
              )
            ]),
            default: t(() => [
              $(
                b(
                  'div',
                  null,
                  [
                    l(
                      Z,
                      {
                        modelValue: p(e),
                        'onUpdate:modelValue': a[0] || (a[0] = (r) => (te(e) ? (e.value = r) : (e = r))),
                        columns: I,
                        'label-width': 120
                      },
                      null,
                      8,
                      ['modelValue']
                    ),
                    b('div', ke, [
                      l(c, { type: 'primary', onClick: G }, { default: t(() => [...(a[8] || (a[8] = [o('下一步', -1)]))]), _: 1 }),
                      l(c, { onClick: a[1] || (a[1] = (r) => n.$router.back()) }, { default: t(() => [...(a[9] || (a[9] = [o('取消', -1)]))]), _: 1 })
                    ])
                  ],
                  512
                ),
                [[O, f.value === 0]]
              ),
              $(
                b(
                  'div',
                  null,
                  [
                    l(
                      A,
                      { column: 2, border: '', style: { 'margin-bottom': '16px' } },
                      {
                        default: t(() => [
                          l(u, { label: '产品名称' }, { default: t(() => [o(i(p(e).materialName || '-'), 1)]), _: 1 }),
                          l(u, { label: '计划数量' }, { default: t(() => [o(i(p(e).plannedQty), 1)]), _: 1 }),
                          l(
                            u,
                            { label: '生产产线' },
                            {
                              default: t(() => [
                                l(
                                  N,
                                  {
                                    modelValue: p(e).line,
                                    'onUpdate:modelValue': a[2] || (a[2] = (r) => (p(e).line = r)),
                                    filterable: '',
                                    placeholder: '请选择生产产线',
                                    style: { width: '100%' }
                                  },
                                  {
                                    default: t(() => [
                                      (d(),
                                      E(
                                        z,
                                        null,
                                        q(W, (r) => l(M, { key: r.value, label: r.label, value: r.value }, null, 8, ['label', 'value'])),
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
                          ),
                          l(
                            u,
                            { label: 'BOM版本' },
                            {
                              default: t(() => [
                                l(
                                  N,
                                  {
                                    modelValue: s.bomVersion,
                                    'onUpdate:modelValue': a[3] || (a[3] = (r) => (s.bomVersion = r)),
                                    filterable: '',
                                    placeholder: '请选择BOM版本',
                                    style: { width: '100%' },
                                    onChange: Y
                                  },
                                  {
                                    default: t(() => [
                                      (d(!0),
                                      E(
                                        z,
                                        null,
                                        q(y.value, (r) => (d(), v(M, { key: r.value, label: r.label, value: r.value }, null, 8, ['label', 'value']))),
                                        128
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
                          ),
                          l(
                            u,
                            { label: '工艺路线版本' },
                            {
                              default: t(() => [
                                l(
                                  N,
                                  {
                                    modelValue: s.routingVersion,
                                    'onUpdate:modelValue': a[4] || (a[4] = (r) => (s.routingVersion = r)),
                                    filterable: '',
                                    placeholder: '请选择工艺路线版本',
                                    style: { width: '100%' },
                                    onChange: P
                                  },
                                  {
                                    default: t(() => [
                                      (d(!0),
                                      E(
                                        z,
                                        null,
                                        q(x.value, (r) => (d(), v(M, { key: r.value, label: r.label, value: r.value }, null, 8, ['label', 'value']))),
                                        128
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
                          ),
                          l(
                            u,
                            { label: '产线负荷' },
                            { default: t(() => [b('span', { style: T({ color: g.value.color, fontWeight: 'bold' }) }, i(g.value.text), 5)]), _: 1 }
                          )
                        ]),
                        _: 1
                      }
                    ),
                    g.value.overloaded
                      ? (d(),
                        v(
                          ee,
                          {
                            key: 0,
                            title: `产线“${p(e).line || '-'}”当前负荷已达 ${g.value.rate}%，建议调整计划或切换其他产线`,
                            type: 'warning',
                            'show-icon': '',
                            closable: !1,
                            style: { 'margin-bottom': '16px' }
                          },
                          null,
                          8,
                          ['title']
                        ))
                      : D('', !0),
                    s.bomVersion
                      ? (d(),
                        v(
                          Q,
                          { key: 1, header: 'BOM 物料清单预览', shadow: 'never', style: { 'margin-bottom': '16px' } },
                          {
                            default: t(() => [
                              l(
                                L,
                                { data: V.value, border: '', size: 'small' },
                                {
                                  default: t(() => [
                                    l(m, { prop: 'level', label: '层级', width: '60' }),
                                    l(
                                      m,
                                      { prop: 'material', label: '物料名称', 'min-width': '180' },
                                      {
                                        default: t(({ row: r }) => [b('span', { style: T({ paddingLeft: `${r.level * 16}px` }) }, i(r.material), 5)]),
                                        _: 1
                                      }
                                    ),
                                    l(m, { prop: 'qty', label: '单位用量', width: '100', align: 'center' }),
                                    l(m, { prop: 'total', label: '总需求', width: '100', align: 'center' }),
                                    l(
                                      m,
                                      { prop: 'available', label: '可用库存', width: '100', align: 'center' },
                                      {
                                        default: t(({ row: r }) => [
                                          b('span', { style: T({ color: r.available < r.total ? '#e6a23c' : '#67c23a' }) }, i(r.available), 5)
                                        ]),
                                        _: 1
                                      }
                                    ),
                                    l(
                                      m,
                                      { label: '库存状态', width: '100', align: 'center' },
                                      {
                                        default: t(({ row: r }) => [
                                          r.available >= r.total
                                            ? (d(),
                                              v(
                                                C,
                                                { key: 0, type: 'success', size: 'small' },
                                                { default: t(() => [...(a[10] || (a[10] = [o('充足', -1)]))]), _: 1 }
                                              ))
                                            : r.available > 0
                                              ? (d(),
                                                v(
                                                  C,
                                                  { key: 1, type: 'warning', size: 'small' },
                                                  { default: t(() => [...(a[11] || (a[11] = [o('不足', -1)]))]), _: 1 }
                                                ))
                                              : (d(),
                                                v(
                                                  C,
                                                  { key: 2, type: 'danger', size: 'small' },
                                                  { default: t(() => [...(a[12] || (a[12] = [o('缺料', -1)]))]), _: 1 }
                                                ))
                                        ]),
                                        _: 1
                                      }
                                    )
                                  ]),
                                  _: 1
                                },
                                8,
                                ['data']
                              )
                            ]),
                            _: 1
                          }
                        ))
                      : D('', !0),
                    s.routingVersion
                      ? (d(),
                        v(
                          Q,
                          { key: 2, header: '工艺路线预览', shadow: 'never' },
                          {
                            default: t(() => [
                              l(
                                L,
                                { data: k.value, border: '', size: 'small' },
                                {
                                  default: t(() => [
                                    l(m, { prop: 'opNo', label: '工序号', width: '80', align: 'center' }),
                                    l(m, { prop: 'name', label: '工序名称', width: '120' }),
                                    l(m, { prop: 'workCenter', label: '工作中心', width: '120' }),
                                    l(m, { prop: 'setup', label: '准备工时(分钟)', width: '120', align: 'center' }),
                                    l(m, { prop: 'run', label: '单件工时(分钟)', width: '120', align: 'center' }),
                                    l(
                                      m,
                                      { label: '总工时(小时)', width: '110', align: 'center' },
                                      { default: t(({ row: r }) => [o(i(((r.setupVal + r.runVal * p(e).plannedQty) / 60).toFixed(1)), 1)]), _: 1 }
                                    ),
                                    l(
                                      m,
                                      { prop: 'qc', label: '质检关口', width: '90', align: 'center' },
                                      {
                                        default: t(({ row: r }) => [
                                          r.qc
                                            ? (d(),
                                              v(
                                                C,
                                                { key: 0, type: 'warning', size: 'small' },
                                                { default: t(() => [...(a[13] || (a[13] = [o('是', -1)]))]), _: 1 }
                                              ))
                                            : (d(), E('span', Ce, '-'))
                                        ]),
                                        _: 1
                                      }
                                    )
                                  ]),
                                  _: 1
                                },
                                8,
                                ['data']
                              )
                            ]),
                            _: 1
                          }
                        ))
                      : D('', !0),
                    b('div', he, [
                      l(
                        c,
                        { type: 'primary', onClick: a[5] || (a[5] = (r) => (f.value = 2)) },
                        { default: t(() => [...(a[14] || (a[14] = [o('下一步', -1)]))]), _: 1 }
                      ),
                      l(
                        c,
                        { onClick: a[6] || (a[6] = (r) => (f.value = 0)) },
                        { default: t(() => [...(a[15] || (a[15] = [o('上一步', -1)]))]), _: 1 }
                      )
                    ])
                  ],
                  512
                ),
                [[O, f.value === 1]]
              ),
              $(
                b(
                  'div',
                  null,
                  [
                    l(
                      A,
                      { column: 2, border: '' },
                      {
                        default: t(() => [
                          l(u, { label: '工单类型' }, { default: t(() => [o(i(J.value), 1)]), _: 1 }),
                          l(u, { label: '产品名称' }, { default: t(() => [o(i(p(e).materialName), 1)]), _: 1 }),
                          l(u, { label: '计划数量' }, { default: t(() => [o(i(p(e).plannedQty) + ' ' + i(p(e).unit), 1)]), _: 1 }),
                          l(u, { label: '优先级' }, { default: t(() => [o(i(K.value), 1)]), _: 1 }),
                          l(u, { label: '生产车间' }, { default: t(() => [o(i(p(e).workshop), 1)]), _: 1 }),
                          l(u, { label: '生产产线' }, { default: t(() => [o(i(p(e).line || '-'), 1)]), _: 1 }),
                          l(u, { label: '计划开工' }, { default: t(() => [o(i(p(e).plannedStart), 1)]), _: 1 }),
                          l(u, { label: '计划完工' }, { default: t(() => [o(i(p(e).plannedEnd), 1)]), _: 1 }),
                          l(u, { label: 'BOM版本' }, { default: t(() => [o(i(s.bomVersion || '-'), 1)]), _: 1 }),
                          l(u, { label: '工艺路线版本' }, { default: t(() => [o(i(s.routingVersion || '-'), 1)]), _: 1 }),
                          l(u, { label: '客户订单号' }, { default: t(() => [o(i(p(e).customerPo || '-'), 1)]), _: 1 }),
                          l(u, { label: '备注' }, { default: t(() => [o(i(p(e).remark || '-'), 1)]), _: 1 })
                        ]),
                        _: 1
                      }
                    ),
                    b('div', Se, [
                      l(c, { type: 'primary', onClick: H }, { default: t(() => [...(a[16] || (a[16] = [o('提交工单', -1)]))]), _: 1 }),
                      l(
                        c,
                        { onClick: a[7] || (a[7] = (r) => (f.value = 1)) },
                        { default: t(() => [...(a[17] || (a[17] = [o('上一步', -1)]))]), _: 1 }
                      )
                    ])
                  ],
                  512
                ),
                [[O, f.value === 2]]
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  De = ce(Ee, [['__scopeId', 'data-v-c7182f97']])
export { De as default }
