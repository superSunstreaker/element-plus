import {
  Transition,
  createApp,
  createVNode,
  defineComponent,
  h,
  reactive,
  ref,
  toRefs,
  vShow,
  withCtx,
  withDirectives,
} from 'vue'
import { removeClass } from '@element-plus/utils'
import { useGlobalComponentSettings } from '@element-plus/components/config-provider'

import type { UseNamespaceReturn } from '@element-plus/hooks'
import type { LoadingOptionsResolved } from './types'

/**
 * @summary ElLoading 加载 - 创建并管理加载遮罩实例的工厂函数
 *
 * 🔒 内部组件：同时作为 v-loading 指令与 ElLoadingService 服务 的底层实现，提供加载遮罩的创建/关闭/销毁能力
 *
 * @param {LoadingOptionsResolved} options - 已解析的加载配置
 * @returns {LoadingInstance} 加载实例，含 close/setText/handleAfterLeave 等方法
 *
 * @usage
 * // 内部用法：service.ts 的 Loading() 函数调用此工厂创建实例
 * const instance = createLoadingComponent(resolvedOptions)
 * instance.visible.value = true
 * // 关闭
 * instance.close()
 */
export function createLoadingComponent(options: LoadingOptionsResolved) {
  let afterLeaveTimer: number
  // IMPORTANT NOTE: this is only a hacking way to expose the injections on an
  // instance, DO NOT FOLLOW this pattern in your own code.
  const afterLeaveFlag = ref(false)
  const data = reactive({
    ...options,
    originalPosition: '',
    originalOverflow: '',
    visible: false,
  })

  function setText(text: string) {
    data.text = text
  }

  function destroySelf() {
    const target = data.parent
    const ns = (vm as any).ns as UseNamespaceReturn
    if (!target.vLoadingAddClassList) {
      let loadingNumber: number | string | null =
        target.getAttribute('loading-number')
      loadingNumber = Number.parseInt(loadingNumber as any) - 1
      if (!loadingNumber) {
        removeClass(target, ns.bm('parent', 'relative'))
        target.removeAttribute('loading-number')
      } else {
        target.setAttribute('loading-number', loadingNumber.toString())
      }
      removeClass(target, ns.bm('parent', 'hidden'))
    }
    removeElLoadingChild()
    loadingInstance.unmount()
  }
  function removeElLoadingChild(): void {
    vm.$el?.parentNode?.removeChild(vm.$el)
  }
  function close() {
    if (options.beforeClose && !options.beforeClose()) return

    afterLeaveFlag.value = true
    clearTimeout(afterLeaveTimer)

    afterLeaveTimer = window.setTimeout(handleAfterLeave, 400)
    data.visible = false

    options.closed?.()
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return
    const target = data.parent
    afterLeaveFlag.value = false
    target.vLoadingAddClassList = undefined
    destroySelf()
  }

  const elLoadingComponent = defineComponent({
    name: 'ElLoading',
    setup(_, { expose }) {
      const { ns, zIndex } = useGlobalComponentSettings('loading')

      expose({
        ns,
        zIndex,
      })

      return () => {
        const svg = data.spinner || data.svg
        const spinner = h(
          'svg',
          {
            class: 'circular',
            viewBox: data.svgViewBox ? data.svgViewBox : '0 0 50 50',
            ...(svg ? { innerHTML: svg } : {}),
          },
          [
            h('circle', {
              class: 'path',
              cx: '25',
              cy: '25',
              r: '20',
              fill: 'none',
            }),
          ]
        )

        const spinnerText = data.text
          ? h('p', { class: ns.b('text') }, [data.text])
          : undefined

        return h(
          Transition,
          {
            name: ns.b('fade'),
            onAfterLeave: handleAfterLeave,
          },
          {
            default: withCtx(() => [
              withDirectives(
                createVNode(
                  'div',
                  {
                    style: {
                      backgroundColor: data.background || '',
                    },
                    class: [
                      ns.b('mask'),
                      data.customClass,
                      data.fullscreen ? 'is-fullscreen' : '',
                    ],
                  },
                  [
                    h(
                      'div',
                      {
                        class: ns.b('spinner'),
                      },
                      [spinner, spinnerText]
                    ),
                  ]
                ),
                [[vShow, data.visible]]
              ),
            ]),
          }
        )
      }
    },
  })

  const loadingInstance = createApp(elLoadingComponent)
  const vm = loadingInstance.mount(document.createElement('div'))

  return {
    ...toRefs(data),
    setText,
    removeElLoadingChild,
    close,
    handleAfterLeave,
    vm,
    get $el(): HTMLElement {
      return vm.$el
    },
  }
}

export type LoadingInstance = ReturnType<typeof createLoadingComponent>
