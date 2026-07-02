/**
 * @summary ElMessage 消息提示 - 用于全局展示操作反馈或轻量级通知的浮层消息
 *
 * ⚠️ 注意：此组件通过函数式 API（`ElMessage(...)`）调用，而非在模板中使用；
 * 调用后会动态挂载一个消息实例到 `appendTo` 指定的容器（默认 `document.body`）。
 *
 * @attr {string} customClass - 自定义类名，附加到消息根节点，默认 ''
 * @attr {boolean} center - 是否居中显示文本，默认 false
 * @attr {boolean} dangerouslyUseHTMLString - 是否将 `message` 作为 HTML 字符串渲染（注意 XSS 风险），默认 false
 * @attr {number} duration - 显示时长（毫秒）；设为 0 则不自动关闭，默认 3000
 * @attr {string | Component} icon - 自定义图标组件，设置后会覆盖 `type` 对应的默认图标
 * @attr {string} id - 消息 DOM 的 id（一般由内部生成，无需手动指定），默认 ''
 * @attr {string | VNode | (() => VNode)} message - 消息文本内容，支持字符串、VNode 或返回 VNode 的函数，默认 ''
 * @attr {() => void} onClose - 关闭时的回调函数（无参数）
 * @attr {boolean} showClose - 是否显示关闭按钮，默认 false
 * @attr {'success' | 'info' | 'warning' | 'error'} type - 消息类型，决定图标与主题色，默认 'info'
 * @attr {number} offset - 距离视口顶部的偏移量（像素），默认 16
 * @attr {number} zIndex - 消息的初始 z-index，默认 0（内部会自增管理）
 * @attr {boolean} grouping - 是否合并相同内容的消息（VNode 类型 message 不支持合并），默认 false
 * @attr {number} repeatNum - 重复次数（与 `grouping` 配合使用时作为初始计数，类似 badge），默认 1
 * @attr {HTMLElement | string} appendTo - 消息挂载的根节点（仅在 `MessageOptions` 中提供，默认 `document.body`）
 *
 * @method ElMessage(options) - 主调用方法，返回 MessageHandler
 * @method ElMessage.success(options) - 快捷方式，type 固定为 success
 * @method ElMessage.warning(options) - 快捷方式，type 固定为 warning
 * @method ElMessage.info(options) - 快捷方式，type 固定为 info
 * @method ElMessage.error(options) - 快捷方式，type 固定为 error
 * @method ElMessage.closeAll(type?) - 关闭所有消息实例，可选传入 type 仅关闭指定类型
 *
 * @returns {MessageHandler} 返回消息句柄，调用其 `close()` 方法可手动关闭该消息
 *
 * @example
 * // 示例1：基础调用（字符串作为 message）
 * ElMessage('这是一条消息提示')
 *
 * @example
 * // 示例2：指定类型与时长
 * ElMessage({ message: '操作成功', type: 'success', duration: 2000 })
 * // 等价于快捷方式
 * ElMessage.success({ message: '操作成功', duration: 2000 })
 *
 * @example
 * // 示例3：手动关闭 + 回调
 * const handler = ElMessage({ message: '3秒后自动关闭', showClose: true, onClose: () => console.log('closed') })
 * // 提前手动关闭
 * handler.close()
 *
 * @example
 * // 示例4：关闭所有消息
 * ElMessage.closeAll()
 * // 仅关闭 success 类型的消息
 * ElMessage.closeAll('success')
 */
import {
  buildProps,
  definePropType,
  iconPropType,
  isClient,
  mutable,
} from '@element-plus/utils'
import type { AppContext, ExtractPropTypes, VNode } from 'vue'
import type { Mutable } from '@element-plus/utils'
import type MessageConstructor from './message.vue'

export const messageTypes = ['success', 'info', 'warning', 'error'] as const

export type messageType = typeof messageTypes[number]

export interface MessageConfigContext {
  max?: number
}

