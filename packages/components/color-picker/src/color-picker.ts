/**
 * @summary ElColorPicker 颜色选择器 - 可视化颜色选择组件
 *
 * 提供可视化色板、透明度滑块、预定义色板与十六进制/RGB 输入，用于让用户选取颜色。
 * 支持 alpha 通道、颜色格式约束（hex/rgb/hsl）、预定义快捷色与表单校验联动。
 *
 * @attr {String} modelValue - 绑定值，v-model 双向绑定（颜色字符串）
 * @attr {String} id - 组件 id
 * @attr {Boolean} showAlpha - 是否显示透明度滑块（默认 false）
 * @attr {String} colorFormat - 颜色格式，可选 'hsl'/'hsv'/'hex'/'rgb'，约束 v-model 输出格式
 * @attr {Boolean} disabled - 是否禁用（默认 false）
 * @attr {String} size - 尺寸，可选 'large'/'default'/'small'
 * @attr {String} popperClass - 下拉面板自定义类名（默认 ''）
 * @attr {String} label - 无障碍 aria-label（默认 undefined）
 * @attr {String|Number} tabindex - tabindex 属性（默认 0）
 * @attr {String[]} predefine - 预定义颜色数组
 * @attr {Boolean} validateEvent - 值变化时是否触发表单校验（默认 true）
 *
 * @event {String|null} update:modelValue - 绑定值变化时触发
 * @event {String|null} change - 颜色选择确认（关闭面板）时触发
 * @event {String|null} activeChange - 颜色活动变化（拖动滑块过程中）时触发
 *
 * @example
 * <el-color-picker v-model="color" show-alpha />
 *
 * @example
 * // 预定义色板 + 格式约束
 * <el-color-picker
 *   v-model="color"
 *   color-format="hex"
 *   :predefine="['#ff4500', '#ff8c00', '#ffd700']"
 * />
 */
import { isNil } from 'lodash-unified'
import { buildProps, definePropType, isString } from '@element-plus/utils'
import { useSizeProp } from '@element-plus/hooks'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'

import type { ComputedRef, ExtractPropTypes, InjectionKey } from 'vue'
import type ColorPicker from './color-picker.vue'

export const colorPickerProps = buildProps({
  /**
   * @description binding value
   */
  modelValue: String,
  /**
   * @description ColorPicker id
   */
  id: String,
  /**
   * @description whether to display the alpha slider
   */
  showAlpha: Boolean,
  /**
   * @description color format of v-model
   */
  colorFormat: String,
  /**
   * @description whether to disable the ColorPicker
   */
  disabled: Boolean,
  /**
   * @description size of ColorPicker
   */
  size: useSizeProp,
  /**
   * @description custom class name for ColorPicker's dropdown
   */
  popperClass: {
    type: String,
    default: '',
  },
  /**
   * @description ColorPicker aria-label
   */
  label: {
    type: String,
    default: undefined,
  },
  /**
   * @description ColorPicker tabindex
   */
  tabindex: {
    type: [String, Number],
    default: 0,
  },
  /**
   * @description predefined color options
   */
  predefine: {
    type: definePropType<string[]>(Array),
  },
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const)
export const colorPickerEmits = {
  [UPDATE_MODEL_EVENT]: (val: string | null) => isString(val) || isNil(val),
  [CHANGE_EVENT]: (val: string | null) => isString(val) || isNil(val),
  activeChange: (val: string | null) => isString(val) || isNil(val),
}

export type ColorPickerProps = ExtractPropTypes<typeof colorPickerProps>
export type ColorPickerEmits = typeof colorPickerEmits
export type ColorPickerInstance = InstanceType<typeof ColorPicker>

export interface ColorPickerContext {
  currentColor: ComputedRef<string>
}

export const colorPickerContextKey: InjectionKey<ColorPickerContext> = Symbol(
  'colorPickerContextKey'
)
