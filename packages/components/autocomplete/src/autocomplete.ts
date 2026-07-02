/**
 * @summary ElAutocomplete 自动补全 - 输入框自动补全组件
 *
 * 在用户输入时实时提供可选建议列表，常用于搜索框、邮箱/标签输入、远程联想等场景。
 * 支持本地数据数组与异步 fetchSuggestions 回调两种数据源，并通过防抖控制请求频率。
 *
 * @attr {String} valueKey - 输入建议对象中用于显示的字段名（默认 'value'）
 * @attr {String|Number} modelValue - 绑定值，v-model 双向绑定（默认 ''）
 * @attr {Number} debounce - 输入后触发 fetchSuggestions 的防抖延迟，单位毫秒（默认 300）
 * @attr {String} placement - 下拉菜单弹出位置，可选 'top'/'top-start'/'top-end'/'bottom'/'bottom-start'/'bottom-end'（默认 'bottom-start'）
 * @attr {Function|Array} fetchSuggestions - 获取输入建议的方法或静态数组；为函数时签名为 (queryString, cb) => void | Promise，需在就绪后调用 cb(data) 返回结果（默认 NOOP）
 * @attr {String} popperClass - 下拉菜单的自定义类名（默认 ''）
 * @attr {Boolean} triggerOnFocus - 是否在输入框获得焦点时立即触发建议（默认 true）
 * @attr {Boolean} selectWhenUnmatched - 在无匹配项时按下回车是否仍触发 select 事件（默认 false）
 * @attr {Boolean} hideLoading - 是否隐藏远程搜索时的加载图标（默认 false）
 * @attr {String} label - 输入框的标签文本（用于无障碍）
 * @attr {Boolean} teleported - 下拉菜单是否使用 teleport 渲染到 body（默认 true）
 * @attr {Boolean} highlightFirstItem - 是否默认高亮第一项建议（默认 false）
 * @attr {Boolean} fitInputWidth - 下拉菜单宽度是否与输入框一致（默认 false）
 * @attr {Boolean} clearable - 是否显示清除按钮（默认 false）
 * @attr {Boolean} disabled - 是否禁用组件（默认 false）
 * @attr {String} name - 原生 input 的 name 属性
 *
 * @event {String} update:modelValue - 输入值变化时触发
 * @event {String} input - 输入时触发（值变化）
 * @event {String} change - 值变化并失焦时触发
 * @event {FocusEvent} focus - 输入框获得焦点时触发
 * @event {FocusEvent} blur - 输入框失去焦点时触发
 * @event {*} clear - 点击清除按钮时触发
 * @event {Object} select - 选中某条建议时触发，参数为选中的建议对象
 *
 * @example
 * <el-autocomplete
 *   v-model="value"
 *   :fetch-suggestions="querySearch"
 *   placeholder="请输入内容"
 *   @select="handleSelect"
 * />
 *
 * @example
 * // 异步远程搜索
 * const querySearch = (queryString, cb) => {
 *   axios.get('/api/search', { params: { q: queryString } }).then(res => cb(res.data))
 * }
 */
import { NOOP } from '@vue/shared'
import {
  buildProps,
  definePropType,
  isObject,
  isString,
} from '@element-plus/utils'
import { useTooltipContentProps } from '@element-plus/components/tooltip'
import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@element-plus/constants'

import type { ExtractPropTypes } from 'vue'
import type Autocomplete from './autocomplete.vue'
import type { Placement } from '@element-plus/components/popper'
import type { Awaitable } from '@element-plus/utils'

export type AutocompleteData = Record<string, any>[]
export type AutocompleteFetchSuggestionsCallback = (
  data: AutocompleteData
) => void
export type AutocompleteFetchSuggestions =
  | ((
      queryString: string,
      cb: AutocompleteFetchSuggestionsCallback
    ) => Awaitable<AutocompleteData> | void)
  | AutocompleteData

export const autocompleteProps = buildProps({
  /**
   * @description key name of the input suggestion object for display
   */
  valueKey: {
    type: String,
    default: 'value',
  },
  /**
   * @description binding value
   */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /**
   * @description debounce delay when typing, in milliseconds
   */
  debounce: {
    type: Number,
    default: 300,
  },
  /**
   * @description placement of the popup menu
   */
  placement: {
    type: definePropType<Placement>(String),
    values: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
    ],
    default: 'bottom-start',
  },
  /**
   * @description a method to fetch input suggestions. When suggestions are ready, invoke `callback(data:[])` to return them to Autocomplete
   */
  fetchSuggestions: {
    type: definePropType<AutocompleteFetchSuggestions>([Function, Array]),
    default: NOOP,
  },
  /**
   * @description custom class name for autocomplete's dropdown
   */
  popperClass: {
    type: String,
    default: '',
  },
  /**
   * @description whether show suggestions when input focus
   */
  triggerOnFocus: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether to emit a `select` event on enter when there is no autocomplete match
   */
  selectWhenUnmatched: {
    type: Boolean,
    default: false,
  },
  /**
   * @description whether to hide the loading icon in remote search
   */
  hideLoading: {
    type: Boolean,
    default: false,
  },
  /**
   * @description label text
   */
  label: {
    type: String,
  },
  teleported: useTooltipContentProps.teleported,
  /**
   * @description whether to highlight first item in remote search suggestions by default
   */
  highlightFirstItem: {
    type: Boolean,
    default: false,
  },
  /**
   * @description whether the width of the dropdown is the same as the input
   */
  fitInputWidth: {
    type: Boolean,
    default: false,
  },
  /**
   * @description whether to show clear button
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * @description whether to disable
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @description same as `name` in native input
   */
  name: String,
} as const)
export type AutocompleteProps = ExtractPropTypes<typeof autocompleteProps>

export const autocompleteEmits = {
  [UPDATE_MODEL_EVENT]: (value: string) => isString(value),
  [INPUT_EVENT]: (value: string) => isString(value),
  [CHANGE_EVENT]: (value: string) => isString(value),
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
  select: (item: Record<string, any>) => isObject(item),
}
export type AutocompleteEmits = typeof autocompleteEmits

export type AutocompleteInstance = InstanceType<typeof Autocomplete>
