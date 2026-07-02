<template>
  <component
    :is="tag"
    :id="groupId"
    :class="ns.b('group')"
    role="group"
    :aria-label="!isLabeledByFormItem ? label || 'checkbox-group' : undefined"
    :aria-labelledby="isLabeledByFormItem ? formItem?.labelId : undefined"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
/**
 * @summary ElCheckboxGroup 复选框组 - 管理多个复选框的选中值集合，提供统一的禁用、尺寸、范围限制
 *
 * ⚠️ 此组件为 ElCheckbox / ElCheckboxButton 的父容器，需配合子复选框使用
 *
 * @attr {Array} modelValue - 双向绑定的选中值数组
 * @attr {boolean} disabled - 是否禁用所有子复选框
 * @attr {number} min - 可勾选的最小数量
 * @attr {number} max - 可勾选的最大数量
 * @attr {('large'|'default'|'small')} size - 子复选框的尺寸
 * @attr {string} label - 供屏幕阅读器读取的分组标签
 * @attr {string} fill - 按钮形态激活时的边框与背景色
 * @attr {string} textColor - 按钮形态激活时的文字颜色
 * @attr {string} tag - 渲染的容器元素标签，默认 div
 * @attr {boolean} validateEvent - 值变化时是否触发表单校验
 * @event {Array} update:modelEvent - 选中值变化时触发
 * @event {Array} change - 选中值变化时触发
 *
 * @example
 * ```vue
 * <el-checkbox-group v-model="checked">
 *   <el-checkbox label="A">选项 A</el-checkbox>
 *   <el-checkbox label="B">选项 B</el-checkbox>
 * </el-checkbox-group>
 * ```
 */
import { computed, nextTick, provide, toRefs, watch } from 'vue'
import { pick } from 'lodash-unified'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { debugWarn } from '@element-plus/utils'
import { useNamespace } from '@element-plus/hooks'
import { useFormItem, useFormItemInputId } from '@element-plus/components/form'
import { checkboxGroupEmits, checkboxGroupProps } from './checkbox-group'
import { checkboxGroupContextKey } from './constants'

import type { CheckboxGroupValueType } from './checkbox-group'

defineOptions({
  name: 'ElCheckboxGroup',
})

const props = defineProps(checkboxGroupProps)
const emit = defineEmits(checkboxGroupEmits)
const ns = useNamespace('checkbox')

const { formItem } = useFormItem()
const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
  formItemContext: formItem,
})

const changeEvent = async (value: CheckboxGroupValueType) => {
  emit(UPDATE_MODEL_EVENT, value)
  await nextTick()
  emit('change', value)
}

const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(val: CheckboxGroupValueType) {
    changeEvent(val)
  },
})

provide(checkboxGroupContextKey, {
  ...pick(toRefs(props), [
    'size',
    'min',
    'max',
    'disabled',
    'validateEvent',
    'fill',
    'textColor',
  ]),
  modelValue,
  changeEvent,
})

watch(
  () => props.modelValue,
  () => {
    if (props.validateEvent) {
      formItem?.validate('change').catch((err) => debugWarn(err))
    }
  }
)
</script>
