<template>
  <i :class="ns.b()" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script lang="ts" setup>
/**
 * @summary ElIcon 图标容器 - 用于包裹 SVG 图标并统一尺寸、颜色与行内对齐
 *
 * ⚠️ 此组件为通用图标容器，需配合具体 SVG 图标组件使用（如 @element-plus/icons-vue）
 *
 * @attr {number|string} size - 图标尺寸，数字按 px 处理
 * @attr {string} color - SVG 的 fill 颜色
 *
 * @example
 * ```vue
 * <el-icon :size="20" color="#409EFF">
 *   <Edit />
 * </el-icon>
 * ```
 */
import { computed } from 'vue'
import { addUnit, isUndefined } from '@element-plus/utils'
import { useNamespace } from '@element-plus/hooks'
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElIcon',
  inheritAttrs: false,
})
const props = defineProps(iconProps)
const ns = useNamespace('icon')

const style = computed<CSSProperties>(() => {
  const { size, color } = props
  if (!size && !color) return {}

  return {
    fontSize: isUndefined(size) ? undefined : addUnit(size),
    '--color': color,
  }
})
</script>
