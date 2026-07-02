/**
 * @summary ElCascader 级联选择器 - 多层级联数据选择组件
 *
 * 用于从具有层级关系的数据（如省市区、分类目录）中逐级选择，支持单选/多选、搜索过滤、
 * 动态加载子节点等场景。继承 cascader-panel 的 CommonProps，并扩展输入框、标签展示、
 * 下拉交互等外观与行为配置。
 *
 * @attr {*} modelValue - 绑定值，v-model 双向绑定（CascaderValue，来自 cascader-panel）
 * @attr {Array} options - 可选项数据源，树形结构数组（来自 CommonProps）
 * @attr {Object} props - 配置选项，如 label/value/children/disabled 字段映射（来自 CommonProps）
 * @attr {String} size - 输入框尺寸，可选 'large'/'default'/'small'
 * @attr {String} placeholder - 输入框占位文本
 * @attr {Boolean} disabled - 是否禁用
 * @attr {Boolean} clearable - 是否支持清空选项
 * @attr {Boolean} filterable - 是否可搜索选项
 * @attr {Function} filterMethod - 自定义搜索逻辑，签名 (node, keyword) => boolean（默认包含匹配）
 * @attr {String} separator - 选项标签分隔符（默认 ' / '）
 * @attr {Boolean} showAllLevels - 输入框中是否显示选中值的完整路径（默认 true）
 * @attr {Boolean} collapseTags - 多选模式下是否折叠标签
 * @attr {Number} maxCollapseTags - 折叠时显示的最大标签数，需 collapseTags 为 true（默认 1）
 * @attr {Boolean} collapseTagsTooltip - 折叠的标签是否以 tooltip 显示完整内容（默认 false）
 * @attr {Number} debounce - 搜索关键词输入防抖延迟，单位毫秒（默认 300）
 * @attr {Function} beforeFilter - 过滤前的钩子，返回 false 或 reject 的 Promise 则中止过滤
 * @attr {String} popperClass - 下拉框自定义类名（默认 ''）
 * @attr {Boolean} teleported - 下拉框是否 teleport 到 body（默认 true）
 * @attr {String} tagType - 多选标签类型（默认 'info'）
 * @attr {Boolean} validateEvent - 值变化时是否触发表单校验（默认 true）
 *
 * @event {CascaderValue} update:modelValue - 绑定值变化时触发
 * @event {CascaderValue} change - 值变化时触发
 * @event {FocusEvent} focus - 获得焦点时触发
 * @event {FocusEvent} blur - 失去焦点时触发
 * @event {Boolean} visibleChange - 下拉框显示/隐藏时触发
 * @event {CascaderValue} expandChange - 展开层级变化时触发
 * @event {CascaderNode['valueByOption']} removeTag - 多选模式下移除标签时触发
 *
 * @example
 * <el-cascader
 *   v-model="value"
 *   :options="options"
 *   :props="{ expandTrigger: 'hover' }"
 *   @change="handleChange"
 * />
 *
 * @example
 * // 多选 + 搜索 + 折叠标签
 * <el-cascader
 *   v-model="value"
 *   :options="options"
 *   :props="{ multiple: true }"
 *   filterable
 *   collapse-tags
 *   :max-collapse-tags="3"
 * />
 */
import { CommonProps } from '@element-plus/components/cascader-panel'
import { buildProps, definePropType, isBoolean } from '@element-plus/utils'
import { useSizeProp } from '@element-plus/hooks'
import { useTooltipContentProps } from '@element-plus/components/tooltip'
import { tagProps } from '@element-plus/components/tag'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import type {
  CascaderNode,
  CascaderValue,
} from '@element-plus/components/cascader-panel'

export const cascaderProps = buildProps({
  ...CommonProps,
  /**
   * @description size of input
   */
  size: useSizeProp,
  /**
   * @description placeholder of input
   */
  placeholder: String,
  /**
   * @description whether Cascader is disabled
   */
  disabled: Boolean,
  /**
   * @description whether selected value can be cleared
   */
  clearable: Boolean,
  /**
   * @description whether the options can be searched
   */
  filterable: Boolean,
  /**
   * @description customize search logic, the first parameter is `node`, the second is `keyword`, and need return a boolean value indicating whether it hits.
   */
  filterMethod: {
    type: definePropType<(node: CascaderNode, keyword: string) => boolean>(
      Function
    ),
    default: (node: CascaderNode, keyword: string) =>
      node.text.includes(keyword),
  },
  /**
   * @description option label separator
   */
  separator: {
    type: String,
    default: ' / ',
  },
  /**
   * @description whether to display all levels of the selected value in the input
   */
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether to collapse tags in multiple selection mode
   */
  collapseTags: Boolean,
  /**
   * @description The max tags number to be shown. To use this, collapse-tags must be true
   */
  maxCollapseTags: {
    type: Number,
    default: 1,
  },
  /**
   * @description native input id
   */
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  /**
   * @description debounce delay when typing filter keyword, in milliseconds
   */
  debounce: {
    type: Number,
    default: 300,
  },
  /**
   * @description hook function before filtering with the value to be filtered as its parameter. If `false` is returned or a `Promise` is returned and then is rejected, filtering will be aborted
   */
  beforeFilter: {
    type: definePropType<(value: string) => boolean | Promise<any>>(Function),
    default: () => true,
  },
  /**
   * @description custom class name for Cascader's dropdown
   */
  popperClass: {
    type: String,
    default: '',
  },
  /**
   * @description whether cascader popup is teleported
   */
  teleported: useTooltipContentProps.teleported,
  /**
   * @description tag type
   */
  // eslint-disable-next-line vue/require-prop-types
  tagType: { ...tagProps.type, default: 'info' },
  /**
   * @description whether to trigger form validation
   */
  validateEvent: {
    type: Boolean,
    default: true,
  },
})

export const cascaderEmits = {
  [UPDATE_MODEL_EVENT]: (val: CascaderValue) => !!val || val === null,
  [CHANGE_EVENT]: (val: CascaderValue) => !!val || val === null,
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  visibleChange: (val: boolean) => isBoolean(val),
  expandChange: (val: CascaderValue) => !!val,
  removeTag: (val: CascaderNode['valueByOption']) => !!val,
}

// Type name is taken(cascader-panel/src/node), needs discussion
// export type CascaderProps = ExtractPropTypes<typeof cascaderProps>

export type CascaderEmits = typeof cascaderEmits
