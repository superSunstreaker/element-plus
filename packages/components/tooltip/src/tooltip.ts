/**
 * @summary ElTooltip 文字提示 - 常用于展示鼠标 hover 时的提示信息，基于 Popper.js 实现，支持丰富的定位与触发方式
 *
 * @attr {string} content - 显示的内容，也可通过具名 slot #content 覆盖，默认 ''
 * @attr {boolean} rawContent - content 是否作为 HTML 字符串渲染，默认 false
 * @attr {Placement} placement - 出现位置（top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end），默认 'bottom'
 * @attr {'dark' | 'light'} effect - 主题样式，默认 'dark'
 * @attr {boolean | null} visible / v-model:visible - 是否显示 Tooltip，手动控制可见性时使用，默认 null
 * @attr {boolean} disabled - 是否禁用 Tooltip，默认 false
 * @attr {boolean} enterable - 鼠标是否可进入到 tooltip 内容中，默认 true
 * @attr {boolean} showArrow - 是否显示箭头，默认 true
 * @attr {number} arrowOffset - 箭头偏移量，默认 5
 * @attr {number} offset - 出现位置的偏移量，默认 12
 * @attr {'hover' | 'focus' | 'click' | 'contextmenu' | Array} trigger - 触发方式，默认 'hover'
 * @attr {string[]} triggerKeys - 键盘触发显示的按键码，默认 [Enter, Space]
 * @attr {number} showAfter - 显示前的延迟（毫秒），默认 0
 * @attr {number} hideAfter - 隐藏前的延迟（毫秒），默认 200
 * @attr {number} autoClose - 自动隐藏的延迟（毫秒），默认 0
 * @attr {string} transition - 动画名称
 * @attr {boolean} teleported - 是否将 tooltip 内容 teleport 到 append-to 指定节点，默认 true
 * @attr {string | HTMLElement} appendTo - tooltip 内容挂载到的元素，默认追加到 body
 * @attr {boolean} persistent - 当 tooltip 不显示且 persistent=false 时，popconfirm 会被销毁；默认 false（保持轻量）
 * @attr {boolean} virtualTriggering - 是否启用虚拟触发（不包裹真实子元素），默认 false
 * @attr {Measurable} virtualRef - 虚拟触发时的参照元素
 * @attr {string} popperClass - 弹出内容的自定义类名
 * @attr {StyleValue} popperStyle - 弹出内容的自定义样式
 * @attr {string} ariaLabel - 同原生 aria-label
 * @attr {Partial<Options>} popperOptions - 透传给 popper.js 的参数，默认 {}
 * @attr {'absolute' | 'fixed'} strategy - popper.js 的定位策略，默认 'absolute'
 * @attr {Placement[]} fallbackPlacements - popper.js 的回退位置
 * @attr {number} boundariesPadding - 边界内边距，默认 0
 * @attr {boolean} gpuAcceleration - 是否启用 GPU 加速，默认 true
 * @attr {boolean} pure - 是否为纯净模式（无默认样式），默认 false
 * @attr {boolean} focusOnShow - 显示时是否聚焦内容，默认 false
 * @attr {boolean} trapping - 是否在内容中锁定焦点，默认 false
 * @attr {boolean} stopPopperMouseEvent - 是否阻止弹出内容的鼠标事件冒泡，默认 true
 * @attr {number} zIndex - 层叠顺序
 *
 * @event {(visible: boolean) => void} update:visible - 可见性变化时触发，配合 v-model:visible
 * @event {() => void} before-show - 显示动画开始前触发
 * @event {() => void} before-hide - 隐藏动画开始前触发
 * @event {() => void} show - 显示时触发
 * @event {() => void} hide - 隐藏时触发
 * @event {() => void} open - 打开时触发（同 show 语义）
 * @event {() => void} close - 关闭时触发（同 hide 语义）
 *
 * @example 基础用法
 * ```vue
 * <template>
 *   <el-tooltip content="这里是提示文字" placement="top">
 *     <el-button>hover 我</el-button>
 *   </el-tooltip>
 * </template>
 * ```
 *
 * @example 自定义内容 + 点击触发 + 手动控制
 * ```vue
 * <template>
 *   <el-tooltip v-model:visible="visible" trigger="click" placement="right" :hide-after="0">
 *     <template #content>
 *       <span style="color: #409eff">自定义 HTML</span>
 *       <el-button link @click="visible = false">关闭</el-button>
 *     </template>
 *     <el-button>点击我</el-button>
 *   </el-tooltip>
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const visible = ref(false)
 * </script>
 * ```
 *
 * @example 虚拟触发（不包裹子元素）
 * ```vue
 * <template>
 *   <el-button ref="btnRef">虚拟触发</el-button>
 *   <el-tooltip
 *     :virtual-ref="btnRef?.$el"
 *     virtual-triggering
 *     content="由其他元素触发"
 *     placement="bottom"
 *   />
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const btnRef = ref()
 * </script>
 * ```
 */

import { buildProps } from '@element-plus/utils'
import { createModelToggleComposable } from '@element-plus/hooks'
import { popperArrowProps, popperProps } from '@element-plus/components/popper'
import { useTooltipContentProps } from './content'
import { useTooltipTriggerProps } from './trigger'
import type Tooltip from './tooltip.vue'

import type { ExtractPropTypes } from 'vue'

export const {
  useModelToggleProps: useTooltipModelToggleProps,
  useModelToggleEmits: useTooltipModelToggleEmits,
  useModelToggle: useTooltipModelToggle,
} = createModelToggleComposable('visible' as const)

export const useTooltipProps = buildProps({
  ...popperProps,
  ...useTooltipModelToggleProps,
  ...useTooltipContentProps,
  ...useTooltipTriggerProps,
  ...popperArrowProps,
  /**
   * @description whether the tooltip content has an arrow
   */
  showArrow: {
    type: Boolean,
    default: true,
  },
})

export const tooltipEmits = [
  ...useTooltipModelToggleEmits,
  'before-show',
  'before-hide',
  'show',
  'hide',
  'open',
  'close',
]

export type ElTooltipProps = ExtractPropTypes<typeof useTooltipProps>

export type TooltipInstance = InstanceType<typeof Tooltip>
