/**
 * @summary ElSwitch 开关组件 - 用于在两种互斥状态（开/关）之间切换的开关选择器
 *
 * @attr {Boolean|String|Number} modelValue - 绑定值，默认 boolean 类型；可与 active-value / inactive-value 配置返回任意值；默认 false
 * @attr {Boolean} disabled - 是否禁用开关；默认 false
 * @attr {Boolean} loading - 是否处于加载中状态（加载时不可切换）；默认 false
 * @attr {ComponentSize} size - 开关尺寸，可选值 'large' | 'default' | 'small'
 * @attr {String|Number} width - 开关宽度（像素或字符串），默认 ''
 * @attr {Boolean} inlinePrompt - 是否将图标/文字显示在圆点内部（仅渲染文字首个字符）；默认 false
 * @attr {Component} inactiveActionIcon - 关闭状态下圆点内显示的图标组件
 * @attr {Component} activeActionIcon - 打开状态下圆点内显示的图标组件
 * @attr {Component} activeIcon - 打开状态显示的图标组件，优先级高于 active-text
 * @attr {Component} inactiveIcon - 关闭状态显示的图标组件，优先级高于 inactive-text
 * @attr {String} activeText - 打开状态显示的文字，默认 ''
 * @attr {String} inactiveText - 关闭状态显示的文字，默认 ''
 * @attr {Boolean|String|Number} activeValue - 打开状态对应的值；默认 true
 * @attr {Boolean|String|Number} inactiveValue - 关闭状态对应的值；默认 false
 * @attr {String} activeColor - 【已废弃】打开状态背景色，请改用 CSS 变量 `--el-switch-on-color`
 * @attr {String} inactiveColor - 【已废弃】关闭状态背景色，请改用 CSS 变量 `--el-switch-off-color`
 * @attr {String} borderColor - 【已废弃】边框颜色，请改用 CSS 变量 `--el-switch-border-color`
 * @attr {String} name - 原生 input 的 name 属性；默认 ''
 * @attr {Boolean} validateEvent - 值变化时是否触发表单校验；默认 true
 * @attr {Function} beforeChange - 状态变更前钩子，返回 false 或被 reject 的 Promise 将阻止切换；签名为 `() => Promise<boolean> | boolean`
 * @attr {String} id - input 元素的 id
 * @attr {String|Number} tabindex - input 元素的 tabindex
 * @attr {Boolean|String|Number} value - 【已废弃】绑定值，请使用 model-value / v-model
 *
 * @event {Boolean|String|Number} update:modelValue - 值变化时触发，返回当前绑定值（active-value 或 inactive-value）
 * @event {Boolean|String|Number} change - 值变化时触发，返回当前绑定值
 * @event {Boolean|String|Number} input - 输入时触发，返回当前绑定值
 *
 * @example
 * ```vue
 * <el-switch v-model="value" />
 *
 * <el-switch
 *   v-model="value"
 *   active-text="按月付费"
 *   inactive-text="按年付费"
 *   :active-value="1"
 *   :inactive-value="0"
 *   :before-change="beforeChange"
 * />
 * ```
 */
import {
  buildProps,
  definePropType,
  iconPropType,
  isBoolean,
  isNumber,
  isString,
  isValidComponentSize,
} from '@element-plus/utils'
import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@element-plus/constants'
import type { ComponentSize } from '@element-plus/constants'
import type Switch from './switch.vue'
import type { ExtractPropTypes, PropType } from 'vue'

export const switchProps = buildProps({
  /**
   * @description binding value, it should be equivalent to either `active-value` or `inactive-value`, by default it's `boolean` type
   */
  modelValue: {
    type: [Boolean, String, Number],
    default: false,
  },
  /**
   * @description whether Switch is disabled
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @description whether Switch is in loading state
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @description size of Switch
   */
  size: {
    type: String as PropType<ComponentSize>,
    validator: isValidComponentSize,
  },
  /**
   * @description width of Switch
   */
  width: {
    type: [String, Number],
    default: '',
  },
  /**
   * @description whether icon or text is displayed inside dot, only the first character will be rendered for text
   */
  inlinePrompt: {
    type: Boolean,
    default: false,
  },
  /**
   * @description component of the icon displayed in action when in `off` state
   */
  inactiveActionIcon: {
    type: iconPropType,
  },
  /**
   * @description component of the icon displayed in action when in `on` state
   */
  activeActionIcon: {
    type: iconPropType,
  },
  /**
   * @description component of the icon displayed when in `on` state, overrides `active-text`
   */
  activeIcon: {
    type: iconPropType,
  },
  /**
   * @description component of the icon displayed when in `off` state, overrides `inactive-text`
   */
  inactiveIcon: {
    type: iconPropType,
  },
  /**
   * @description text displayed when in `on` state
   */
  activeText: {
    type: String,
    default: '',
  },
  /**
   * @description text displayed when in `off` state
   */
  inactiveText: {
    type: String,
    default: '',
  },
  /**
   * @description switch value when in `on` state
   */
  activeValue: {
    type: [Boolean, String, Number],
    default: true,
  },
  /**
   * @description switch value when in `off` state
   */
  inactiveValue: {
    type: [Boolean, String, Number],
    default: false,
  },
  /**
   * @deprecated background color when in `on` state ( deprecated, use CSS var `--el-switch-on-color` instead )
   */
  activeColor: {
    type: String,
    default: '',
  },
  /**
   * @deprecated background color when in `off` state ( deprecated, use CSS var `--el-switch-off-color` instead )
   */
  inactiveColor: {
    type: String,
    default: '',
  },
  /**
   * @deprecated border color of the switch ( deprecated, use CSS var `--el-switch-border-color` instead )
   */
  borderColor: {
    type: String,
    default: '',
  },
  /**
   * @description input name of Switch
   */
  name: {
    type: String,
    default: '',
  },
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
  /**
   * @description before-change hook before the switch state changes. If `false` is returned or a `Promise` is returned and then is rejected, will stop switching
   */
  beforeChange: {
    type: definePropType<() => Promise<boolean> | boolean>(Function),
  },
  /**
   * @description id for input
   */
  id: String,
  /**
   * @description tabindex for input
   */
  tabindex: {
    type: [String, Number],
  },
  /**
   * @deprecated binding value ( deprecated, use `model-value / v-model` instead )
   */
  value: {
    type: [Boolean, String, Number],
    default: false,
  },
} as const)

export type SwitchProps = ExtractPropTypes<typeof switchProps>

export const switchEmits = {
  [UPDATE_MODEL_EVENT]: (val: boolean | string | number) =>
    isBoolean(val) || isString(val) || isNumber(val),
  [CHANGE_EVENT]: (val: boolean | string | number) =>
    isBoolean(val) || isString(val) || isNumber(val),
  [INPUT_EVENT]: (val: boolean | string | number) =>
    isBoolean(val) || isString(val) || isNumber(val),
}
export type SwitchEmits = typeof switchEmits

export type SwitchInstance = InstanceType<typeof Switch>
