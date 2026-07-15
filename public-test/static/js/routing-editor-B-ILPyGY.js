import {
  An as F,
  Bn as t,
  F as H,
  Mn as J,
  On as k,
  Tn as K,
  Xn as P,
  Yn as Q,
  an as W,
  b as Z,
  dn as l,
  ft as ee,
  ht as oe,
  i as b,
  in as u,
  mt as le,
  nt as te,
  ot as ae,
  pn as ne,
  rn as v,
  rt as ue,
  sn as M,
  sr as m,
  tn as B,
  tt as re,
  un as V,
  x as se,
  y as ie
} from './element-plus-CzL7BOKu.js'
import { r as de } from './vue-chunks-CWn_TkJU.js'
import { I as _e } from './index-DqMfCNbk.js'
var me = { class: 'editor-header' },
  pe = { class: 'header-desc' },
  ce = { class: 'header-actions' },
  ve = { class: 'page-shell' },
  Ve = { class: 'editor-layout' },
  fe = { class: 'left-panel' },
  he = { class: 'summary-item' },
  ge = { class: 'summary-item' },
  ke = { class: 'summary-item' },
  be = { class: 'summary-item total' },
  we = { class: 'right-panel' },
  Ue = { class: 'toolbar' },
  ye = ne({
    __name: 'index',
    setup(qe) {
      const w = de(),
        U = ['下料组', '数控车组', '钻床组', '热处理组', '磨床组', '装配组', '测试组', '加工中心'],
        y = ['下料操作', '数控车床操作', '钻床操作', '热处理操作', '磨床操作', '装配钳工', '测试操作', '加工中心操作'],
        q = {
          'RT-2101-V2.0': {
            id: 'RT-2101-V2.0',
            material_code: 'FG-ASSY-2101',
            material_name: '供液控制总成',
            routing_name: '供液控制总成主装路线',
            version: 'V2.0',
            status: 'active',
            description: '用于主装产线的标准装配路线。',
            operations: [
              {
                id: '1',
                operation_no: 10,
                name: '壳体清洗',
                work_center: '装配组',
                setup_hours: 8,
                run_hours: 12,
                queue_hours: 4,
                move_hours: 2,
                workers: 1,
                skill: '装配钳工',
                is_qc_gate: !1,
                is_outsourced: !1,
                instruction: '装配前完成油污清洗。'
              },
              {
                id: '2',
                operation_no: 20,
                name: '密封件预装',
                work_center: '装配组',
                setup_hours: 10,
                run_hours: 18,
                queue_hours: 6,
                move_hours: 2,
                workers: 2,
                skill: '装配钳工',
                is_qc_gate: !0,
                is_outsourced: !1,
                instruction: '确认密封圈批次和装配方向。'
              },
              {
                id: '3',
                operation_no: 30,
                name: '总成装配',
                work_center: '装配组',
                setup_hours: 12,
                run_hours: 40,
                queue_hours: 8,
                move_hours: 4,
                workers: 2,
                skill: '装配钳工',
                is_qc_gate: !0,
                is_outsourced: !1,
                instruction: '按标准扭矩完成总成装配。'
              }
            ]
          },
          'RT-2101-V2.1': {
            id: 'RT-2101-V2.1',
            material_code: 'FG-ASSY-2101',
            material_name: '供液控制总成',
            routing_name: '供液控制总成优化路线',
            version: 'V2.1',
            status: 'draft',
            description: '优化排队工时并新增中间质检关卡。',
            operations: [
              {
                id: '1',
                operation_no: 10,
                name: '壳体清洗',
                work_center: '装配组',
                setup_hours: 8,
                run_hours: 10,
                queue_hours: 2,
                move_hours: 2,
                workers: 1,
                skill: '装配钳工',
                is_qc_gate: !1,
                is_outsourced: !1,
                instruction: '装配前完成油污清洗。'
              },
              {
                id: '2',
                operation_no: 20,
                name: '核心组件预组',
                work_center: '装配组',
                setup_hours: 10,
                run_hours: 16,
                queue_hours: 4,
                move_hours: 2,
                workers: 2,
                skill: '装配钳工',
                is_qc_gate: !0,
                is_outsourced: !1,
                instruction: '拆分为预装工位减少主线等待。'
              },
              {
                id: '3',
                operation_no: 30,
                name: '整机联调',
                work_center: '测试组',
                setup_hours: 12,
                run_hours: 34,
                queue_hours: 6,
                move_hours: 4,
                workers: 2,
                skill: '测试操作',
                is_qc_gate: !0,
                is_outsourced: !1,
                instruction: '完成功能联调与首件确认。'
              }
            ]
          },
          'RT-1001-V1.0': {
            id: 'RT-1001-V1.0',
            material_code: 'SM-CNC-1001',
            material_name: '壳体粗加工件',
            routing_name: '壳体粗加工路线',
            version: 'V1.0',
            status: 'active',
            description: '机加壳体的标准工艺路线。',
            operations: [
              {
                id: '1',
                operation_no: 10,
                name: '下料',
                work_center: '下料组',
                setup_hours: 6,
                run_hours: 10,
                queue_hours: 3,
                move_hours: 2,
                workers: 1,
                skill: '下料操作',
                is_qc_gate: !1,
                is_outsourced: !1,
                instruction: '按毛坯图纸完成下料。'
              },
              {
                id: '2',
                operation_no: 20,
                name: '数控粗车',
                work_center: '数控车组',
                setup_hours: 10,
                run_hours: 28,
                queue_hours: 8,
                move_hours: 3,
                workers: 1,
                skill: '数控车床操作',
                is_qc_gate: !1,
                is_outsourced: !1,
                instruction: '执行粗车并保留精加工余量。'
              },
              {
                id: '3',
                operation_no: 30,
                name: '热处理',
                work_center: '热处理组',
                setup_hours: 8,
                run_hours: 12,
                queue_hours: 8,
                move_hours: 6,
                workers: 1,
                skill: '热处理操作',
                is_qc_gate: !0,
                is_outsourced: !0,
                instruction: '按热处理标准完成硬度控制。'
              }
            ]
          }
        },
        s = Q({ id: '', material_code: '', material_name: '', routing_name: '', version: 'V1.0', status: 'draft', description: '', operations: [] }),
        r = P([]),
        C = v(() => String(w.params.id || '') === 'new'),
        D = v(() => s.routing_name || '工艺路线编辑'),
        E = v(() => r.value.reduce((n, e) => n + Number(e.setup_hours || 0), 0)),
        S = v(() => r.value.reduce((n, e) => n + Number(e.run_hours || 0), 0)),
        T = v(() => r.value.reduce((n, e) => n + Number(e.queue_hours || 0) + Number(e.move_hours || 0), 0)),
        I = v(() => E.value + S.value + T.value)
      function N() {
        const n = r.value.length ? Math.max(...r.value.map((e) => e.operation_no)) + 10 : 10
        return {
          id: `temp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          operation_no: n,
          name: '',
          work_center: U[0],
          setup_hours: 0,
          run_hours: 0,
          queue_hours: 0,
          move_hours: 0,
          workers: 1,
          skill: y[0],
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: ''
        }
      }
      function f() {
        ;((r.value = [...r.value].sort((n, e) => n.operation_no - e.operation_no)),
          r.value.forEach((n, e) => {
            n.operation_no = (e + 1) * 10
          }))
      }
      function A() {
        ;(r.value.push(N()), f())
      }
      function Y(n) {
        n !== 0 && (([r.value[n - 1], r.value[n]] = [r.value[n], r.value[n - 1]]), f())
      }
      function $(n) {
        n >= r.value.length - 1 || (([r.value[n], r.value[n + 1]] = [r.value[n + 1], r.value[n]]), f())
      }
      function j(n) {
        ;(r.value.splice(n, 1), f())
      }
      function G() {
        const n = String(w.params.id || '')
        if (C.value || !n) {
          ;(Object.assign(s, {
            id: 'new',
            material_code: '',
            material_name: '',
            routing_name: '',
            version: 'V1.0',
            status: 'draft',
            description: '',
            operations: []
          }),
            (r.value = [N()]))
          return
        }
        const e = q[n] || q['RT-2101-V2.0']
        ;(Object.assign(s, { ...e, operations: [] }), (r.value = e.operations.map((d) => ({ ...d }))), f())
      }
      function x() {
        if (!s.routing_name || !s.material_name) {
          b.warning('请填写工艺路线名称和物料名称')
          return
        }
        if (!r.value.length) {
          b.warning('请至少维护一条工序')
          return
        }
        ;((s.operations = r.value.map((n) => ({ ...n }))), b.success('静态工艺路线已保存，可作为后续 mock 基线'))
      }
      return (
        K(() => {
          G()
        }),
        (n, e) => {
          const d = ae,
            _ = ee,
            p = oe,
            h = te,
            g = ue,
            z = le,
            O = re,
            c = H,
            i = Z,
            R = se,
            L = ie,
            X = J('gi-page-layout')
          return (
            k(),
            W(X, null, {
              header: t(() => [
                u('div', me, [
                  u('div', null, [
                    u('h2', null, m(C.value ? '新建工艺路线' : D.value), 1),
                    u('p', pe, m(s.material_code || '待定义产品编码') + ' ｜ 版本：' + m(s.version || '-'), 1)
                  ]),
                  u('div', ce, [
                    l(d, { type: 'primary', onClick: x }, { default: t(() => [...(e[7] || (e[7] = [V('保存', -1)]))]), _: 1 }),
                    l(d, { onClick: e[0] || (e[0] = (o) => n.$router.back()) }, { default: t(() => [...(e[8] || (e[8] = [V('返回', -1)]))]), _: 1 })
                  ])
                ])
              ]),
              default: t(() => [
                u('div', ve, [
                  u('div', Ve, [
                    u('div', fe, [
                      l(
                        O,
                        { shadow: 'never', class: 'summary-card' },
                        {
                          header: t(() => [...(e[9] || (e[9] = [u('div', { class: 'card-header' }, [u('span', null, '路线头信息')], -1)]))]),
                          default: t(() => [
                            l(
                              z,
                              { model: s, 'label-width': '92px' },
                              {
                                default: t(() => [
                                  l(
                                    p,
                                    { label: '工艺路线' },
                                    {
                                      default: t(() => [
                                        l(
                                          _,
                                          { modelValue: s.routing_name, 'onUpdate:modelValue': e[1] || (e[1] = (o) => (s.routing_name = o)) },
                                          null,
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    p,
                                    { label: '物料编码' },
                                    {
                                      default: t(() => [
                                        l(
                                          _,
                                          { modelValue: s.material_code, 'onUpdate:modelValue': e[2] || (e[2] = (o) => (s.material_code = o)) },
                                          null,
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    p,
                                    { label: '物料名称' },
                                    {
                                      default: t(() => [
                                        l(
                                          _,
                                          { modelValue: s.material_name, 'onUpdate:modelValue': e[3] || (e[3] = (o) => (s.material_name = o)) },
                                          null,
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    p,
                                    { label: '版本' },
                                    {
                                      default: t(() => [
                                        l(_, { modelValue: s.version, 'onUpdate:modelValue': e[4] || (e[4] = (o) => (s.version = o)) }, null, 8, [
                                          'modelValue'
                                        ])
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    p,
                                    { label: '状态' },
                                    {
                                      default: t(() => [
                                        l(
                                          g,
                                          {
                                            modelValue: s.status,
                                            'onUpdate:modelValue': e[5] || (e[5] = (o) => (s.status = o)),
                                            style: { width: '100%' }
                                          },
                                          {
                                            default: t(() => [
                                              l(h, { label: '草稿', value: 'draft' }),
                                              l(h, { label: '已生效', value: 'active' }),
                                              l(h, { label: '已停用', value: 'disabled' })
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
                                    p,
                                    { label: '说明' },
                                    {
                                      default: t(() => [
                                        l(
                                          _,
                                          {
                                            modelValue: s.description,
                                            'onUpdate:modelValue': e[6] || (e[6] = (o) => (s.description = o)),
                                            type: 'textarea',
                                            rows: 4
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
                        }
                      ),
                      l(
                        O,
                        { shadow: 'never', class: 'summary-card' },
                        {
                          header: t(() => [...(e[10] || (e[10] = [u('div', { class: 'card-header' }, [u('span', null, '工时汇总')], -1)]))]),
                          default: t(() => [
                            u('div', he, [e[11] || (e[11] = u('span', null, '准备工时', -1)), u('strong', null, m(E.value) + ' 分钟', 1)]),
                            u('div', ge, [e[12] || (e[12] = u('span', null, '加工工时', -1)), u('strong', null, m(S.value) + ' 分钟', 1)]),
                            u('div', ke, [e[13] || (e[13] = u('span', null, '排队与转运', -1)), u('strong', null, m(T.value) + ' 分钟', 1)]),
                            u('div', be, [e[14] || (e[14] = u('span', null, '总工时', -1)), u('strong', null, m(I.value) + ' 分钟', 1)])
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    u('div', we, [
                      u('div', Ue, [
                        l(d, { type: 'primary', onClick: A }, { default: t(() => [...(e[15] || (e[15] = [V('新增工序', -1)]))]), _: 1 })
                      ]),
                      l(
                        L,
                        { data: r.value, border: '', stripe: '', style: { width: '100%' } },
                        {
                          default: t(() => [
                            l(
                              i,
                              { label: '工序号', width: '90', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    c,
                                    {
                                      modelValue: o.operation_no,
                                      'onUpdate:modelValue': (a) => (o.operation_no = a),
                                      min: 10,
                                      step: 10,
                                      'controls-position': 'right'
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '工序名称', 'min-width': '130' },
                              {
                                default: t(({ row: o }) => [
                                  l(_, { modelValue: o.name, 'onUpdate:modelValue': (a) => (o.name = a) }, null, 8, [
                                    'modelValue',
                                    'onUpdate:modelValue'
                                  ])
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '工作中心', 'min-width': '140' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    g,
                                    { modelValue: o.work_center, 'onUpdate:modelValue': (a) => (o.work_center = a), style: { width: '100%' } },
                                    {
                                      default: t(() => [
                                        (k(),
                                        M(
                                          B,
                                          null,
                                          F(U, (a) => l(h, { key: a, label: a, value: a }, null, 8, ['label', 'value'])),
                                          64
                                        ))
                                      ]),
                                      _: 1
                                    },
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '准备工时', width: '110', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    c,
                                    {
                                      modelValue: o.setup_hours,
                                      'onUpdate:modelValue': (a) => (o.setup_hours = a),
                                      min: 0,
                                      precision: 0,
                                      'controls-position': 'right'
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '加工工时', width: '110', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    c,
                                    {
                                      modelValue: o.run_hours,
                                      'onUpdate:modelValue': (a) => (o.run_hours = a),
                                      min: 0,
                                      precision: 0,
                                      'controls-position': 'right'
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '排队工时', width: '110', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    c,
                                    {
                                      modelValue: o.queue_hours,
                                      'onUpdate:modelValue': (a) => (o.queue_hours = a),
                                      min: 0,
                                      precision: 0,
                                      'controls-position': 'right'
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '转运工时', width: '110', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    c,
                                    {
                                      modelValue: o.move_hours,
                                      'onUpdate:modelValue': (a) => (o.move_hours = a),
                                      min: 0,
                                      precision: 0,
                                      'controls-position': 'right'
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '人数', width: '80', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    c,
                                    {
                                      modelValue: o.workers,
                                      'onUpdate:modelValue': (a) => (o.workers = a),
                                      min: 1,
                                      precision: 0,
                                      'controls-position': 'right'
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '技能要求', 'min-width': '140' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    g,
                                    { modelValue: o.skill, 'onUpdate:modelValue': (a) => (o.skill = a), style: { width: '100%' } },
                                    {
                                      default: t(() => [
                                        (k(),
                                        M(
                                          B,
                                          null,
                                          F(y, (a) => l(h, { key: a, label: a, value: a }, null, 8, ['label', 'value'])),
                                          64
                                        ))
                                      ]),
                                      _: 1
                                    },
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '质检关卡', width: '100', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(R, { modelValue: o.is_qc_gate, 'onUpdate:modelValue': (a) => (o.is_qc_gate = a) }, null, 8, [
                                    'modelValue',
                                    'onUpdate:modelValue'
                                  ])
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '委外', width: '90', align: 'center' },
                              {
                                default: t(({ row: o }) => [
                                  l(R, { modelValue: o.is_outsourced, 'onUpdate:modelValue': (a) => (o.is_outsourced = a) }, null, 8, [
                                    'modelValue',
                                    'onUpdate:modelValue'
                                  ])
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '操作说明', 'min-width': '220' },
                              {
                                default: t(({ row: o }) => [
                                  l(
                                    _,
                                    { modelValue: o.instruction, 'onUpdate:modelValue': (a) => (o.instruction = a), type: 'textarea', rows: 2 },
                                    null,
                                    8,
                                    ['modelValue', 'onUpdate:modelValue']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              i,
                              { label: '操作', width: '170', fixed: 'right', align: 'center' },
                              {
                                default: t(({ $index: o }) => [
                                  l(
                                    d,
                                    { link: '', type: 'primary', onClick: (a) => Y(o), disabled: o === 0 },
                                    { default: t(() => [...(e[16] || (e[16] = [V('上移', -1)]))]), _: 1 },
                                    8,
                                    ['onClick', 'disabled']
                                  ),
                                  l(
                                    d,
                                    { link: '', type: 'primary', onClick: (a) => $(o), disabled: o === r.value.length - 1 },
                                    { default: t(() => [...(e[17] || (e[17] = [V('下移', -1)]))]), _: 1 },
                                    8,
                                    ['onClick', 'disabled']
                                  ),
                                  l(
                                    d,
                                    { link: '', type: 'danger', onClick: (a) => j(o) },
                                    { default: t(() => [...(e[18] || (e[18] = [V('删除', -1)]))]), _: 1 },
                                    8,
                                    ['onClick']
                                  )
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
                    ])
                  ])
                ])
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  Te = _e(ye, [['__scopeId', 'data-v-9bca5004']])
export { Te as default }
