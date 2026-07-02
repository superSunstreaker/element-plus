/**
 * @summary ElMessageBox 消息弹框 - 模拟系统弹窗，用于二次确认、提示输入或展示重要信息
 *
 * ⚠️ 注意：此组件通过函数式 API（`ElMessageBox.alert/confirm/prompt(...)`）调用，
 * 而非在模板中使用；调用后返回 Promise，可通过 then/catch 或 callback 处理用户操作结果。
 *
 * 配置项详见 `ElMessageBoxOptions`（message-box.type.ts），核心项列举如下：
 *
 * @attr {string | VNode | (() => VNode)} message - 弹框正文内容
 * @attr {string | ElMessageBoxOptions} title - 弹框标题
 * @attr {'success' | 'warning' | 'info' | 'error' | ''} type - 消息类型，决定图标显示
 * @attr {string | Component} icon - 自定义图标组件，会覆盖 `type` 对应的默认图标
 * @attr {string} customClass - 自定义类名
 * @attr {CSSProperties} customStyle - 自定义内联样式
 * @attr {boolean} showConfirmButton - 是否显示确认按钮，默认 true
 * @attr {boolean} showCancelButton - 是否显示取消按钮，默认 false（confirm/prompt 自动开启）
 * @attr {string} confirmButtonText - 确认按钮文本
 * @attr {string} cancelButtonText - 取消按钮文本
 * @attr {string} confirmButtonClass - 确认按钮自定义类名
 * @attr {string} cancelButtonClass - 取消按钮自定义类名
 * @attr {boolean} confirmButtonLoading - 确认按钮是否处于 loading 状态
 * @attr {boolean} cancelButtonLoading - 取消按钮是否处于 loading 状态
 * @attr {boolean} confirmButtonDisabled - 是否禁用确认按钮
 * @attr {boolean} buttonReverse - 是否反转确认/取消按钮顺序（注：由 roundButton 等周边配置间接体现）
 * @attr {boolean} distinguishCancelAndClose - 是否区分「取消」与「关闭」动作（影响 Promise reject 的 reason）
 * @attr {boolean} center - 是否居中对齐内容
 * @attr {boolean} roundButton - 是否使用圆角按钮，默认 false
 * @attr {ComponentSize} buttonSize - 自定义确认/取消按钮尺寸（large/default/small）
 * @attr {boolean} closeOnClickModal - 是否允许点击遮罩关闭弹框，默认 true（alert 默认 false）
 * @attr {boolean} closeOnPressEscape - 是否允许按 ESC 关闭弹框，默认 true（alert 默认 false）
 * @attr {boolean} closeOnHashChange - 是否在 hash 变化时关闭弹框，默认 true
 * @attr {boolean} showClose - 是否显示右上角关闭按钮，默认 true
 * @attr {boolean} lockScroll - 是否在弹框出现时锁定 body 滚动，默认 true
 * @attr {boolean} draggable - 是否可拖拽弹框，默认 false
 * @attr {boolean} autofocus - 打开弹框时是否自动聚焦，默认 true
 * @attr {boolean} showInput - 是否显示输入框（prompt 自动开启），默认 false
 * @attr {string} inputType - 输入框类型（text/textArea/password/number 等），默认 'text'
 * @attr {string} inputValue - 输入框初始值
 * @attr {string} inputPlaceholder - 输入框占位符
 * @attr {RegExp} inputPattern - 输入框校验正则
 * @attr {MessageBoxInputValidator} inputValidator - 输入框校验函数，返回 boolean 或 string（string 会作为错误信息）
 * @attr {string} inputErrorMessage - 校验失败时的错误提示文本
 * @attr {boolean} dangerouslyUseHTMLString - 是否将 `message` 作为 HTML 字符串渲染（注意 XSS 风险）
 * @attr {Callback} callback - 不使用 Promise 时的关闭回调，接收 (value, action) 或 (action)
 * @attr {(action, instance, done) => void} beforeClose - 关闭前的回调，调用 `done()` 才会真正关闭
 * @attr {HTMLElement | string} appendTo - 弹框挂载的根节点，默认 document.body
 * @attr {MessageBoxType} boxType - 弹框类型（alert/confirm/prompt），一般由对应快捷方法自动设置
 *
 * @method ElMessageBox(options) - 通用调用方法，返回 Promise<MessageBoxData>
 * @method ElMessageBox.alert(message, title?, options?) - 警告弹框（默认无取消按钮、不可点击遮罩/ESC 关闭）
 * @method ElMessageBox.confirm(message, title?, options?) - 确认弹框（默认显示取消按钮）
 * @method ElMessageBox.prompt(message, title?, options?) - 输入弹框（默认显示取消按钮与输入框）
 * @method ElMessageBox.close() - 关闭当前所有已打开的弹框实例
 *
 * @returns {Promise<MessageBoxData>} 返回 Promise：
 *   - 用户点击「确认」时 resolve，值为 'confirm'（无输入框）或 { value, action }（有输入框）；
 *   - 用户点击「取消」或「关闭」时 reject，reason 为 'cancel' 或 'close'（取决于 distinguishCancelAndClose）。
 *
 * @example
 * // 示例1：Alert 警告弹框
 * ElMessageBox.alert('这是一段内容', '标题', {
 *   confirmButtonText: '确定',
 *   type: 'warning'
 * }).then(() => {
 *   // 用户点击确认
 * })
 *
 * @example
 * // 示例2：Confirm 确认弹框（Promise 链式）
 * ElMessageBox.confirm('此操作将永久删除该文件，是否继续？', '提示', {
 *   confirmButtonText: '确定',
 *   cancelButtonText: '取消',
 *   type: 'warning'
 * }).then(() => {
 *   // 确认
 * }).catch((action) => {
 *   // action === 'cancel' 或 'close'
 * })
 *
 * @example
 * // 示例3：Prompt 输入弹框
 * ElMessageBox.prompt('请输入邮箱', '提示', {
 *   confirmButtonText: '确定',
 *   cancelButtonText: '取消',
 *   inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+@[\w](?:[\w-]*[\w])?(?:\.[\w](?:[\w-]*[\w])?)*/,
 *   inputErrorMessage: '邮箱格式不正确'
 * }).then(({ value }) => {
 *   // value 为用户输入内容
 * }).catch(() => {
 *   // 取消
 * })
 *
 * @example
 * // 示例4：使用 callback 而非 Promise
 * ElMessageBox.confirm('测试 callback', '提示', {
 *   callback: (action) => {
 *     console.log(action) // 'confirm' | 'cancel' | 'close'
 *   }
 * })
 *
 * @example
 * // 示例5：beforeClose 拦截关闭
 * ElMessageBox.confirm('确定要提交吗？', '提示', {
 *   beforeClose: (action, instance, done) => {
 *     if (action === 'confirm') {
 *       instance.confirmButtonLoading = true
 *       submitForm().then(() => done()).finally(() => {
 *         instance.confirmButtonLoading = false
 *       })
 *     } else {
 *       done()
 *     }
 *   }
 * })
 */
