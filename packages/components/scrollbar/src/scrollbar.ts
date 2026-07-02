/**
 * @summary ElScrollbar 滚动条 - 用于替换浏览器原生滚动条的自定义滚动条组件
 *
 * @attr {String|Number} height - 滚动区域高度（默认 ''）
 * @attr {String|Number} maxHeight - 滚动区域最大高度（默认 ''）
 * @attr {Boolean} native - 是否使用原生滚动条（默认 false）
 * @attr {String|Object|Array} wrapStyle - wrap 元素样式（默认 ''）
 * @attr {String|Array} wrapClass - wrap 元素类名（默认 ''）
 * @attr {String|Array} viewClass - view 元素类名（默认 ''）
 * @attr {String|Array|Object} viewStyle - view 元素样式（默认 ''）
 * @attr {Boolean} noresize - 不响应容器尺寸变化（容器尺寸固定时设为 true 可优化性能）
 * @attr {String} tag - view 元素标签名（默认 'div'）
 * @attr {Boolean} always - 是否始终显示滚动条
 * @attr {Number} minSize - 滚动条最小尺寸（默认 20）
 *
 * @event {Object} scroll - 滚动时触发，参数 { scrollTop, scrollLeft }
 *
 * @example
 * <el-scrollbar height="200px">
 *   <p v-for="i in 50" :key="i">第 {{ i }} 行</p>
 * </el-scrollbar>
 * <el-scrollbar always>
 *   <div style="height: 300px; width: 300px;">内容</div>
 * </el-scrollbar>
 */
import { buildProps, definePropType, isNumber } from '@element-plus/utils'
import type { ExtractPropTypes, StyleValue } from 'vue'
import type Scrollbar from './scrollbar.vue'

export const scrollbarProps = buildProps({
  /**
   * @description height of scrollbar
   */
  height: {
    type: [String, Number],
    default: '',
  },
  /**
   * @description max height of scrollbar
   */
  maxHeight: {
    type: [String, Number],
    default: '',
  },
  /**
   * @description whether to use the native scrollbar
   */
  native: {
    type: Boolean,
    default: false,
  },
  /**
   * @description style of wrap
   */
  wrapStyle: {
    type: definePropType<StyleValue>([String, Object, Array]),
    default: '',
  },
  /**
   * @description class of wrap
   */
  wrapClass: {
    type: [String, Array],
    default: '',
  },
  /**
   * @description class of view
   */
  viewClass: {
    type: [String, Array],
    default: '',
  },
  /**
   * @description style of view
   */
  viewStyle: {
    type: [String, Array, Object],
    default: '',
  },
  /**
   * @description do not respond to container size changes, if the container size does not change, it is better to set it to optimize performance
   */
  noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  /**
   * @description element tag of the view
   */
  tag: {
    type: String,
    default: 'div',
  },
  /**
   * @description always show
   */
  always: Boolean,
  /**
   * @description minimum size of scrollbar
   */
  minSize: {
    type: Number,
    default: 20,
  },
} as const)
export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>

export const scrollbarEmits = {
  scroll: ({
    scrollTop,
    scrollLeft,
  }: {
    scrollTop: number
    scrollLeft: number
  }) => [scrollTop, scrollLeft].every(isNumber),
}
export type ScrollbarEmits = typeof scrollbarEmits

export type ScrollbarInstance = InstanceType<typeof Scrollbar>
