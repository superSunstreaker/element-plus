/**
 * @summary ElInputNumber 数字输入框 - 仅允许输入数字的输入组件
 *
 * 提供带步进按钮的数字输入控件，支持范围限制、步长、精度控制、键盘操作。
 * 适用于数量、金额、比例等需要严格数值约束的场景，比原生 input[type=number] 提供更精确的行为控制。
 *
 * @attr {String} id - 原生 input 的 id 属性（默认 undefined）
 * @attr {Number} step - 步进增量（默认 1）
 * @attr {Boolean} stepStrictly - 是否只允许输入 step 的整数倍（默认 false）
 * @attr {Number} max - 允许的最大值（默认 Number.POSITIVE_INFINITY）
 * @attr {Number} min - 允许的最小值（默认 Number.NEGATIVE_INFINITY）
 * @attr {Number} modelValue - 绑定值，v-model 双向绑定
 * @attr {Boolean} readonly - 是否只读（默认 false）
 * @attr {Boolean} disabled - 是否禁用（默认 false）
 * @attr {String} size - 输入框尺寸，可选 'large'/'default'/'small'
 * @attr {Boolean} controls - 是否显示控制按钮（默认 true）
 * @attr {String} controlsPosition - 控制按钮位置，可选 ''/'right'（默认 ''）
 * @attr {'min'|'max'|Number|null} valueOnClear - 输入框清空时回退到的值，可指定 'min'/'max'/具体数值/null（默认 null）
 * @attr {String} name - 原生 input 的 name 属性
 * @attr {String} label - 原生 input 的 label 属性（无障碍）
 * @attr {String} placeholder - 占位文本
 * @attr {Number} precision - 数值精度（小数位数），必须为非负整数
 * @attr {Boolean} validateEvent - 值变化时是否触发表单校验（默认 true）
 *
 * @event {Number|undefined,Number|undefined} change - 值变化时触发，参数为 (新值, 旧值)
 * @event {FocusEvent} blur - 失去焦点时触发
 * @event {FocusEvent} focus - 获得焦点时触发
 * @event {Number|null|undefined} input - 输入时触发
 * @event {Number|undefined} update:modelValue - 绑定值变化时触发
 *
 * @example
 * <el-input-number v-model="num" :min="1" :max="10" :step="2" />
 *
 * @example
 * // 精度控制 + 右侧按钮
 * <el-input-number
 *   v-model="price"
 *   :precision="2"
 *   :step="0.1"
 *   :max="9999.99"
 *   controls-position="right"
 * />
 */
import { isNil } from 'lodash-unified'
import { useSizeProp } from '@element-plus/hooks'
import { buildProps, isNumber } from '@element-plus/utils'
import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@element-plus/constants'
import type { ExtractPropTypes } from 'vue'
import type InputNumber from './input-number.vue'

export const inputNumberProps = buildProps({
  /**
   * @description same as `id` in native input
   */
  id: {
    type: String,
    default: undefined,
  },
  /**
   * @description incremental step
   */
  step: {
    type: Number,
    default: 1,
  },
  /**
   * @description whether input value can only be multiple of step
   */
  stepStrictly: Boolean,
  /**
   * @description the maximum allowed value
   */
  max: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },
  /**
   * @description the minimum allowed value
   */
  min: {
    type: Number,
    default: Number.NEGATIVE_INFINITY,
  },
  /**
   * @description binding value
   */
  modelValue: Number,
  /**
   * @description same as `readonly` in native input
   */
  readonly: Boolean,
  /**
   * @description whether the component is disabled
   */
  disabled: Boolean,
  /**
   * @description size of the component
   */
  size: useSizeProp,
  /**
   * @description whether to enable the control buttons
   */
  controls: {
    type: Boolean,
    default: true,
  },
  /**
   * @description position of the control buttons
   */
  controlsPosition: {
    type: String,
    default: '',
    values: ['', 'right'],
  },
  /**
   * @description value should be set when input box is cleared
   */
  valueOnClear: {
    type: [String, Number, null],
    validator: (val: 'min' | 'max' | number | null) =>
      val === null || isNumber(val) || ['min', 'max'].includes(val),
    default: null,
  },
  /**
   * @description same as `name` in native input
   */
  name: String,
  /**
   * @description same as `label` in native input
   */
  label: String,
  /**
   * @description same as `placeholder` in native input
   */
  placeholder: String,
  /**
   * @description precision of input value
   */
  precision: {
    type: Number,
    validator: (val: number) =>
      val >= 0 && val === Number.parseInt(`${val}`, 10),
  },
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const)
export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>

export const inputNumberEmits = {
  [CHANGE_EVENT]: (cur: number | undefined, prev: number | undefined) =>
    prev !== cur,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  [INPUT_EVENT]: (val: number | null | undefined) =>
    isNumber(val) || isNil(val),
  [UPDATE_MODEL_EVENT]: (val: number | undefined) =>
    isNumber(val) || isNil(val),
}
export type InputNumberEmits = typeof inputNumberEmits

export type InputNumberInstance = InstanceType<typeof InputNumber>
