import { C as a, D as _, E as p, M as u, O as g, T as m, b as l, g as n, k as f, w as c, x as s } from './index-DqMfCNbk.js'
var h = [
    {
      id: 'routing-1',
      material_code: '04.01.001-00001',
      material_name: '离心泵 XJP-100',
      routing_name: '离心泵 XJP-100 标准工艺',
      version: 'V1.1',
      status: 'enabled',
      description: '适用于离心泵 XJP-100 的机加工与装配标准流程。',
      operations: [
        {
          id: 'routing-1-op-10',
          operation_no: 10,
          name: '下料',
          work_center: '下料组',
          setup_hours: 15,
          run_hours: 5,
          queue_hours: 0,
          move_hours: 10,
          workers: 1,
          skill: '下料操作',
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: '按图纸尺寸下料，预留 2mm 加工余量。'
        },
        {
          id: 'routing-1-op-20',
          operation_no: 20,
          name: '粗车',
          work_center: '数控车组',
          setup_hours: 30,
          run_hours: 25,
          queue_hours: 30,
          move_hours: 10,
          workers: 1,
          skill: '数控车床操作',
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: '完成外圆与端面粗加工，确保余量均匀。'
        },
        {
          id: 'routing-1-op-30',
          operation_no: 30,
          name: '精车',
          work_center: '数控车组',
          setup_hours: 20,
          run_hours: 18,
          queue_hours: 20,
          move_hours: 10,
          workers: 1,
          skill: '数控车床操作',
          is_qc_gate: !0,
          is_outsourced: !1,
          instruction: '保证关键尺寸公差控制在 ±0.01mm。'
        },
        {
          id: 'routing-1-op-40',
          operation_no: 40,
          name: '钻孔',
          work_center: '钻床组',
          setup_hours: 10,
          run_hours: 8,
          queue_hours: 15,
          move_hours: 10,
          workers: 1,
          skill: '钻床操作',
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: '按工装定位完成孔位加工。'
        },
        {
          id: 'routing-1-op-50',
          operation_no: 50,
          name: '热处理',
          work_center: '热处理组',
          setup_hours: 60,
          run_hours: 120,
          queue_hours: 60,
          move_hours: 30,
          workers: 2,
          skill: '热处理操作',
          is_qc_gate: !1,
          is_outsourced: !0,
          instruction: '执行淬火加回火工艺，目标硬度 HRC45-50。'
        },
        {
          id: 'routing-1-op-60',
          operation_no: 60,
          name: '磨削',
          work_center: '磨床组',
          setup_hours: 20,
          run_hours: 15,
          queue_hours: 20,
          move_hours: 10,
          workers: 1,
          skill: '磨床操作',
          is_qc_gate: !0,
          is_outsourced: !1,
          instruction: '修正关键尺寸并控制表面粗糙度。'
        },
        {
          id: 'routing-1-op-70',
          operation_no: 70,
          name: '装配',
          work_center: '装配组',
          setup_hours: 30,
          run_hours: 45,
          queue_hours: 30,
          move_hours: 10,
          workers: 2,
          skill: '装配钳工',
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: '按装配清单完成泵体与转子总成装配。'
        },
        {
          id: 'routing-1-op-80',
          operation_no: 80,
          name: '试压',
          work_center: '测试组',
          setup_hours: 15,
          run_hours: 20,
          queue_hours: 10,
          move_hours: 10,
          workers: 1,
          skill: '测试操作',
          is_qc_gate: !0,
          is_outsourced: !1,
          instruction: '试验压力 2.5MPa，保压 10 分钟无泄漏。'
        }
      ]
    },
    {
      id: 'routing-2',
      material_code: '04.01.001-00002',
      material_name: '齿轮箱 GBX-200',
      routing_name: '齿轮箱 GBX-200 标准工艺',
      version: 'V1.0',
      status: 'enabled',
      description: '适用于齿轮箱壳体和传动部件的标准制造流程。',
      operations: [
        {
          id: 'routing-2-op-10',
          operation_no: 10,
          name: '下料',
          work_center: '下料组',
          setup_hours: 12,
          run_hours: 6,
          queue_hours: 5,
          move_hours: 10,
          workers: 1,
          skill: '下料操作',
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: '根据排样单完成板材与型材切割。'
        },
        {
          id: 'routing-2-op-20',
          operation_no: 20,
          name: '粗铣',
          work_center: '加工中心',
          setup_hours: 25,
          run_hours: 22,
          queue_hours: 15,
          move_hours: 10,
          workers: 1,
          skill: '加工中心操作',
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: '完成箱体基准面与安装面的粗加工。'
        },
        {
          id: 'routing-2-op-30',
          operation_no: 30,
          name: '精车',
          work_center: '数控车组',
          setup_hours: 18,
          run_hours: 16,
          queue_hours: 10,
          move_hours: 10,
          workers: 1,
          skill: '数控车床操作',
          is_qc_gate: !0,
          is_outsourced: !1,
          instruction: '保证轴类配合面尺寸稳定。'
        },
        {
          id: 'routing-2-op-40',
          operation_no: 40,
          name: '磨削',
          work_center: '磨床组',
          setup_hours: 16,
          run_hours: 14,
          queue_hours: 12,
          move_hours: 8,
          workers: 1,
          skill: '磨床操作',
          is_qc_gate: !0,
          is_outsourced: !1,
          instruction: '对轴承位与密封位进行精磨。'
        },
        {
          id: 'routing-2-op-50',
          operation_no: 50,
          name: '总装',
          work_center: '装配组',
          setup_hours: 28,
          run_hours: 40,
          queue_hours: 20,
          move_hours: 8,
          workers: 2,
          skill: '装配钳工',
          is_qc_gate: !1,
          is_outsourced: !1,
          instruction: '按装配工艺卡完成齿轮与轴承总装。'
        }
      ]
    }
  ],
  k = h.flatMap((e) =>
    e.operations.map((o) => ({
      ...o,
      routing_id: e.id,
      routing_name: e.routing_name,
      material_code: e.material_code,
      material_name: e.material_name,
      version: e.version,
      status: e.status
    }))
  ),
  d = [
    {
      id: 'routing-time-1',
      operation: '下料',
      material_name: '离心泵 XJP-100',
      std_hours: 5,
      actual_avg: 4.2,
      deviation: 16,
      samples: 120,
      suggestion: '建议将标准工时调整为 4 分钟。'
    },
    {
      id: 'routing-time-2',
      operation: '精车',
      material_name: '离心泵 XJP-100',
      std_hours: 18,
      actual_avg: 20.5,
      deviation: 14,
      samples: 85,
      suggestion: '建议将标准工时调整为 21 分钟。'
    },
    {
      id: 'routing-time-3',
      operation: '钻孔',
      material_name: '离心泵 XJP-100',
      std_hours: 8,
      actual_avg: 7.8,
      deviation: 3,
      samples: 110,
      suggestion: '偏差处于合理范围，可继续观察。'
    },
    {
      id: 'routing-time-4',
      operation: '磨削',
      material_name: '齿轮箱 GBX-200',
      std_hours: 15,
      actual_avg: 18.2,
      deviation: 21,
      samples: 60,
      suggestion: '建议结合砂轮寿命与换型频次重新核定工时。'
    }
  ],
  i = [
    {
      id: 'routing-parallel-1',
      routing_id: 'routing-1',
      routing_name: '离心泵 XJP-100 标准工艺',
      operations: ['工序40：钻孔', '工序50：热处理'],
      merge_rule: '全部完成后继续',
      remark: '钻孔与热处理完成后统一转入磨削工序。'
    },
    {
      id: 'routing-parallel-2',
      routing_id: 'routing-2',
      routing_name: '齿轮箱 GBX-200 标准工艺',
      operations: ['工序30：精车', '工序40：磨削'],
      merge_rule: '任一完成后继续',
      remark: '用于急单场景下的并行试运行方案。'
    }
  ]
