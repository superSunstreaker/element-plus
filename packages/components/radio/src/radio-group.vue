<template>
  <div
    :id="groupId"
    ref="radioGroupRef"
    :class="ns.b('group')"
    role="radiogroup"
    :aria-label="!isLabeledByFormItem ? label || 'radio-group' : undefined"
    :aria-labelledby="isLabeledByFormItem ? formItem!.labelId : undefined"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
/**
 * @summary ElRadioGroup 单选框组 - 管理一组单选框的选中值，提供统一的禁用、尺寸、激活配色
 *
 * ⚠️ 此组件为 ElRadio / ElRadioButton 的父容器，需配合子单选框使用
 *
 * @attr {string} id - 原生 id 属性
 * @attr {('large'|'default'|'small')} size - 子单选框或带边框单选框的尺寸
 * @attr {boolean} disabled - 是否禁用所有子单选框
 * @attr {string|number|boolean} modelValue - 双向绑定的当前选中值
 * @attr {string} fill - 按钮形态激活时的边框与背景色
 * @attr {string} label - 等同于 aria-label，供屏幕阅读器读取
 * @attr {string} textColor - 按钮形态激活时的文字颜色
 * @attr {string} name - 原生 name 属性，用于表单提交
 * @attr {boolean} validateEvent - 值变化时是否触发表单校验
 * @event {string|number|boolean} update:modelEvent - 选中值变化时触发
 * @event {string|number|boolean} change - 选中值变化时触发
 *
 * @example
 * ```vue
 * <el-radio-group v-model="picked">
 *   <el-radio label="A">选项 A</el-radio>
 *   <el-radio label="B">选项 B</el-radio>
 * </el-radio-group>
 * ```
 */
import {
  computed,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import { useFormItem, useFormItemInputId } from '@element-plus/components/form'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { useId, useNamespace } from '@element-plus/hooks'
import { debugWarn } from '@element-plus/utils'
import { radioGroupEmits, radioGroupProps } from './radio-group'
import { radioGroupKey } from './constants'

import type { RadioGroupProps } from './radio-group'

defineOptions({
  name: 'ElRadioGroup',
})

const props = defineProps(radioGroupProps)
const emit = defineEmits(radioGroupEmits)

const ns = useNamespace('radio')
const radioId = useId()
const radioGroupRef = ref<HTMLDivElement>()
const { formItem } = useFormItem()
const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
  formItemContext: formItem,
})

const changeEvent = (value: RadioGroupProps['modelValue']) => {
  emit(UPDATE_MODEL_EVENT, value)
  nextTick(() => emit('change', value))
}

onMounted(() => {
  const radios =
    radioGroupRef.value!.querySelectorAll<HTMLInputElement>('[type=radio]')
  const firstLabel = radios[0]
  if (!Array.from(radios).some((radio) => radio.checked) && firstLabel) {
    firstLabel.tabIndex = 0
  }
})

const name = computed(() => {
  return props.name || radioId.value
})

provide(
  radioGroupKey,
  reactive({
    ...toRefs(props),
    changeEvent,
    name,
  })
)

watch(
  () => props.modelValue,
  () => {
    if (props.validateEvent) {
      formItem?.validate('change').catch((err) => debugWarn(err))
    }
  }
)
</script>
