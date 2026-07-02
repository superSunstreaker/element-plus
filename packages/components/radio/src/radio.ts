/**
 * @summary ElRadio 单选框组件 - 用于在一组互斥选项中选择一个的单选控件，通常配合 ElRadioGroup 使用以实现联动
 *
 * @attr {ComponentSize} size - 单选框尺寸，可选值 'large' | 'default' | 'small'
 * @attr {Boolean} disabled - 是否禁用；默认 false
 * @attr {String|Number|Boolean} label - 单选框对应的值（在 ElRadioGroup 中用于匹配 v-model 以判断选中态）；默认 ''
 * @attr {String|Number|Boolean} modelValue - 绑定值（ElRadio 单独使用时）；默认 ''
 * @attr {String} name - 原生 name 属性；默认 ''
 * @attr {Boolean} border - 是否显示边框；默认 false
 *
 * @event {String|Number|Boolean} update:modelValue - 值变化时触发，返回选中项 label
 * @event {String|Number|Boolean} change - 值变化时触发，返回选中项 label
 *
 * @example
 * ```vue
 * <el-radio v-model="picked" label="1">备选项 A</el-radio>
 *
 * <el-radio-group v-model="picked">
 *   <el-radio label="1">备选项 A</el-radio>
 *   <el-radio label="2">备选项 B</el-radio>
 * </el-radio-group>
 * ```
 */
import { buildProps, isBoolean, isNumber, isString } from '@element-plus/utils'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { useSizeProp } from '@element-plus/hooks'
import type { ExtractPropTypes } from 'vue'
import type Radio from './radio.vue'

export const radioPropsBase = buildProps({
  /**
   * @description size of the Radio
   */
  size: useSizeProp,
  /**
   * @description whether Radio is disabled
   */
  disabled: Boolean,
  /**
   * @description the value of Radio
   */
  label: {
    type: [String, Number, Boolean],
    default: '',
  },
})

export const radioProps = buildProps({
  ...radioPropsBase,
  /**
   * @description binding value
   */
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  /**
   * @description native `name` attribute
   */
  name: {
    type: String,
    default: '',
  },
  /**
   * @description whether to add a border around Radio
   */
  border: Boolean,
} as const)

export const radioEmits = {
  [UPDATE_MODEL_EVENT]: (val: string | number | boolean) =>
    isString(val) || isNumber(val) || isBoolean(val),
  [CHANGE_EVENT]: (val: string | number | boolean) =>
    isString(val) || isNumber(val) || isBoolean(val),
}

export type RadioProps = ExtractPropTypes<typeof radioProps>
export type RadioEmits = typeof radioEmits
export type RadioInstance = InstanceType<typeof Radio>
