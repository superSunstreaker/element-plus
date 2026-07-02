/**
 * @summary ElBacktop 回到顶部 - 滚动到阈值后显示的返回顶部按钮
 *
 * 当页面或指定容器滚动超过一定高度时显示一个浮动按钮，点击后平滑滚动回顶部。
 * 常用于长页面、列表、文档站点的导航辅助。
 *
 * @attr {Number} visibilityHeight - 滚动高度达到此值时按钮才显示（默认 200）
 * @attr {String} target - 触发滚动的目标容器选择器（默认 ''，即 window）
 * @attr {Number} right - 按钮距右侧距离，单位 px（默认 40）
 * @attr {Number} bottom - 按钮距底部距离，单位 px（默认 40）
 *
 * @event {MouseEvent} click - 点击按钮时触发
 *
 * @example
 * <el-backtop :right="50" :bottom="50" :visibility-height="300" />
 *
 * @example
 * // 指定滚动容器 + 自定义内容
 * <el-backtop target=".main-container">
 *   <el-icon><Top /></el-icon>
 * </el-backtop>
 */
import type { ExtractPropTypes } from 'vue'

export const backtopProps = {
  /**
   * @description the button will not show until the scroll height reaches this value.
   */
  visibilityHeight: {
    type: Number,
    default: 200,
  },
  /**
   * @description the target to trigger scroll.
   */
  target: {
    type: String,
    default: '',
  },
  /**
   * @description right distance.
   */
  right: {
    type: Number,
    default: 40,
  },
  /**
   * @description bottom distance.
   */
  bottom: {
    type: Number,
    default: 40,
  },
} as const
export type BacktopProps = ExtractPropTypes<typeof backtopProps>

export const backtopEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}
export type BacktopEmits = typeof backtopEmits
