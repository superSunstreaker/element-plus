/**
 * @summary ElDatePicker 日期选择器 - 用于选择或输入日期/日期时间/日期范围等，是 Element Plus 中功能最丰富、最复杂的表单组件之一
 *
 * @attr {'year' | 'month' | 'date' | 'dates' | 'week' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange'} type - 选择器类型，默认 'date'
 * @attr {number | string | Date | [Date, Date]} modelValue - 绑定值，支持 v-model；范围选择时为数组（长度 2），默认 ''
 * @attr {string} format - 输入框中显示的格式（参考 dayjs），如 'YYYY-MM-DD HH:mm:ss'；未指定时按 type 取默认值
 * @attr {string} valueFormat - 绑定值的格式（即 modelValue 的字符串格式）；未指定时绑定值为 Date 对象
 * @attr {boolean} clearable - 是否显示清除按钮，默认 true
 * @attr {string | Component} clearIcon - 自定义清除图标，默认 CircleClose
 * @attr {boolean} editable - 文本框是否可输入，默认 true
 * @attr {boolean} readonly - 是否只读（与 editable 不同：readonly 仍可打开面板选择），默认 false
 * @attr {boolean} disabled - 是否禁用，默认 false
 * @attr {'large' | 'default' | 'small'} size - 输入框尺寸，默认 default
 * @attr {string} placeholder - 非范围选择时的占位内容，默认 ''
 * @attr {string} startPlaceholder - 范围选择时开始日期的占位内容
 * @attr {string} endPlaceholder - 范围选择时结束日期的占位内容
 * @attr {string} rangeSeparator - 范围选择时的分隔符，默认 '-'
 * @attr {string | Component} prefixIcon - 自定义头部图标
 * @attr {Date | [Date, Date]} defaultValue - 可选，日历面板默认显示的日期
 * @attr {Date | [Date, Date]} defaultTime - 可选，选择日期范围时使用的时间值（用于补齐日期的时间部分）
 * @attr {(date: Date) => boolean} disabledDate - 给定日期作为参数的函数，返回 true 表示该日期被禁用
 * @attr {Array} shortcuts - 设置快捷选项的数组，每项形如 { text, value / onClick }
 * @attr {boolean} arrowControl - 是否使用箭头按钮形式选择时间，默认 false
 * @attr {boolean} unlinkPanels - 范围选择时是否取消两个面板的联动，默认 false
 * @attr {string} popperClass - 弹出层自定义类名，默认 ''
 * @attr {Partial<Options>} popperOptions - 透传给 popper.js 的参数，默认 {}
 * @attr {string | string[]} id - 原生 id，范围选择时为长度 2 的数组
 * @attr {string | string[]} name - 原生 name 属性，范围选择时为长度 2 的数组，默认 ''
 * @attr {string} label - 等同原生 aria-label
 * @attr {string | number} tabindex - 输入框 tabindex，默认 0
 * @attr {boolean} validateEvent - 输入值变化时是否触发表单校验，默认 true
 * @attr {(role: string, comparing?: Dayjs) => number[]} disabledHours - 禁用的小时（函数返回数组）
 * @attr {(hour: number, role: string, comparing?: Dayjs) => number[]} disabledMinutes - 禁用的分钟
 * @attr {(hour: number, minute: number, role: string, comparing?: Dayjs) => number[]} disabledSeconds - 禁用的秒
 * @attr {(date: Date) => string} cellClassName - 给定日期返回自定义类名，用于设置单元格样式
 *
 * @event {(value: ModelValueType) => void} update:modelValue - 用户选择后绑定值变化时触发，配合 v-model
 * @event {(value: ModelValueType) => void} change - 用户确认选定的值时触发（与 update:modelValue 同步）
 * @event {(event: FocusEvent) => void} focus - 输入框获得焦点时触发
 * @event {(event: FocusEvent) => void} blur - 输入框失去焦点时触发
 * @event {(visible: boolean) => void} visible-change - 弹出面板显示/隐藏时触发
 * @event {(date: Date | [Date, Date | null]) => void} calendar-change - 在日历面板中选择日期（含范围选择中的 hover 选中）时触发
 * @event {(date: Date, mode: string, view: string) => void} panel-change - 面板视图切换（如 year/month/date 之间）时触发
 *
 * @method focus(focusStartInput?: boolean) - 使输入框获得焦点
 * @method handleOpen() - 打开日期面板
 * @method handleClose() - 关闭日期面板
 *
 * @example 基础用法（日期 + 格式化）
 * ```vue
 * <template>
 *   <el-date-picker
 *     v-model="value"
 *     type="date"
 *     format="YYYY-MM-DD"
 *     value-format="YYYY-MM-DD"
 *     placeholder="选择日期"
 *   />
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const value = ref('')
 * </script>
 * ```
 *
 * @example 日期范围选择 + 快捷选项 + 禁用日期
 * ```vue
 * <template>
 *   <el-date-picker
 *     v-model="range"
 *     type="daterange"
 *     range-separator="至"
 *     start-placeholder="开始日期"
 *     end-placeholder="结束日期"
 *     :shortcuts="shortcuts"
 *     :disabled-date="disabledDate"
 *     unlink-panels
 *   />
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const range = ref([])
 * const shortcuts = [
 *   { text: '最近一周', value: () => { const e = new Date(); const s = new Date(); s.setTime(s.getTime() - 3600 * 1000 * 24 * 7); return [s, e] } },
 * ]
 * const disabledDate = (date) => date.getTime() > Date.now()
 * </script>
 * ```
 *
 * @example 月份选择 + 月份范围
 * ```vue
 * <template>
 *   <el-date-picker v-model="month" type="month" placeholder="选择月份" />
 *   <el-date-picker v-model="monthRange" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" />
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const month = ref('')
 * const monthRange = ref([])
 * </script>
 * ```
 */