async function v(e) {
  await n()
  let o = [...k]
  e.materialCode && (o = o.filter((t) => t.material_code === e.materialCode))
  const r = a(o, e.pageNum, e.pageSize)
  return l(r.list, r.total, r.pageNum, r.pageSize)
}
async function w(e) {
  await n()
  let o = [...d]
  ;(e.keyword && (o = c(o, e.keyword, ['operation', 'material_name'])),
    e.deviation === 'low' && (o = o.filter((t) => t.deviation <= 10)),
    e.deviation === 'mid' && (o = o.filter((t) => t.deviation > 10 && t.deviation <= 20)),
    e.deviation === 'high' && (o = o.filter((t) => t.deviation > 20)))
  const r = a(o, e.pageNum, e.pageSize)
  return l(r.list, r.total, r.pageNum, r.pageSize)
}
async function q(e) {
  await n()
  const o = d.find((r) => r.id === e)
  return (o && ((o.std_hours = Math.round(o.actual_avg)), (o.deviation = 0), (o.suggestion = '已采纳建议工时。')), s('已采纳工时建议'))
}
async function R(e) {
  await n()
  let o = [...i]
  ;(e.routingName && (o = c(o, e.routingName, ['routing_name'])), e.mergeRule && (o = o.filter((t) => t.merge_rule === e.mergeRule)))
  const r = a(o, e.pageNum, e.pageSize)
  return l(r.list, r.total, r.pageNum, r.pageSize)
}
async function P(e) {
  await n()
  const o = i.findIndex((r) => r.id === e.id)
  return o > -1 ? (Object.assign(i[o], e), s('并行工序配置更新成功')) : (i.unshift({ ...e, id: e.id || m() }), s('并行工序配置创建成功'))
}
async function X(e) {
  await n()
  const o = i.findIndex((r) => r.id === e)
  return (o > -1 && i.splice(o, 1), s('并行工序配置删除成功'))
}
function $(e) {
  return u ? v(e) : _('/routing/list', { params: e })
}
function N(e) {
  return u ? w(e) : _('/routing/auto-time', { params: e })
}
function J(e) {
  return u ? q(e) : g(`/routing/auto-time/${e}/adopt`)
}
function L(e) {
  return u ? R(e) : _('/routing/parallel', { params: e })
}
function S(e) {
  return u ? P(e) : e.id ? f(`/routing/parallel/${e.id}`, e) : g('/routing/parallel', e)
}
function x(e) {
  return u ? X(e) : p(`/routing/parallel/${e}`)
}
export { L as a, $ as i, x as n, S as o, N as r, J as t }
