/**
 * @summary ElInput 输入框 - 基础表单组件，用于接收用户输入的文本、数字等信息，支持文本框、密码框、多行文本域等多种模式
 *
 * @attr {string} id - 原生 input 元素的 id 属性，用于关联 label 标签或表单元素
 * @attr {ComponentSize} size - 输入框尺寸，可选值为 large / default / small，默认继承自父级 Form 或 ConfigProvider
 * @attr {boolean} disabled - 是否禁用输入框，默认 false，禁用后输入框不可编辑且样式变灰
 * @attr {string | number | null | undefined} modelValue (v-model) - 绑定值（双向绑定），支持字符串、数字或空值，默认 ''
 * @attr {'text' | 'textarea' | 'password' | 'number' | ...} type - 输入框类型，支持原生 input 所有 type 属性及 textarea 模式，默认 'text'
 * @attr {'none' | 'both' | 'horizontal' | 'vertical'} resize - 控制文本域的尺寸可调整性，仅对 textarea 类型生效
 * @attr {boolean | { minRows?: number; maxRows?: number }} autosize - 文本域是否自适应高度，传入对象时可设置最小/最大行数，默认 false
 * @attr {string} autocomplete - 原生 autocomplete 属性，控制浏览器自动填充行为，默认 'off'
 * @attr {(value: string) => string} formatter - 输入内容格式化函数，用于在显示时格式化绑定的值
 * @attr {(value: string) => string} parser - 输入内容解析函数，用于将用户输入转换为绑定值，需要配合 formatter 使用
 * @attr {string} placeholder - 占位提示文字，在输入框为空时显示的灰色提示文本
 * @attr {string} form - 原生 form 属性，指定输入框所属的表单 ID
 * @attr {boolean} readonly - 是否只读状态，默认 false，只读状态下无法修改但可以选中和复制
 * @attr {boolean} clearable - 是否可清空，默认 false，为 true 时在获得焦点且非空时显示清除按钮
 * @attr {boolean} showPassword - 是否切换为密码框模式，默认 false，为 true 时显示密码显示/隐藏切换按钮
 * @attr {boolean} showWordLimit - 是否显示字数统计，默认 false，需配合 maxlength 属性使用，显示 当前字数/最大字数
 * @attr {Component | string} suffixIcon - 尾部图标组件，显示在输入框右侧（清除按钮左侧）
 * @attr {Component | string} prefixIcon - 头部图标组件，显示在输入框左侧
 * @attr {string} containerRole - 容器的 ARIA role 属性（内部属性，供 DatePicker 等组件使用）
 * @attr {string} label - 原生 aria-label 属性，用于无障碍访问时的标签描述
 * @attr {string | number} tabindex - 原生 tabindex 属性，控制 Tab 键聚焦顺序，默认 0
 * @attr {boolean} validateEvent - 是否触发表单验证，默认 true，当输入值改变时触发表单校验
 * @attr {StyleValue} inputStyle - 自定义输入框或文本域的内联样式，支持对象、数组或字符串形式
 *
 * @event {string} update:modelValue (v-model) - 绑定值变化时触发，返回更新后的字符串值
 * @event {string} input - 输入事件，用户每次按键或粘贴时实时触发，返回当前输入值
 * @event {string} change - 值改变事件，仅在失焦或按回车时触发，返回最终确认值
 * @event {FocusEvent} focus - 获取焦点时触发，返回原生 FocusEvent 对象
 * @event {FocusEvent} blur - 失去焦点时触发，返回原生 FocusEvent 对象
 * @event {} clear - 点击清空按钮时触发（仅在 clearable 为 true 时可用）
 * @event {MouseEvent} mouseleave - 鼠标移出输入框区域时触发
 * @event {MouseEvent} mouseenter - 鼠标移入输入框区域时触发
 * @event {KeyboardEvent | Event} keydown - 键盘按下事件触发，注意浏览器自动填充时可能返回 Event 而非 KeyboardEvent
 * @event {CompositionEvent} compositionstart - 开始中文输入法组合时触发
 * @event {CompositionEvent} compositionupdate - 中文输入法组合过程更新时触发
 * @event {CompositionEvent} compositionend - 结束中文输入法组合时触发
 *
 * @example
 * ```vue
 * <!-- 基础用法 -->
 * <el-input v-model="input" placeholder="请输入内容" />
 *
 * <!-- 可清空的输入框 -->
 * <el-input v-model="input" clearable />
 *
 * <!-- 密码框 -->
 * <el-input v-model="password" type="text" show-password />
 *
 * <!-- 文本域 -->
 * <el-input v-model="textarea" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" />
 *
 * <!-- 带前后缀图标 -->
 * <el-input v-model="input" prefix-icon="Search" suffix-icon="Calendar" />
 *
 * <!-- 限长输入 -->
 * <el-input v-model="input" maxlength="10" show-word-limit />
 * ```
 */

