/**
 * @summary ElBadge 徽章标记组件 - 用于在按钮、图标等元素右上角显示数字、文字或圆点，常用于消息数量、待办提醒、状态标记等场景
 *
 * @attr {String|Number} value - 显示的值，可传字符串或数字；当为数字且超过 max 时显示 `{max}+`，默认空字符串
 * @attr {Number} max - 最大值上限，仅在 value 为数字时生效，超出则显示 `{max}+`，默认 99
 * @attr {Boolean} isDot - 是否以小圆点形式显示，默认 false；为 true 时忽略 value，仅展示一个圆点
 * @attr {Boolean} hidden - 是否隐藏徽章，默认 false
 * @attr {String} type - 徽章类型，决定背景色，可选值：'primary' | 'success' | 'warning' | 'info' | 'danger'，默认 'danger'
 *
 * @example
 * ```vue
 * <!-- 示例1：基础用法，消息数量与圆点提示 -->
 * <el-badge :value="12">
 *   <el-button>消息</el-button>
 * </el-badge>
 * <el-badge is-dot class="item">
 *   <el-icon><Bell /></el-icon>
 * </el-badge>
 *
 * <!-- 示例2：高级用法，超限显示与不同类型 -->
 * <el-badge :value="200" :max="99" type="primary">
 *   <el-button>评论</el-button>
 * </el-badge>
 * <el-badge :value="new" type="warning">
 *   <el-button>回复</el-button>
 * </el-badge>
 * ```
 */
import { buildProps } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'

export const badgeProps = buildProps({
  /**
   * @description display value.
   */
  value: {
    type: [String, Number],
    default: '',
  },
  /**
   * @description maximum value, shows `{max}+` when exceeded. Only works if value is a number.
   */
  max: {
    type: Number,
    default: 99,
  },
  /**
   * @description if a little dot is displayed.
   */
  isDot: Boolean,
  /**
   * @description hidden badge.
   */
  hidden: Boolean,
  /**
   * @description badge type.
   */
  type: {
    type: String,
    values: ['primary', 'success', 'warning', 'info', 'danger'],
    default: 'danger',
  },
} as const)
export type BadgeProps = ExtractPropTypes<typeof badgeProps>
