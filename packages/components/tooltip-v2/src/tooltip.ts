import { buildProps, definePropType } from '@element-plus/utils'
import { tooltipV2RootProps } from './root'
import { tooltipV2TriggerProps } from './trigger'
import { tooltipV2ArrowProps } from './arrow'
import { tooltipV2ContentProps } from './content'

import type { ExtractPropTypes, TeleportProps, TransitionProps } from 'vue'

/**
 * @summary ElTooltipV2 新版提示 - 基于 floating-ui 的新一代 Tooltip 组件（实验性）
 *
 * 🔒 内部组件：基于 floating-ui 重构的 Tooltip 实现，聚合 Root/Trigger/Content/Arrow 子组件能力
 *
 * @attr {Number} delayDuration - 显示延迟（ms），默认 300
 * @attr {Boolean} defaultOpen - 默认是否展开（非受控）
 * @attr {Boolean} open - 是否展开（受控，undefined 表示非受控）
 * @attr {Function} onOpenChange - 展开状态变化回调
 * @attr {Function} onUpdate:open - open 受控更新回调
 * @attr {String} ariaLabel - 内容的无障碍标签
 * @attr {Number} arrowPadding - 箭头与内容边缘的间距，默认 5
 * @attr {String} effect - 视觉主题（如 'dark'/'light'），默认 ''
 * @attr {String} contentClass - 内容自定义类名
 * @attr {Placement} placement - 内容相对触发元素的位置，默认 'bottom'
 *   可选: 'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'|
 *         'left'|'left-start'|'left-end'|'right'|'right-start'|'right-end'
 * @attr {HTMLElement|VirtualElement|null} reference - 定位参考元素（缺省时为 trigger），默认 null
 * @attr {Number} offset - 内容与参考元素的偏移，默认 8
 * @attr {'absolute'|'fixed'} strategy - 定位策略，默认 'absolute'
 * @attr {Boolean} showArrow - 是否显示箭头，默认 false
 * @attr {Boolean} alwaysOn - 是否常驻显示
 * @attr {Boolean} fullTransition - 是否使用完整过渡
 * @attr {TransitionProps|null} transitionProps - 自定义过渡属性，默认 null
 * @attr {Boolean} teleported - 是否传送到 body
 * @attr {String} to - 传送目标选择器，默认 'body'
 *
 * @usage
 * <el-tooltip-v2 placement="top" :show-arrow="true">
 *   <template #trigger>
 *     <button>悬停我</button>
 *   </template>
 *   提示内容
 * </el-tooltip-v2>
 */
export const tooltipV2Props = buildProps({
  ...tooltipV2RootProps,
  ...tooltipV2ArrowProps,
  ...tooltipV2TriggerProps,
  ...tooltipV2ContentProps,
  alwaysOn: Boolean,
  fullTransition: Boolean,
  transitionProps: {
    type: definePropType<TransitionProps | null>(Object),
    default: null,
  },
  teleported: Boolean,
  to: {
    type: definePropType<TeleportProps['to']>(String),
    default: 'body',
  },
} as const)

export type TooltipV2Props = ExtractPropTypes<typeof tooltipV2Props>
