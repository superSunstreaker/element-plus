/**
 * @summary ElTable 表格 - 用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作
 *
 * @attr {DefaultRow[]} data - 显示的数据，类型为数组，默认空数组，每一项对应一行数据
 * @attr {ComponentSize} size - 表格尺寸，可选值为 large / default / small，默认继承自父级 Form 或 ConfigProvider
 * @attr {string | number} width - 表格宽度，支持数字（像素）或字符串（如 '100%'）
 * @attr {string | number} height - 表格高度，支持数字（像素）或字符串，设置后表格表头固定、表体滚动
 * @attr {string | number} maxHeight - 表格最大高度，超出部分表体滚动，表头不固定但会随滚动悬停
 * @attr {boolean} fit - 列宽是否自撑开，默认 true，false 时列宽由内容决定
 * @attr {boolean} stripe - 是否为斑马纹表格，默认 false，开启后奇偶行交替显示背景色
 * @attr {boolean} border - 是否带有纵向边框，默认 false
 * @attr {string | ((row: T) => string)} rowKey - 行数据的 Key，用于优化渲染，类型为字符串（属性名）或函数，使用 reserve-selection / 树形数据 / 展开行时必填
 * @attr {boolean} showHeader - 是否显示表头，默认 true
 * @attr {boolean} showSummary - 是否在表尾显示合计行，默认 false
 * @attr {string} sumText - 合计行第一列的文本，默认'合计'
 * @attr {SummaryMethod<T>} summaryMethod - 自定义合计计算方法，参数为 { columns, data }，返回字符串数组
 * @attr {string | ((data: { row, rowIndex }) => string)} rowClassName - 行的 className 方法或字符串，用于自定义行样式
 * @attr {CSSProperties | ((data: { row, rowIndex }) => CSSProperties)} rowStyle - 行样式的方法或对象，用于自定义行内联样式
 * @attr {string | ((data: { row, rowIndex, column, columnIndex }) => string)} cellClassName - 单元格的 className 方法或字符串
 * @attr {CSSProperties | ((data: { row, rowIndex, column, columnIndex }) => CSSProperties)} cellStyle - 单元格样式的方法或对象
 * @attr {string | ((data: { row, rowIndex }) => string)} headerRowClassName - 表头行的 className 方法或字符串
 * @attr {CSSProperties | ((data: { row, rowIndex }) => CSSProperties)} headerRowStyle - 表头行样式的方法或对象
 * @attr {string | ((data: { row, rowIndex, column, columnIndex }) => string)} headerCellClassName - 表头单元格的 className 方法或字符串
 * @attr {CSSProperties | ((data: { row, rowIndex, column, columnIndex }) => CSSProperties)} headerCellStyle - 表头单元格样式的方法或对象
 * @attr {boolean} highlightCurrentRow - 是否高亮当前行，默认 false
 * @attr {string | number} currentRowKey - 当前行的 key，配合 highlightCurrentRow 使用，需设置 row-key 才生效
 * @attr {string} emptyText - 空数据时显示的文本内容，默认'暂无数据'
 * @attr {any[]} expandRowKeys - 通过该属性设置展开行的 keys，需设置 row-key 属性，类型为数组
 * @attr {boolean} defaultExpandAll - 是否默认展开所有展开行，默认 false，对树形数据无效
 * @attr {Sort} defaultSort - 默认排序列与方向，结构为 { prop, order }，order 可选 'ascending' / 'descending'
 * @attr {string} tooltipEffect - 溢出时 tooltip 的主题，可选 dark / light
 * @attr {TableOverflowTooltipOptions} tooltipOptions - 溢出 tooltip 的配置项，透传给 el-tooltip
 * @attr {(data: { row, rowIndex, column, columnIndex }) => number[] | { rowspan, colspan } | undefined} spanMethod - 合并行/列计算方法，返回 { rowspan, colspan } 或 [rowspan, colspan]
 * @attr {boolean} selectOnIndeterminate - 在多选表格中，当仅部分行被选中时，点击表头多选框的行为，默认 true 表示选中所有行，false 表示取消所有选中
 * @attr {number} indent - 展示树形数据时，每层缩进的像素值，默认 16
 * @attr {boolean} lazy - 是否懒加载子节点数据，配合 load 使用，默认 false
 * @attr {(row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void} load - 加载子节点数据的函数，仅在 lazy 为 true 时生效
 * @attr {{ hasChildren?: string, children?: string }} treeProps - 渲染嵌套数据的配置项，默认 { hasChildren: 'hasChildren', children: 'children' }
 * @attr {string} className - 表格的自定义 class 名
 * @attr {CSSProperties} style - 表格的自定义内联样式
 * @attr {'fixed' | 'auto'} tableLayout - 表格布局算法，可选 fixed / auto，默认 fixed
 * @attr {boolean} scrollbarAlwaysOn - 是否总是显示滚动条，默认 false
 * @attr {boolean} flexible - 是否让 main 区域随父容器宽度自适应伸缩，默认 false，仅在 height 为空或 max-height 时生效
 * @attr {boolean | TableOverflowTooltipOptions} showOverflowTooltip - 当内容过长被隐藏时是否显示 tooltip，默认 false，可传对象进行详细配置
 *
 * @event {(selection: T[], row: T) => void} select - 当用户手动勾选数据行的 Checkbox 时触发，参数为 selection（当前选中行数组）和 row（被勾选的行）
 * @event {(selection: T[]) => void} select-all - 当用户手动勾选全选 Checkbox 时触发，参数为 selection（当前选中行数组）
 * @event {(selection: T[]) => void} selection-change - 当选择项发生变化时触发，参数为 selection（当前选中行数组）
 * @event {(row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event) => void} cell-mouse-enter - 当单元格 hover 进入时触发
 * @event {(row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event) => void} cell-mouse-leave - 当单元格 hover 退出时触发
 * @event {(row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event) => void} cell-click - 当某个单元格被点击时触发
 * @event {(row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event) => void} cell-dblclick - 当某个单元格被双击时触发
 * @event {(row: T, column: TableColumnCtx<T>, cell: HTMLElement, event: Event) => void} cell-contextmenu - 当某个单元格被右键点击时触发
 * @event {(row: T, column: TableColumnCtx<T>, event: Event) => void} row-click - 当某一行被点击时触发
 * @event {(row: T, column: TableColumnCtx<T>, event: Event) => void} row-dblclick - 当某一行被双击时触发
 * @event {(row: T, column: TableColumnCtx<T>, event: Event) => void} row-contextmenu - 当某一行被右键点击时触发
 * @event {(column: TableColumnCtx<T>, event: Event) => void} header-click - 当某一列的表头被点击时触发
 * @event {(column: TableColumnCtx<T>, event: Event) => void} header-contextmenu - 当某一列的表头被右键点击时触发
 * @event {{ column, prop, order }} sort-change - 当表格的排序条件发生变化时触发，参数为 { column, prop, order }
 * @event {{ column, values }} filter-change - 当表格的筛选条件发生变化时触发，参数为 { column, values }
 * @event {(currentRow: T, oldCurrentRow: T) => void} current-change - 当表格的当前行发生变化时触发，参数为当前行和上一行的数据
 * @event {(newWidth: number, oldWidth: number, column: TableColumnCtx<T>, event: Event) => void} header-dragend - 当拖动表头改变列宽时触发
 * @event {(row: T, expandedRows: T[]) => void} expand-change - 当用户对某一行展开/收起时触发（展开行与树形数据共用），参数为当前行与展开行数组
 * @event {{ scrollTop, scrollLeft }} scroll - 当表格滚动时触发，参数为滚动位置信息
 *
 * @example
 * ```vue
 * <el-table :data="tableData" stripe border @selection-change="handleSelectionChange">
 *   <el-table-column type="selection" width="55" />
 *   <el-table-column prop="date" label="日期" width="180" />
 *   <el-table-column prop="name" label="姓名" width="180" />
 *   <el-table-column prop="address" label="地址" />
 * </el-table>
 * ```
 *
 * @example
 * ```vue
 * <el-table :data="tableData" :row-class-name="tableRowClassName" @row-click="handleRowClick">
 *   <el-table-column prop="name" label="姓名" />
 *   <el-table-column prop="amount" label="金额" :sortable="true" />
 * </el-table>
 * ```
 *
 * @example
 * ```vue
 * <el-table :data="treeData" row-key="id" lazy :load="load" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
 *   <el-table-column prop="name" label="名称" />
 *   <el-table-column prop="size" label="大小" />
 * </el-table>
 * ```
 */

