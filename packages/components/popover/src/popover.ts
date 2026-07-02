/**
 * @summary ElPopover 弹出框 - 与 Tooltip 类似，但提供 title、width 等更丰富的展示能力，常用于承载更复杂的提示/操作内容
 *
 * @attr {string} trigger - 触发方式：'hover' | 'focus' | 'click' | 'contextmenu'，默认 'hover'
 * @attr {Placement} placement - 出现位置（参考 Tooltip 的 placement 值），默认 'bottom'
 * @attr {boolean} disabled - 是否禁用，默认 false
 * @attr {boolean} visible / v-model:visible - 是否显示，默认 false
 * @attr {string} transition - 动画名称，默认 'el-fade-in-linear'
 * @attr {Partial<Options>} popperOptions - 透传给 popper.js 的参数，默认 {}
 * @attr {number} tabindex - tabindex，默认 0
 * @attr {string} content - 显示的内容，也可通过具名 slot #content 覆盖，默认 ''
 * @attr {StyleValue} popperStyle - 自定义弹出样式
 * @attr {string} popperClass - 自定义弹出类名
 * @attr {boolean} enterable - 鼠标是否可进入弹出内容，默认 true
 * @attr {'dark' | 'light'} effect - 主题样式，默认 'light'
 * @attr {boolean} teleported - 是否 teleport 到 body，默认 true
 * @attr {string} title - 标题，默认 ''
 * @attr {string | number} width - 宽度，默认 150
 * @attr {number} offset - 出现位置的偏移量，默认 undefined（使用 popper 默认）
 * @attr {number} showAfter - 显示前的延迟（毫秒），默认 0
 * @attr {number} hideAfter - 隐藏前的延迟（毫秒），默认 200
 * @attr {number} autoClose - 自动隐藏的延迟（毫秒），默认 0
 * @attr {boolean} showArrow - 是否显示箭头，默认 true
 * @attr {boolean} persistent - 是否持久化（不销毁），默认 true
 *
 * @event {(visible: boolean) => void} update:visible - 可见性变化时触发，配合 v-model:visible
 * @event {() => void} before-enter - 显示动画开始前触发
 * @event {() => void} before-leave - 隐藏动画开始前触发
 * @event {() => void} after-enter - 显示动画结束时触发
 * @event {() => void} after-leave - 隐藏动画结束时触发
 *
 * @example 基础用法
 * ```vue
 * <template>
 *   <el-popover title="标题" content="这是一段内容" width="200" trigger="click">
 *     <template #reference>
 *       <el-button>点击触发</el-button>
 *     </template>
 *   </el-popover>
 * </template>
 * ```
 *
 * @example 嵌套操作按钮 + 自定义内容
 * ```vue
 * <template>
 *   <el-popover v-model:visible="visible" placement="top" width="240">
 *     <p>确认删除这条记录吗？</p>
 *     <div style="text-align: right; margin-top: 8px">
 *       <el-button size="small" @click="visible = false">取消</el-button>
 *       <el-button size="small" type="primary" @click="handleConfirm">确定</el-button>
 *     </div>
 *     <template #reference>
 *       <el-button type="danger">删除</el-button>
 *     </template>
 *   </el-popover>
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const visible = ref(false)
 * const handleConfirm = () => {
 *   console.log('已删除')
 *   visible.value = false
 * }
 * </script>
 * ```
 */

import { buildProps, isBoolean } from '@element-plus/utils'
import {
  useTooltipContentProps,
  useTooltipTriggerProps,
} from '@element-plus/components/tooltip'
import { dropdownProps } from '@element-plus/components/dropdown'
import type { ExtractPropTypes, PropType } from 'vue'
import type Popover from './popover.vue'

export const popoverProps = buildProps({
  trigger: useTooltipTriggerProps.trigger,
  placement: dropdownProps.placement,
  disabled: useTooltipTriggerProps.disabled,
  visible: useTooltipContentProps.visible,
  transition: useTooltipContentProps.transition,
  popperOptions: dropdownProps.popperOptions,
  tabindex: dropdownProps.tabindex,
  content: useTooltipContentProps.content,
  popperStyle: useTooltipContentProps.popperStyle,
  popperClass: useTooltipContentProps.popperClass,
  enterable: {
    ...useTooltipContentProps.enterable,
    default: true,
  },
  effect: {
    ...useTooltipContentProps.effect,
    default: 'light',
  },
  teleported: useTooltipContentProps.teleported,
  title: String,

  width: {
    type: [String, Number],
    default: 150,
  },
  offset: {
    type: Number,
    default: undefined,
  },
  showAfter: {
    type: Number,
    default: 0,
  },
  hideAfter: {
    type: Number,
    default: 200,
  },
  autoClose: {
    type: Number,
    default: 0,
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  persistent: {
    type: Boolean,
    default: true,
  },
  'onUpdate:visible': {
    type: Function as PropType<(visible: boolean) => void>,
  },
} as const)
export type PopoverProps = ExtractPropTypes<typeof popoverProps>

export const popoverEmits = {
  'update:visible': (value: boolean) => isBoolean(value),
  'before-enter': () => true,
  'before-leave': () => true,
  'after-enter': () => true,
  'after-leave': () => true,
}
export type PopoverEmits = typeof popoverEmits

export type PopoverInstance = InstanceType<typeof Popover>
