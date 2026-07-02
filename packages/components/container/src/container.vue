<template>
  <section :class="[ns.b(), ns.is('vertical', isVertical)]">
    <slot />
  </section>
</template>
<script lang="ts" setup>
/**
 * @summary ElContainer 布局容器 - 页面布局的外层容器，常与 el-header/el-aside/el-main/el-footer 组合使用构建后台管理页面整体框架，会根据子组件自动判断水平或垂直排列
 *
 * @attr {'horizontal' | 'vertical'} direction - 子元素排列方向，可选 horizontal（水平）/ vertical（垂直）；未设置时若子级含 el-header 或 el-footer 则自动为 vertical，否则为 horizontal
 *
 * @example
 * ```vue
 * <!-- 示例1：常见后台布局（上中下 + 侧边） -->
 * <el-container>
 *   <el-header>Header</el-header>
 *   <el-container>
 *     <el-aside width="200px">Aside</el-aside>
 *     <el-main>Main</el-main>
 *   </el-container>
 *   <el-footer>Footer</el-footer>
 * </el-container>
 *
 * <!-- 示例2：水平方向（侧边 + 主体） -->
 * <el-container direction="horizontal">
 *   <el-aside>Aside</el-aside>
 *   <el-main>Main</el-main>
 * </el-container>
 * ```
 */
import { computed, useSlots } from 'vue'
import { useNamespace } from '@element-plus/hooks'

import type { Component, VNode } from 'vue'

defineOptions({
  name: 'ElContainer',
})
const props = defineProps({
  /**
   * @description layout direction for child elements
   */
  direction: {
    type: String,
  },
})
const slots = useSlots()

const ns = useNamespace('container')

const isVertical = computed(() => {
  if (props.direction === 'vertical') {
    return true
  } else if (props.direction === 'horizontal') {
    return false
  }
  if (slots && slots.default) {
    const vNodes: VNode[] = slots.default()
    return vNodes.some((vNode) => {
      const tag = (vNode.type as Component).name
      return tag === 'ElHeader' || tag === 'ElFooter'
    })
  } else {
    return false
  }
})
</script>
