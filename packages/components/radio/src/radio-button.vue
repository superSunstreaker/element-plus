<template>
  <label
    :class="[
      ns.b('button'),
      ns.is('active', modelValue === label),
      ns.is('disabled', disabled),
      ns.is('focus', focus),
      ns.bm('button', size),
    ]"
  >
    <input
      ref="radioRef"
      v-model="modelValue"
      :class="ns.be('button', 'original-radio')"
      :value="label"
      type="radio"
      :name="name || radioGroup?.name"
      :disabled="disabled"
      @focus="focus = true"
      @blur="focus = false"
      @click.stop
    />
    <span
      :class="ns.be('button', 'inner')"
      :style="modelValue === label ? activeStyle : {}"
      @keydown.stop
    >
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
/**
 * @summary ElRadioButton 单选按钮 - 以按钮形态呈现的单选项，需放在 ElRadioGroup 中使用
 *
 * ⚠️ 此组件为 ElRadioGroup 的子组件，需配合 ElRadioGroup 使用
 *
 * @attr {string|number|boolean} label - 当前选项对应的值，选中时与父组件 modelValue 相等
 * @attr {boolean} disabled - 是否禁用该单选按钮
 * @attr {string} name - 原生 name 属性，缺省时继承父组件
 *
 * @example
 * ```vue
 * <el-radio-group v-model="picked">
 *   <el-radio-button label="A">选项 A</el-radio-button>
 *   <el-radio-button label="B">选项 B</el-radio-button>
 * </el-radio-group>
 * ```
 */
import { computed } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { useRadio } from './use-radio'
import { radioButtonProps } from './radio-button'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElRadioButton',
})

const props = defineProps(radioButtonProps)

const ns = useNamespace('radio')
const { radioRef, focus, size, disabled, modelValue, radioGroup } =
  useRadio(props)

const activeStyle = computed<CSSProperties>(() => {
  return {
    backgroundColor: radioGroup?.fill || '',
    borderColor: radioGroup?.fill || '',
    boxShadow: radioGroup?.fill ? `-1px 0 0 0 ${radioGroup.fill}` : '',
    color: radioGroup?.textColor || '',
  }
})
</script>
