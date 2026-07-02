import { buildProps } from '@element-plus/utils'
import { componentSizes } from '@element-plus/constants'
import type Text from './text.vue'

import type { ExtractPropTypes } from 'vue'

/**
 * @summary ElText 文本 - 提供主题色、尺寸、省略等文本样式的语义化包装组件
 *
 * 🔒 内部组件：可独立使用，也常被其他需要文本展示的组件作为基础文本元素
 *
 * @attr {'primary'|'success'|'info'|'warning'|'danger'|''} type - 文本主题色，默认 ''
 * @attr {''|'small'|'default'|'large'} size - 文本尺寸，默认 ''
 * @attr {Boolean} truncated - 是否启用单行省略
 * @attr {String} tag - 自定义渲染标签，默认 'span'
 *
 * @usage
 * <el-text type="primary" size="small" truncated>主要文本</el-text>
 */
export const textProps = buildProps({
  /**
   * @description text type
   */
  type: {
    type: String,
    values: ['primary', 'success', 'info', 'warning', 'danger', ''],
    default: '',
  },
  /**
   * @description text size
   */
  size: {
    type: String,
    values: componentSizes,
    default: '',
  },
  /**
   * @description render ellipsis
   */
  truncated: {
    type: Boolean,
  },
  /**
   * @description custom element tag
   */
  tag: {
    type: String,
    default: 'span',
  },
} as const)
export type TextProps = ExtractPropTypes<typeof textProps>
export type TextInstance = InstanceType<typeof Text>