import { createVNode, render } from 'vue'
import {
  debugWarn,
  hasOwn,
  isClient,
  isElement,
  isFunction,
  isObject,
  isString,
  isUndefined,
  isVNode,
} from '@element-plus/utils'
import MessageBoxConstructor from './index.vue'

import type { AppContext, ComponentPublicInstance, VNode } from 'vue'
import type {
  Action,
  Callback,
  ElMessageBoxOptions,
  ElMessageBoxShortcutMethod,
  IElMessageBox,
  MessageBoxData,
  MessageBoxState,
} from './message-box.type'

// component default merge props & data

const messageInstance = new Map<
  ComponentPublicInstance<{ doClose: () => void }>, // marking doClose as function
  {
    options: any
    callback: Callback | undefined
    resolve: (res: any) => void
    reject: (reason?: any) => void
  }
>()

const getAppendToElement = (props: any): HTMLElement => {
  let appendTo: HTMLElement | null = document.body
  if (props.appendTo) {
    if (isString(props.appendTo)) {
      appendTo = document.querySelector<HTMLElement>(props.appendTo)
    }
    if (isElement(props.appendTo)) {
      appendTo = props.appendTo
    }

    // should fallback to default value with a warning
    if (!isElement(appendTo)) {
      debugWarn(
        'ElMessageBox',
        'the appendTo option is not an HTMLElement. Falling back to document.body.'
      )
      appendTo = document.body
    }
  }
  return appendTo
}

const initInstance = (
  props: any,
  container: HTMLElement,
  appContext: AppContext | null = null
) => {
  const vnode = createVNode(
    MessageBoxConstructor,
    props,
    isFunction(props.message) || isVNode(props.message)
      ? {
          default: isFunction(props.message)
            ? props.message
            : () => props.message,
        }
      : null
  )
  vnode.appContext = appContext
  render(vnode, container)
  getAppendToElement(props).appendChild(container.firstElementChild!)
  return vnode.component
}

