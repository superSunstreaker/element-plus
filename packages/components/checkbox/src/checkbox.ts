/**
 * @summary ElCheckbox 复选框组件 - 用于在多个选项中进行单选或多选，支持双向绑定、半选状态、分组使用、禁用、自定义真/假值等场景
 *
 * @attr {Number|String|Boolean} modelValue - 双向绑定的选中值，配合 v-model 使用，默认 undefined
 * @attr {String|Boolean|Number|Object} label - 在 el-checkbox-group 中使用时作为该项的标识值；单独使用时可作为显示文本，默认 undefined
 * @attr {Boolean} indeterminate - 是否为半选（不确定）状态，仅控制样式展示，不影响实际选中值，默认 false
 * @attr {Boolean} disabled - 是否禁用复选框，默认 false
 * @attr {Boolean} checked - 是否默认选中，默认 false；仅在初始渲染时生效
 * @attr {String} name - 原生 name 属性，用于表单提交时标识字段，默认 undefined
 * @attr {String|Number} trueLabel - 选中状态下 modelValue 的取值，默认 undefined（默认为 true）
 * @attr {String|Number} falseLabel - 未选中状态下 modelValue 的取值，默认 undefined（默认为 false）
 * @attr {String} id - input 元素的 id 属性，用于关联 label，默认 undefined
 * @attr {String} controls - 关联元素 id，同 [aria-controls](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls)，仅在 indeterminate 为 true 时生效，默认 undefined
 * @attr {Boolean} border - 是否显示边框，默认 false
 * @attr {String} size - 复选框尺寸，可选值：'large' | 'default' | 'small'，默认 'default'
 * @attr {String|Number} tabindex - input 的 tabindex 属性，控制 tab 键焦点顺序，默认 undefined
 * @attr {Boolean} validateEvent - 值变化时是否触发表单校验，默认 true
 *
 * @event {(val: CheckboxValueType) => void} update:modelEvent - v-model 更新事件，回调参数为新的选中值
 * @event {(val: CheckboxValueType) => void} change - 选中状态变化时触发，回调参数为新的选中值
 *
 * @example
 * ```vue
 * <!-- 示例1：基础用法，单选与多选 -->
 * <el-checkbox v-model="checked">备选项</el-checkbox>
 * <el-checkbox-group v-model="checkList">
 *   <el-checkbox label="A">选项A</el-checkbox>
 *   <el-checkbox label="B">选项B</el-checkbox>
 *   <el-checkbox label="C">选项C</el-checkbox>
 * </el-checkbox-group>
 *
 * <!-- 示例2：高级用法，半选状态、自定义值与禁用 -->
 * <el-checkbox
 *   v-model="selectAll"
 *   :indeterminate="isIndeterminate"
 *   @change="handleCheckAll"
 * >全选</el-checkbox>
 * <el-checkbox
 *   v-model="value"
 *   :true-label="1"
 *   :false-label="0"
 *   disabled
 *   border
 *   size="small"
 * >自定义值（选中为1）</el-checkbox>
 * ```
 */
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { useSizeProp } from '@element-plus/hooks'
import { isBoolean, isNumber, isString } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'
import type Checkbox from './checkbox.vue'

export type CheckboxValueType = string | number | boolean

export const checkboxProps = {
  /**
   * @description binding value
   */
  modelValue: {
    type: [Number, String, Boolean],
    default: undefined,
  },
  /**
   * @description value of the Checkbox when used inside a `checkbox-group`
   */
  label: {
    type: [String, Boolean, Number, Object],
  },
  /**
   * @description Set indeterminate state, only responsible for style control
   */
  indeterminate: Boolean,
  /**
   * @description whether the Checkbox is disabled
   */
  disabled: Boolean,
  /**
   * @description if the Checkbox is checked
   */
  checked: Boolean,
  /**
   * @description native 'name' attribute
   */
  name: {
    type: String,
    default: undefined,
  },
  /**
   * @description value of the Checkbox if it's checked
   */
  trueLabel: {
    type: [String, Number],
    default: undefined,
  },
  /**
   * @description value of the Checkbox if it's not checked
   */
  falseLabel: {
    type: [String, Number],
    default: undefined,
  },
  /**
   * @description input id
   */
  id: {
    type: String,
    default: undefined,
  },
  /**
   * @description same as [aria-controls](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls), takes effect when `indeterminate` is `true`
   */
  controls: {
    type: String,
    default: undefined,
  },
  /**
   * @description whether to add a border around Checkbox
   */
  border: Boolean,
  /**
   * @description size of the Checkbox
   */
  size: useSizeProp,
  /**
   * @description input tabindex
   */
  tabindex: [String, Number],
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
}

export const checkboxEmits = {
  [UPDATE_MODEL_EVENT]: (val: CheckboxValueType) =>
    isString(val) || isNumber(val) || isBoolean(val),
  change: (val: CheckboxValueType) =>
    isString(val) || isNumber(val) || isBoolean(val),
}

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>
export type CheckboxEmits = typeof checkboxEmits
export type CheckboxInstance = InstanceType<typeof Checkbox>
