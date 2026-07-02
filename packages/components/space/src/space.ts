/**
 * @summary ElSpace 间距 - 统一设置子元素之间的间距，支持水平/垂直排列与自动换行
 *
 * @attr {String} direction - 排列方向，可选值 'horizontal' / 'vertical'（默认 'horizontal'）
 * @attr {String|Object|Array} class - 容器自定义类名（默认 ''）
 * @attr {String|Array|Object} style - 容器额外样式（默认 ''）
 * @attr {String} alignment - 子元素对齐方式，同 CSS align-items（默认 'center'）
 * @attr {String} prefixCls - space-item 类名前缀
 * @attr {VNodeChild} spacer - 分隔符，可为 VNode / 字符串 / 数字（默认 null）
 * @attr {Boolean} wrap - 是否自动换行（仅水平方向生效）
 * @attr {Boolean} fill - 是否填充容器
 * @attr {Number} fillRatio - 填充比例（默认 100）
 * @attr {String|[Number,Number]|Number} size - 间距大小，可选 'large' / 'default' / 'small' 或数字或 [水平, 垂直]
 *
 * @example
 * <el-space :size="20">
 *   <el-button>按钮1</el-button>
 *   <el-button>按钮2</el-button>
 * </el-space>
 * <el-space direction="vertical" wrap>
 *   <div v-for="i in 10" :key="i">项 {{ i }}</div>
 * </el-space>
 */
import {
  createTextVNode,
  createVNode,
  defineComponent,
  isVNode,
  renderSlot,
} from 'vue'
import { isString } from '@vue/shared'
import {
  PatchFlags,
  buildProps,
  definePropType,
  isArray,
  isFragment,
  isNumber,
  isValidElementNode,
} from '@element-plus/utils'
import { componentSizes } from '@element-plus/constants'
import Item from './item'
import { useSpace } from './use-space'

import type {
  ExtractPropTypes,
  StyleValue,
  VNode,
  VNodeArrayChildren,
  VNodeChild,
} from 'vue'
import type { Arrayable } from '@element-plus/utils'
import type { AlignItemsProperty } from 'csstype'

export const spaceProps = buildProps({
  /**
   * @description Placement direction
   */
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  /**
   * @description Classname
   */
  class: {
    type: definePropType<Arrayable<Record<string, boolean> | string>>([
      String,
      Object,
      Array,
    ]),
    default: '',
  },
  /**
   * @description Extra style rules
   */
  style: {
    type: definePropType<StyleValue>([String, Array, Object]),
    default: '',
  },
  /**
   * @description Controls the alignment of items
   */
  alignment: {
    type: definePropType<AlignItemsProperty>(String),
    default: 'center',
  },
  /**
   * @description Prefix for space-items
   */
  prefixCls: {
    type: String,
  },
  /**
   * @description Spacer
   */
  spacer: {
    type: definePropType<VNodeChild>([Object, String, Number, Array]),
    default: null,
    validator: (val: unknown) => isVNode(val) || isNumber(val) || isString(val),
  },
  /**
   * @description Auto wrapping
   */
  wrap: Boolean,
  /**
   * @description Whether to fill the container
   */
  fill: Boolean,
  /**
   * @description Ratio of fill
   */
  fillRatio: {
    type: Number,
    default: 100,
  },
  /**
   * @description Spacing size
   */
  size: {
    type: [String, Array, Number],
    values: componentSizes,
    validator: (val: unknown): val is [number, number] | number => {
      return (
        isNumber(val) ||
        (isArray(val) && val.length === 2 && val.every(isNumber))
      )
    },
  },
} as const)
export type SpaceProps = ExtractPropTypes<typeof spaceProps>

const Space = defineComponent({
  name: 'ElSpace',

  props: spaceProps,

  setup(props, { slots }) {
    const { classes, containerStyle, itemStyle } = useSpace(props)

    // retrieve the children out via a simple for loop
    // the edge case here is that when users uses directives like <v-for>, <v-if>
    // we need to go deeper until the child is not the Fragment type
    function extractChildren(
      children: VNodeArrayChildren,
      parentKey = '',
      extractedChildren: VNode[] = []
    ) {
      const { prefixCls } = props
      children.forEach((child, loopKey) => {
        if (isFragment(child)) {
          if (isArray(child.children)) {
            child.children.forEach((nested, key) => {
              if (isFragment(nested) && isArray(nested.children)) {
                extractChildren(
                  nested.children,
                  `${parentKey + key}-`,
                  extractedChildren
                )
              } else {
                extractedChildren.push(
                  createVNode(
                    Item,
                    {
                      style: itemStyle.value,
                      prefixCls,
                      key: `nested-${parentKey + key}`,
                    },
                    {
                      default: () => [nested],
                    },
                    PatchFlags.PROPS | PatchFlags.STYLE,
                    ['style', 'prefixCls']
                  )
                )
              }
            })
          }
          // if the current child is valid vnode, then append this current vnode
          // to item as child node.
        } else if (isValidElementNode(child)) {
          extractedChildren.push(
            createVNode(
              Item,
              {
                style: itemStyle.value,
                prefixCls,
                key: `LoopKey${parentKey + loopKey}`,
              },
              {
                default: () => [child],
              },
              PatchFlags.PROPS | PatchFlags.STYLE,
              ['style', 'prefixCls']
            )
          )
        }
      })

      return extractedChildren
    }

    return () => {
      const { spacer, direction } = props

      const children = renderSlot(slots, 'default', { key: 0 }, () => [])

      if ((children.children ?? []).length === 0) return null
      // loop the children, if current children is rendered via `renderList` or `<v-for>`
      if (isArray(children.children)) {
        let extractedChildren = extractChildren(children.children)

        if (spacer) {
          // track the current rendering index, when encounters the last element
          // then no need to add a spacer after it.
          const len = extractedChildren.length - 1
          extractedChildren = extractedChildren.reduce<VNode[]>(
            (acc, child, idx) => {
              const children = [...acc, child]
              if (idx !== len) {
                children.push(
                  createVNode(
                    'span',
                    // adding width 100% for vertical alignment,
                    // when the spacer inherit the width from the
                    // parent, this span's width was not set, so space
                    // might disappear
                    {
                      style: [
                        itemStyle.value,
                        direction === 'vertical' ? 'width: 100%' : null,
                      ],
                      key: idx,
                    },
                    [
                      // if spacer is already a valid vnode, then append it to the current
                      // span element.
                      // otherwise, treat it as string.
                      isVNode(spacer)
                        ? spacer
                        : createTextVNode(spacer as string, PatchFlags.TEXT),
                    ],
                    PatchFlags.STYLE
                  )
                )
              }
              return children
            },
            []
          )
        }

        // spacer container.
        return createVNode(
          'div',
          {
            class: classes.value,
            style: containerStyle.value,
          },
          extractedChildren,
          PatchFlags.STYLE | PatchFlags.CLASS
        )
      }

      return children.children
    }
  },
})

export type SpaceInstance = InstanceType<typeof Space>

export default Space