const genContainer = () => {
  return document.createElement('div')
}

const showMessage = (options: any, appContext?: AppContext | null) => {
  const container = genContainer()
  // Adding destruct method.
  // when transition leaves emitting `vanish` evt. so that we can do the clean job.
  options.onVanish = () => {
    // not sure if this causes mem leak, need proof to verify that.
    // maybe calling out like 1000 msg-box then close them all.
    render(null, container)
    messageInstance.delete(vm) // Remove vm to avoid mem leak.
    // here we were suppose to call document.body.removeChild(container.firstElementChild)
    // but render(null, container) did that job for us. so that we do not call that directly
  }

  options.onAction = (action: Action) => {
    const currentMsg = messageInstance.get(vm)!
    let resolve: Action | { value: string; action: Action }
    if (options.showInput) {
      resolve = { value: vm.inputValue, action }
    } else {
      resolve = action
    }
    if (options.callback) {
      options.callback(resolve, instance.proxy)
    } else {
      if (action === 'cancel' || action === 'close') {
        if (options.distinguishCancelAndClose && action !== 'cancel') {
          currentMsg.reject('close')
        } else {
          currentMsg.reject('cancel')
        }
      } else {
        currentMsg.resolve(resolve)
      }
    }
  }

  const instance = initInstance(options, container, appContext)!

  // This is how we use message box programmably.
  // Maybe consider releasing a template version?
  // get component instance like v2.
  const vm = instance.proxy as ComponentPublicInstance<
    {
      visible: boolean
      doClose: () => void
    } & MessageBoxState
  >

  for (const prop in options) {
    if (hasOwn(options, prop) && !hasOwn(vm.$props, prop)) {
      vm[prop as keyof ComponentPublicInstance] = options[prop]
    }
  }

  // change visibility after everything is settled
  vm.visible = true
  return vm
}

async function MessageBox(
  options: ElMessageBoxOptions,
  appContext?: AppContext | null
): Promise<MessageBoxData>
function MessageBox(
  options: ElMessageBoxOptions | string | VNode,
  appContext: AppContext | null = null
): Promise<{ value: string; action: Action } | Action> {
  if (!isClient) return Promise.reject()
  let callback: Callback | undefined
  if (isString(options) || isVNode(options)) {
    options = {
      message: options,
    }
  } else {
    callback = options.callback
  }

  return new Promise((resolve, reject) => {
    const vm = showMessage(
      options,
      appContext ?? (MessageBox as IElMessageBox)._context
    )
    // collect this vm in order to handle upcoming events.
    messageInstance.set(vm, {
      options,
      callback,
      resolve,
      reject,
    })
  })
}

const MESSAGE_BOX_VARIANTS = ['alert', 'confirm', 'prompt'] as const
const MESSAGE_BOX_DEFAULT_OPTS: Record<
  typeof MESSAGE_BOX_VARIANTS[number],
  Partial<ElMessageBoxOptions>
> = {
  alert: { closeOnPressEscape: false, closeOnClickModal: false },
  confirm: { showCancelButton: true },
  prompt: { showCancelButton: true, showInput: true },
}

MESSAGE_BOX_VARIANTS.forEach((boxType) => {
  ;(MessageBox as IElMessageBox)[boxType] = messageBoxFactory(
    boxType
  ) as ElMessageBoxShortcutMethod
})

function messageBoxFactory(boxType: typeof MESSAGE_BOX_VARIANTS[number]) {
  return (
    message: string | VNode,
    title: string | ElMessageBoxOptions,
    options?: ElMessageBoxOptions,
    appContext?: AppContext | null
  ) => {
    let titleOrOpts = ''
    if (isObject(title)) {
      options = title as ElMessageBoxOptions
      titleOrOpts = ''
    } else if (isUndefined(title)) {
      titleOrOpts = ''
    } else {
      titleOrOpts = title as string
    }

    return MessageBox(
      Object.assign(
        {
          title: titleOrOpts,
          message,
          type: '',
          ...MESSAGE_BOX_DEFAULT_OPTS[boxType],
        },
        options,
        {
          boxType,
        }
      ),
      appContext
    )
  }
}

MessageBox.close = () => {
  // instance.setupInstall.doClose()
  // instance.setupInstall.state.visible = false

  messageInstance.forEach((_, vm) => {
    vm.doClose()
  })

  messageInstance.clear()
}
;(MessageBox as IElMessageBox)._context = null

export default MessageBox as IElMessageBox