export const messageDefaults = mutable({
  customClass: '',
  center: false,
  dangerouslyUseHTMLString: false,
  duration: 3000,
  icon: undefined,
  id: '',
  message: '',
  onClose: undefined,
  showClose: false,
  type: 'info',
  offset: 16,
  zIndex: 0,
  grouping: false,
  repeatNum: 1,
  appendTo: isClient ? document.body : (undefined as never),
} as const)

export const messageProps = buildProps({
  /**
   * @description custom class name for Message
   */
  customClass: {
    type: String,
    default: messageDefaults.customClass,
  },
  /**
   * @description whether to center the text
   */
  center: {
    type: Boolean,
    default: messageDefaults.center,
  },
  /**
   * @description whether `message` is treated as HTML string
   */
  dangerouslyUseHTMLString: {
    type: Boolean,
    default: messageDefaults.dangerouslyUseHTMLString,
  },
  /**
   * @description display duration, millisecond. If set to 0, it will not turn off automatically
   */
  duration: {
    type: Number,
    default: messageDefaults.duration,
  },
  /**
   * @description custom icon component, overrides `type`
   */
  icon: {
    type: iconPropType,
    default: messageDefaults.icon,
  },
  /**
   * @description message dom id
   */
  id: {
    type: String,
    default: messageDefaults.id,
  },
  /**
   * @description message text
   */
  message: {
    type: definePropType<string | VNode | (() => VNode)>([
      String,
      Object,
      Function,
    ]),
    default: messageDefaults.message,
  },
  /**
   * @description callback function when closed with the message instance as the parameter
   */
  onClose: {
    type: definePropType<() => void>(Function),
    required: false,
  },
  /**
   * @description whether to show a close button
   */
  showClose: {
    type: Boolean,
    default: messageDefaults.showClose,
  },
  /**
   * @description message type
   */
  type: {
    type: String,
    values: messageTypes,
    default: messageDefaults.type,
  },
  /**
   * @description set the distance to the top of viewport
   */
  offset: {
    type: Number,
    default: messageDefaults.offset,
  },
  /**
   * @description input box size
   */
  zIndex: {
    type: Number,
    default: messageDefaults.zIndex,
  },
  /**
   * @description merge messages with the same content, type of VNode message is not supported
   */
  grouping: {
    type: Boolean,
    default: messageDefaults.grouping,
  },
  /**
   * @description The number of repetitions, similar to badge, is used as the initial number when used with `grouping`
   */
  repeatNum: {
    type: Number,
    default: messageDefaults.repeatNum,
  },
} as const)
export type MessageProps = ExtractPropTypes<typeof messageProps>

export const messageEmits = {
  destroy: () => true,
}
export type MessageEmits = typeof messageEmits

export type MessageInstance = InstanceType<typeof MessageConstructor>

export type MessageOptions = Partial<
  Mutable<
    Omit<MessageProps, 'id'> & {
      appendTo?: HTMLElement | string
    }
  >
>
export type MessageParams = MessageOptions | MessageOptions['message']
export type MessageParamsNormalized = Omit<MessageProps, 'id'> & {
  /**
   * @description set the root element for the message, default to `document.body`
   */
  appendTo: HTMLElement
}
export type MessageOptionsWithType = Omit<MessageOptions, 'type'>
export type MessageParamsWithType =
  | MessageOptionsWithType
  | MessageOptions['message']

export interface MessageHandler {
  /**
   * @description close the Message
   */
  close: () => void
}

export type MessageFn = {
  (options?: MessageParams, appContext?: null | AppContext): MessageHandler
  closeAll(type?: messageType): void
}
export type MessageTypedFn = (
  options?: MessageParamsWithType,
  appContext?: null | AppContext
) => MessageHandler

export interface Message extends MessageFn {
  success: MessageTypedFn
  warning: MessageTypedFn
  info: MessageTypedFn
  error: MessageTypedFn
}
