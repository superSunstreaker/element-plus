import { buildProps, definePropType } from '@element-plus/utils'
import type { ExtractPropTypes, StyleValue } from 'vue'
import type Teleport from './teleport.vue'

/**
 * @summary ElTeleport 传送门 - 将内容渲染到指定 DOM 节点的传送门组件
 *
 * 🔒 内部组件：主要为 Dialog、Drawer、Message、Notification、Popper 等需要脱离父级层叠上下文的组件提供传送能力，也可单独使用
 *
 * @attr {String} container - 目标容器选择器，默认 'body'
 * @attr {Boolean} disabled - 是否禁用传送（true 时内容留在原位），默认 false
 * @attr {String|Array|Object} style - 容器自定义样式
 * @attr {String} zIndex - 容器 z-index，默认 '2000'
 *
 * @usage
 * <!-- 内部用法：Dialog 用 ElTeleport 将自身传送到 body 避免层叠上下文问题 -->
 * <el-teleport container="body" :z-index="2000">
 *   <div>需要传送的内容</div>
 * </el-teleport>
 */
export const teleportProps = buildProps({
  container: {
    type: definePropType<string>(String),
    default: 'body',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  style: {
    type: definePropType<StyleValue>([String, Array, Object]),
  },
  zIndex: {
    type: String,
    default: '2000',
  },
} as const)

export type TeleportProps = ExtractPropTypes<typeof teleportProps>
export type TeleportInstance = InstanceType<typeof Teleport>
