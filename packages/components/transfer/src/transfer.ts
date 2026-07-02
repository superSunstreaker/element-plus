/**
 * @summary ElTransfer 穿梭框 - 双列表互选数据组件
 *
 * 提供左右两个列表，用户可在两侧之间穿梭勾选项，常用于权限分配、字段选择、成员分组。
 * 支持搜索过滤、自定义渲染、初始勾选、目标列表排序策略、表单校验联动。
 *
 * @attr {Array} data - 数据源数组，每项为 { key, label, disabled } 结构（默认 []）
 * @attr {[String,String]} titles - 自定义左右列表标题（默认 []）
 * @attr {[String,String]} buttonTexts - 自定义左右穿梭按钮文案（默认 []）
 * @attr {String} filterPlaceholder - 搜索框占位文本
 * @attr {Function} filterMethod - 自定义过滤方法，签名 (query, item) => boolean
 * @attr {Array} leftDefaultChecked - 初始左侧勾选项 key 数组（默认 []）
 * @attr {Array} rightDefaultChecked - 初始右侧勾选项 key 数组（默认 []）
 * @attr {Function} renderContent - 自定义数据项渲染函数，签名 (h, option) => VNode
 * @attr {Array} modelValue - 绑定值（右侧列表 key 数组），v-model 双向绑定（默认 []）
 * @attr {Object} format - 列表顶部勾选状态文案，{ noChecked, hasChecked }（默认 {}）
 * @attr {Boolean} filterable - 是否可搜索（默认 false）
 * @attr {Object} props - 数据源字段别名，{ label, key, disabled }（默认 { label:'label', key:'key', disabled:'disabled' }）
 * @attr {String} targetOrder - 右侧列表排序策略，可选 'original'/'push'/'unshift'（默认 'original'，保持数据源顺序）
 * @attr {Boolean} validateEvent - 值变化时是否触发表单校验（默认 true）
 *
 * @event {Array,String,Array} change - 值变化时触发，参数为 (新值, 方向 'left'/'right', 移动的 key 数组)
 * @event {Array} update:modelValue - 绑定值变化时触发
 * @event {Array,Array|undefined} left-check-change - 左侧勾选项变化时触发
 * @event {Array,Array|undefined} right-check-change - 右侧勾选项变化时触发
 *
 * @example
 * <el-transfer
 *   v-model="value"
 *   :data="data"
 *   :titles="['可选', '已选']"
 *   filterable
 * />
 *
 * @example
 * // 自定义渲染 + 排序策略
 * <el-transfer
 *   v-model="value"
 *   :data="data"
 *   :render-content="renderFunc"
 *   target-order="push"
 * />
 */
import { isNil } from 'lodash-unified'
import {
  buildProps,
  definePropType,
  isArray,
  mutable,
} from '@element-plus/utils'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'

import type { ExtractPropTypes, h as H, VNode } from 'vue'
import type Transfer from './transfer.vue'

export type TransferKey = string | number
export type TransferDirection = 'left' | 'right'

export type TransferDataItem = Record<string, any>

export type renderContent = (
  h: typeof H,
  option: TransferDataItem
) => VNode | VNode[]

export interface TransferFormat {
  noChecked?: string
  hasChecked?: string
}

export interface TransferPropsAlias {
  label?: string
  key?: string
  disabled?: string
}

export interface TransferCheckedState {
  leftChecked: TransferKey[]
  rightChecked: TransferKey[]
}

export const LEFT_CHECK_CHANGE_EVENT = 'left-check-change'
export const RIGHT_CHECK_CHANGE_EVENT = 'right-check-change'

export const transferProps = buildProps({
  /**
   * @description data source
   */
  data: {
    type: definePropType<TransferDataItem[]>(Array),
    default: () => [],
  },
  /**
   * @description custom list titles
   */
  titles: {
    type: definePropType<[string, string]>(Array),
    default: () => [],
  },
  /**
   * @description custom button texts
   */
  buttonTexts: {
    type: definePropType<[string, string]>(Array),
    default: () => [],
  },
  /**
   * @description placeholder for the filter input
   */
  filterPlaceholder: String,
  /**
   * @description custom filter method
   */
  filterMethod: {
    type: definePropType<(query: string, item: TransferDataItem) => boolean>(
      Function
    ),
  },
  /**
   * @description key array of initially checked data items of the left list
   */
  leftDefaultChecked: {
    type: definePropType<TransferKey[]>(Array),
    default: () => [],
  },
  /**
   * @description key array of initially checked data items of the right list
   */
  rightDefaultChecked: {
    type: definePropType<TransferKey[]>(Array),
    default: () => [],
  },
  /**
   * @description custom render function for data items
   */
  renderContent: {
    type: definePropType<renderContent>(Function),
  },
  /**
   * @description binding value
   */
  modelValue: {
    type: definePropType<TransferKey[]>(Array),
    default: () => [],
  },
  /**
   * @description texts for checking status in list header
   */
  format: {
    type: definePropType<TransferFormat>(Object),
    default: () => ({}),
  },
  /**
   * @description whether Transfer is filterable
   */
  filterable: Boolean,
  /**
   * @description prop aliases for data source
   */
  props: {
    type: definePropType<TransferPropsAlias>(Object),
    default: () =>
      mutable({
        label: 'label',
        key: 'key',
        disabled: 'disabled',
      } as const),
  },
  /**
   * @description order strategy for elements in the target list. If set to `original`, the elements will keep the same order as the data source. If set to `push`, the newly added elements will be pushed to the bottom. If set to `unshift`, the newly added elements will be inserted on the top
   */
  targetOrder: {
    type: String,
    values: ['original', 'push', 'unshift'],
    default: 'original',
  },
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const)
export type TransferProps = ExtractPropTypes<typeof transferProps>

export const transferCheckedChangeFn = (
  value: TransferKey[],
  movedKeys?: TransferKey[]
) => [value, movedKeys].every(isArray) || (isArray(value) && isNil(movedKeys))

export const transferEmits = {
  [CHANGE_EVENT]: (
    value: TransferKey[],
    direction: TransferDirection,
    movedKeys: TransferKey[]
  ) =>
    [value, movedKeys].every(isArray) && ['left', 'right'].includes(direction),
  [UPDATE_MODEL_EVENT]: (value: TransferKey[]) => isArray(value),
  [LEFT_CHECK_CHANGE_EVENT]: transferCheckedChangeFn,
  [RIGHT_CHECK_CHANGE_EVENT]: transferCheckedChangeFn,
}
export type TransferEmits = typeof transferEmits

export type TransferInstance = InstanceType<typeof Transfer>
