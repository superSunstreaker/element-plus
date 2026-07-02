/**
 * @summary ElAffix 固钉 - 将元素固定在视口或容器指定位置
 *
 * 当页面滚动时，将元素（如导航、筛选栏、操作按钮）固定在视口顶部/底部或指定容器边缘，
 * 避免重要内容随滚动消失。常与 PageHeader、Table 配合实现吸顶/吸底效果。
 *
 * @attr {Number|String} zIndex - 固钉元素的 z-index（默认 100）
 * @attr {String} target - 目标容器 CSS 选择器，固钉将相对于该容器固定（默认 ''，即相对视口）
 * @attr {Number} offset - 偏移距离，单位 px（默认 0）
 * @attr {String} position - 固定位置，可选 'top'/'bottom'（默认 'top'）
 *
 * @event {{scrollTop:number,fixed:boolean}} scroll - 滚动时触发，参数为 { scrollTop, fixed }
 * @event {Boolean} change - 固定状态变化时触发，参数为当前是否固定
 *
 * @example
 * <el-affix :offset="60">
 *   <el-menu mode="horizontal">...</el-menu>
 * </el-affix>
 *
 * @example
 * // 吸底 + 指定容器
 * <el-affix position="bottom" target=".container" :offset="20">
 *   <el-button type="primary">提交</el-button>
 * </el-affix>
 */
import {
  buildProps,
  definePropType,
  isBoolean,
  isNumber,
} from '@element-plus/utils'
import { CHANGE_EVENT } from '@element-plus/constants'
import type { ExtractPropTypes } from 'vue'
import type { ZIndexProperty } from 'csstype'
import type Affix from './affix.vue'

export const affixProps = buildProps({
  /**
   * @description affix element zIndex value
   * */
  zIndex: {
    type: definePropType<ZIndexProperty>([Number, String]),
    default: 100,
  },
  /**
   * @description target container. (CSS selector)
   */
  target: {
    type: String,
    default: '',
  },
  /**
   * @description offset distance
   * */
  offset: {
    type: Number,
    default: 0,
  },
  /**
   * @description position of affix
   * */
  position: {
    type: String,
    values: ['top', 'bottom'],
    default: 'top',
  },
} as const)
export type AffixProps = ExtractPropTypes<typeof affixProps>

export const affixEmits = {
  scroll: ({ scrollTop, fixed }: { scrollTop: number; fixed: boolean }) =>
    isNumber(scrollTop) && isBoolean(fixed),
  [CHANGE_EVENT]: (fixed: boolean) => isBoolean(fixed),
}
export type AffixEmits = typeof affixEmits

export type AffixInstance = InstanceType<typeof Affix>
