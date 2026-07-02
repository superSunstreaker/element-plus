<template>
  <header :class="ns.b()" :style="style">
    <slot />
  </header>
</template>
<script lang="ts" setup>
/**
 * @summary ElHeader 顶栏容器 - el-container 的子组件，用于页面顶部区域（如导航栏、工具条），默认渲染为 <header> 标签，高度可通过 height 属性自定义
 *
 * @attr {string} height - 顶栏高度，默认不设置（继承 CSS 默认 60px）；支持任意 CSS 长度值如 '80px'、'10vh'
 *
 * @example
 * ```vue
 * <el-container>
 *   <el-header height="80px">顶部导航</el-header>
 *   <el-main>内容</el-main>
 * </el-container>
 * ```
 */
import { computed } from 'vue'
import { useNamespace } from '@element-plus/hooks'

import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElHeader',
})

const props = defineProps({
  /**
   * @description height of the header
   */
  height: {
    type: String,
    default: null,
  },
})

const ns = useNamespace('header')
const style = computed(() => {
  return props.height
    ? (ns.cssVarBlock({
        height: props.height,
      }) as CSSProperties)
    : {}
})
</script>