// @ts-nocheck
import { useSizeProp } from '@element-plus/hooks'
import type {
  CSSProperties,
  ComponentInternalInstance,
  PropType,
  Ref,
  VNode,
} from 'vue'
import type { ComponentSize } from '@element-plus/constants'
import type { Nullable } from '@element-plus/utils'
import type { Store } from '../store'
import type { TableColumnCtx } from '../table-column/defaults'
import type TableLayout from '../table-layout'
import type { TableOverflowTooltipOptions } from '../util'

export type DefaultRow = any

interface TableRefs {
  tableWrapper: HTMLElement
  headerWrapper: HTMLElement
  footerWrapper: HTMLElement
  fixedBodyWrapper: HTMLElement
  rightFixedBodyWrapper: HTMLElement
  bodyWrapper: HTMLElement
  appendWrapper: HTMLElement
  [key: string]: any
}

interface TableState {
  isGroup: Ref<boolean>
  resizeState: Ref<{
    width: any
    height: any
  }>
  doLayout: () => void
  debouncedUpdateLayout: () => void
}

type HoverState<T> = Nullable<{
  cell: HTMLElement
  column: TableColumnCtx<T>
  row: T
}>

type RIS<T> = { row: T; $index: number; store: Store<T>; expanded: boolean }

type RenderExpanded<T> = ({
  row,
  $index,
  store,
  expanded: boolean,
}: RIS<T>) => VNode

