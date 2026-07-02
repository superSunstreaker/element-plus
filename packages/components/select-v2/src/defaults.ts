/**
 * @summary ElSelectV2 虚拟化选择器 - 大数据量高性能 Select
 *
 * 基于 VirtualList 实现的虚拟滚动选择器，当选项数量巨大（数千/数万）时仍能保持流畅滚动与渲染。
 * API 与 ElSelect 基本兼容，但通过虚拟列表仅渲染可视区域选项，适用于长列表、远程大数据场景。
 * 支持多选、可创建、远程搜索、分组、折叠标签等。
 *
 * @attr {Array|String|Number|Boolean|Object} modelValue - 绑定值，v-model 双向绑定
 * @attr {Array} options - 选项数据源（必填），结构为 [{ label, value, ... }] 或分组 [{ label, options: [...] }]
 * @attr {Boolean} multiple - 是否多选
 * @attr {Number} multipleLimit - 多选时的最大可选数量，0 为不限制（默认 0）
 * @attr {Boolean} disabled - 是否禁用
 * @attr {Boolean} clearable - 是否可清空
 * @attr {String|Component} clearIcon - 清除图标（默认 CircleClose）
 * @attr {Boolean} collapseTags - 多选时是否折叠标签
 * @attr {Boolean} collapseTagsTooltip - 折叠标签是否以 tooltip 显示（默认 false）
 * @attr {Number} maxCollapseTags - 折叠时最大显示标签数（默认 1）
 * @attr {Boolean} filterable - 是否可搜索
 * @attr {Function} filterMethod - 自定义过滤方法
 * @attr {Boolean} remote - 是否为远程搜索
 * @attr {Function} remoteMethod - 远程搜索方法
 * @attr {Boolean} loading - 是否显示加载中
 * @attr {String} loadingText - 加载中文案
 * @attr {String} noDataText - 无数据文案
 * @attr {String} noMatchText - 无匹配文案
 * @attr {Boolean} allowCreate - 是否允许创建新选项
 * @attr {String} autocomplete - 自动补全类型，可选 'none'/'both'/'list'/'inline'（默认 'none'）
 * @attr {Boolean} automaticDropdown - 聚焦时是否自动展开（默认 false）
 * @attr {Boolean} defaultFirstOption - 是否默认选中第一个选项（默认 false）
 * @attr {Number} estimatedOptionHeight - 选项预估高度（用于动态高度虚拟列表）
 * @attr {Number} height - 下拉面板高度（默认 170，约 5 项）
 * @attr {Number} itemHeight - 单项高度（默认 34）
 * @attr {Boolean} reserveKeyword - 多选搜索后是否保留关键字（默认 true）
 * @attr {String} valueKey - 选项值的字段名（默认 'value'）
 * @attr {Boolean} scrollbarAlwaysOn - 滚动条是否常驻（默认 false）
 * @attr {String} placement - 弹出位置（默认 'bottom-start'）
 * @attr {Boolean} teleported - 是否 teleport（默认 true）
 * @attr {Boolean} persistent - 是否持久化（默认 true）
 * @attr {String} popperClass - 下拉自定义类名（默认 ''）
 * @attr {Object} popperOptions - popper 配置
 * @attr {String} size - 尺寸
 * @attr {String} label - 标签（无障碍）
 * @attr {String} id - id
 * @attr {String} name - name
 * @attr {Boolean} validateEvent - 是否触发表单校验（默认 true）
 *
 * @example
 * <el-select-v2
 *   v-model="value"
 *   :options="options"
 *   :height="200"
 *   filterable
 * />
 *
 * @example
 * // 多选 + 远程搜索 + 折叠标签
 * <el-select-v2
 *   v-model="value"
 *   :options="options"
 *   multiple
 *   remote
 *   :remote-method="remoteSearch"
 *   collapse-tags
 *   :max-collapse-tags="3"
 * />
 */
import { placements } from '@popperjs/core'
import { definePropType, isValidComponentSize } from '@element-plus/utils'
import { useTooltipContentProps } from '@element-plus/components/tooltip'
import { CircleClose } from '@element-plus/icons-vue'
import type { Component, PropType } from 'vue'
import type { ComponentSize } from '@element-plus/constants'
import type { OptionType } from './select.types'
import type { Options, Placement } from '@element-plus/components/popper'

export const SelectProps = {
  allowCreate: Boolean,
  autocomplete: {
    type: String as PropType<'none' | 'both' | 'list' | 'inline'>,
    default: 'none',
  },
  automaticDropdown: Boolean,
  clearable: Boolean,
  clearIcon: {
    type: [String, Object] as PropType<string | Component>,
    default: CircleClose,
  },
  effect: {
    type: String as PropType<'light' | 'dark' | string>,
    default: 'light',
  },
  collapseTags: Boolean,
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  maxCollapseTags: {
    type: Number,
    default: 1,
  },
  defaultFirstOption: Boolean,
  disabled: Boolean,
  estimatedOptionHeight: {
    type: Number,
    default: undefined,
  },
  filterable: Boolean,
  filterMethod: Function,
  height: {
    type: Number,
    default: 170, // 5 items by default
  },
  itemHeight: {
    type: Number,
    default: 34,
  },
  id: String,
  loading: Boolean,
  loadingText: String,
  label: String,
  modelValue: [Array, String, Number, Boolean, Object] as PropType<
    any[] | string | number | boolean | Record<string, any> | any
  >,
  multiple: Boolean,
  multipleLimit: {
    type: Number,
    default: 0,
  },
  name: String,
  noDataText: String,
  noMatchText: String,
  remoteMethod: Function,
  reserveKeyword: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Array as PropType<OptionType[]>,
    required: true,
  },
  placeholder: {
    type: String,
  },
  teleported: useTooltipContentProps.teleported,
  persistent: {
    type: Boolean,
    default: true,
  },
  popperClass: {
    type: String,
    default: '',
  },
  popperOptions: {
    type: Object as PropType<Partial<Options>>,
    default: () => ({} as Partial<Options>),
  },
  remote: Boolean,
  size: {
    type: String as PropType<ComponentSize>,
    validator: isValidComponentSize,
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  placement: {
    type: definePropType<Placement>(String),
    values: placements,
    default: 'bottom-start',
  },
}

export const OptionProps = {
  data: Array,
  disabled: Boolean,
  hovering: Boolean,
  item: Object,
  index: Number,
  style: Object,
  selected: Boolean,
  created: Boolean,
}
