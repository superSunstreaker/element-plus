import { inject, onBeforeUnmount, onMounted, provide, ref, unref } from 'vue'
import Collection from './collection.vue'
import CollectionItem from './collection-item.vue'

import type { InjectionKey } from 'vue'
import type { SetupContext } from '@vue/runtime-core'
import type {
  ElCollectionInjectionContext,
  ElCollectionItemInjectionContext,
} from './tokens'

/**
 * @summary ElCollection 集合 - 收集并按 DOM 顺序排序子组件的工具组件
 *
 * 🔒 内部组件：主要为 RovingFocusGroup、Dropdown、Select 等需要管理一组有序子项的组件提供子项收集能力
 *
 * @usage
 * // 内部用法：通过 createCollectionWithScope 创建带作用域的集合
 * const {
 *   ElCollection,           // 集合容器组件
 *   ElCollectionItem,       // 集合子项组件
 *   COLLECTION_INJECTION_KEY,
 *   COLLECTION_ITEM_INJECTION_KEY,
 * } = createCollectionWithScope('RovingFocusGroup')
 *
 * // 子项通过 [data-el-collection-item] 标记，容器按 DOM 顺序读取并排序
 */
export const COLLECTION_ITEM_SIGN = `data-el-collection-item`

// Make sure the first letter of name is capitalized
export const createCollectionWithScope = (name: string) => {
  const COLLECTION_NAME = `El${name}Collection`
  const COLLECTION_ITEM_NAME = `${COLLECTION_NAME}Item`
  const COLLECTION_INJECTION_KEY: InjectionKey<ElCollectionInjectionContext> =
    Symbol(COLLECTION_NAME)
  const COLLECTION_ITEM_INJECTION_KEY: InjectionKey<ElCollectionItemInjectionContext> =
    Symbol(COLLECTION_ITEM_NAME)

  const ElCollection = {
    ...Collection,
    name: COLLECTION_NAME,
    setup() {
      const collectionRef = ref<HTMLElement | null>(null)
      const itemMap: ElCollectionInjectionContext['itemMap'] = new Map()
      const getItems = () => {
        const collectionEl = unref(collectionRef)

        if (!collectionEl) return []
        const orderedNodes = Array.from(
          collectionEl.querySelectorAll(`[${COLLECTION_ITEM_SIGN}]`)
        )

        const items = [...itemMap.values()]

        return items.sort(
          (a, b) => orderedNodes.indexOf(a.ref!) - orderedNodes.indexOf(b.ref!)
        )
      }

      provide(COLLECTION_INJECTION_KEY, {
        itemMap,
        getItems,
        collectionRef,
      })
    },
  }

  const ElCollectionItem = {
    ...CollectionItem,
    name: COLLECTION_ITEM_NAME,
    setup(_: unknown, { attrs }: SetupContext) {
      const collectionItemRef = ref<HTMLElement | null>(null)
      const collectionInjection = inject(COLLECTION_INJECTION_KEY, undefined)!

      provide(COLLECTION_ITEM_INJECTION_KEY, {
        collectionItemRef,
      })

      onMounted(() => {
        const collectionItemEl = unref(collectionItemRef)
        if (collectionItemEl) {
          collectionInjection.itemMap.set(collectionItemEl, {
            ref: collectionItemEl,
            ...attrs,
          })
        }
      })

      onBeforeUnmount(() => {
        const collectionItemEl = unref(collectionItemRef)!
        collectionInjection.itemMap.delete(collectionItemEl)
      })
    },
  }

  return {
    COLLECTION_INJECTION_KEY,
    COLLECTION_ITEM_INJECTION_KEY,
    ElCollection,
    ElCollectionItem,
  }
}
