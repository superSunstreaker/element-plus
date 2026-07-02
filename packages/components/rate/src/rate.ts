/**
 * @summary ElRate 评分组件 - 通过点击星星进行星级评分的输入控件
 *
 * @attr {Number} modelValue - 当前评分绑定值；默认 0
 * @attr {String} id - 原生 id 属性；默认 undefined
 * @attr {Number} lowThreshold - 低分与中分的阈值，该值本身归入低分；默认 2
 * @attr {Number} highThreshold - 中分与高分的阈值，该值本身归入高分；默认 4
 * @attr {Number} max - 最大评分值；默认 5
 * @attr {String[]|Record<number, string>} colors - 不同分数段图标颜色；数组需 3 个元素分别对应低/中/高分段；对象以分数段阈值为 key
 * @attr {String} voidColor - 未选中图标颜色；默认 ''
 * @attr {String} disabledVoidColor - 禁用状态下未选中图标颜色；默认 ''
 * @attr {Array<String|Component>|Record<number, String|Component>} icons - 不同分数段图标组件；数组需 3 个元素分别对应低/中/高分段；默认全 StarFilled
 * @attr {Component} voidIcon - 未选中状态图标组件；默认 Star
 * @attr {Component} disabledVoidIcon - 禁用状态下未选中图标组件；默认 StarFilled
 * @attr {Boolean} disabled - 是否只读不可交互；默认 false
 * @attr {Boolean} allowHalf - 是否允许半选；默认 false
 * @attr {Boolean} showText - 是否显示评分文案；默认 false
 * @attr {Boolean} showScore - 是否显示当前分数（与 showText 不可同时为 true）；默认 false
 * @attr {String} textColor - 文案文字颜色；默认 ''
 * @attr {String[]} texts - 评分文案数组，与分值一一对应；默认 ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise']
 * @attr {String} scoreTemplate - 分数显示模板，`{value}` 为占位符；默认 '{value}'
 * @attr {ComponentSize} size - 评分组件尺寸，可选值 'large' | 'default' | 'small'
 * @attr {String} label - 原生 aria-label
 * @attr {Boolean} clearable - 是否允许再次点击同分数清零到 0；默认 false
 *
 * @event {Number} update:modelValue - 评分变化时触发，返回新分值
 * @event {Number} change - 评分变化时触发，返回新分值
 *
 * @example
 * ```vue
 * <el-rate v-model="value" />
 *
 * <el-rate
 *   v-model="value"
 *   :max="10"
 *   allow-half
 *   show-score
 *   score-template="{value}"
 *   :colors="['#F7BA2A', '#F7BA2A', '#FF9900']"
 * />
 * ```
 */
import { Star, StarFilled } from '@element-plus/icons-vue'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import {
  buildProps,
  definePropType,
  iconPropType,
  isNumber,
  mutable,
} from '@element-plus/utils'
import { useSizeProp } from '@element-plus/hooks'
import type { Component, ExtractPropTypes } from 'vue'
import type Rate from './rate.vue'

export const rateProps = buildProps({
  /**
   * @description binding value
   */
  modelValue: {
    type: Number,
    default: 0,
  },
  /**
   * @description native `id` attribute
   */
  id: {
    type: String,
    default: undefined,
  },
  /**
   * @description threshold value between low and medium level. The value itself will be included in low level
   */
  lowThreshold: {
    type: Number,
    default: 2,
  },
  /**
   * @description threshold value between medium and high level. The value itself will be included in high level
   */
  highThreshold: {
    type: Number,
    default: 4,
  },
  /**
   * @description max rating score
   */
  max: {
    type: Number,
    default: 5,
  },
  /**
   * @description colors for icons. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding color
   */
  colors: {
    type: definePropType<string[] | Record<number, string>>([Array, Object]),
    default: () => mutable(['', '', ''] as const),
  },
  /**
   * @description color of unselected icons
   */
  voidColor: {
    type: String,
    default: '',
  },
  /**
   * @description color of unselected read-only icons
   */
  disabledVoidColor: {
    type: String,
    default: '',
  },
  /**
   * @description icon components. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding icon component
   */
  icons: {
    type: definePropType<
      Array<string | Component> | Record<number, string | Component>
    >([Array, Object]),
    default: () => [StarFilled, StarFilled, StarFilled],
  },
  /**
   * @description component of unselected icons
   */
  voidIcon: {
    type: iconPropType,
    default: () => Star,
  },
  /**
   * @description component of unselected read-only icons
   */
  disabledVoidIcon: {
    type: iconPropType,
    default: () => StarFilled,
  },
  /**
   * @description whether Rate is read-only
   */
  disabled: Boolean,
  /**
   * @description whether picking half start is allowed
   */
  allowHalf: Boolean,
  /**
   * @description whether to display texts
   */
  showText: Boolean,
  /**
   * @description whether to display current score. show-score and show-text cannot be true at the same time
   */
  showScore: Boolean,
  /**
   * @description color of texts
   */
  textColor: {
    type: String,
    default: '',
  },
  /**
   * @description text array
   */
  texts: {
    type: definePropType<string[]>(Array),
    default: () =>
      mutable([
        'Extremely bad',
        'Disappointed',
        'Fair',
        'Satisfied',
        'Surprise',
      ] as const),
  },
  /**
   * @description score template
   */
  scoreTemplate: {
    type: String,
    default: '{value}',
  },
  /**
   * @description size of Rate
   */
  size: useSizeProp,
  /**
   * @description same as `aria-label` in Rate
   */
  label: {
    type: String,
    default: undefined,
  },
  /**
   * @description whether value can be reset to `0`
   */
  clearable: {
    type: Boolean,
    default: false,
  },
} as const)

export type RateProps = ExtractPropTypes<typeof rateProps>

export const rateEmits = {
  [CHANGE_EVENT]: (value: number) => isNumber(value),
  [UPDATE_MODEL_EVENT]: (value: number) => isNumber(value),
}
export type RateEmits = typeof rateEmits

export type RateInstance = InstanceType<typeof Rate>
