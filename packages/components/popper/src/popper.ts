import { buildProps } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'
import type Popper from './popper.vue'

/**
 * @summary ElPopper 弹出定位器 - 基于 popper.js 的浮动元素定位基础组件
 *
 * 🔒 内部组件：为 Tooltip、Dropdown、Select、Popconfirm、Popover 等所有弹出类组件提供定位能力，也可单独使用
 *
 * @attr {String} role - 弹出内容的 ARIA role，影响无障碍语义
 *   可选值: 'dialog' | 'grid' | 'group' | 'listbox' | 'menu' | 'navigation' | 'tooltip' | 'tree'
 *   默认: 'tooltip'
 *
 * @usage
 * <!-- 内部用法：Tooltip 内部使用 ElPopper 包裹 trigger 与 content -->
 * <el-popper role="tooltip">
 *   <template #trigger><button>触发</button></template>
 *   <template #default><div>弹出内容</div></template>
 * </el-popper>
 */
const effects = ['light', 'dark'] as const
const triggers = ['click', 'contextmenu', 'hover', 'focus'] as const

export const Effect = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export const roleTypes = [
  'dialog',
  'grid',
  'group',
  'listbox',
  'menu',
  'navigation',
  'tooltip',
  'tree',
] as const

export type PopperEffect = typeof effects[number]
export type PopperTrigger = typeof triggers[number]

export const popperProps = buildProps({
  role: {
    type: String,
    values: roleTypes,
    default: 'tooltip',
  },
} as const)

export type PopperProps = ExtractPropTypes<typeof popperProps>

export type PopperInstance = InstanceType<typeof Popper>

/** @deprecated use `popperProps` instead, and it will be deprecated in the next major version */
export const usePopperProps = popperProps

/** @deprecated use `PopperProps` instead, and it will be deprecated in the next major version */
export type UsePopperProps = PopperProps