import { isString } from '@vue/shared'
import {
  buildProps,
  definePropType,
  iconPropType,
  mutable,
} from '@element-plus/utils'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { useSizeProp } from '@element-plus/hooks'
import type Input from './input.vue'
import type { ExtractPropTypes, StyleValue } from 'vue'

export type InputAutoSize = { minRows?: number; maxRows?: number } | boolean

export const inputProps = buildProps({
  /**
   * @description native input id
   */
  id: {
    type: String,
    default: undefined,
  },
  /**
   * @description input box size
   */
  size: useSizeProp,
  /**
   * @description whether to disable
   */
  disabled: Boolean,
  /**
   * @description binding value
   */
  modelValue: {
    type: definePropType<string | number | null | undefined>([
      String,
      Number,
      Object,
    ]),
    default: '',
  },
  /**
   * @description type of input
   */
  type: {
    type: String,
    default: 'text',
  },
  /**
   * @description control the resizability
   */
  resize: {
    type: String,
    values: ['none', 'both', 'horizontal', 'vertical'],
  },
  /**
   * @description whether textarea has an adaptive height
   */
  autosize: {
    type: definePropType<InputAutoSize>([Boolean, Object]),
    default: false,
  },
  /**
   * @description native input autocomplete
   */
  autocomplete: {
    type: String,
    default: 'off',
  },
  /**
   * @description format content
   */
  formatter: {
    type: Function,
  },
  /**
   * @description parse content
   */
  parser: {
    type: Function,
  },
  /**
   * @description placeholder
   */
  placeholder: {
    type: String,
  },
  /**
   * @description native input form
   */
  form: {
    type: String,
  },
  /**
   * @description native input readonly
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * @description native input readonly
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * @description toggleable password input
   */
  showPassword: {
    type: Boolean,
    default: false,
  },
  /**
   * @description word count
   */
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  /**
   * @description suffix icon
   */
  suffixIcon: {
    type: iconPropType,
  },
  /**
   * @description prefix icon
   */
  prefixIcon: {
    type: iconPropType,
  },
  /**
   * @description container role, internal properties provided for use by the picker component
   */
  containerRole: {
    type: String,
    default: undefined,
  },
  /**
   * @description native input aria-label
   */
  label: {
    type: String,
    default: undefined,
  },
  /**
   * @description input tabindex
   */
  tabindex: {
    type: [String, Number],
    default: 0,
  },
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
  /**
   * @description input or textarea element style
   */
  inputStyle: {
    type: definePropType<StyleValue>([Object, Array, String]),
    default: () => mutable({} as const),
  },
} as const)
export type InputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  [UPDATE_MODEL_EVENT]: (value: string) => isString(value),
  input: (value: string) => isString(value),
  change: (value: string) => isString(value),
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
  mouseleave: (evt: MouseEvent) => evt instanceof MouseEvent,
  mouseenter: (evt: MouseEvent) => evt instanceof MouseEvent,
  // NOTE: when autofill by browser, the keydown event is instanceof Event, not KeyboardEvent
  // relative bug report https://github.com/element-plus/element-plus/issues/6665
  keydown: (evt: KeyboardEvent | Event) => evt instanceof Event,
  compositionstart: (evt: CompositionEvent) => evt instanceof CompositionEvent,
  compositionupdate: (evt: CompositionEvent) => evt instanceof CompositionEvent,
  compositionend: (evt: CompositionEvent) => evt instanceof CompositionEvent,
}
export type InputEmits = typeof inputEmits

export type InputInstance = InstanceType<typeof Input>
