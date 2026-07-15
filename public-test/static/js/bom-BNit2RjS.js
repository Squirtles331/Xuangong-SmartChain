import { C as s, D as l, M as o, b as c, g as m, w as r, y as d } from './index-DqMfCNbk.js'
var n = [
    {
      id: '1',
      material_code: '04.01.001-00001',
      material_name: '离心泵 XJP-100',
      bom_type: 'EBOM',
      version: 'V2.0',
      status: 'active',
      effective_date: '2025-01-10',
      created_by: '张工',
      createdAt: '2025-01-10'
    },
    {
      id: '2',
      material_code: '04.01.001-00001',
      material_name: '离心泵 XJP-100',
      bom_type: 'MBOM',
      version: 'V1.2',
      status: 'active',
      effective_date: '2025-01-12',
      created_by: '李工',
      createdAt: '2025-01-12'
    },
    {
      id: '3',
      material_code: '04.02.001-00001',
      material_name: '齿轮箱 GBX-200',
      bom_type: 'EBOM',
      version: 'V1.0',
      status: 'active',
      effective_date: '2025-01-05',
      created_by: '张工',
      createdAt: '2025-01-05'
    },
    {
      id: '4',
      material_code: '04.02.001-00001',
      material_name: '齿轮箱 GBX-200',
      bom_type: 'MBOM',
      version: 'V1.0',
      status: 'active',
      effective_date: '2025-01-08',
      created_by: '李工',
      createdAt: '2025-01-08'
    },
    {
      id: '5',
      material_code: '03.01.001-00001',
      material_name: '传动轴 DS-50',
      bom_type: 'MBOM',
      version: 'V1.1',
      status: 'draft',
      effective_date: '-',
      created_by: '李工',
      createdAt: '2025-01-15'
    },
    {
      id: '6',
      material_code: '04.01.001-00001',
      material_name: '离心泵 XJP-100',
      bom_type: 'MBOM',
      version: 'V1.1',
      status: 'archived',
      effective_date: '2024-12-01',
      created_by: '王工',
      createdAt: '2024-12-01'
    }
  ],
  _ = [
    { level: 0, material: '离心泵 XJP-100', qty: '1', total: '100台' },
    { level: 1, material: '泵体组件', qty: '1', total: '100' },
    { level: 2, material: '泵体铸件', qty: '1', total: '100' },
    { level: 2, material: '耐磨环', qty: '2', total: '200' },
    { level: 2, material: '螺栓 M16×60', qty: '8', total: '800' },
    { level: 1, material: '叶轮组件', qty: '1', total: '100' },
    { level: 1, material: '轴承架组件', qty: '1', total: '100' }
  ]
async function v(e) {
  await m()
  let t = [...n]
  ;(e.materialCode && (t = r(t, e.materialCode, ['material_code'])),
    e.materialName && (t = r(t, e.materialName, ['material_name'])),
    e.bomType && (t = t.filter((i) => i.bom_type === e.bomType)),
    e.status && (t = t.filter((i) => i.status === e.status)))
  const a = s(t, e.pageNum, e.pageSize)
  return c(a.list, a.total, a.pageNum, a.pageSize)
}
async function f(e) {
  return (await m(), d(_))
}
function u(e) {
  return o ? v(e) : l('/bom/list', { params: e })
}
function b(e) {
  return o ? f(e) : l('/bom/preview', { params: { materialCode: e } })
}
export { b as n, u as t }
