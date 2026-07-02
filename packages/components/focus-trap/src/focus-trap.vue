<template>
  <slot :handle-keydown="onKeydown" />
</template>
<script lang="ts">
/**
 * @summary ElFocusTrap 焦点陷阱 - 将键盘焦点限制在指定容器内的无障碍工具组件
 *
 * 🔒 内部组件：主要为 Dialog、Drawer、MessageBox、Popconfirm 等弹层组件提供焦点管理，确保 Tab 循环不外泄，也可单独使用
 *
 * @attr {Boolean} loop - 是否在容器内循环焦点（Tab 到末尾后回到首个可聚焦元素）
 * @attr {Boolean} trapped - 是否激活焦点陷阱（true 时捕获焦点，false 时释放并还原之前焦点）
 * @attr {HTMLElement} focusTrapEl - 指定作为陷阱容器的 DOM 元素（不传则使用插槽 ref）
 * @attr {'container'|'first'|HTMLElement} focusStartEl - 陷阱激活时焦点起始位置
 *   - 'container': 焦点落在容器本身
 *   - 'first': 焦点落在首个可聚焦子元素（默认）
 *   - HTMLElement: 焦点落在指定元素
 * @emit focus-after-trapped - 焦点被捕获时触发
 * @emit focus-after-released - 焦点被释放时触发
 * @emit focusin - 焦点进入容器时触发
 * @emit focusout - 焦点离开容器时触发
 * @emit focusout-prevented - 焦点外溢被阻止时触发（可用于自定义循环逻辑）
 * @emit release-requested - 用户按下 Esc 请求释放焦点时触发
 *
 * @usage
 * <!-- 内部用法：Dialog 将内容包裹在 ElFocusTrap 中确保无障碍 -->
 * <el-focus-trap :trapped="visible" @release-requested="onClose">
 *   <div class="dialog-content">...</div>
 * </el-focus-trap>
 */
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  unref,
  watch,
} from 'vue'
import { isNil } from 'lodash-unified'
import { EVENT_CODE } from '@element-plus/constants'
import { useEscapeKeydown } from '@element-plus/hooks'
import { isString } from '@element-plus/utils'
import {
  createFocusOutPreventedEvent,
  focusFirstDescendant,
  focusableStack,
  getEdges,
  isFocusCausedByUserEvent,
  obtainAllFocusableElements,
  tryFocus,
  useFocusReason,
} from './utils'
import {
  FOCUS_AFTER_RELEASED,
  FOCUS_AFTER_TRAPPED,
  FOCUS_AFTER_TRAPPED_OPTS,
  FOCUS_TRAP_INJECTION_KEY,
  ON_RELEASE_FOCUS_EVT,
  ON_TRAP_FOCUS_EVT,
} from './tokens'

import type { PropType } from 'vue'
import type { FocusLayer } from './utils'

