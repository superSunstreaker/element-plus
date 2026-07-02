/**
 * @summary ElTag 标签 - 用于标记和分类的小标签，支持多种类型、主题与可关闭
 *
 * ⚠️ 此组件为独立展示组件，常配合列表/表单等场景使用
 *
 * @attr {('success'|'info'|'warning'|'danger'|'')} type - 标签类型，控制主题色
 * @attr {boolean} closable - 是否可关闭
 * @attr {boolean} disableTransitions - 是否禁用动画
 * @attr {boolean} hit - 是否显示高亮边框
 * @attr {string} color - 背景色
 * @attr {('large'|'default'|'small')} size - 尺寸
 * @attr {('dark'|'light'|'plain')} effect - 主题风格
 * @attr {boolean} round - 是否圆角
 * @event {MouseEvent} close - 关闭时触发
 * @event {MouseEvent} click - 点击时触发
 *
 * @example
 * ```vue
 * <el-tag type="success" closable>成功标签</el-tag>
 * ```
 */
import { buildProps } from '@element-plus/utils'
import { componentSizes } from '@element-plus/constants'
import type Tag from './tag.vue'

import type { ExtractPropTypes } from 'vue'

export const tagProps = buildProps({
  /**
   * @description type of Tag
   */
  type: {
    type: String,
    values: ['success', 'info', 'warning', 'danger', ''],
    default: '',
  },
  /**
   * @description whether Tag can be removed
   */
  closable: Boolean,
  /**
   * @description whether to disable animations
   */
  disableTransitions: Boolean,
  /**
   * @description whether Tag has a highlighted border
   */
  hit: Boolean,
  /**
   * @description background color of the Tag
   */
  color: {
    type: String,
    default: '',
  },
  /**
   * @description size of Tag
   */
  size: {
    type: String,
    values: componentSizes,
    default: '',
  },
  /**
   * @description theme of Tag
   */
  effect: {
    type: String,
    values: ['dark', 'light', 'plain'],
    default: 'light',
  },
  /**
   * @description whether Tag is rounded
   */
  round: Boolean,
} as const)
export type TagProps = ExtractPropTypes<typeof tagProps>

export const tagEmits = {
  close: (evt: MouseEvent) => evt instanceof MouseEvent,
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}
export type TagEmits = typeof tagEmits

export type TagInstance = InstanceType<typeof Tag>
