/**
 * @summary ElSlider 滑块组件 - 通过拖动滑块在一个区间内选择数值的输入控件
 *
 * @attr {Number|Number[]} modelValue - 绑定值；range 模式下为长度 2 的数组 [起始, 结束]；默认 0
 * @attr {String} id - 原生 id 属性；默认 undefined
 * @attr {Number} min - 最小值；默认 0
 * @attr {Number} max - 最大值；默认 100
 * @attr {Number} step - 步长；默认 1
 * @attr {Boolean} showInput - 是否在右侧显示输入框；默认 false
 * @attr {Boolean} showInputControls - 是否显示输入框控制按钮；默认 true
 * @attr {ComponentSize} size - 滑块尺寸，可选值 'large' | 'default' | 'small'
 * @attr {ComponentSize} inputSize - 输入框尺寸，可选值 'large' | 'default' | 'small'
 * @attr {Boolean} showStops - 是否显示间断点（step 间断点）；默认 false
 * @attr {Boolean} showTooltip - 是否显示 tooltip 提示；默认 true
 * @attr {Function} formatTooltip - 格式化 tooltip 显示值的函数，签名 `(val: number) => number | string`；默认 undefined
 * @attr {Boolean} disabled - 是否禁用；默认 false
 * @attr {Boolean} range - 是否开启范围选择（双向滑块）；默认 false
 * @attr {Boolean} vertical - 是否垂直模式；默认 false
 * @attr {String} height - 垂直模式下滑块的高度
 * @attr {Number} debounce - 输入框与滑块同步的防抖时间（毫秒）；默认 300
 * @attr {String} label - 屏幕阅读器 aria-label
 * @attr {String} rangeStartLabel - range 模式下起始滑块的 aria-label
 * @attr {String} rangeEndLabel - range 模式下结束滑块的 aria-label
 * @attr {Function} formatValueText - 格式化 aria-valuetext 的函数，签名 `(val: number) => string`；默认 undefined
 * @attr {String} tooltipClass - tooltip 自定义类名
 * @attr {String} placement - tooltip 弹出位置，可选值为 popperjs 的 placements（如 'top' | 'bottom' | 'left' | 'right' 等）；默认 'top'
 * @attr {Object} marks - 在滑块上显示标记，key 为位置数值，value 为标记文案或 `{ style, label }` 配置对象
 * @attr {Boolean} validateEvent - 值变化时是否触发表单校验；默认 true
 *
 * @event {Number|Number[]} update:modelValue - 值变化时触发，range 模式返回数组
 * @event {Number|Number[]} input - 拖动时实时触发（未释放），range 模式返回数组
 * @event {Number|Number[]} change - 值变化且释放后触发，range 模式返回数组
 *
 * @example
 * ```vue
 * <el-slider v-model="value" />
 *
 * <el-slider
 *   v-model="value"
 *   :min="0"
 *   :max="100"
 *   :step="10"
 *   show-stops
 *   :marks="{ 0: '0°C', 50: '50°C', 100: '100°C' }"
 * />
 *
 * <el-slider v-model="range" range :min="0" :max="100" />
 * ```
 */
import { placements } from '@popperjs/core'
import {
  buildProps,
  definePropType,
  isArray,
  isNumber,
} from '@element-plus/utils'
import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@element-plus/constants'
import { useSizeProp } from '@element-plus/hooks'
import type { Arrayable } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type { SliderMarkerProps } from './marker'
import type Slider from './slider.vue'

type SliderMarks = Record<number, string | SliderMarkerProps['mark']>

export interface SliderInitData {
  firstValue: number
  secondValue: number
  oldValue?: Arrayable<number>
  dragging: boolean
  sliderSize: number
}

export const sliderProps = buildProps({
  modelValue: {
    type: definePropType<Arrayable<number>>([Number, Array]),
    default: 0,
  },
  id: {
    type: String,
    default: undefined,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  showInput: Boolean,
  showInputControls: {
    type: Boolean,
    default: true,
  },
  size: useSizeProp,
  inputSize: useSizeProp,
  showStops: Boolean,
  showTooltip: {
    type: Boolean,
    default: true,
  },
  formatTooltip: {
    type: definePropType<(val: number) => number | string>(Function),
    default: undefined,
  },
  disabled: Boolean,
  range: Boolean,
  vertical: Boolean,
  height: String,
  debounce: {
    type: Number,
    default: 300,
  },
  label: {
    type: String,
    default: undefined,
  },
  rangeStartLabel: {
    type: String,
    default: undefined,
  },
  rangeEndLabel: {
    type: String,
    default: undefined,
  },
  formatValueText: {
    type: definePropType<(val: number) => string>(Function),
    default: undefined,
  },
  tooltipClass: {
    type: String,
    default: undefined,
  },
  placement: {
    type: String,
    values: placements,
    default: 'top',
  },
  marks: {
    type: definePropType<SliderMarks>(Object),
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const)
export type SliderProps = ExtractPropTypes<typeof sliderProps>

const isValidValue = (value: Arrayable<number>) =>
  isNumber(value) || (isArray(value) && value.every(isNumber))
export const sliderEmits = {
  [UPDATE_MODEL_EVENT]: isValidValue,
  [INPUT_EVENT]: isValidValue,
  [CHANGE_EVENT]: isValidValue,
}
export type SliderEmits = typeof sliderEmits

export type SliderInstance = InstanceType<typeof Slider>
