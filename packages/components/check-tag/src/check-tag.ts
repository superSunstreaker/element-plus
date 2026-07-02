/**
 * @summary ElCheckTag 可选标签 - 可被选中/取消选中的标签，常用于过滤、切换状态
 *
 * ⚠️ 此组件为 ElTag 的衍生形态，独立使用或配合列表/筛选场景使用
 *
 * @attr {boolean} checked - 是否选中
 * @event {boolean} update:checked - 选中状态变化时触发
 * @event {boolean} change - 选中状态变化时触发
 *
 * @example
 * ```vue
 * <el-check-tag v-model:checked="checked" @change="onChange">可选标签</el-check-tag>
 * ```
 */
import { buildProps, isBoolean } from '@element-plus/utils'
import { CHANGE_EVENT } from '@element-plus/constants'

import type CheckTag from './check-tag.vue'
import type { ExtractPropTypes } from 'vue'

export const checkTagProps = buildProps({
  /**
   * @description is checked
   */
  checked: {
    type: Boolean,
    default: false,
  },
} as const)
export type CheckTagProps = ExtractPropTypes<typeof checkTagProps>

export const checkTagEmits = {
  'update:checked': (value: boolean) => isBoolean(value),
  [CHANGE_EVENT]: (value: boolean) => isBoolean(value),
}
export type CheckTagEmits = typeof checkTagEmits

export type CheckTagInstance = InstanceType<typeof CheckTag>
