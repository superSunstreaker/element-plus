/**
 * @summary ElNotification 通知 - 在页面角落悬浮展示较长时间的通知消息
 *
 * ⚠️ 注意：此组件通过函数式 API（`ElNotification(...)`）调用，而非在模板中使用；
 * 调用后会动态挂载通知实例到 `appendTo` 指定的容器（默认 `document.body`），
 * 并按 `position` 在对应角落堆叠排列。
 *
 * @attr {string} customClass - 自定义类名，附加到通知根节点，默认 ''
 * @attr {boolean} dangerouslyUseHTMLString - 是否将 `message` 作为 HTML 字符串渲染（注意 XSS 风险），默认 false
 * @attr {number} duration - 显示时长（毫秒）；设为 0 则不自动关闭，默认 4500
 * @attr {string | Component} icon - 自定义图标组件，会被 `type` 对应的默认图标覆盖
 * @attr {string} id - 通知 DOM 的 id（一般由内部生成，无需手动指定），默认 ''
 * @attr {string | VNode} message - 描述文本内容，支持字符串或 VNode，默认 ''
 * @attr {number} offset - 相对屏幕边缘的偏移量（像素）；同一时刻的多个通知应使用相同 offset，默认 0
 * @attr {() => void} onClick - 通知被点击时的回调函数
 * @attr {() => void} onClose - 关闭时的回调函数（必填）
 * @attr {'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'} position - 显示位置，默认 'top-right'
 * @attr {boolean} showClose - 是否显示关闭按钮，默认 true
 * @attr {string} title - 标题文本，默认 ''
 * @attr {'success' | 'info' | 'warning' | 'error' | ''} type - 通知类型，决定图标与主题色，默认 ''
 * @attr {number} zIndex - 初始 z-index
 * @attr {HTMLElement | string} appendTo - 通知挂载的根节点（仅在 `NotificationOptions` 中提供，默认 `document.body`）
 *
 * @method ElNotification(options) - 主调用方法，返回 NotificationHandle
 * @method ElNotification.success(options) - 快捷方式，type 固定为 success
 * @method ElNotification.warning(options) - 快捷方式，type 固定为 warning
 * @method ElNotification.error(options) - 快捷方式，type 固定为 error
 * @method ElNotification.info(options) - 快捷方式，type 固定为 info
 * @method ElNotification.closeAll() - 关闭所有通知实例
 *
 * @returns {NotificationHandle} 返回通知句柄，调用其 `close()` 方法可手动关闭该通知
 *
 * @example
 * // 示例1：基础调用（字符串作为 message）
 * ElNotification('这是一条通知')
 *
 * @example
 * // 示例2：指定标题、类型与位置
 * ElNotification({
 *   title: '提示',
 *   message: '您有一条新消息',
 *   type: 'success',
 *   position: 'bottom-right',
 *   duration: 0
 * })
 * // 等价于快捷方式
 * ElNotification.success({ title: '提示', message: '您有一条新消息' })
 *
 * @example
 * // 示例3：手动关闭 + 点击回调
 * const handle = ElNotification({
 *   title: '可点击通知',
 *   message: '点击我或等待 5 秒自动关闭',
 *   onClick: () => console.log('clicked'),
 *   onClose: () => console.log('closed')
 * })
 * // 提前手动关闭
 * handle.close()
 *
 * @example
 * // 示例4：关闭所有通知
 * ElNotification.closeAll()
 */
import { buildProps, definePropType, iconPropType } from '@element-plus/utils'

import type { ExtractPropTypes, VNode } from 'vue'
import type Notification from './notification.vue'

export const notificationTypes = [
  'success',
  'info',
  'warning',
  'error',
] as const

export const notificationProps = buildProps({
  /**
   * @description custom class name for Notification
   */
  customClass: {
    type: String,
    default: '',
  },
  /**
   * @description whether `message` is treated as HTML string
   */
  dangerouslyUseHTMLString: {
    type: Boolean,
    default: false,
  },
  /**
   * @description duration before close. It will not automatically close if set 0
   */
  duration: {
    type: Number,
    default: 4500,
  },
  /**
   * @description custom icon component. It will be overridden by `type`
   */
  icon: {
    type: iconPropType,
  },
  /**
   * @description notification dom id
   */
  id: {
    type: String,
    default: '',
  },
  /**
   * @description description text
   */
  message: {
    type: definePropType<string | VNode>([String, Object]),
    default: '',
  },
  /**
   * @description offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset
   */
  offset: {
    type: Number,
    default: 0,
  },
  /**
   * @description callback function when notification clicked
   */
  onClick: {
    type: definePropType<() => void>(Function),
    default: () => undefined,
  },
  /**
   * @description callback function when closed
   */
  onClose: {
    type: definePropType<() => void>(Function),
    required: true,
  },
  /**
   * @description custom position
   */
  position: {
    type: String,
    values: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    default: 'top-right',
  },
  /**
   * @description whether to show a close button
   */
  showClose: {
    type: Boolean,
    default: true,
  },
  /**
   * @description title
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * @description notification type
   */
  type: {
    type: String,
    values: [...notificationTypes, ''],
    default: '',
  },
  /**
   * @description initial zIndex
   */
  zIndex: Number,
} as const)
export type NotificationProps = ExtractPropTypes<typeof notificationProps>

export const notificationEmits = {
  destroy: () => true,
}
export type NotificationEmits = typeof notificationEmits

export type NotificationInstance = InstanceType<typeof Notification>

export type NotificationOptions = Omit<NotificationProps, 'id'> & {
  /**
   * @description set the root element for the notification, default to `document.body`
   */
  appendTo?: HTMLElement | string
}
export type NotificationOptionsTyped = Omit<NotificationOptions, 'type'>

export interface NotificationHandle {
  close: () => void
}

export type NotificationParams = Partial<NotificationOptions> | string | VNode
export type NotificationParamsTyped =
  | Partial<NotificationOptionsTyped>
  | string
  | VNode

export type NotifyFn = ((
  options?: NotificationParams
) => NotificationHandle) & { closeAll: () => void }

export type NotifyTypedFn = (
  options?: NotificationParamsTyped
) => NotificationHandle

export interface Notify extends NotifyFn {
  success: NotifyTypedFn
  warning: NotifyTypedFn
  error: NotifyTypedFn
  info: NotifyTypedFn
}

export interface NotificationQueueItem {
  vm: VNode
}

export type NotificationQueue = NotificationQueueItem[]
