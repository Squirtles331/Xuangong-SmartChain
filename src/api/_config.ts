/**
 * API 层统一配置
 * 控制 mock / real 模式切换
 */

/** 当前是否处于 Mock 模式 */
export const isMockMode: boolean = import.meta.env.VITE_API_MODE === 'mock'