export default defineComponent({
  name: 'ElFocusTrap',
  inheritAttrs: false,
  props: {
    loop: Boolean,
    trapped: Boolean,
    focusTrapEl: Object as PropType<HTMLElement>,
    focusStartEl: {
      type: [Object, String] as PropType<'container' | 'first' | HTMLElement>,
      default: 'first',
    },
  },
  emits: [
    ON_TRAP_FOCUS_EVT,
    ON_RELEASE_FOCUS_EVT,
    'focusin',
    'focusout',
    'focusout-prevented',
    'release-requested',
  ],
  setup(props, { emit }) {
    const forwardRef = ref<HTMLElement | undefined>()
    let lastFocusBeforeTrapped: HTMLElement | null
    let lastFocusAfterTrapped: HTMLElement | null

    const { focusReason } = useFocusReason()

    useEscapeKeydown((event) => {
      if (props.trapped && !focusLayer.paused) {
        emit('release-requested', event)
      }
    })

    const focusLayer: FocusLayer = {
      paused: false,
      pause() {
        this.paused = true
      },
      resume() {
        this.paused = false
      },
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (!props.loop && !props.trapped) return
      if (focusLayer.paused) return

      const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e
      const { loop } = props
      const isTabbing =
        key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey

      const currentFocusingEl = document.activeElement
      if (isTabbing && currentFocusingEl) {
        const container = currentTarget as HTMLElement
        const [first, last] = getEdges(container)
        const isTabbable = first && last
        if (!isTabbable) {
          if (currentFocusingEl === container) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason.value,
            })
            emit('focusout-prevented', focusoutPreventedEvent)
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault()
            }
          }
        } else {
          if (!shiftKey && currentFocusingEl === last) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason.value,
            })
            emit('focusout-prevented', focusoutPreventedEvent)
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault()
              if (loop) tryFocus(first, true)
            }
          } else if (
            shiftKey &&
            [first, container].includes(currentFocusingEl as HTMLElement)
          ) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason.value,
            })
            emit('focusout-prevented', focusoutPreventedEvent)
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault()
              if (loop) tryFocus(last, true)
            }
          }
        }
      }
    }

    provide(FOCUS_TRAP_INJECTION_KEY, {
      focusTrapRef: forwardRef,
      onKeydown,
    })

    watch(
      () => props.focusTrapEl,
      (focusTrapEl) => {
        if (focusTrapEl) {
          forwardRef.value = focusTrapEl
        }
      },
      { immediate: true }
    )

    watch([forwardRef], ([forwardRef], [oldForwardRef]) => {
      if (forwardRef) {
        forwardRef.addEventListener('keydown', onKeydown)
        forwardRef.addEventListener('focusin', onFocusIn)
        forwardRef.addEventListener('focusout', onFocusOut)
      }
      if (oldForwardRef) {
        oldForwardRef.removeEventListener('keydown', onKeydown)
        oldForwardRef.removeEventListener('focusin', onFocusIn)
        oldForwardRef.removeEventListener('focusout', onFocusOut)
      }
    })

    const trapOnFocus = (e: Event) => {
      emit(ON_TRAP_FOCUS_EVT, e)
    }
    const releaseOnFocus = (e: Event) => emit(ON_RELEASE_FOCUS_EVT, e)

    const onFocusIn = (e: FocusEvent) => {
      const trapContainer = unref(forwardRef)
      if (!trapContainer) return

      const target = e.target as HTMLElement | null
      const relatedTarget = e.relatedTarget as HTMLElement | null
      const isFocusedInTrap = target && trapContainer.contains(target)

      if (!props.trapped) {
        const isPrevFocusedInTrap =
          relatedTarget && trapContainer.contains(relatedTarget)
        if (!isPrevFocusedInTrap) {
          lastFocusBeforeTrapped = relatedTarget
        }
      }

      if (isFocusedInTrap) emit('focusin', e)

      if (focusLayer.paused) return

      if (props.trapped) {
        if (isFocusedInTrap) {
          lastFocusAfterTrapped = target
        } else {
          tryFocus(lastFocusAfterTrapped, true)
        }
      }
    }

    const onFocusOut = (e: Event) => {
      const trapContainer = unref(forwardRef)
      if (focusLayer.paused || !trapContainer) return

      if (props.trapped) {
        const relatedTarget = (e as FocusEvent)
          .relatedTarget as HTMLElement | null
        if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
          // Give embedded focus layer time to pause this layer before reclaiming focus
          // And only reclaim focus if it should currently be trapping
          setTimeout(() => {
            if (!focusLayer.paused && props.trapped) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason.value,
              })
              emit('focusout-prevented', focusoutPreventedEvent)
              if (!focusoutPreventedEvent.defaultPrevented) {
                tryFocus(lastFocusAfterTrapped, true)
              }
            }
          }, 0)
        }
      } else {
        const target = e.target as HTMLElement | null
        const isFocusedInTrap = target && trapContainer.contains(target)
        if (!isFocusedInTrap) emit('focusout', e)
      }
    }

    async function startTrap() {
      // Wait for forwardRef to resolve
      await nextTick()
      const trapContainer = unref(forwardRef)
      if (trapContainer) {
        focusableStack.push(focusLayer)
        const prevFocusedElement = trapContainer.contains(
          document.activeElement
        )
          ? lastFocusBeforeTrapped
          : document.activeElement
        lastFocusBeforeTrapped = prevFocusedElement as HTMLElement | null
        const isPrevFocusContained = trapContainer.contains(prevFocusedElement)
        if (!isPrevFocusContained) {
          const focusEvent = new Event(
            FOCUS_AFTER_TRAPPED,
            FOCUS_AFTER_TRAPPED_OPTS
          )
          trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus)
          trapContainer.dispatchEvent(focusEvent)
          if (!focusEvent.defaultPrevented) {
            nextTick(() => {
              let focusStartEl = props.focusStartEl
              if (!isString(focusStartEl)) {
                tryFocus(focusStartEl)
                if (document.activeElement !== focusStartEl) {
                  focusStartEl = 'first'
                }
              }
              if (focusStartEl === 'first') {
                focusFirstDescendant(
                  obtainAllFocusableElements(trapContainer),
                  true
                )
              }
              if (
                document.activeElement === prevFocusedElement ||
                focusStartEl === 'container'
              ) {
                tryFocus(trapContainer)
              }
            })
          }
        }
      }
    }

    function stopTrap() {
      const trapContainer = unref(forwardRef)

      if (trapContainer) {
        trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus)

        const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
          ...FOCUS_AFTER_TRAPPED_OPTS,
          detail: {
            focusReason: focusReason.value,
          },
        })
        trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus)
        trapContainer.dispatchEvent(releasedEvent)
        if (
          !releasedEvent.defaultPrevented &&
          (focusReason.value == 'keyboard' ||
            !isFocusCausedByUserEvent() ||
            trapContainer.contains(document.activeElement))
        ) {
          tryFocus(lastFocusBeforeTrapped ?? document.body)
        }

        trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus)
        focusableStack.remove(focusLayer)
      }
    }

    onMounted(() => {
      if (props.trapped) {
        startTrap()
      }

      watch(
        () => props.trapped,
        (trapped) => {
          if (trapped) {
            startTrap()
          } else {
            stopTrap()
          }
        }
      )
    })

    onBeforeUnmount(() => {
      if (props.trapped) {
        stopTrap()
      }
    })

    return {
      onKeydown,
    }
  },
})
</script>
