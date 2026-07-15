import {
  An as A,
  B as te,
  Bn as i,
  Cn as ae,
  Kn as oe,
  On as c,
  Rn as le,
  Xn as x,
  Yn as ne,
  an as h,
  dn as f,
  in as e,
  it as re,
  on as V,
  pn as se,
  rn as L,
  rr as S,
  sn as M,
  sr as l,
  tn as k,
  tt as ie,
  un as b,
  xn as de
} from './element-plus-CzL7BOKu.js'
import { I as ue } from './index-DqMfCNbk.js'
import { t as me } from './echarts-BZg-173N.js'
import { t as ce } from './useTable-Hzr4fBAy.js'
import { t as q } from './StatusTag-DWd3m1xj.js'
import { t as pe } from './CrudPage-7Q0FEhS_.js'
import { t as ve } from './CrudRowActions-Dmc4i_Io.js'
var Ce = { class: 'cost-context' },
  ge = { class: 'cost-context__item' },
  Se = { class: 'cost-context__item' },
  be = { class: 'cost-context__item' },
  ye = { class: 'cost-context__item' },
  he = { key: 0, class: 'detail-shell' },
  fe = { class: 'detail-hero' },
  _e = { class: 'detail-title' },
  Oe = { class: 'detail-subtitle' },
  we = { class: 'detail-grid' },
  Ne = { class: 'detail-card' },
  Ee = { class: 'detail-item' },
  xe = { class: 'detail-item' },
  Le = { class: 'detail-item' },
  Me = { class: 'detail-item' },
  Be = { class: 'detail-card' },
  Te = { class: 'detail-item' },
  Re = { class: 'detail-item' },
  Ie = { class: 'detail-item' },
  Ae = { class: 'detail-item' },
  Ve = { class: 'detail-card' },
  ke = { class: 'detail-item' },
  qe = { class: 'detail-item' },
  We = { class: 'detail-item' },
  Fe = { class: 'detail-tags' },
  Ue = { class: 'detail-card' },
  Ye = { class: 'detail-tags' },
  Pe = { class: 'detail-description' },
  ze = se({
    __name: 'index',
    setup(De) {
      const _ = [
          {
            id: 'BOM-MB-2101',
            materialCode: 'FG-ASSY-2101',
            materialName: '供液控制总成',
            bomType: 'MBOM',
            version: 'V1.2',
            routeBinding: 'RT-2101-V2.0',
            changeOrder: 'ECN-202607-001'
          },
          {
            id: 'BOM-EB-1002',
            materialCode: 'FG-ASSY-2101',
            materialName: '供液控制总成',
            bomType: 'EBOM',
            version: 'V2.4',
            routeBinding: 'RT-2101-V2.1',
            changeOrder: 'ECN-202607-004'
          }
        ],
        W = {
          'BOM-MB-2101': {
            engineering: [
              {
                id: 'COST-001',
                levelLabel: 'L1 子装配',
                componentCode: 'SUB-ASSY-001',
                componentName: '密封组件',
                quantity: 1,
                costSource: 'mixed',
                materialCost: 1260,
                laborCost: 180,
                overheadCost: 64,
                totalCost: 1504,
                replacementStrategy: '沿用当前密封组件方案',
                changeOrder: 'ECN-202607-001',
                routeImpacts: ['主装工位', '扭矩确认'],
                downstreamConsumers: ['MES 报工', 'QMS 首件检验'],
                impactSummary: '该子装配同时受材料替代与装配工时影响，是版本测算中的主要成本驱动项。'
              },
              {
                id: 'COST-002',
                levelLabel: 'L2 采购件',
                componentCode: 'RM-FAST-021',
                componentName: '不锈钢卡箍',
                quantity: 2,
                costSource: 'material',
                materialCost: 96,
                laborCost: 0,
                overheadCost: 0,
                totalCost: 96,
                replacementStrategy: '首批按标准件池采购',
                changeOrder: 'ECN-202607-001',
                routeImpacts: ['来料检验'],
                downstreamConsumers: ['WMS 领料', 'QMS 来料检验'],
                impactSummary: '新增标准件对材料成本敏感，主要影响采购与来料检验口径。'
              },
              {
                id: 'COST-003',
                levelLabel: 'L1 委外件',
                componentCode: 'RM-SRV-003',
                componentName: '热处理套筒',
                quantity: 1,
                costSource: 'route',
                materialCost: 210,
                laborCost: 72,
                overheadCost: 28,
                totalCost: 310,
                replacementStrategy: '沿用委外协同方案',
                changeOrder: 'ECN-202607-001',
                routeImpacts: ['委外协同', '回厂复验'],
                downstreamConsumers: ['MES 委外任务', 'QMS 回厂检验'],
                impactSummary: '委外件成本由外协工时和回厂复验共同拉动。'
              },
              {
                id: 'COST-004',
                levelLabel: '汇总',
                componentCode: 'FG-ASSY-2101',
                componentName: '供液控制总成',
                quantity: 1,
                costSource: 'summary',
                materialCost: 3520,
                laborCost: 820,
                overheadCost: 246,
                totalCost: 4586,
                replacementStrategy: '汇总结构成本估算',
                changeOrder: 'ECN-202607-001',
                routeImpacts: ['路线版本冻结'],
                downstreamConsumers: ['ECN 评估', '版本切换'],
                impactSummary: '当前 MBOM 版本估算结果可用于工程评审与版本切换前的成本预判。'
              }
            ],
            manufacturing: [
              {
                id: 'COST-005',
                levelLabel: 'L1 子装配',
                componentCode: 'SUB-ASSY-001',
                componentName: '密封组件',
                quantity: 1,
                costSource: 'mixed',
                materialCost: 1310,
                laborCost: 210,
                overheadCost: 76,
                totalCost: 1596,
                replacementStrategy: '按制造节拍重估',
                changeOrder: 'ECN-202607-001',
                routeImpacts: ['节拍修正', '工时学习'],
                downstreamConsumers: ['MES 派工', 'ERP 成本接口'],
                impactSummary: '制造视角进一步考虑节拍与现场损耗，成本略高于工程估算。'
              },
              {
                id: 'COST-006',
                levelLabel: 'L2 采购件',
                componentCode: 'RM-FAST-021',
                componentName: '不锈钢卡箍',
                quantity: 2,
                costSource: 'material',
                materialCost: 104,
                laborCost: 0,
                overheadCost: 0,
                totalCost: 104,
                replacementStrategy: '按制造批量采购均价',
                changeOrder: 'ECN-202607-001',
                routeImpacts: ['批量采购'],
                downstreamConsumers: ['WMS 领料'],
                impactSummary: '制造视角按批量采购均价重新估算材料成本。'
              },
              {
                id: 'COST-007',
                levelLabel: '汇总',
                componentCode: 'FG-ASSY-2101',
                componentName: '供液控制总成',
                quantity: 1,
                costSource: 'summary',
                materialCost: 3648,
                laborCost: 908,
                overheadCost: 284,
                totalCost: 4840,
                replacementStrategy: '制造估算汇总',
                changeOrder: 'ECN-202607-001',
                routeImpacts: ['制造节拍', '现场损耗'],
                downstreamConsumers: ['ERP 成本接口', '工单定额'],
                impactSummary: '制造估算用于判断现场执行阶段的成本波动风险。'
              }
            ]
          },
          'BOM-EB-1002': {
            engineering: [
              {
                id: 'COST-008',
                levelLabel: 'L1 子装配',
                componentCode: 'SUB-ASSY-001',
                componentName: '密封组件',
                quantity: 1,
                costSource: 'mixed',
                materialCost: 1388,
                laborCost: 186,
                overheadCost: 66,
                totalCost: 1640,
                replacementStrategy: '新密封结构切换',
                changeOrder: 'ECN-202607-004',
                routeImpacts: ['扭矩参数更新', '首件确认'],
                downstreamConsumers: ['ECN 影响分析', 'QMS 首件检验'],
                impactSummary: '新密封结构是 EBOM V2.4 版本的主要增量成本来源。'
              },
              {
                id: 'COST-009',
                levelLabel: 'L2 采购件',
                componentCode: 'RM-SEAL-021',
                componentName: '高性能密封圈',
                quantity: 2,
                costSource: 'material',
                materialCost: 168,
                laborCost: 0,
                overheadCost: 0,
                totalCost: 168,
                replacementStrategy: '替代旧版密封圈',
                changeOrder: 'ECN-202607-004',
                routeImpacts: ['来料检验更新'],
                downstreamConsumers: ['WMS 齐套', 'QMS 来料检验'],
                impactSummary: '替代件抬升材料成本，但同步降低后续返修风险。'
              },
              {
                id: 'COST-010',
                levelLabel: '汇总',
                componentCode: 'FG-ASSY-2101',
                componentName: '供液控制总成',
                quantity: 1,
                costSource: 'summary',
                materialCost: 3716,
                laborCost: 838,
                overheadCost: 252,
                totalCost: 4806,
                replacementStrategy: 'EBOM 工程估算汇总',
                changeOrder: 'ECN-202607-004',
                routeImpacts: ['版本评审', '成本评估'],
                downstreamConsumers: ['ECN 审批', '版本切换评估'],
                impactSummary: 'EBOM 估算用于版本评审阶段判断变更收益与成本压力。'
              }
            ],
            manufacturing: [
              {
                id: 'COST-011',
                levelLabel: 'L1 子装配',
                componentCode: 'SUB-ASSY-001',
                componentName: '密封组件',
                quantity: 1,
                costSource: 'mixed',
                materialCost: 1432,
                laborCost: 224,
                overheadCost: 84,
                totalCost: 1740,
                replacementStrategy: '按制造节拍模拟切换',
                changeOrder: 'ECN-202607-004',
                routeImpacts: ['节拍变化', '工装切换'],
                downstreamConsumers: ['MES 派工', 'ERP 成本接口'],
                impactSummary: '制造视角会把现场切换和工装准备成本纳入估算。'
              },
              {
                id: 'COST-012',
                levelLabel: '汇总',
                componentCode: 'FG-ASSY-2101',
                componentName: '供液控制总成',
                quantity: 1,
                costSource: 'summary',
                materialCost: 3842,
                laborCost: 926,
                overheadCost: 306,
                totalCost: 5074,
                replacementStrategy: 'EBOM 制造估算汇总',
                changeOrder: 'ECN-202607-004',
                routeImpacts: ['现场切换', '节拍修正'],
                downstreamConsumers: ['工单定额', 'ERP 成本接口'],
                impactSummary: '制造估算更适合评估切换后工单执行成本与定额影响。'
              }
            ]
          }
        },
        v = [
          { value: 'material', label: '物料主导', type: 'primary' },
          { value: 'route', label: '工艺主导', type: 'warning' },
          { value: 'mixed', label: '结构+工艺', type: 'success' },
          { value: 'summary', label: '汇总', type: 'info' }
        ],
        B = [
          { label: '工程估算', value: 'engineering' },
          { label: '制造估算', value: 'manufacturing' }
        ],
        F = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '组件编码 / 组件名称 / 变更单号' } },
          {
            type: 'select-v2',
            label: 'BOM 版本',
            field: 'contextId',
            props: { options: _.map((o) => ({ label: `${o.materialCode} / ${o.bomType} ${o.version}`, value: o.id })) }
          },
          { type: 'select-v2', label: '估算口径', field: 'valuationView', props: { options: B } },
          {
            type: 'select-v2',
            label: '成本来源',
            field: 'costSource',
            props: { options: [{ label: '全部', value: '' }, ...v.map((o) => ({ label: o.label, value: o.value }))] }
          }
        ],
        U = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 } },
        Y = [
          { prop: 'levelLabel', label: '层级', minWidth: 100, align: 'center' },
          { prop: 'componentCode', label: '组件编码', minWidth: 140 },
          { prop: 'componentName', label: '组件名称', minWidth: 170 },
          { prop: 'quantity', label: '用量', minWidth: 80, align: 'center' },
          { label: '成本来源', minWidth: 110, align: 'center', slotName: 'costSource' },
          { label: '材料成本', minWidth: 120, align: 'right', slotName: 'materialCost' },
          { label: '人工成本', minWidth: 120, align: 'right', slotName: 'laborCost' },
          { label: '制造费用', minWidth: 120, align: 'right', slotName: 'overheadCost' },
          { label: '估算合计', minWidth: 120, align: 'right', slotName: 'totalCost' },
          { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
        ],
        P = [{ key: 'export', label: '导出估算', tone: 'default' }],
        z = [{ key: 'detail', label: '查看详情', tone: 'primary' }]
      let r = ne({ keyword: '', contextId: 'BOM-MB-2101', valuationView: 'engineering', costSource: '' })
      const O = x(!1),
        n = x(null),
        w = x()
      let C = null
      const d = L(() => _.find((o) => o.id === r.contextId) || _[0]),
        y = L(() =>
          (W[r.contextId]?.[r.valuationView] || []).filter((o) => {
            const t = r.keyword.trim().toLowerCase(),
              u =
                !t ||
                o.componentCode.toLowerCase().includes(t) ||
                o.componentName.toLowerCase().includes(t) ||
                o.changeOrder.toLowerCase().includes(t),
              m = !r.costSource || o.costSource === r.costSource
            return u && m
          })
        ),
        p = L(() => y.value.find((o) => o.costSource === 'summary') || null),
        {
          tableData: D,
          pagination: G,
          loading: $,
          search: T,
          refresh: j
        } = ce({
          rowKey: 'id',
          listAPI: async ({ page: o, size: t }) => {
            const u = (o - 1) * t,
              m = u + t
            return { list: y.value.slice(u, m), total: y.value.length }
          }
        })
      function s(o) {
        return o ? o.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
      }
      function R(o, t) {
        return o.find((u) => u.value === t)?.label || t || '-'
      }
      function I(o) {
        return B.find((t) => t.value === o)?.label || o
      }
      function Q() {
        !w.value ||
          !p.value ||
          (C?.dispose(),
          (C = me(w.value)),
          C.setOption({
            title: { text: '成本构成分析', left: 'center', textStyle: { fontSize: 16, fontWeight: 600 } },
            tooltip: { trigger: 'item', formatter: '{b}: {c} 元 ({d}%)' },
            legend: { orient: 'vertical', left: 'left', top: 'middle' },
            series: [
              {
                name: '成本构成',
                type: 'pie',
                radius: ['42%', '72%'],
                center: ['58%', '52%'],
                label: {
                  formatter: `{b}
{c} 元`
                },
                data: [
                  { value: p.value.materialCost, name: '材料成本' },
                  { value: p.value.laborCost, name: '人工成本' },
                  { value: p.value.overheadCost, name: '制造费用' }
                ]
              }
            ]
          }),
          window.removeEventListener('resize', N),
          window.addEventListener('resize', N))
      }
      function N() {
        C?.resize()
      }
      ;(le(p, () => {
        de(() => Q())
      }),
        ae(() => {
          ;(window.removeEventListener('resize', N), C?.dispose())
        }))
      function K() {
        T()
      }
      function X() {
        ;(Object.assign(r, { keyword: '', contextId: 'BOM-MB-2101', valuationView: 'engineering', costSource: '' }), T())
      }
      function H() {
        j()
      }
      function J() {
        const o = y.value
        if (!o.length) return
        const t = [
            ['层级', '组件编码', '组件名称', '用量', '成本来源', '材料成本', '人工成本', '制造费用', '估算合计', '变更单'],
            ...o.map((a) => [
              a.levelLabel,
              a.componentCode,
              a.componentName,
              a.quantity,
              R(v, a.costSource),
              s(a.materialCost),
              s(a.laborCost),
              s(a.overheadCost),
              s(a.totalCost),
              a.changeOrder
            ])
          ].map((a) => a.map((E) => `"${E}"`).join(',')).join(`
`),
          u = new Blob(['\uFEFF' + t], { type: 'text/csv;charset=utf-8' }),
          m = URL.createObjectURL(u),
          g = document.createElement('a')
        ;((g.href = m),
          (g.download = `结构成本估算_${d.value.bomType}_${d.value.version}_${I(r.valuationView)}.csv`),
          g.click(),
          URL.revokeObjectURL(m))
      }
      function Z(o) {
        o === 'export' && J()
      }
      function ee(o, t) {
        o === 'detail' && ((n.value = { ...t, routeImpacts: [...t.routeImpacts], downstreamConsumers: [...t.downstreamConsumers] }), (O.value = !0))
      }
      return (o, t) => {
        const u = ie,
          m = re,
          g = te
        return (
          c(),
          h(
            pe,
            {
              'search-model': S(r),
              'onUpdate:searchModel': t[1] || (t[1] = (a) => (oe(r) ? (r.value = a) : (r = a))),
              title: '结构成本估算',
              'search-columns': F,
              'search-grid-item-props': U,
              columns: Y,
              data: S(D),
              pagination: S(G),
              loading: S($),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              'show-add-button': !1,
              'toolbar-actions': P,
              onSearch: K,
              onReset: X,
              onRefresh: H,
              onToolbarAction: Z
            },
            {
              beforeTable: i(() => [
                e('div', Ce, [
                  e('div', ge, [
                    t[2] || (t[2] = e('span', null, '估算对象', -1)),
                    e('strong', null, l(d.value.materialCode) + ' / ' + l(d.value.materialName), 1)
                  ]),
                  e('div', Se, [
                    t[3] || (t[3] = e('span', null, '估算版本', -1)),
                    e('strong', null, l(d.value.bomType) + ' ' + l(d.value.version), 1)
                  ]),
                  e('div', be, [t[4] || (t[4] = e('span', null, '工艺路线', -1)), e('strong', null, l(d.value.routeBinding), 1)]),
                  e('div', ye, [t[5] || (t[5] = e('span', null, '变更来源', -1)), e('strong', null, l(d.value.changeOrder), 1)])
                ]),
                p.value
                  ? (c(),
                    h(
                      u,
                      { key: 0, class: 'chart-card', header: '成本构成分析', shadow: 'never' },
                      { default: i(() => [e('div', { ref_key: 'pieChartRef', ref: w, class: 'chart-card__canvas' }, null, 512)]), _: 1 }
                    ))
                  : V('', !0)
              ]),
              costSource: i(({ row: a }) => [f(q, { value: a.costSource, options: v }, null, 8, ['value'])]),
              materialCost: i(({ row: a }) => [b(l(s(a.materialCost)), 1)]),
              laborCost: i(({ row: a }) => [b(l(s(a.laborCost)), 1)]),
              overheadCost: i(({ row: a }) => [b(l(s(a.overheadCost)), 1)]),
              totalCost: i(({ row: a }) => [e('strong', null, l(s(a.totalCost)), 1)]),
              actions: i(({ row: a }) => [f(ve, { actions: z, onAction: (E) => ee(E, a) }, null, 8, ['onAction'])]),
              dialog: i(() => [
                f(
                  g,
                  { modelValue: O.value, 'onUpdate:modelValue': t[0] || (t[0] = (a) => (O.value = a)), title: '成本明细详情', size: '760px' },
                  {
                    default: i(() => [
                      n.value
                        ? (c(),
                          M('div', he, [
                            e('div', fe, [
                              e('div', null, [
                                e('div', _e, l(n.value.componentName), 1),
                                e('div', Oe, l(n.value.componentCode) + ' · ' + l(n.value.levelLabel), 1)
                              ]),
                              f(q, { value: n.value.costSource, options: v }, null, 8, ['value'])
                            ]),
                            e('div', we, [
                              e('section', Ne, [
                                t[10] || (t[10] = e('div', { class: 'detail-card__title' }, '基础信息', -1)),
                                e('div', Ee, [t[6] || (t[6] = e('span', null, '单位用量', -1)), e('strong', null, l(n.value.quantity), 1)]),
                                e('div', xe, [t[7] || (t[7] = e('span', null, '成本来源', -1)), e('strong', null, l(R(v, n.value.costSource)), 1)]),
                                e('div', Le, [
                                  t[8] || (t[8] = e('span', null, '替代策略', -1)),
                                  e('strong', null, l(n.value.replacementStrategy), 1)
                                ]),
                                e('div', Me, [t[9] || (t[9] = e('span', null, '变更单', -1)), e('strong', null, l(n.value.changeOrder), 1)])
                              ]),
                              e('section', Be, [
                                t[15] || (t[15] = e('div', { class: 'detail-card__title' }, '成本拆分', -1)),
                                e('div', Te, [t[11] || (t[11] = e('span', null, '材料成本', -1)), e('strong', null, l(s(n.value.materialCost)), 1)]),
                                e('div', Re, [t[12] || (t[12] = e('span', null, '人工成本', -1)), e('strong', null, l(s(n.value.laborCost)), 1)]),
                                e('div', Ie, [t[13] || (t[13] = e('span', null, '制造费用', -1)), e('strong', null, l(s(n.value.overheadCost)), 1)]),
                                e('div', Ae, [t[14] || (t[14] = e('span', null, '估算合计', -1)), e('strong', null, l(s(n.value.totalCost)), 1)])
                              ]),
                              e('section', Ve, [
                                t[19] || (t[19] = e('div', { class: 'detail-card__title' }, '版本与路线影响', -1)),
                                e('div', ke, [
                                  t[16] || (t[16] = e('span', null, 'BOM 版本', -1)),
                                  e('strong', null, l(d.value.bomType) + ' ' + l(d.value.version), 1)
                                ]),
                                e('div', qe, [t[17] || (t[17] = e('span', null, '工艺路线', -1)), e('strong', null, l(d.value.routeBinding), 1)]),
                                e('div', We, [t[18] || (t[18] = e('span', null, '估算口径', -1)), e('strong', null, l(I(S(r).valuationView)), 1)]),
                                e('div', Fe, [
                                  (c(!0),
                                  M(
                                    k,
                                    null,
                                    A(
                                      n.value.routeImpacts,
                                      (a) => (
                                        c(),
                                        h(m, { key: a, type: 'success', effect: 'light', round: '' }, { default: i(() => [b(l(a), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ])
                              ]),
                              e('section', Ue, [
                                t[20] || (t[20] = e('div', { class: 'detail-card__title' }, '下游消费影响', -1)),
                                e('div', Ye, [
                                  (c(!0),
                                  M(
                                    k,
                                    null,
                                    A(
                                      n.value.downstreamConsumers,
                                      (a) => (
                                        c(),
                                        h(m, { key: a, type: 'warning', effect: 'light', round: '' }, { default: i(() => [b(l(a), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ]),
                                e('p', Pe, l(n.value.impactSummary), 1)
                              ])
                            ])
                          ]))
                        : V('', !0)
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
            ['search-model', 'data', 'pagination', 'loading']
          )
        )
      }
    }
  }),
  Je = ue(ze, [['__scopeId', 'data-v-fdcc3f01']])
export { Je as default }
