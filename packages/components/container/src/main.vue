<template>
  <main :class="ns.b()">
    <slot />
  </main>
</template>
<script lang="ts" setup>
/**
 * @summary ElMain 主体内容容器 - el-container 的子组件，用于页面主要内容区域，默认渲染为 <main> 标签，自动填充剩余空间并内部滚动
 *
 * @example
 * ```vue
 * <el-container>
 *   <el-header>顶部</el-header>
 *   <el-main>这里是页面主要内容</el-main>
 * </el-container>
 * ```
 */
import { useNamespace } from '@element-plus/hooks'

defineOptions({
  name: 'ElMain',
})

const ns = useNamespace('main')
</script>
