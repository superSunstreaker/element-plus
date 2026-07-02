import {
  buildProp,
  buildProps,
  definePropType,
  mutable,
} from '@element-plus/utils'
import { VERTICAL } from './defaults'

import type { ExtractPropTypes, StyleValue } from 'vue'
import type { GridItemKeyGetter, ItemSize } from './types'

/**
 * @summary ElVirtualList 虚拟列表 - 仅渲染可视区域条目以提升大数据量渲染性能的虚拟滚动组件
 *
 * 🔒 内部组件：主要为 Select（大列表）、TableV2、TreeV2、Scrollbar 等需要处理海量数据的组件提供虚拟滚动能力，也可单独使用
 *
 * @attr {Number|Function} itemSize - 每个条目高度（数字）或动态高度计算函数（必填）
 * @attr {Number} estimatedItemSize - 预估条目高度（用于动态高度场景的初始估算）
 * @attr {Number} cache - 视窗前后预渲染的条目数，默认 2
 * @attr {'ltr'|'rtl'} direction - 水平方向，默认 'ltr'
 * @attr {Number} initScrollOffset - 初始滚动偏移量，默认 0
 * @attr {Number} total - 总条目数（必填）
 * @attr {'horizontal'|'vertical'} layout - 列表方向，默认 'vertical'
 * @attr {String} className - 容器自定义类名
 * @attr {String|Element} containerElement - 外层容器元素标签或组件，默认 'div'
 * @attr {Array} data - 渲染数据数组
 * @attr {String|Number} height - 容器高度（必填）
 * @attr {String|Object} innerElement - 内层元素标签或组件，默认 'div'
 * @attr {String|Array|Object} style - 容器自定义样式
 * @attr {Boolean} useIsScrolling - 是否在滚动时注入 isScrolling 状态到条目，默认 false
 * @attr {String|Number} width - 容器宽度（水平布局时需要）
 * @attr {Boolean} perfMode - 是否启用性能模式，默认 true
 * @attr {Boolean} scrollbarAlwaysOn - 滚动条是否常驻，默认 false
 *
 * @usage
 * <!-- 内部用法：Select 当选项过多时切换为 VirtualList 渲染 -->
 * <el-virtual-list :data="items" :item-size="40" :total="10000" height="200">
 *   <template #default="{ item, index }">
 *     <div>{{ index }}: {{ item.label }}</div>
 *   </template>
 * </el-virtual-list>
 */
const itemSize = buildProp({
  type: definePropType<number | ItemSize>([Number, Function]),
  required: true,
} as const)

const estimatedItemSize = buildProp({
  type: Number,
} as const)

const cache = buildProp({
  type: Number,
  default: 2,
} as const)

const direction = buildProp({
  type: String,
  values: ['ltr', 'rtl'],
  default: 'ltr',
} as const)

const initScrollOffset = buildProp({
  type: Number,
  default: 0,
} as const)

const total = buildProp({
  type: Number,
  required: true,
} as const)

const layout = buildProp({
  type: String,
  values: ['horizontal', 'vertical'],
  default: VERTICAL,
} as const)

export const virtualizedProps = buildProps({
  className: {
    type: String,
    default: '',
  },

  containerElement: {
    type: definePropType<string | Element>([String, Object]),
    default: 'div',
  },

  data: {
    type: definePropType<any[]>(Array),
    default: () => mutable([] as const),
  },

  /**
   * @description controls the horizontal direction.
   */
  direction,

  height: {
    type: [String, Number],
    required: true,
  },

  innerElement: {
    type: [String, Object],
    default: 'div',
  },

  style: {
    type: definePropType<StyleValue>([Object, String, Array]),
  },

  useIsScrolling: {
    type: Boolean,
    default: false,
  },

  width: {
    type: [Number, String],
    required: false,
  },

  perfMode: {
    type: Boolean,
    default: true,
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
} as const)

export const virtualizedListProps = buildProps({
  /**
   * @description describes how many items should be pre rendered to the head
   * and the tail of the window
   */
  cache,

  estimatedItemSize,

  /**
   * @description controls the list's orientation
   */
  layout,

  initScrollOffset,

  /**
   * @description describes the total number of the list.
   */
  total,

  itemSize,
  ...virtualizedProps,
} as const)

const scrollbarSize = {
  type: Number,
  default: 6,
} as const

const startGap = { type: Number, default: 0 } as const
const endGap = { type: Number, default: 2 } as const

export const virtualizedGridProps = buildProps({
  columnCache: cache,
  columnWidth: itemSize,
  estimatedColumnWidth: estimatedItemSize,
  estimatedRowHeight: estimatedItemSize,
  initScrollLeft: initScrollOffset,
  initScrollTop: initScrollOffset,
  itemKey: {
    type: definePropType<GridItemKeyGetter>(Function),
    default: ({
      columnIndex,
      rowIndex,
    }: {
      columnIndex: number
      rowIndex: number
    }) => `${rowIndex}:${columnIndex}`,
  },
  rowCache: cache,
  rowHeight: itemSize,
  totalColumn: total,
  totalRow: total,
  hScrollbarSize: scrollbarSize,
  vScrollbarSize: scrollbarSize,
  scrollbarStartGap: startGap,
  scrollbarEndGap: endGap,
  role: String,
  ...virtualizedProps,
} as const)

export const virtualizedScrollbarProps = buildProps({
  alwaysOn: Boolean,
  class: String,
  layout,
  total,
  ratio: {
    type: Number,
    required: true,
  },
  clientSize: {
    type: Number,
    required: true,
  },
  scrollFrom: {
    type: Number,
    required: true,
  },
  scrollbarSize,
  startGap,
  endGap,

  visible: Boolean,
} as const)

export type VirtualizedProps = ExtractPropTypes<typeof virtualizedProps>
export type VirtualizedListProps = ExtractPropTypes<typeof virtualizedListProps>
export type VirtualizedGridProps = ExtractPropTypes<typeof virtualizedGridProps>

export type VirtualizedScrollbarProps = ExtractPropTypes<
  typeof virtualizedScrollbarProps
>
