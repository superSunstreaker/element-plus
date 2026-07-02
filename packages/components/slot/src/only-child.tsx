import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  inject,
  withDirectives,
} from 'vue'
import { NOOP, isObject } from '@vue/shared'
import {
  FORWARD_REF_INJECTION_KEY,
  useForwardRefDirective,
  useNamespace,
} from '@element-plus/hooks'
import { debugWarn } from '@element-plus/utils'

import type { Ref, VNode } from 'vue'

const NAME = 'ElOnlyChild'

/**
 * @summary ElOnlyChild 唯一子节点 - 渲染插槽中第一个合法子节点并转发 ref 的工具组件
 *
 * 🔒 内部组件：主要为 Popper Trigger、TooltipV2 等需要将 ref/attrs 透传给唯一子元素的组件服务
 *
 * @usage
 * <!-- 内部用法：Popper Trigger 用 OnlyChild 包装以确保只有一个子节点并转发 ref -->
 * <OnlyChild v-bind="$attrs">
 *   <button>触发器</button>
 * </OnlyChild>
 */
export const OnlyChild = defineComponent({
  name: NAME,
  setup(_, { slots, attrs }) {
    const forwardRefInjection = inject(FORWARD_REF_INJECTION_KEY)
    const forwardRefDirective = useForwardRefDirective(
      forwardRefInjection?.setForwardRef ?? NOOP
    )
    return () => {
      const defaultSlot = slots.default?.(attrs)
      if (!defaultSlot) return null

      if (defaultSlot.length > 1) {
        debugWarn(NAME, 'requires exact only one valid child.')
        return null
      }

      const firstLegitNode = findFirstLegitChild(defaultSlot)
      if (!firstLegitNode) {
        debugWarn(NAME, 'no valid child node found')
        return null
      }

      return withDirectives(cloneVNode(firstLegitNode!, attrs), [
        [forwardRefDirective],
      ])
    }
  },
})

function findFirstLegitChild(node: VNode[] | undefined): VNode | null {
  if (!node) return null
  const children = node as VNode[]
  for (const child of children) {
    /**
     * when user uses h(Fragment, [text]) to render plain string,
     * this switch case just cannot handle, when the value is primitives
     * we should just return the wrapped string
     */
    if (isObject(child)) {
      switch (child.type) {
        case Comment:
          continue
        case Text:
        case 'svg':
          return wrapTextContent(child)
        case Fragment:
          return findFirstLegitChild(child.children as VNode[])
        default:
          return child
      }
    }
    return wrapTextContent(child)
  }
  return null
}

function wrapTextContent(s: string | VNode) {
  const ns = useNamespace('only-child')
  return <span class={ns.e('content')}>{s}</span>
}

export type OnlyChildExpose = {
  forwardRef: Ref<HTMLElement>
}
