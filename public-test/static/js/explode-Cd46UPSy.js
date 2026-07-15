import {
  An as V,
  B as H,
  Bn as i,
  Kn as J,
  On as d,
  Q as ee,
  Xn as T,
  Yn as te,
  Z as ae,
  an as N,
  dn as p,
  in as t,
  it as le,
  on as c,
  pn as ne,
  rn as B,
  rr as _,
  sn as m,
  sr as r,
  tn as w,
  un as g
} from './element-plus-CzL7BOKu.js'
import { I as oe } from './index-DqMfCNbk.js'
import { t as re } from './useTable-Hzr4fBAy.js'
import { t as E } from './StatusTag-DWd3m1xj.js'
import { t as se } from './CrudPage-7Q0FEhS_.js'
import { t as ie } from './CrudRowActions-Dmc4i_Io.js'
var de = { class: 'analysis-switch' },
  ue = { key: 0, class: 'detail-shell' },
  pe = { class: 'detail-hero' },
  me = { class: 'detail-title' },
  ce = { class: 'detail-subtitle' },
  ve = { class: 'detail-grid' },
  ye = { class: 'detail-card' },
  ge = { key: 0, class: 'detail-item' },
  fe = { key: 1, class: 'detail-item' },
  Be = { key: 2, class: 'detail-item' },
  _e = { key: 3, class: 'detail-item' },
  he = { key: 4, class: 'detail-item' },
  be = { class: 'detail-item' },
  Me = { class: 'detail-card' },
  Se = { class: 'detail-item' },
  Ce = { class: 'detail-item' },
  Te = { class: 'detail-item' },
  Ne = { key: 0, class: 'detail-item' },
  Ee = { class: 'detail-card' },
  Oe = { class: 'detail-tags' },
  xe = { class: 'detail-description' },
  Ve = { class: 'detail-card' },
  we = { class: 'detail-tags' },
  Re = ne({
    __name: 'index',
    setup(Ie) {
      const h = [
          {
            id: 'BOM-EB-1002',
            materialCode: 'FG-ASSY-2101',
            materialName: '供液控制总成',
            bomType: 'EBOM',
            version: 'V2.4',
            routeBinding: 'RT-2101-V2.1',
            changeOrder: 'ECN-202607-004'
          },
          {
            id: 'BOM-MB-2101',
            materialCode: 'FG-ASSY-2101',
            materialName: '供液控制总成',
            bomType: 'MBOM',
            version: 'V1.2',
            routeBinding: 'RT-2101-V2.0',
            changeOrder: 'ECN-202607-001'
          }
        ],
        R = {
          'BOM-EB-1002': [
            {
              id: 'EXP-001',
              level: 0,
              componentCode: 'FG-ASSY-2101',
              componentName: '供液控制总成',
              nodeType: '成品总成',
              supplyMode: 'manufacture',
              unitQty: '1',
              demandQty: '12',
              routeBinding: 'RT-2101-V2.1',
              replacementStrategy: '总成版本切换',
              changeOrder: 'ECN-202607-004',
              impactSummary: '作为顶层总成节点，决定下游领料、装配与首件切换的统一口径。',
              inventoryImpacts: ['在制工单 2 张', '待切换库存 86 件'],
              consumedBy: ['MES 工单', 'WMS 领料', 'QMS 首件确认']
            },
            {
              id: 'EXP-002',
              level: 1,
              componentCode: 'SUB-ASSY-001',
              componentName: '密封组件',
              nodeType: '自制子装配',
              supplyMode: 'manufacture',
              unitQty: '1',
              demandQty: '12',
              routeBinding: 'RT-2101-V2.1',
              replacementStrategy: '替换旧密封件组合',
              changeOrder: 'ECN-202607-004',
              impactSummary: '该节点变化会同步影响工艺路线扭矩确认和联调前质检关卡。',
              inventoryImpacts: ['旧组件收口', '首件样机复验'],
              consumedBy: ['工艺路线', '工序定义', 'ECN 影响分析']
            },
            {
              id: 'EXP-003',
              level: 2,
              componentCode: 'RM-FAST-021',
              componentName: '不锈钢卡箍',
              nodeType: '采购件',
              supplyMode: 'purchase',
              unitQty: '2',
              demandQty: '24',
              routeBinding: 'RT-2101-V2.1',
              replacementStrategy: '新增标准件，进入首批切换池',
              changeOrder: 'ECN-202607-004',
              impactSummary: '新增采购件后需要同步新增领料与来料检验口径。',
              inventoryImpacts: ['新增安全库存', '补充来料检验'],
              consumedBy: ['WMS 领料', 'QMS 来料检验']
            },
            {
              id: 'EXP-004',
              level: 2,
              componentCode: 'RM-SRV-003',
              componentName: '热处理套筒',
              nodeType: '委外件',
              supplyMode: 'outsource',
              unitQty: '1',
              demandQty: '12',
              routeBinding: 'RT-2101-V2.1',
              replacementStrategy: '沿用委外协同标准',
              changeOrder: 'ECN-202607-004',
              impactSummary: '委外件节点用于约束回厂复验和批次追溯深度。',
              inventoryImpacts: ['回厂复验', '批次追溯'],
              consumedBy: ['MES 委外任务', 'QMS 回厂检验']
            }
          ],
          'BOM-MB-2101': [
            {
              id: 'EXP-005',
              level: 0,
              componentCode: 'FG-ASSY-2101',
              componentName: '供液控制总成',
              nodeType: '制造总成',
              supplyMode: 'manufacture',
              unitQty: '1',
              demandQty: '8',
              routeBinding: 'RT-2101-V2.0',
              replacementStrategy: '按制造投料口径执行',
              changeOrder: 'ECN-202607-001',
              impactSummary: 'MBOM 结构用于驱动工单派工和现场领料真相。',
              inventoryImpacts: ['工单投料', '完工收口'],
              consumedBy: ['MES 工单', 'WMS 倒冲']
            }
          ]
        },
        I = {
          'BOM-EB-1002': [
            {
              id: 'REF-001',
              parentCode: 'FG-LINE-9001',
              parentName: '供液总装单元',
              referenceBomType: 'EBOM',
              referenceVersion: 'V1.4',
              referenceQty: '1',
              effectiveStatus: 'active',
              routeBinding: 'RT-LINE-9001-V1.2',
              replacementStrategy: '随总装单元版本同步消费',
              changeOrder: 'ECN-202607-004',
              impactSummary: '父项总装单元仍引用该总成，需要同步评估整机交付切换窗口。',
              inventoryImpacts: ['整机在制 1 套', '交付窗口确认'],
              consumedBy: ['整机装配', '交付齐套']
            },
            {
              id: 'REF-002',
              parentCode: 'FG-MOD-5008',
              parentName: '注液功能模组',
              referenceBomType: 'MBOM',
              referenceVersion: 'V2.0',
              referenceQty: '2',
              effectiveStatus: 'pending',
              routeBinding: 'RT-MOD-5008-V2.0',
              replacementStrategy: '待 ECN 放行后切换',
              changeOrder: 'ECN-202607-004',
              impactSummary: '下游模组正在等待变更放行，引用版本仍需现场验证。',
              inventoryImpacts: ['待切换工单', '首件验证'],
              consumedBy: ['模组装配', '现场切换']
            }
          ],
          'BOM-MB-2101': [
            {
              id: 'REF-003',
              parentCode: 'WO-202607-021',
              parentName: '供液控制总成工单',
              referenceBomType: '工单投料',
              referenceVersion: '批次 A',
              referenceQty: '8',
              effectiveStatus: 'active',
              routeBinding: 'RT-2101-V2.0',
              replacementStrategy: '按工单冻结版本执行',
              changeOrder: 'ECN-202607-001',
              impactSummary: '该 MBOM 直接被在制工单引用，是现场领料与倒冲的依据。',
              inventoryImpacts: ['冻结投料', '完工倒冲'],
              consumedBy: ['领料执行', '完工入库']
            }
          ]
        },
        b = [
          { value: 'purchase', label: '采购', type: 'primary' },
          { value: 'manufacture', label: '自制', type: 'success' },
          { value: 'outsource', label: '委外', type: 'warning' }
        ],
        M = [
          { value: 'active', label: '已生效', type: 'success' },
          { value: 'pending', label: '待切换', type: 'warning' },
          { value: 'archived', label: '已归档', type: 'info' }
        ],
        Q = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码 / 物料名称 / 变更单号' } },
          {
            type: 'select-v2',
            label: 'BOM 版本',
            field: 'versionId',
            props: { options: h.map((l) => ({ label: `${l.materialCode} / ${l.bomType} ${l.version}`, value: l.id })) }
          },
          {
            type: 'select-v2',
            label: '节点筛选',
            field: 'nodeType',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: '成品总成', value: '成品总成' },
                { label: '制造总成', value: '制造总成' },
                { label: '自制子装配', value: '自制子装配' },
                { label: '采购件', value: '采购件' },
                { label: '委外件', value: '委外件' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '供给方式',
            field: 'supplyMode',
            props: { options: [{ label: '全部', value: '' }, ...b.map((l) => ({ label: l.label, value: l.value }))] }
          }
        ],
        W = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 } },
        k = [
          { prop: 'level', label: '层级', minWidth: 70, align: 'center' },
          { prop: 'componentCode', label: '组件编码', minWidth: 140 },
          { prop: 'componentName', label: '组件名称', minWidth: 180 },
          { label: '节点类型', minWidth: 120, align: 'center', slotName: 'nodeType' },
          { label: '供给方式', minWidth: 100, align: 'center', slotName: 'supplyMode' },
          { prop: 'unitQty', label: '单位用量', minWidth: 100, align: 'center' },
          { prop: 'demandQty', label: '需求总量', minWidth: 100, align: 'center' },
          { prop: 'routeBinding', label: '关联路线', minWidth: 150 },
          { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
        ],
        A = [
          { prop: 'parentCode', label: '父项编码', minWidth: 140 },
          { prop: 'parentName', label: '父项名称', minWidth: 180 },
          { prop: 'referenceBomType', label: '引用类型', minWidth: 110, align: 'center' },
          { prop: 'referenceVersion', label: '引用版本', minWidth: 110, align: 'center' },
          { prop: 'referenceQty', label: '引用数量', minWidth: 100, align: 'center' },
          { label: '生效状态', minWidth: 100, align: 'center', slotName: 'effectiveStatus' },
          { prop: 'routeBinding', label: '关联路线', minWidth: 150 },
          { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
        ],
        F = [{ key: 'detail', label: '查看详情', tone: 'primary' }]
      let s = te({ keyword: '', versionId: 'BOM-EB-1002', nodeType: '', supplyMode: '' })
      const o = T('explode'),
        f = T(!1),
        a = T(null),
        O = B(() => h.find((l) => l.id === s.versionId) || h[0]),
        U = B(() => `${O.value.bomType} ${O.value.version}`),
        x = B(() =>
          (o.value === 'explode' ? R[s.versionId] || [] : I[s.versionId] || []).filter((l) => {
            const e = s.keyword.trim().toLowerCase(),
              u = [l.componentCode, l.componentName, l.parentCode, l.parentName, l.changeOrder].filter(Boolean).map((n) => String(n).toLowerCase()),
              v = !e || u.some((n) => n.includes(e)),
              y = o.value !== 'explode' || !s.nodeType || l.nodeType === s.nodeType,
              C = o.value !== 'explode' || !s.supplyMode || l.supplyMode === s.supplyMode
            return v && y && C
          })
        ),
        P = B(() => (o.value === 'explode' ? k : A)),
        {
          tableData: D,
          pagination: G,
          loading: L,
          search: S,
          refresh: $
        } = re({
          rowKey: 'id',
          listAPI: async ({ page: l, size: e }) => {
            const u = (l - 1) * e,
              v = u + e
            return { list: x.value.slice(u, v), total: x.value.length }
          }
        })
      function X(l, e) {
        return l.find((u) => u.value === e)?.label || e || '-'
      }
      function Y() {
        S()
      }
      function K() {
        ;(Object.assign(s, { keyword: '', versionId: 'BOM-EB-1002', nodeType: '', supplyMode: '' }), (o.value = 'explode'), S())
      }
      function j() {
        $()
      }
      function q() {
        ;((f.value = !1), (a.value = null), S())
      }
      function Z(l, e) {
        l === 'detail' && ((a.value = { ...e, inventoryImpacts: [...e.inventoryImpacts], consumedBy: [...e.consumedBy] }), (f.value = !0))
      }
      return (l, e) => {
        const u = ae,
          v = ee,
          y = le,
          C = H
        return (
          d(),
          N(
            se,
            {
              'search-model': _(s),
              'onUpdate:searchModel': e[2] || (e[2] = (n) => (J(s) ? (s.value = n) : (s = n))),
              title: '用量展开与反查',
              'search-columns': Q,
              'search-grid-item-props': W,
              columns: P.value,
              data: _(D),
              pagination: _(G),
              loading: _(L),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              'show-add-button': !1,
              onSearch: Y,
              onReset: K,
              onRefresh: j
            },
            {
              beforeTable: i(() => [
                t('div', de, [
                  e[5] || (e[5] = t('span', { class: 'analysis-switch__label' }, '视图模式', -1)),
                  p(
                    v,
                    { modelValue: o.value, 'onUpdate:modelValue': e[0] || (e[0] = (n) => (o.value = n)), onChange: q },
                    {
                      default: i(() => [
                        p(u, { label: 'explode' }, { default: i(() => [...(e[3] || (e[3] = [g('BOM 展开', -1)]))]), _: 1 }),
                        p(u, { label: 'whereUsed' }, { default: i(() => [...(e[4] || (e[4] = [g('反查引用', -1)]))]), _: 1 })
                      ]),
                      _: 1
                    },
                    8,
                    ['modelValue']
                  )
                ])
              ]),
              nodeType: i(({ row: n }) => [p(y, { effect: 'light', round: '' }, { default: i(() => [g(r(n.nodeType || '-'), 1)]), _: 2 }, 1024)]),
              supplyMode: i(({ row: n }) => [p(E, { value: n.supplyMode, options: b }, null, 8, ['value'])]),
              effectiveStatus: i(({ row: n }) => [p(E, { value: n.effectiveStatus, options: M }, null, 8, ['value'])]),
              actions: i(({ row: n }) => [p(ie, { actions: F, onAction: (z) => Z(z, n) }, null, 8, ['onAction'])]),
              dialog: i(() => [
                p(
                  C,
                  {
                    modelValue: f.value,
                    'onUpdate:modelValue': e[1] || (e[1] = (n) => (f.value = n)),
                    title: o.value === 'explode' ? '结构节点详情' : '引用关系详情',
                    size: '760px'
                  },
                  {
                    default: i(() => [
                      a.value
                        ? (d(),
                          m('div', ue, [
                            t('div', pe, [
                              t('div', null, [
                                t('div', me, r(a.value.componentName || a.value.parentName), 1),
                                t(
                                  'div',
                                  ce,
                                  r(o.value === 'explode' ? a.value.componentCode : a.value.parentCode) +
                                    ' · ' +
                                    r(o.value === 'explode' ? `层级 ${a.value.level}` : `${a.value.referenceBomType} ${a.value.referenceVersion}`),
                                  1
                                )
                              ]),
                              p(
                                E,
                                {
                                  value: o.value === 'explode' ? a.value.supplyMode || 'purchase' : a.value.effectiveStatus || 'active',
                                  options: o.value === 'explode' ? b : M
                                },
                                null,
                                8,
                                ['value', 'options']
                              )
                            ]),
                            t('div', ve, [
                              t('section', ye, [
                                e[12] || (e[12] = t('div', { class: 'detail-card__title' }, '基础信息', -1)),
                                o.value === 'explode'
                                  ? (d(), m('div', ge, [e[6] || (e[6] = t('span', null, '节点类型', -1)), t('strong', null, r(a.value.nodeType), 1)]))
                                  : c('', !0),
                                o.value === 'explode'
                                  ? (d(), m('div', fe, [e[7] || (e[7] = t('span', null, '单位用量', -1)), t('strong', null, r(a.value.unitQty), 1)]))
                                  : c('', !0),
                                o.value === 'explode'
                                  ? (d(),
                                    m('div', Be, [e[8] || (e[8] = t('span', null, '需求总量', -1)), t('strong', null, r(a.value.demandQty), 1)]))
                                  : c('', !0),
                                o.value === 'whereUsed'
                                  ? (d(),
                                    m('div', _e, [e[9] || (e[9] = t('span', null, '父项物料', -1)), t('strong', null, r(a.value.parentCode), 1)]))
                                  : c('', !0),
                                o.value === 'whereUsed'
                                  ? (d(),
                                    m('div', he, [e[10] || (e[10] = t('span', null, '引用数量', -1)), t('strong', null, r(a.value.referenceQty), 1)]))
                                  : c('', !0),
                                t('div', be, [e[11] || (e[11] = t('span', null, '变更单', -1)), t('strong', null, r(a.value.changeOrder), 1)])
                              ]),
                              t('section', Me, [
                                e[17] || (e[17] = t('div', { class: 'detail-card__title' }, '版本与路线', -1)),
                                t('div', Se, [e[13] || (e[13] = t('span', null, 'BOM 版本', -1)), t('strong', null, r(U.value), 1)]),
                                t('div', Ce, [e[14] || (e[14] = t('span', null, '关联路线', -1)), t('strong', null, r(a.value.routeBinding), 1)]),
                                t('div', Te, [
                                  e[15] || (e[15] = t('span', null, '替代策略', -1)),
                                  t('strong', null, r(a.value.replacementStrategy), 1)
                                ]),
                                o.value === 'whereUsed'
                                  ? (d(),
                                    m('div', Ne, [
                                      e[16] || (e[16] = t('span', null, '生效状态', -1)),
                                      t('strong', null, r(X(M, a.value.effectiveStatus || '')), 1)
                                    ]))
                                  : c('', !0)
                              ]),
                              t('section', Ee, [
                                e[18] || (e[18] = t('div', { class: 'detail-card__title' }, '库存与执行影响', -1)),
                                t('div', Oe, [
                                  (d(!0),
                                  m(
                                    w,
                                    null,
                                    V(
                                      a.value.inventoryImpacts,
                                      (n) => (
                                        d(),
                                        N(y, { key: n, type: 'warning', effect: 'light', round: '' }, { default: i(() => [g(r(n), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ]),
                                t('p', xe, r(a.value.impactSummary), 1)
                              ]),
                              t('section', Ve, [
                                e[19] || (e[19] = t('div', { class: 'detail-card__title' }, '消费关系', -1)),
                                t('div', we, [
                                  (d(!0),
                                  m(
                                    w,
                                    null,
                                    V(
                                      a.value.consumedBy,
                                      (n) => (
                                        d(),
                                        N(y, { key: n, type: 'success', effect: 'light', round: '' }, { default: i(() => [g(r(n), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ])
                              ])
                            ])
                          ]))
                        : c('', !0)
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue', 'title']
                )
              ]),
              _: 1
            },
            8,
            ['search-model', 'columns', 'data', 'pagination', 'loading']
          )
        )
      }
    }
  }),
  Pe = oe(Re, [['__scopeId', 'data-v-5d7368cc']])
export { Pe as default }
