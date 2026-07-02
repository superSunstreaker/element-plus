/**
 * @summary ElTableV2 虚拟化表格 - 大数据量高性能表格
 *
 * 基于虚拟滚动实现的表格组件，当数据量巨大（数千/数万行）时仍能保持流畅渲染与滚动。
 * 与 ElTable API 差异较大，采用 columns 配置式声明、函数式渲染，支持固定列、行展开、
 * 排序、自定义单元格/表头渲染。适用于大数据报表、日志查看、监控面板等场景。
 *
 * @attr {Array} columns - 列配置数组（必填），每项定义列的 key/width/dataKey/cellRenderer 等
 * @attr {Array} data - 数据源数组（必填）
 * @attr {Number} width - 表格宽度（必填，Number）
 * @attr {Number} height - 表格高度（必填，Number）
 * @attr {Number} maxHeight - 最大高度
 * @attr {Number} rowHeight - 行高（默认 50）
 * @attr {Number} estimatedRowHeight - 预估行高（用于动态高度虚拟列表）
 * @attr {String|Number} rowKey - 行数据的唯一 key 字段名
 * @attr {String|Function} rowClass - 行类名或类名生成函数
 * @attr {Object|Function} rowProps - 行附加属性或生成函数
 * @attr {Object|Function} cellProps - 单元格附加属性或生成函数
 * @attr {String|Function} headerClass - 表头类名或生成函数
 * @attr {Object|Function} headerProps - 表头附加属性或生成函数
 * @attr {Object|Function} headerCellProps - 表头单元格附加属性或生成函数
 * @attr {Number} headerHeight - 表头高度
 * @attr {Number} footerHeight - 表尾高度（默认 0）
 * @attr {String|Function} class - 自定义类名
 * @attr {Object} style - 自定义样式
 * @attr {Boolean} fixed - 是否固定列
 * @attr {Boolean} useIsScrolling - 是否传递 isScrolling 状态给渲染函数
 * @attr {Number} indentSize - 展开行缩进（默认 12）
 * @attr {Number} iconSize - 展开图标尺寸（默认 12）
 * @attr {Number} hScrollbarSize - 水平滚动条尺寸
 * @attr {Number} vScrollbarSize - 垂直滚动条尺寸
 * @attr {Boolean} scrollbarAlwaysOn - 滚动条是否常驻（默认 false）
 * @attr {Number} cache - 虚拟列表渲染缓存
 * @attr {Function} dataGetter - 自定义数据获取函数
 * @attr {Array} fixedData - 固定在顶部的数据（如汇总行）
 * @attr {String} expandColumnKey - 展开行所在的列 key
 * @attr {Array} expandedRowKeys - 展开行的 key 数组
 * @attr {Array} defaultExpandedRowKeys - 默认展开行 key 数组
 * @attr {Object} sortBy - 排序状态 { key, order }
 * @attr {Object} sortState - 受控排序状态
 * @attr {Function} onColumnSort - 列排序回调
 * @attr {Function} onExpandedRowsChange - 展开行变化回调
 * @attr {Function} onEndReached - 滚动到底部回调（参数为距离底部的 distance）
 * @attr {Function} onRowExpand - 行展开回调
 * @attr {Function} onScroll - 滚动回调
 * @attr {Function} onRowsRendered - 行渲染回调
 * @attr {Object} rowEventHandlers - 行事件处理器映射
 *
 * @example
 * <el-table-v2
 *   :columns="columns"
 *   :data="data"
 *   :width="700"
 *   :height="400"
 *   :row-height="50"
 * />
 *
 * @example
 * // 自定义单元格渲染 + 固定列 + 排序
 * const columns = [
 *   { key: 'name', dataKey: 'name', title: '姓名', width: 150 },
 *   { key: 'age', dataKey: 'age', title: '年龄', width: 100, cellRenderer: ({ cellData }) => h('span', cellData) },
 * ]
 * <el-table-v2 :columns="columns" :data="data" :width="800" :height="500" fixed />
 */
import { buildProps, definePropType } from '@element-plus/utils'
import {
  virtualizedGridProps,
  virtualizedScrollbarProps,
} from '@element-plus/components/virtual-list'
import {
  classType,
  columns,
  dataType,
  expandKeys,
  fixedDataType,
  requiredNumber,
  rowKey,
} from './common'
import { tableV2RowProps } from './row'
import { tableV2HeaderProps } from './header'
import { tableV2GridProps } from './grid'

import type { CSSProperties, ExtractPropTypes } from 'vue'
import type { SortOrder } from './constants'
import type {
  Column,
  ColumnCommonParams,
  DataGetter,
  KeyType,
  RowCommonParams,
  SortBy,
  SortState,
} from './types'

