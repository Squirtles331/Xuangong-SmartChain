export const ecnOrders = [
  {
    id: 'ecn-1',
    code: 'ECN202606300001',
    change_type: 'BOM变更' as const,
    material: '离心泵 XJP-100',
    current_version: 'V2.3',
    status: 'draft' as const,
    urgency: 'urgent' as const,
    applicant: '张工',
    createdAt: '2026-06-30 09:20:00'
  },
  {
    id: 'ecn-2',
    code: 'ECN202606280002',
    change_type: '工艺变更' as const,
    material: '齿轮箱 GBX-200',
    current_version: 'V1.8',
    status: 'approved' as const,
    urgency: 'normal' as const,
    applicant: '李工',
    createdAt: '2026-06-28 14:10:00'
  },
  {
    id: 'ecn-3',
    code: 'ECN202606250003',
    change_type: 'BOM+工艺变更' as const,
    material: '传动轴 DS-50',
    current_version: 'V3.1',
    status: 'executed' as const,
    urgency: 'planned' as const,
    applicant: '王工',
    createdAt: '2026-06-25 10:35:00'
  },
  {
    id: 'ecn-4',
    code: 'ECN202606220004',
    change_type: 'BOM变更' as const,
    material: '联轴器 LZQ-80',
    current_version: 'V1.2',
    status: 'verified' as const,
    urgency: 'normal' as const,
    applicant: '赵工',
    createdAt: '2026-06-22 16:05:00'
  }
]
