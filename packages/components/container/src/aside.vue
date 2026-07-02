<template>
  <aside :class="ns.b()" :style="style">
    <slot />
  </aside>
</template>
<script lang="ts" setup>
/**
 * @summary ElAside 侧边栏容器 - el-container 的子组件，用于页面侧边区域（如侧边菜单、筛选区），默认渲染为 <aside> 标签，宽度可通过 width 属性自定义
 *
 * @attr {string} width - 侧边栏宽度，默认不设置（继承 CSS 默认 300px）；支持任意 CSS 长度值如 '200px'、'20%'
 *
 * @example
 * ```vue
 * <el-container direction="horizontal">
 *   <el-aside width="200px">侧边菜单</el-aside>
 *   <el-main>主体内容</el-main>
 * </el-container>
 * ```
 */
import { computed } from 'vue'
import { useNamespace } from '@element-plus/hooks'

import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElAside',
})
const props = defineProps({
  /**
   * @description width of the side section
   */
  width: {
    type: String,
    default: null,
  },
})

const ns = useNamespace('aside')
const style = computed(
  () =>
    (props.width ? ns.cssVarBlock({ width: props.width }) : {}) as CSSProperties
)
</script>
