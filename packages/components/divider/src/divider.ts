/**
 * @summary ElDivider 分割线 - 区隔内容的分割线组件
 *
 * @attr {String} direction - 分割方向，可选值 'horizontal' / 'vertical'（默认 'horizontal'）
 * @attr {String} contentPosition - 自定义内容位置，可选值 'left' / 'center' / 'right'（默认 'center'）
 * @attr {String} borderStyle - 分割线样式，同 CSS border-style（默认 'solid'）
 *
 * @example
 * <el-divider />
 * <el-divider direction="vertical" />
 * <el-divider content-position="left">左侧标题</el-divider>
 * <el-divider border-style="dashed" />
 */
import { buildProps, definePropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type Divider from './divider.vue'

export type BorderStyle = CSSStyleDeclaration['borderStyle']

export const dividerProps = buildProps({
  /**
   * @description Set divider's direction
   */
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  /**
   * @description Set the style of divider
   */
  contentPosition: {
    type: String,
    values: ['left', 'center', 'right'],
    default: 'center',
  },
  /**
   * @description the position of the customized content on the divider line
   */
  borderStyle: {
    type: definePropType<BorderStyle>(String),
    default: 'solid',
  },
} as const)
export type DividerProps = ExtractPropTypes<typeof dividerProps>

export type DividerInstance = InstanceType<typeof Divider>