type SummaryMethod<T> = (data: {
  columns: TableColumnCtx<T>[]
  data: T[]
}) => string[]

interface Table<T> extends ComponentInternalInstance {
  $ready: boolean
  hoverState?: HoverState<T>
  renderExpanded: RenderExpanded<T>
  store: Store<T>
  layout: TableLayout<T>
  refs: TableRefs
  tableId: string
  state: TableState
}

type ColumnCls<T> = string | ((data: { row: T; rowIndex: number }) => string)
type ColumnStyle<T> =
  | CSSProperties
  | ((data: { row: T; rowIndex: number }) => CSSProperties)
type CellCls<T> =
  | string
  | ((data: {
      row: T
      rowIndex: number
      column: TableColumnCtx<T>
      columnIndex: number
    }) => string)
type CellStyle<T> =
  | CSSProperties
  | ((data: {
      row: T
      rowIndex: number
      column: TableColumnCtx<T>
      columnIndex: number
    }) => CSSProperties)
type Layout = 'fixed' | 'auto'
interface TableProps<T> {
  data: T[]
  size?: ComponentSize
  width?: string | number
  height?: string | number
  maxHeight?: string | number
  fit?: boolean
  stripe?: boolean
  border?: boolean
  rowKey?: string | ((row: T) => string)
  context?: Table<T>
  showHeader?: boolean
  showSummary?: boolean
  sumText?: string
  summaryMethod?: SummaryMethod<T>
  rowClassName?: ColumnCls<T>
  rowStyle?: ColumnStyle<T>
  cellClassName?: CellCls<T>
  cellStyle?: CellStyle<T>
  headerRowClassName?: ColumnCls<T>
  headerRowStyle?: ColumnStyle<T>
  headerCellClassName?: CellCls<T>
  headerCellStyle?: CellStyle<T>
  highlightCurrentRow?: boolean
  currentRowKey?: string | number
  emptyText?: string
  expandRowKeys?: any[]
  defaultExpandAll?: boolean
  defaultSort?: Sort
  tooltipEffect?: string
  tooltipOptions?: TableOverflowTooltipOptions
  spanMethod?: (data: {
    row: T
    rowIndex: number
    column: TableColumnCtx<T>
    columnIndex: number
  }) =>
    | number[]
    | {
        rowspan: number
        colspan: number
      }
    | undefined
  selectOnIndeterminate?: boolean
  indent?: number
  treeProps?: {
    hasChildren?: string
    children?: string
  }
  lazy?: boolean
  load?: (row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void
  className?: string
  style?: CSSProperties
  tableLayout?: Layout
  scrollbarAlwaysOn?: boolean
  flexible?: boolean
  showOverflowTooltip?: boolean | TableOverflowTooltipOptions
}

interface Sort {
  prop: string
  order: 'ascending' | 'descending'
  init?: any
  silent?: any
}

interface Filter<T> {
  column: TableColumnCtx<T>
  values: string[]
  silent: any
}

interface TreeNode {
  expanded?: boolean
  loading?: boolean
  noLazyChildren?: boolean
  indent?: number
  level?: number
  display?: boolean
}

interface RenderRowData<T> {
  store: Store<T>
  _self: Table<T>
  column: TableColumnCtx<T>
  row: T
  $index: number
  treeNode?: TreeNode
  expanded: boolean
}

export default {
  data: {
    type: Array as PropType<DefaultRow[]>,
    default: () => [],
  },
  size: useSizeProp,
  width: [String, Number],
  height: [String, Number],
  maxHeight: [String, Number],
  fit: {
    type: Boolean,
    default: true,
  },
  stripe: Boolean,
  border: Boolean,
  rowKey: [String, Function] as PropType<TableProps<DefaultRow>['rowKey']>,
  showHeader: {
    type: Boolean,
    default: true,
  },
  showSummary: Boolean,
  sumText: String,
  summaryMethod: Function as PropType<TableProps<DefaultRow>['summaryMethod']>,
  rowClassName: [String, Function] as PropType<
    TableProps<DefaultRow>['rowClassName']
  >,
  rowStyle: [Object, Function] as PropType<TableProps<DefaultRow>['rowStyle']>,
  cellClassName: [String, Function] as PropType<
    TableProps<DefaultRow>['cellClassName']
  >,
  cellStyle: [Object, Function] as PropType<
    TableProps<DefaultRow>['cellStyle']
  >,
  headerRowClassName: [String, Function] as PropType<
    TableProps<DefaultRow>['headerRowClassName']
  >,
  headerRowStyle: [Object, Function] as PropType<
    TableProps<DefaultRow>['headerRowStyle']
  >,
  headerCellClassName: [String, Function] as PropType<
    TableProps<DefaultRow>['headerCellClassName']
  >,
  headerCellStyle: [Object, Function] as PropType<
    TableProps<DefaultRow>['headerCellStyle']
  >,
  highlightCurrentRow: Boolean,
  currentRowKey: [String, Number],
  emptyText: String,
  expandRowKeys: Array as PropType<TableProps<DefaultRow>['expandRowKeys']>,
  defaultExpandAll: Boolean,
  defaultSort: Object as PropType<TableProps<DefaultRow>['defaultSort']>,
  tooltipEffect: String,
  tooltipOptions: Object as PropType<TableProps<DefaultRow>['tooltipOptions']>,
  spanMethod: Function as PropType<TableProps<DefaultRow>['spanMethod']>,
  selectOnIndeterminate: {
    type: Boolean,
    default: true,
  },
  indent: {
    type: Number,
    default: 16,
  },
  treeProps: {
    type: Object as PropType<TableProps<DefaultRow>['treeProps']>,
    default: () => {
      return {
        hasChildren: 'hasChildren',
        children: 'children',
      }
    },
  },
  lazy: Boolean,
  load: Function as PropType<TableProps<DefaultRow>['load']>,
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  className: {
    type: String,
    default: '',
  },
  tableLayout: {
    type: String as PropType<Layout>,
    default: 'fixed',
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
  flexible: Boolean,
  showOverflowTooltip: [Boolean, Object] as PropType<
    TableProps<DefaultRow>['showOverflowTooltip']
  >,
}
export type {
  SummaryMethod,
  Table,
  TableProps,
  TableRefs,
  ColumnCls,
  ColumnStyle,
  CellCls,
  CellStyle,
  TreeNode,
  RenderRowData,
  Sort,
  Filter,
  TableColumnCtx,
}