import { defineComponent, provide, reactive, ref, toRef } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import localeData from 'dayjs/plugin/localeData.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import weekYear from 'dayjs/plugin/weekYear.js'
import dayOfYear from 'dayjs/plugin/dayOfYear.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import { useNamespace } from '@element-plus/hooks'
import {
  CommonPicker,
  DEFAULT_FORMATS_DATE,
  DEFAULT_FORMATS_DATEPICKER,
} from '@element-plus/components/time-picker'
import { ROOT_PICKER_INJECTION_KEY } from './constants'

import { datePickerProps } from './props/date-picker'
import { getPanel } from './panel-utils'
import type { DatePickerExpose } from './instance'

dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(dayOfYear)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default defineComponent({
  name: 'ElDatePicker',
  install: null,
  props: datePickerProps,
  emits: ['update:modelValue'],
  setup(props, { expose, emit, slots }) {
    const ns = useNamespace('picker-panel')

    provide('ElPopperOptions', reactive(toRef(props, 'popperOptions')))
    provide(ROOT_PICKER_INJECTION_KEY, {
      slots,
      pickerNs: ns,
    })

    const commonPicker = ref<InstanceType<typeof CommonPicker>>()
    const refProps: DatePickerExpose = {
      focus: (focusStartInput = true) => {
        commonPicker.value?.focus(focusStartInput)
      },
      handleOpen: () => {
        commonPicker.value?.handleOpen()
      },
      handleClose: () => {
        commonPicker.value?.handleClose()
      },
    }

    expose(refProps)

    const onModelValueUpdated = (val: any) => {
      emit('update:modelValue', val)
    }

    return () => {
      // since props always have all defined keys on it, {format, ...props} will always overwrite format
      // pick props.format or provide default value here before spreading
      const format =
        props.format ??
        (DEFAULT_FORMATS_DATEPICKER[props.type] || DEFAULT_FORMATS_DATE)

      const Component = getPanel(props.type)

      return (
        <CommonPicker
          {...props}
          format={format}
          type={props.type}
          ref={commonPicker}
          onUpdate:modelValue={onModelValueUpdated}
        >
          {{
            default: (scopedProps: /**FIXME: remove any type */ any) => (
              <Component {...scopedProps} />
            ),
            'range-separator': slots['range-separator'],
          }}
        </CommonPicker>
      )
    }
  },
})
