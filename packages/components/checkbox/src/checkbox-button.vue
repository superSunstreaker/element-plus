<template>
  <label :class="labelKls">
    <input
      v-if="trueLabel || falseLabel"
      v-model="model"
      :class="ns.be('button', 'original')"
      type="checkbox"
      :name="name"
      :tabindex="tabindex"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      @change="handleChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @click.stop
    />
    <input
      v-else
      v-model="model"
      :class="ns.be('button', 'original')"
      type="checkbox"
      :name="name"
      :tabindex="tabindex"
      :disabled="isDisabled"
      :value="label"
      @change="handleChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @click.stop
    />

    <span
      v-if="$slots.default || label"
      :class="ns.be('button', 'inner')"
      :style="isChecked ? activeStyle : undefined"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
/**
 * @summary ElCheckboxButton 复选框按钮 - 以按钮形态呈现的复选项，需放在 ElCheckboxGroup 中使用
 *
 * ⚠️ 此组件为 ElCheckboxGroup 的子组件，需配合 ElCheckboxGroup 使用
 *
 * @attr {string|number|boolean} label - 当前选项对应的值
 * @attr {boolean} disabled - 是否禁用该复选按钮
 * @attr {string|number} trueLabel - 选中时代表的值
 * @attr {string|number} falseLabel - 未选中时代表的值
 * @attr {string} name - 原生 name 属性
 * @attr {number} tabindex - 原生 tabindex 属性
 *
 * @example
 * ```vue
 * <el-checkbox-group v-model="checked">
 *   <el-checkbox-button label="A">选项 A</el-checkbox-button>
 *   <el-checkbox-button label="B">选项 B</el-checkbox-button>
 * </el-checkbox-group>
 * ```
 */
import { computed, inject, useSlots } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { checkboxGroupContextKey } from './constants'
import { useCheckbox } from './composables'
import { checkboxEmits, checkboxProps } from './checkbox'

import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElCheckboxButton',
})

const props = defineProps(checkboxProps)
defineEmits(checkboxEmits)
const slots = useSlots()

const {
  isFocused,
  isChecked,
  isDisabled,
  checkboxButtonSize,
  model,
  handleChange,
} = useCheckbox(props, slots)
const checkboxGroup = inject(checkboxGroupContextKey, undefined)
const ns = useNamespace('checkbox')

const activeStyle = computed<CSSProperties>(() => {
  const fillValue = checkboxGroup?.fill?.value ?? ''
  return {
    backgroundColor: fillValue,
    borderColor: fillValue,
    color: checkboxGroup?.textColor?.value ?? '',
    boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : undefined,
  }
})

const labelKls = computed(() => {
  return [
    ns.b('button'),
    ns.bm('button', checkboxButtonSize.value),
    ns.is('disabled', isDisabled.value),
    ns.is('checked', isChecked.value),
    ns.is('focus', isFocused.value),
  ]
})
</script>
