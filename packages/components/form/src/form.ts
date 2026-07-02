/**
 * @summary ElForm 表单 - 由输入框、选择器、单选框、多选框等控件组成，用于收集、校验和提交数据
 *
 * @attr {ComponentSize} size - 用于控制该表单中所有组件的尺寸，可选值为 large / default / small，默认继承自父级 ConfigProvider
 * @attr {boolean} disabled - 是否禁用该表单中的所有组件，默认 false，若设置为 true，将覆盖内部组件自身的 disabled 属性
 * @attr {Record<string, any>} model - 表单数据对象，用于绑定表单组件的数据模型，配合 rules 进行校验
 * @attr {FormRules} rules - 表单验证规则，键名对应 model 中的字段名，值为该字段的校验规则数组
 * @attr {'left' | 'right' | 'top'} labelPosition - 表单域标签的位置，可选值为 left / right / top，默认 right；当设为 left 或 right 时，需同时设置 label-width
 * @attr {'left' | 'right'} requireAsteriskPosition - 必填字段的星号位置，可选值为 left / right，默认 left
 * @attr {string | number} labelWidth - 表单域标签的宽度，例如 '50px'，所有直接子级 form-item 会继承此值，也支持 'auto'，默认 ''
 * @attr {string} labelSuffix - 表单域标签的后缀，默认 ''
 * @attr {boolean} inline - 行内表单模式，默认 false，开启后表单项会横向排列在一行
 * @attr {boolean} inlineMessage - 是否以行内形式展示校验提示信息，默认 false
 * @attr {boolean} statusIcon - 是否在输入框中显示校验结果的反馈图标，默认 false
 * @attr {boolean} showMessage - 是否显示校验错误信息，默认 true
 * @attr {boolean} validateOnRuleChange - 是否在 rules 属性改变后立即触发校验，默认 true
 * @attr {boolean} hideRequiredAsterisk - 是否隐藏必填字段的红色星号，默认 false
 * @attr {boolean} scrollToError - 当校验失败时，是否滚动到第一个出错的表单项，默认 false
 * @attr {Object | boolean} scrollIntoViewOptions - 当校验失败时滚动到第一个出错表单项的配置项，同原生 scrollIntoView 的 options 参数，传 false 表示不滚动
 *
 * @event {(prop: FormItemProp, isValid: boolean, message: string) => void} validate - 任意表单项被校验后触发，返回被校验的字段名、是否通过校验及错误消息
 *
 * @example
 * ```vue
 * <template>
 *   <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
 *     <el-form-item label="用户名" prop="name">
 *       <el-input v-model="form.name" />
 *     </el-form-item>
 *     <el-form-item label="邮箱" prop="email">
 *       <el-input v-model="form.email" />
 *     </el-form-item>
 *     <el-form-item>
 *       <el-button type="primary" @click="submitForm">提交</el-button>
 *       <el-button @click="resetForm">重置</el-button>
 *     </el-form-item>
 *   </el-form>
 * </template>
 *
 * <script setup>
 * import { reactive, ref } from 'vue'
 * const formRef = ref()
 * const form = reactive({ name: '', email: '' })
 * const rules = {
 *   name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
 *   email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
 * }
 * const submitForm = () => formRef.value?.validate((valid) => {
 *   if (valid) console.log('提交成功', form)
 * })
 * const resetForm = () => formRef.value?.resetFields()
 * </script>
 * ```
 *
 * @example
 * ```vue
 * <template>
 *   <el-form :model="form" inline status-icon label-position="top">
 *     <el-form-item label="关键词">
 *       <el-input v-model="form.keyword" placeholder="搜索关键词" />
 *     </el-form-item>
 *     <el-form-item label="状态">
 *       <el-select v-model="form.status" placeholder="选择状态">
 *         <el-option label="启用" value="enabled" />
 *         <el-option label="禁用" value="disabled" />
 *       </el-select>
 *     </el-form-item>
 *     <el-form-item>
 *       <el-button type="primary">查询</el-button>
 *     </el-form-item>
 *   </el-form>
 * </template>
 *
 * <script setup>
 * import { reactive } from 'vue'
 * const form = reactive({ keyword: '', status: '' })
 * </script>
 * ```
 */

import { componentSizes } from '@element-plus/constants'
import {
  buildProps,
  definePropType,
  isArray,
  isBoolean,
  isString,
} from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'
import type { FormItemProp } from './form-item'
import type { FormRules } from './types'

const formMetaProps = buildProps({
  /**
   * @description Control the size of components in this form.
   */
  size: {
    type: String,
    values: componentSizes,
  },
  /**
   * @description Whether to disable all components in this form. If set to `true`, it will override the `disabled` prop of the inner component.
   */
  disabled: Boolean,
} as const)

export const formProps = buildProps({
  ...formMetaProps,
  /**
   * @description Data of form component.
   */
  model: Object,
  /**
   * @description Validation rules of form.
   */
  rules: {
    type: definePropType<FormRules>(Object),
  },
  /**
   * @description Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required.
   */
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top'],
    default: 'right',
  },
  /**
   * @description Position of asterisk.
   */
  requireAsteriskPosition: {
    type: String,
    values: ['left', 'right'],
    default: 'left',
  },
  /**
   * @description Width of label, e.g. `'50px'`. All its direct child form items will inherit this value. `auto` is supported.
   */
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  /**
   * @description Suffix of the label.
   */
  labelSuffix: {
    type: String,
    default: '',
  },
  /**
   * @description Whether the form is inline.
   */
  inline: Boolean,
  /**
   * @description Whether to display the error message inline with the form item.
   */
  inlineMessage: Boolean,
  /**
   * @description Whether to display an icon indicating the validation result.
   */
  statusIcon: Boolean,
  /**
   * @description Whether to show the error message.
   */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Whether to trigger validation when the `rules` prop is changed.
   */
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Whether to hide required fields should have a red asterisk (star) beside their labels.
   */
  hideRequiredAsterisk: Boolean,
  /**
   * @description When validation fails, scroll to the first error form entry.
   */
  scrollToError: Boolean,
  /**
   * @description When validation fails, it scrolls to the first error item based on the scrollIntoView option.
   */
  scrollIntoViewOptions: {
    type: [Object, Boolean],
  },
} as const)
export type FormProps = ExtractPropTypes<typeof formProps>
export type FormMetaProps = ExtractPropTypes<typeof formMetaProps>

export const formEmits = {
  validate: (prop: FormItemProp, isValid: boolean, message: string) =>
    (isArray(prop) || isString(prop)) &&
    isBoolean(isValid) &&
    isString(message),
}
export type FormEmits = typeof formEmits
