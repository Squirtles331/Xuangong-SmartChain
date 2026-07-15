import {
  $ as ie,
  Bn as a,
  Cn as de,
  F as ue,
  Mn as U,
  O as pe,
  On as V,
  Rn as A,
  Tn as _e,
  U as ce,
  W as me,
  Xn as F,
  Yn as W,
  an as D,
  bn as fe,
  dn as e,
  et as ye,
  ft as ve,
  gt as ge,
  ht as be,
  i as f,
  in as m,
  it as qe,
  mt as he,
  on as we,
  ot as xe,
  pn as ke,
  r as Ce,
  rn as q,
  rr as I,
  sn as Ee,
  sr as u,
  tt as Ve,
  un as d,
  xn as L
} from './element-plus-CzL7BOKu.js'
import { i as Ie, r as Me } from './vue-chunks-CWn_TkJU.js'
import { I as Re } from './index-DqMfCNbk.js'
import { t as Oe } from './echarts-BZg-173N.js'
import { t as ze } from './useTable-Hzr4fBAy.js'
import { t as $e } from './TableSetting-BqN9x3yX.js'
import { d as De, l as Pe, p as Se, s as Ne } from './work-order-Clsu8Szn.js'
var Be = { class: 'report-container' },
  Te = { class: 'report-header' },
  Ue = { class: 'report-tags' },
  Ae = { class: 'field-tip' },
  Fe = { class: 'field-tip' },
  We = { key: 1 },
  Le = ke({
    __name: 'index',
    setup(je) {
      const j = Me(),
        Q = Ie(),
        l = W({
          workOrderId: '',
          operationId: '',
          wo_code: '',
          material_name: '',
          operation_no: 0,
          operation_name: '',
          work_center: '',
          start_time: '',
          planned_qty: 0,
          reported_qty: 0,
          status: 'in_progress'
        }),
        y = F(0)
      let M
      const t = W({ qualified_qty: 0, defective_qty: 0, defect_reasons: [], actual_hours: 1, remark: '' }),
        G = q(() => ({ pending: '待开工', assigned: '已派工', running: '生产中', completed: '已完工', in_progress: '生产中' })[l.status] || '生产中'),
        P = q(() => O(C.value?.[0]?.status || 'draft')),
        S = q(() => {
          const r = Math.floor(y.value / 60),
            o = y.value % 60
          return r > 0 ? `${r}小时${o}分钟` : `${o}分钟`
        }),
        v = q(() => Math.max(l.planned_qty - l.reported_qty, 0)),
        k = q(() => (l.planned_qty === 0 ? 0 : Math.round((l.reported_qty / l.planned_qty) * 100))),
        H = q(() => !l.operationId || t.qualified_qty + t.defective_qty === 0),
        K = q(() => (k.value >= 100 ? '#67c23a' : k.value >= 60 ? '#409eff' : '#e6a23c'))
      A(y, (r) => {
        t.actual_hours = Math.max(r, 1)
      })
      const X = [
          { prop: 'time', label: '报工时间', width: 160 },
          { prop: 'status', label: '记录状态', width: 110, align: 'center', slotName: 'status' },
          { prop: 'qualified_qty', label: '合格数', width: 90, align: 'center' },
          { prop: 'defective_qty', label: '不良数', width: 90, align: 'center' },
          { prop: 'defect_reasons', label: '不良原因', minWidth: 180, slotName: 'defect_reasons' },
          { prop: 'actual_hours', label: '工时(分钟)', width: 110, align: 'center' },
          { prop: 'worker', label: '操作人', width: 100 },
          { prop: 'actions', label: '操作', width: 100, align: 'center', slotName: 'actions', fixed: 'right' }
        ],
        {
          tableData: C,
          pagination: Y,
          loading: J,
          refresh: R
        } = ze({
          rowKey: 'time',
          listAPI: async ({ page: r, size: o }) => (await Ne({ pageNum: r, pageSize: o, workOrderCode: l.wo_code || void 0 })).data
        })
      ;(_e(async () => {
        ;(await Z(),
          (M = setInterval(() => {
            y.value += 1
          }, 6e4)),
          await R(),
          L(() => T()))
      }),
        de(() => {
          ;(M && clearInterval(M), window.removeEventListener('resize', B), w?.dispose())
        }))
      async function Z() {
        const r = j.params.id
        l.workOrderId = r
        try {
          const [o, g] = await Promise.all([Pe(r), De(r)]),
            c = o.data,
            i = g.data || [],
            p = i.find((n) => n.status === 'running') || i.find((n) => n.status === 'assigned') || i[0]
          Object.assign(l, {
            wo_code: c?.code || '',
            material_name: c?.material_name || '',
            planned_qty: c?.planned_qty || 0,
            reported_qty: c?.completed_qty || 0,
            operationId: p?.id || '',
            operation_no: p?.operation_no || 0,
            operation_name: p?.name || '',
            work_center: p?.work_center || p?.work_center_name || '',
            start_time: p?.actual_start_time || p?.planned_start || p?.planned_start_time || '',
            status: p?.status || c?.status || 'in_progress'
          })
          const x = l.start_time ? new Date(l.start_time.replace(/-/g, '/')).getTime() : Date.now(),
            s = Math.max(Math.floor((Date.now() - x) / 6e4), 1)
          ;((y.value = Number.isFinite(s) ? s : 1), (t.qualified_qty = v.value), (t.actual_hours = y.value))
        } catch {
          f.error('报工数据加载失败')
        }
      }
      async function ee() {
        if (!l.operationId) {
          f.warning('未找到可报工工序')
          return
        }
        if (t.qualified_qty + t.defective_qty === 0) {
          f.warning('请填写报工数量')
          return
        }
        if (t.qualified_qty + t.defective_qty > v.value) {
          f.warning('报工总数不能超过剩余数量')
          return
        }
        if (t.defective_qty > 0 && t.defect_reasons.length === 0) {
          f.warning('请选择不良原因')
          return
        }
        Ce.confirm(`确认提交报工：合格 ${t.qualified_qty} 件，不良 ${t.defective_qty} 件？提交后记录将进入“已提交”状态。`, '确认报工', {
          type: 'warning'
        })
          .then(async () => {
            try {
              if (
                (await Se(l.operationId, {
                  qualified_qty: t.qualified_qty,
                  defective_qty: t.defective_qty,
                  defect_reasons: t.defect_reasons,
                  actual_hours: t.actual_hours
                }),
                (l.reported_qty += t.qualified_qty + t.defective_qty),
                await R(),
                l.reported_qty >= l.planned_qty)
              ) {
                ;(f.success('当前工单已全部报工完成，请返回工单列表继续处理。'), Q.push('/mes/work-order/list'))
                return
              }
              ;(f.success(`报工已提交，当前进度 ${k.value}%，可在下方继续确认入账。`), N(), (t.qualified_qty = v.value))
            } catch {
              f.error('报工提交失败')
            }
          })
          .catch(() => {})
      }
      function N() {
        ;((t.qualified_qty = 0), (t.defective_qty = 0), (t.defect_reasons = []), (t.actual_hours = Math.max(y.value, 1)), (t.remark = ''))
      }
      function te(r) {
        ;((r.status = 'confirmed'), f.success('静态演示：该报工记录已确认入账。'))
      }
      function O(r) {
        return {
          draft: { label: '待提交', type: 'info' },
          submitted: { label: '已提交', type: 'warning' },
          confirmed: { label: '已确认', type: 'success' },
          rejected: { label: '已退回', type: 'danger' }
        }[r || 'draft']
      }
      const z = F()
      let w = null
      function B() {
        w?.resize()
      }
      function T() {
        if (!z.value) return
        ;(w?.dispose(), (w = Oe(z.value)))
        const r = {}
        ;(C.value || []).forEach((s) => {
          ;(s.defect_reasons || '')
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean)
            .forEach((n) => {
              r[n] = (r[n] || 0) + 1
            })
        })
        const o = Object.entries(r).sort((s, n) => n[1] - s[1]),
          g = o.map(([s]) => s),
          c = o.map(([, s]) => s),
          i = c.reduce((s, n) => s + n, 0)
        let p = 0
        const x = c.map((s) => ((p += s), i > 0 ? Math.round((p / i) * 100) : 0))
        ;(window.addEventListener('resize', B),
          w.setOption({
            title: { text: '不良原因 Pareto 图', left: 'center' },
            tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
            grid: { left: 60, right: 60, bottom: 40, top: 60 },
            xAxis: { type: 'category', data: g, axisLabel: { rotate: 30 } },
            yAxis: [
              { type: 'value', name: '频次' },
              { type: 'value', name: '累计(%)', max: 100, axisLabel: { formatter: '{value}%' } }
            ],
            series: [
              { name: '频次', type: 'bar', data: c, itemStyle: { color: '#409eff' } },
              {
                name: '累计占比',
                type: 'line',
                yAxisIndex: 1,
                data: x,
                smooth: !0,
                lineStyle: { color: '#f56c6c', width: 2 },
                itemStyle: { color: '#f56c6c' }
              }
            ]
          }))
      }
      return (
        A(C, () => {
          L(() => T())
        }),
        (r, o) => {
          const g = qe,
            c = ge,
            i = me,
            p = pe,
            x = ce,
            s = ue,
            n = be,
            h = ie,
            ae = ye,
            oe = ve,
            E = xe,
            le = he,
            $ = Ve,
            re = U('gi-table'),
            ne = U('gi-page-layout')
          return (
            V(),
            D(ne, null, {
              default: a(() => [
                m('div', Be, [
                  m('div', Te, [
                    o[6] ||
                      (o[6] = m(
                        'div',
                        null,
                        [m('h2', null, '工序报工'), m('p', { class: 'report-subtitle' }, '围绕报工记录对象完成数量提交、状态确认与缺陷原因归集。')],
                        -1
                      )),
                    m('div', Ue, [
                      e(g, { size: 'large', type: 'warning' }, { default: a(() => [d('当前工序：' + u(G.value), 1)]), _: 1 }),
                      e(g, { size: 'large', type: P.value.type }, { default: a(() => [d('最新记录：' + u(P.value.label), 1)]), _: 1 }, 8, ['type'])
                    ])
                  ]),
                  e(c, {
                    type: 'info',
                    closable: !1,
                    'show-icon': '',
                    class: 'phase-alert',
                    title: '静态阶段口径：提交报工后记录进入“已提交”，在下方历史记录中点击“确认入账”后进入“已确认”；本阶段不联动 WMS、QMS、成本接口。'
                  }),
                  e(
                    x,
                    { column: 2, border: '', class: 'summary-block' },
                    {
                      default: a(() => [
                        e(i, { label: '工单编号' }, { default: a(() => [d(u(l.wo_code || '-'), 1)]), _: 1 }),
                        e(i, { label: '产品名称' }, { default: a(() => [d(u(l.material_name || '-'), 1)]), _: 1 }),
                        e(
                          i,
                          { label: '工序' },
                          { default: a(() => [d(u(l.operation_no ? `${l.operation_no} - ${l.operation_name}` : '-'), 1)]), _: 1 }
                        ),
                        e(i, { label: '工作中心' }, { default: a(() => [d(u(l.work_center || '-'), 1)]), _: 1 }),
                        e(i, { label: '开工时间' }, { default: a(() => [d(u(l.start_time || '-'), 1)]), _: 1 }),
                        e(i, { label: '已用时长' }, { default: a(() => [d(u(S.value), 1)]), _: 1 }),
                        e(i, { label: '计划数量' }, { default: a(() => [d(u(l.planned_qty) + ' 件', 1)]), _: 1 }),
                        e(i, { label: '已报工数量' }, { default: a(() => [d(u(l.reported_qty) + ' 件', 1)]), _: 1 }),
                        e(i, { label: '剩余可报' }, { default: a(() => [d(u(v.value) + ' 件', 1)]), _: 1 }),
                        e(
                          i,
                          { label: '完成进度' },
                          {
                            default: a(() => [
                              e(p, { percentage: k.value, 'stroke-width': 8, color: K.value, style: { width: '220px' } }, null, 8, [
                                'percentage',
                                'color'
                              ])
                            ]),
                            _: 1
                          }
                        )
                      ]),
                      _: 1
                    }
                  ),
                  e(
                    $,
                    { header: '本次报工', shadow: 'never' },
                    {
                      default: a(() => [
                        e(
                          le,
                          { model: t, 'label-width': '120px', style: { 'max-width': '640px' } },
                          {
                            default: a(() => [
                              e(
                                n,
                                { label: '合格数量', required: '' },
                                {
                                  default: a(() => [
                                    e(
                                      s,
                                      {
                                        modelValue: t.qualified_qty,
                                        'onUpdate:modelValue': o[0] || (o[0] = (_) => (t.qualified_qty = _)),
                                        min: 0,
                                        max: v.value,
                                        style: { width: '220px' }
                                      },
                                      null,
                                      8,
                                      ['modelValue', 'max']
                                    ),
                                    m('span', Ae, '本次提交上限为 ' + u(v.value) + ' 件', 1)
                                  ]),
                                  _: 1
                                }
                              ),
                              e(
                                n,
                                { label: '不良数量', required: '' },
                                {
                                  default: a(() => [
                                    e(
                                      s,
                                      {
                                        modelValue: t.defective_qty,
                                        'onUpdate:modelValue': o[1] || (o[1] = (_) => (t.defective_qty = _)),
                                        min: 0,
                                        max: v.value,
                                        style: { width: '220px' }
                                      },
                                      null,
                                      8,
                                      ['modelValue', 'max']
                                    )
                                  ]),
                                  _: 1
                                }
                              ),
                              t.defective_qty > 0
                                ? (V(),
                                  D(
                                    n,
                                    { key: 0, label: '不良原因', required: '' },
                                    {
                                      default: a(() => [
                                        e(
                                          ae,
                                          { modelValue: t.defect_reasons, 'onUpdate:modelValue': o[2] || (o[2] = (_) => (t.defect_reasons = _)) },
                                          {
                                            default: a(() => [
                                              e(h, { label: '尺寸超差', value: '尺寸超差' }),
                                              e(h, { label: '外观缺陷', value: '外观缺陷' }),
                                              e(h, { label: '材质问题', value: '材质问题' }),
                                              e(h, { label: '设备精度异常', value: '设备精度异常' }),
                                              e(h, { label: '操作失误', value: '操作失误' }),
                                              e(h, { label: '其他', value: '其他' })
                                            ]),
                                            _: 1
                                          },
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ))
                                : we('', !0),
                              e(
                                n,
                                { label: '实际工时(分钟)' },
                                {
                                  default: a(() => [
                                    e(
                                      s,
                                      {
                                        modelValue: t.actual_hours,
                                        'onUpdate:modelValue': o[3] || (o[3] = (_) => (t.actual_hours = _)),
                                        min: 1,
                                        style: { width: '220px' }
                                      },
                                      null,
                                      8,
                                      ['modelValue']
                                    ),
                                    m('span', Fe, '当前自动计时：' + u(S.value), 1)
                                  ]),
                                  _: 1
                                }
                              ),
                              e(
                                n,
                                { label: '备注' },
                                {
                                  default: a(() => [
                                    e(
                                      oe,
                                      {
                                        modelValue: t.remark,
                                        'onUpdate:modelValue': o[4] || (o[4] = (_) => (t.remark = _)),
                                        type: 'textarea',
                                        rows: 2
                                      },
                                      null,
                                      8,
                                      ['modelValue']
                                    )
                                  ]),
                                  _: 1
                                }
                              ),
                              e(n, null, {
                                default: a(() => [
                                  e(
                                    E,
                                    { type: 'primary', size: 'large', disabled: H.value, onClick: ee },
                                    { default: a(() => [...(o[7] || (o[7] = [d('提交报工', -1)]))]), _: 1 },
                                    8,
                                    ['disabled']
                                  ),
                                  e(E, { size: 'large', onClick: N }, { default: a(() => [...(o[8] || (o[8] = [d('重置', -1)]))]), _: 1 }),
                                  e(
                                    E,
                                    { size: 'large', onClick: o[5] || (o[5] = (_) => r.$router.back()) },
                                    { default: a(() => [...(o[9] || (o[9] = [d('返回', -1)]))]), _: 1 }
                                  )
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          },
                          8,
                          ['model']
                        )
                      ]),
                      _: 1
                    }
                  ),
                  e(
                    $,
                    { header: '报工记录', shadow: 'never', style: { 'margin-top': '16px' } },
                    {
                      default: a(() => [
                        e(
                          $e,
                          { title: '报工历史', columns: X, onRefresh: I(R) },
                          {
                            default: a(({ settingColumns: _, tableProps: se }) => [
                              e(
                                re,
                                fe({ columns: _, data: I(C), pagination: I(Y), loading: I(J) }, se, { border: '', size: 'small' }),
                                {
                                  status: a(({ row: b }) => [
                                    e(g, { size: 'small', type: O(b.status).type }, { default: a(() => [d(u(O(b.status).label), 1)]), _: 2 }, 1032, [
                                      'type'
                                    ])
                                  ]),
                                  defect_reasons: a(({ row: b }) => [m('span', null, u(b.defect_reasons || '-'), 1)]),
                                  actions: a(({ row: b }) => [
                                    b.status === 'submitted'
                                      ? (V(),
                                        D(
                                          E,
                                          { key: 0, type: 'primary', link: '', size: 'small', onClick: (Qe) => te(b) },
                                          { default: a(() => [...(o[10] || (o[10] = [d('确认入账', -1)]))]), _: 1 },
                                          8,
                                          ['onClick']
                                        ))
                                      : (V(), Ee('span', We, '-'))
                                  ]),
                                  _: 1
                                },
                                16,
                                ['columns', 'data', 'pagination', 'loading']
                              )
                            ]),
                            _: 1
                          },
                          8,
                          ['onRefresh']
                        )
                      ]),
                      _: 1
                    }
                  ),
                  e(
                    $,
                    { header: '不良原因 Pareto 分析', shadow: 'never', style: { 'margin-top': '16px' } },
                    {
                      default: a(() => [m('div', { ref_key: 'paretoChartRef', ref: z, style: { width: '100%', height: '400px' } }, null, 512)]),
                      _: 1
                    }
                  )
                ])
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  et = Re(Le, [['__scopeId', 'data-v-7d71322b']])
export { et as default }