/**
 * Param types
 */
export type ColumnSortParams<T> = {
  column: Column<T>
  key: KeyType
  order: SortOrder
}

/**
 * Renderer/Getter types
 */

export type ExtraCellPropGetter<T> = (
  params: ColumnCommonParams<T> &
    RowCommonParams & { cellData: T; rowData: any }
) => any

export type ExtractHeaderPropGetter<T> = (params: {
  columns: Column<T>[]
  headerIndex: number
}) => any

export type ExtractHeaderCellPropGetter<T> = (
  params: ColumnCommonParams<T> & { headerIndex: number }
) => any

export type ExtractRowPropGetter<T> = (
  params: { columns: Column<T>[] } & RowCommonParams
) => any

export type HeaderClassNameGetter<T> = (params: {
  columns: Column<T>[]
  headerIndex: number
}) => string

export type RowClassNameGetter<T> = (
  params: { columns: Column<T>[] } & RowCommonParams
) => string

/**
 * Handler types
 */
export type ColumnSortHandler<T> = (params: ColumnSortParams<T>) => void
export type ColumnResizeHandler<T> = (column: Column<T>, width: number) => void
export type ExpandedRowsChangeHandler = (expandedRowKeys: KeyType[]) => void

export const tableV2Props = buildProps({
  cache: tableV2GridProps.cache,
  estimatedRowHeight: tableV2RowProps.estimatedRowHeight,
  rowKey,
  // Header attributes
  headerClass: {
    type: definePropType<string | HeaderClassNameGetter<any>>([
      String,
      Function,
    ]),
  },
  headerProps: {
    type: definePropType<any | ExtractHeaderPropGetter<any>>([
      Object,
      Function,
    ]),
  },
  headerCellProps: {
    type: definePropType<any | ExtractHeaderCellPropGetter<any>>([
      Object,
      Function,
    ]),
  },
  headerHeight: tableV2HeaderProps.headerHeight,
  /**
   * Footer attributes
   */
  footerHeight: {
    type: Number,
    default: 0,
  },
  /**
   * Row attributes
   */
  rowClass: {
    type: definePropType<string | RowClassNameGetter<any>>([String, Function]),
  },
  rowProps: {
    type: definePropType<ExtractRowPropGetter<any> | any>([Object, Function]),
  },
  rowHeight: {
    type: Number,
    default: 50,
  },

  /**
   * Cell attributes
   */
  cellProps: {
    type: definePropType<Record<string, any> | ExtraCellPropGetter<any>>([
      Object,
      Function,
    ]),
  },
  /**
   * Data models
   */
  columns,
  data: dataType,
  dataGetter: {
    type: definePropType<DataGetter<any>>(Function),
  },
  fixedData: fixedDataType,
  /**
   * Expanded keys
   */
  expandColumnKey: tableV2RowProps.expandColumnKey,
  expandedRowKeys: expandKeys,
  defaultExpandedRowKeys: expandKeys,

  /**
   * Attributes
   */
  class: classType,
  // disabled: Boolean,
  fixed: Boolean,
  style: {
    type: definePropType<CSSProperties>(Object),
  },
  width: requiredNumber,
  height: requiredNumber,
  maxHeight: Number,
  useIsScrolling: Boolean,
  indentSize: {
    type: Number,
    default: 12,
  },
  iconSize: {
    type: Number,
    default: 12,
  },
  hScrollbarSize: virtualizedGridProps.hScrollbarSize,
  vScrollbarSize: virtualizedGridProps.vScrollbarSize,
  scrollbarAlwaysOn: virtualizedScrollbarProps.alwaysOn,

  /**
   * Sorting
   */
  sortBy: {
    type: definePropType<SortBy>(Object),
    default: () => ({} as { key: KeyType; order: SortOrder }),
  },
  sortState: {
    type: definePropType<SortState>(Object),
    default: undefined,
  },

  /**
   * Handlers
   */
  onColumnSort: {
    type: definePropType<ColumnSortHandler<any>>(Function),
  },
  onExpandedRowsChange: {
    type: definePropType<ExpandedRowsChangeHandler>(Function),
  },
  onEndReached: {
    type: definePropType<(distance: number) => void>(Function),
  },
  onRowExpand: tableV2RowProps.onRowExpand,
  onScroll: tableV2GridProps.onScroll,
  onRowsRendered: tableV2GridProps.onRowsRendered,
  rowEventHandlers: tableV2RowProps.rowEventHandlers,
} as const)

export type TableV2Props = ExtractPropTypes<typeof tableV2Props>
