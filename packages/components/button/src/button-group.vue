<template>
  <div :class="`${ns.b('group')}`">
    <slot />
  </div>
</template>
<script lang="ts" setup>
/**
 * @summary ElButtonGroup 按钮组 - 将多个按钮组合为一组，统一控制尺寸与类型
 *
 * ⚠️ 此组件为 ElButton 的子组件，需配合 ElButton 使用
 *
 * @attr {('large'|'default'|'small')} size - 组内按钮的尺寸，会覆盖单个 ElButton 自身的 size
 * @attr {('primary'|'success'|'warning'|'danger'|'info'|'default')} type - 组内按钮的类型，会覆盖单个 ElButton 自身的 type
 *
 * @example
 * ```vue
 * <el-button-group>
 *   <el-button>上一页</el-button>
 *   <el-button>下一页</el-button>
 * </el-button-group>
 * ```
 */
import { provide, reactive, toRef } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { buttonGroupProps } from './button-group'
import { buttonGroupContextKey } from './constants'

defineOptions({
  name: 'ElButtonGroup',
})
const props = defineProps(buttonGroupProps)
provide(
  buttonGroupContextKey,
  reactive({
    size: toRef(props, 'size'),
    type: toRef(props, 'type'),
  })
)
const ns = useNamespace('button')
</script>
