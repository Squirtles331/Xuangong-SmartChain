import {
  An as w,
  B as Z,
  Bn as u,
  Kn as ee,
  On as c,
  Xn as S,
  Yn as te,
  an as N,
  dn as g,
  i as f,
  in as t,
  ir as R,
  it as ae,
  on as le,
  pn as ne,
  rn as I,
  rr as h,
  sn as V,
  sr as n,
  tn as D,
  un as A
} from './element-plus-CzL7BOKu.js'
import { I as oe } from './index-DqMfCNbk.js'
import { t as re } from './useTable-Hzr4fBAy.js'
import { t as x } from './StatusTag-DWd3m1xj.js'
import { t as se } from './CrudPage-7Q0FEhS_.js'
import { t as ie } from './CrudRowActions-Dmc4i_Io.js'
var de = { class: 'compare-context' },
  ue = { class: 'compare-context__item' },
  pe = { class: 'compare-context__item' },
  ce = { class: 'compare-context__item' },
  me = { class: 'compare-context__item' },
  ve = { key: 0, class: 'detail-shell' },
  ge = { class: 'detail-hero' },
  ye = { class: 'detail-title' },
  be = { class: 'detail-subtitle' },
  fe = { class: 'detail-grid' },
  he = { class: 'detail-card' },
  _e = { class: 'detail-item' },
  Be = { class: 'detail-item' },
  Oe = { class: 'detail-item' },
  Te = { class: 'detail-item' },
  Ce = { class: 'detail-card' },
  Me = { class: 'detail-item' },
  Se = { class: 'detail-item' },
  Ne = { class: 'detail-item' },
  Ve = { class: 'detail-item' },
  xe = { class: 'detail-item' },
  Le = { class: 'detail-card' },
  Ee = { class: 'detail-item' },
  we = { class: 'detail-item' },
  Re = { class: 'detail-item' },
  Ie = { class: 'detail-tags' },
  De = { class: 'detail-card' },
  Ae = { class: 'detail-tags' },
  Qe = { class: 'detail-description' },
  $e = ne({
    __name: 'index',
    setup(ke) {
      const _ = [
          {
            id: 'BOM-EB-1001',
            materialCode: 'FG-ASSY-2101',
            materialName: '供液控制总成',
            bomType: 'EBOM',
            version: 'V2.3',
            status: '已生效',
            routeBinding: 'RT-2101-V2.0',
            changeOrder: 'ECN-202607-001'
          },
          {
            id: 'BOM-EB-1002',
            materialCode: 'FG-ASSY-2101',
            materialName: '供液控制总成',
            bomType: 'EBOM',
            version: 'V2.4',
            status: '待评审',
            routeBinding: 'RT-2101-V2.1',
            changeOrder: 'ECN-202607-004'
          },
          {
            id: 'BOM-MB-2101',
            materialCode: 'FG-ASSY-2101',
            materialName: '供液控制总成',
            bomType: 'MBOM',
            version: 'V1.2',
            status: '已生效',
            routeBinding: 'RT-2101-V2.0',
            changeOrder: 'ECN-202607-001'
          },
          {
            id: 'BOM-MB-3102',
            materialCode: 'SM-CNC-1001',
            materialName: '壳体粗加工件',
            bomType: 'MBOM',
            version: 'V1.0',
            status: '草稿',
            routeBinding: 'RT-1001-V1.0',
            changeOrder: 'ECN-202607-005'
          }
        ],
        Q = {
          'BOM-EB-1001__BOM-EB-1002': [
            {
              id: 'CMP-001',
              level: 1,
              componentCode: 'SUB-ASSY-001',
              componentName: '密封组件',
              changeType: 'updated',
              supplyMode: '自制',
              baseQty: '1',
              targetQty: '1',
              baseScrap: '1%',
              targetScrap: '0%',
              quantityDelta: 0,
              routeBinding: 'RT-2101-V2.1',
              replacementStrategy: '旧件停用，新件首批切换',
              impactLevel: 'high',
              impactSummary: '影响主装路线扭矩确认与首件验证，需要同步切换工艺参数基线。',
              changeOrder: 'ECN-202607-004',
              affectedObjects: ['MBOM V1.2', 'RT-2101-V2.1', '首件检验模板'],
              executionImpacts: ['在制工单切换', '首件确认', '扭矩参数更新']
            },
            {
              id: 'CMP-002',
              level: 2,
              componentCode: 'RM-FAST-021',
              componentName: '不锈钢卡箍',
              changeType: 'added',
              supplyMode: '采购',
              baseQty: '-',
              targetQty: '2',
              baseScrap: '-',
              targetScrap: '0%',
              quantityDelta: 2,
              routeBinding: 'RT-2101-V2.1',
              replacementStrategy: '新增采购件，首批按替代料池补齐',
              impactLevel: 'medium',
              impactSummary: '新增辅料后需要同步修正领料口径和库存预留策略。',
              changeOrder: 'ECN-202607-004',
              affectedObjects: ['领料口径', '替代料策略'],
              executionImpacts: ['新增领料行', '补充来料检验']
            },
            {
              id: 'CMP-003',
              level: 2,
              componentCode: 'RM-SEAL-017',
              componentName: '密封圈 A17',
              changeType: 'removed',
              supplyMode: '采购',
              baseQty: '2',
              targetQty: '-',
              baseScrap: '2%',
              targetScrap: '-',
              quantityDelta: -2,
              routeBinding: 'RT-2101-V2.0',
              replacementStrategy: '由新密封组件整体替代',
              impactLevel: 'high',
              impactSummary: '旧版库存需收口，现场不得继续按旧结构投料。',
              changeOrder: 'ECN-202607-004',
              affectedObjects: ['旧版库存', '现场投料指引'],
              executionImpacts: ['库存收口', '旧料隔离']
            },
            {
              id: 'CMP-004',
              level: 2,
              componentCode: 'RM-BOLT-016',
              componentName: '六角螺栓 M16×60',
              changeType: 'unchanged',
              supplyMode: '采购',
              baseQty: '8',
              targetQty: '8',
              baseScrap: '1%',
              targetScrap: '1%',
              quantityDelta: 0,
              routeBinding: 'RT-2101-V2.0',
              replacementStrategy: '延续现行标准件口径',
              impactLevel: 'low',
              impactSummary: '结构未变化，可继续沿用现有领料与工艺口径。',
              changeOrder: 'ECN-202607-004',
              affectedObjects: ['标准件池'],
              executionImpacts: ['无需额外动作']
            }
          ],
          'BOM-MB-2101__BOM-MB-3102': [
            {
              id: 'CMP-005',
              level: 1,
              componentCode: 'SM-BODY-1001',
              componentName: '壳体毛坯',
              changeType: 'updated',
              supplyMode: '自制',
              baseQty: '1',
              targetQty: '1',
              baseScrap: '3%',
              targetScrap: '4%',
              quantityDelta: 0,
              routeBinding: 'RT-1001-V1.0',
              replacementStrategy: '机加余量重估',
              impactLevel: 'medium',
              impactSummary: '机加良率口径变化，需要同步更新工时学习样本解释。',
              changeOrder: 'ECN-202607-005',
              affectedObjects: ['工时学习样本', '机加良率模型'],
              executionImpacts: ['调整报废率口径']
            }
          ]
        },
        y = [
          { value: 'added', label: '新增', type: 'success' },
          { value: 'removed', label: '删除', type: 'danger' },
          { value: 'updated', label: '修改', type: 'warning' },
          { value: 'unchanged', label: '无变化', type: 'info' }
        ],
        B = [
          { value: 'low', label: '低', type: 'info' },
          { value: 'medium', label: '中', type: 'warning' },
          { value: 'high', label: '高', type: 'danger' }
        ],
        $ = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '组件编码 / 组件名称 / 变更单号' } },
          {
            type: 'select-v2',
            label: 'BOM 类型',
            field: 'bomType',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: 'EBOM', value: 'EBOM' },
                { label: 'MBOM', value: 'MBOM' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '基线版本',
            field: 'baseVersionId',
            props: { options: _.map((a) => ({ label: `${a.materialCode} / ${a.bomType} ${a.version} / ${a.status}`, value: a.id })) }
          },
          {
            type: 'select-v2',
            label: '目标版本',
            field: 'targetVersionId',
            props: { options: _.map((a) => ({ label: `${a.materialCode} / ${a.bomType} ${a.version} / ${a.status}`, value: a.id })) }
          },
          {
            type: 'select-v2',
            label: '差异类型',
            field: 'changeType',
            props: { options: [{ label: '全部', value: '' }, ...y.map((a) => ({ label: a.label, value: a.value }))] }
          }
        ],
        k = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 } },
        q = [
          { prop: 'level', label: '层级', minWidth: 70, align: 'center' },
          { prop: 'componentCode', label: '组件编码', minWidth: 140 },
          { prop: 'componentName', label: '组件名称', minWidth: 170 },
          { label: '差异类型', minWidth: 100, align: 'center', slotName: 'changeType' },
          { prop: 'baseQty', label: '基线用量', minWidth: 90, align: 'center' },
          { prop: 'targetQty', label: '目标用量', minWidth: 90, align: 'center' },
          { label: '数量变动', minWidth: 100, align: 'center', slotName: 'quantityDelta' },
          { prop: 'routeBinding', label: '关联路线', minWidth: 140 },
          { label: '影响级别', minWidth: 100, align: 'center', slotName: 'impactLevel' },
          { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
        ],
        j = [{ key: 'export', label: '导出差异', tone: 'default' }],
        P = [{ key: 'detail', label: '查看详情', tone: 'primary' }]
      let s = te({ keyword: '', bomType: '', baseVersionId: 'BOM-EB-1001', targetVersionId: 'BOM-EB-1002', changeType: '' })
      const m = S(E(s.baseVersionId, s.targetVersionId)),
        O = S(!1),
        r = S(null),
        d = I(() => {
          const a = p(s.baseVersionId),
            e = p(s.targetVersionId)
          return {
            materialCode: e?.materialCode || a?.materialCode || '-',
            materialName: e?.materialName || a?.materialName || '-',
            baseLabel: a ? `${a.bomType} ${a.version}` : '-',
            targetLabel: e ? `${e.bomType} ${e.version}` : '-',
            changeOrder: e?.changeOrder || a?.changeOrder || '-'
          }
        }),
        b = I(() =>
          m.value.filter((a) => {
            const e = s.keyword.trim().toLowerCase(),
              o =
                !e ||
                a.componentCode.toLowerCase().includes(e) ||
                a.componentName.toLowerCase().includes(e) ||
                a.changeOrder.toLowerCase().includes(e),
              i = p(s.targetVersionId),
              l = !s.bomType || i?.bomType === s.bomType,
              v = !s.changeType || a.changeType === s.changeType
            return o && l && v
          })
        ),
        {
          tableData: W,
          pagination: U,
          loading: F,
          search: L,
          refresh: Y
        } = re({
          rowKey: 'id',
          listAPI: async ({ page: a, size: e }) => {
            const o = (a - 1) * e,
              i = o + e
            return { list: b.value.slice(o, i), total: b.value.length }
          }
        })
      function p(a) {
        return _.find((e) => e.id === a)
      }
      function E(a, e) {
        const o = p(a),
          i = p(e)
        return !o || !i
          ? []
          : o.id === i.id
            ? []
            : o.materialCode !== i.materialCode || o.bomType !== i.bomType
              ? []
              : Q[`${a}__${e}`] || [
                  {
                    id: 'CMP-DEFAULT',
                    level: 1,
                    componentCode: 'BASELINE-KEEP',
                    componentName: '当前版本间无显著结构差异',
                    changeType: 'unchanged',
                    supplyMode: '延续现状',
                    baseQty: '1',
                    targetQty: '1',
                    baseScrap: '0%',
                    targetScrap: '0%',
                    quantityDelta: 0,
                    routeBinding: i.routeBinding,
                    replacementStrategy: '维持现行定义',
                    impactLevel: 'low',
                    impactSummary: '当前对比范围内没有需要额外切换的结构差异。',
                    changeOrder: i.changeOrder,
                    affectedObjects: ['现行版本'],
                    executionImpacts: ['无需额外动作']
                  }
                ]
      }
      function T(a, e) {
        return a.find((o) => o.value === e)?.label || e || '-'
      }
      function C(a) {
        return a > 0 ? `+${a}` : a < 0 ? `${a}` : '0'
      }
      function M(a = !1) {
        const e = p(s.baseVersionId),
          o = p(s.targetVersionId)
        if (!e || !o) {
          m.value = []
          return
        }
        if (e.id === o.id) {
          ;((m.value = []), a && f.warning('请选择两个不同的版本进行比较'))
          return
        }
        if (e.materialCode !== o.materialCode || e.bomType !== o.bomType) {
          ;((m.value = []), a && f.warning('请比较同一产品、同一 BOM 类型下的版本'))
          return
        }
        m.value = E(e.id, o.id)
      }
      function G() {
        ;(M(!0), L())
      }
      function K() {
        ;(Object.assign(s, { keyword: '', bomType: '', baseVersionId: 'BOM-EB-1001', targetVersionId: 'BOM-EB-1002', changeType: '' }), M(), L())
      }
      function z() {
        ;(M(), Y())
      }
      function X() {
        if (!b.value.length) {
          f.warning('当前没有可导出的差异结果')
          return
        }
        const a = [
            ['层级', '组件编码', '组件名称', '差异类型', '基线用量', '目标用量', '数量变动', '关联路线', '影响级别', '变更单'],
            ...b.value.map((l) => [
              l.level,
              l.componentCode,
              l.componentName,
              T(y, l.changeType),
              l.baseQty,
              l.targetQty,
              C(l.quantityDelta),
              l.routeBinding,
              T(B, l.impactLevel),
              l.changeOrder
            ])
          ].map((l) => l.map((v) => `"${v}"`).join(',')).join(`
`),
          e = new Blob(['\uFEFF' + a], { type: 'text/csv;charset=utf-8' }),
          o = URL.createObjectURL(e),
          i = document.createElement('a')
        ;((i.href = o),
          (i.download = `BOM差异_${d.value.baseLabel}_vs_${d.value.targetLabel}.csv`),
          i.click(),
          URL.revokeObjectURL(o),
          f.success('已导出结构差异报告'))
      }
      function H(a) {
        a === 'export' && X()
      }
      function J(a, e) {
        a === 'detail' && ((r.value = { ...e, affectedObjects: [...e.affectedObjects], executionImpacts: [...e.executionImpacts] }), (O.value = !0))
      }
      return (a, e) => {
        const o = ae,
          i = Z
        return (
          c(),
          N(
            se,
            {
              'search-model': h(s),
              'onUpdate:searchModel': e[1] || (e[1] = (l) => (ee(s) ? (s.value = l) : (s = l))),
              title: '结构版本比较',
              'search-columns': $,
              'search-grid-item-props': k,
              columns: q,
              data: h(W),
              pagination: h(U),
              loading: h(F),
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              'show-add-button': !1,
              'toolbar-actions': j,
              onSearch: G,
              onReset: K,
              onRefresh: z,
              onToolbarAction: H
            },
            {
              beforeTable: u(() => [
                t('div', de, [
                  t('div', ue, [
                    e[2] || (e[2] = t('span', null, '对比对象', -1)),
                    t('strong', null, n(d.value.materialCode) + ' / ' + n(d.value.materialName), 1)
                  ]),
                  t('div', pe, [e[3] || (e[3] = t('span', null, '基线版本', -1)), t('strong', null, n(d.value.baseLabel), 1)]),
                  t('div', ce, [e[4] || (e[4] = t('span', null, '目标版本', -1)), t('strong', null, n(d.value.targetLabel), 1)]),
                  t('div', me, [e[5] || (e[5] = t('span', null, '评估来源', -1)), t('strong', null, n(d.value.changeOrder), 1)])
                ])
              ]),
              changeType: u(({ row: l }) => [g(x, { value: l.changeType, options: y }, null, 8, ['value'])]),
              impactLevel: u(({ row: l }) => [g(x, { value: l.impactLevel, options: B }, null, 8, ['value'])]),
              quantityDelta: u(({ row: l }) => [
                t(
                  'span',
                  { class: R(['delta-text', l.quantityDelta > 0 ? 'is-up' : l.quantityDelta < 0 ? 'is-down' : '']) },
                  n(C(l.quantityDelta)),
                  3
                )
              ]),
              actions: u(({ row: l }) => [g(ie, { actions: P, onAction: (v) => J(v, l) }, null, 8, ['onAction'])]),
              dialog: u(() => [
                g(
                  i,
                  { modelValue: O.value, 'onUpdate:modelValue': e[0] || (e[0] = (l) => (O.value = l)), title: '结构差异详情', size: '760px' },
                  {
                    default: u(() => [
                      r.value
                        ? (c(),
                          V('div', ve, [
                            t('div', ge, [
                              t('div', null, [
                                t('div', ye, n(r.value.componentName), 1),
                                t('div', be, n(r.value.componentCode) + ' · 层级 ' + n(r.value.level), 1)
                              ]),
                              g(x, { value: r.value.changeType, options: y }, null, 8, ['value'])
                            ]),
                            t('div', fe, [
                              t('section', he, [
                                e[10] || (e[10] = t('div', { class: 'detail-card__title' }, '差异基础', -1)),
                                t('div', _e, [e[6] || (e[6] = t('span', null, '基线版本', -1)), t('strong', null, n(d.value.baseLabel), 1)]),
                                t('div', Be, [e[7] || (e[7] = t('span', null, '目标版本', -1)), t('strong', null, n(d.value.targetLabel), 1)]),
                                t('div', Oe, [e[8] || (e[8] = t('span', null, '供给方式', -1)), t('strong', null, n(r.value.supplyMode), 1)]),
                                t('div', Te, [e[9] || (e[9] = t('span', null, '变更单', -1)), t('strong', null, n(r.value.changeOrder), 1)])
                              ]),
                              t('section', Ce, [
                                e[16] || (e[16] = t('div', { class: 'detail-card__title' }, '数量与损耗变化', -1)),
                                t('div', Me, [e[11] || (e[11] = t('span', null, '基线用量', -1)), t('strong', null, n(r.value.baseQty), 1)]),
                                t('div', Se, [e[12] || (e[12] = t('span', null, '目标用量', -1)), t('strong', null, n(r.value.targetQty), 1)]),
                                t('div', Ne, [e[13] || (e[13] = t('span', null, '基线损耗', -1)), t('strong', null, n(r.value.baseScrap), 1)]),
                                t('div', Ve, [e[14] || (e[14] = t('span', null, '目标损耗', -1)), t('strong', null, n(r.value.targetScrap), 1)]),
                                t('div', xe, [
                                  e[15] || (e[15] = t('span', null, '数量变动', -1)),
                                  t(
                                    'strong',
                                    { class: R(['delta-text', r.value.quantityDelta > 0 ? 'is-up' : r.value.quantityDelta < 0 ? 'is-down' : '']) },
                                    n(C(r.value.quantityDelta)),
                                    3
                                  )
                                ])
                              ]),
                              t('section', Le, [
                                e[20] || (e[20] = t('div', { class: 'detail-card__title' }, '路线与版本影响', -1)),
                                t('div', Ee, [e[17] || (e[17] = t('span', null, '关联工艺路线', -1)), t('strong', null, n(r.value.routeBinding), 1)]),
                                t('div', we, [
                                  e[18] || (e[18] = t('span', null, '替代策略', -1)),
                                  t('strong', null, n(r.value.replacementStrategy), 1)
                                ]),
                                t('div', Re, [
                                  e[19] || (e[19] = t('span', null, '影响层级', -1)),
                                  t('strong', null, n(T(B, r.value.impactLevel)), 1)
                                ]),
                                t('div', Ie, [
                                  (c(!0),
                                  V(
                                    D,
                                    null,
                                    w(
                                      r.value.affectedObjects,
                                      (l) => (
                                        c(),
                                        N(o, { key: l, type: 'success', effect: 'light', round: '' }, { default: u(() => [A(n(l), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ])
                              ]),
                              t('section', De, [
                                e[21] || (e[21] = t('div', { class: 'detail-card__title' }, '执行影响', -1)),
                                t('div', Ae, [
                                  (c(!0),
                                  V(
                                    D,
                                    null,
                                    w(
                                      r.value.executionImpacts,
                                      (l) => (
                                        c(),
                                        N(o, { key: l, type: 'warning', effect: 'light', round: '' }, { default: u(() => [A(n(l), 1)]), _: 2 }, 1024)
                                      )
                                    ),
                                    128
                                  ))
                                ]),
                                t('p', Qe, n(r.value.impactSummary), 1)
                              ])
                            ])
                          ]))
                        : le('', !0)
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
  Ye = oe($e, [['__scopeId', 'data-v-cf8c2036']])
export { Ye as default }
