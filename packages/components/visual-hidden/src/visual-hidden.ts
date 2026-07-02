import { buildProps, definePropType } from '@element-plus/utils'
import type { StyleValue } from 'vue'

/**
 * @summary ElVisualHidden 视觉隐藏 - 将内容对视觉用户隐藏但保留给屏幕阅读器的无障碍工具组件
 *
 * 🔒 内部组件：主要为 Dialog、Drawer、Popconfirm 等需要向辅助技术提供隐藏文本的组件服务
 *
 * @attr {String|Array|Object} style - 额外自定义样式（会与隐藏样式合并），默认 {}
 *
 * @usage
 * <!-- 内部用法：Dialog 用 VisualHidden 为关闭按钮提供屏幕阅读器文本 -->
 * <el-visually-hidden>关闭对话框</el-visually-hidden>
 */
export const visualHiddenProps = buildProps({
  style: {
    type: definePropType<StyleValue>([String, Object, Array]),
    default: () => ({}),
  },
} as const)
