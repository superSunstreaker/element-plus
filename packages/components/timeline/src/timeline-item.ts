/**
 * @summary ElTimelineItem 时间线项 - el-timeline 的子组件，表示时间线上的一个节点，包含节点圆点、时间戳与内容，可自定义节点颜色、图标、类型与时间戳位置
 *
 * @attr {string} timestamp - 时间戳内容，默认 ''；也可通过具名插槽 timestamp 自定义
 * @attr {boolean} hideTimestamp - 是否隐藏时间戳，默认 false
 * @attr {boolean} - 是否垂直居中显示节点与内容，默认 false
 * @attr {'top' | 'bottom'} placement - 时间戳位置，默认 'bottom'，可选 top/bottom
 * @attr {'' | 'primary' | 'success' | 'warning' | 'danger' | 'info'} type - 节点类型（颜色），默认 ''；设置后节点圆点采用对应主题色
 * @attr {string} color - 节点圆点自定义背景色，默认 ''；支持任意 CSS 颜色值，会覆盖 type 的颜色
 * @attr {'normal' | 'large'} size - 节点尺寸，默认 'normal'，可选 normal/large
 * @attr {Component | string} icon - 自定义节点图标组件，设置后圆点内显示该图标
 * @attr {boolean} hollow - 节点是否为空心，默认 false；为 true 时节点仅显示边框
 *
 * @example
 * ```vue
 * <el-timeline>
 *   <el-timeline-item timestamp="2026-07-01" placement="top">
 *     创建订单
 *   </el-timeline-item>
 *   <el-timeline-item timestamp="2026-07-02" type="primary" :hollow="true">
 *     付款成功
 *   </el-timeline-item>
 *   <el-timeline-item timestamp="2026-07-03" type="success" color="#0f0">
 *     已发货
 *   </el-timeline-item>
 *   <el-timeline-item timestamp="2026-07-04" type="danger" size="large">
 *     交易关闭
 *   </el-timeline-item>
 * </el-timeline>
 * ```
 */
import { buildProps, iconPropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type TimelineItem from './timeline-item.vue'

export const timelineItemProps = buildProps({
  /**
   * @description timestamp content
   */
  timestamp: {
    type: String,
    default: '',
  },
  /**
   * @description whether to show timestamp
   */
  hideTimestamp: {
    type: Boolean,
    default: false,
  },
  /**
   * @description whether vertically centered
   */
  center: {
    type: Boolean,
    default: false,
  },
  /**
   * @description position of timestamp
   */
  placement: {
    type: String,
    values: ['top', 'bottom'],
    default: 'bottom',
  },
  /**
   * @description node type
   */
  type: {
    type: String,
    values: ['primary', 'success', 'warning', 'danger', 'info'],
    default: '',
  },
  /**
   * @description background color of node
   */
  color: {
    type: String,
    default: '',
  },
  /**
   * @description node size
   */
  size: {
    type: String,
    values: ['normal', 'large'],
    default: 'normal',
  },
  /**
   * @description icon component
   */
  icon: {
    type: iconPropType,
  },
  /**
   * @description icon is hollow
   */
  hollow: {
    type: Boolean,
    default: false,
  },
} as const)
export type TimelineItemProps = ExtractPropTypes<typeof timelineItemProps>

export type TimelineItemInstance = InstanceType<typeof TimelineItem>
