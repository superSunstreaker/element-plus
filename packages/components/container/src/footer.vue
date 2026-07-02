<template>
  <footer :class="ns.b()" :style="style">
    <slot />
  </footer>
</template>
<script lang="ts" setup>
/**
 * @summary ElFooter 底栏容器 - el-container 的子组件，用于页面底部区域（如版权信息、底部操作栏），默认渲染为 <footer> 标签，高度可通过 height 属性自定义
 *
 * @attr {string} height - 底栏高度，默认不设置（继承 CSS 默认 60px）；支持任意 CSS 长度值如 '60px'、'10vh'
 *
 * @example
 * ```vue
 * <el-container>
 *   <el-main>主体内容</el-main>
 *   <el-footer height="60px">© 2026 Company</el-footer>
 * </el-container>
 * ```
 */
import { computed } from 'vue'
import { useNamespace } from '@element-plus/hooks'

import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElFooter',
})
const props = defineProps({
  /**
   * @description height of the footer
   */
  height: {
    type: String,
    default: null,
  },
})

const ns = useNamespace('footer')

const style = computed(
  () =>
    (props.height
      ? ns.cssVarBlock({ height: props.height })
      : {}) as CSSProperties
)
</script>
