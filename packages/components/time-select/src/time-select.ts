/**
 * @summary ElTimeSelect 时间选择 - 从固定间隔时间列表中选择
 *
 * 提供按固定步长生成的时间下拉列表供用户选择，比 TimePicker 更简单，
 * 适用于无需精确到秒、且可选时间为固定间隔（如每 30 分钟）的场景（会议预约、配送时段）。
 * 支持起止范围、最小/最大时间限制、自定义图标。
 *
 * @attr {String} format - 时间显示格式（默认 'HH:mm'）
 * @attr {String} modelValue - 绑定值，v-model 双向绑定
 * @attr {Boolean} disabled - 是否禁用
 * @attr {Boolean} editable - 输入框是否可手动编辑（默认 true）
 * @attr {String} effect - 主题，可选 'light'/'dark'（默认 'light'）
 * @attr {Boolean} clearable - 是否可清空（默认 true）
 * @attr {String} size - 尺寸，可选 'large'/'default'/'small'
 * @attr {String} placeholder - 占位文本
 * @attr {String} start - 起始时间（默认 '09:00'）
 * @attr {String} end - 结束时间（默认 '18:00'）
 * @attr {String} step - 时间步长（默认 '00:30'）
 * @attr {String} minTime - 最小可选时间，早于该时间的选项将被禁用
 * @attr {String} maxTime - 最大可选时间，晚于该时间的选项将被禁用
 * @attr {String} name - 原生 input 的 name 属性
 * @attr {String|Component} prefixIcon - 自定义前缀图标（默认 Clock 图标）
 * @attr {String|Component} clearIcon - 自定义清除图标（默认 CircleClose 图标）
 *
 * @example
 * <el-time-select
 *   v-model="value"
 *   start="08:00"
 *   end="20:00"
 *   step="00:30"
 *   placeholder="选择时间"
 * />
 *
 * @example
 * // 起止联动：结束时间不早于开始时间
 * <el-time-select
 *   v-model="startTime"
 *   placeholder="开始时间"
 * />
 * <el-time-select
 *   v-model="endTime"
 *   :min-time="startTime"
 *   placeholder="结束时间"
 * />
 */
import { buildProps, definePropType } from '@element-plus/utils'
import { CircleClose, Clock } from '@element-plus/icons-vue'
import { useSizeProp } from '@element-plus/hooks'
import type TimeSelect from './time-select.vue'
import type { Component, ExtractPropTypes, PropType } from 'vue'

export const timeSelectProps = buildProps({
  /**
   * @description set format of time
   */
  format: {
    type: String,
    default: 'HH:mm',
  },
  /**
   * @description binding value
   */
  modelValue: String,
  /**
   * @description whether TimeSelect is disabled
   */
  disabled: Boolean,
  /**
   * @description whether the input is editable
   */
  editable: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Tooltip theme, built-in theme: `dark` / `light`
   */
  effect: {
    type: String as PropType<'light' | 'dark' | string>,
    default: 'light',
  },
  /**
   * @description whether to show clear button
   */
  clearable: {
    type: Boolean,
    default: true,
  },
  /**
   * @description size of Input
   */
  size: useSizeProp,
  /**
   * @description placeholder in non-range mode
   */
  placeholder: String,
  /**
   * @description start time
   */
  start: {
    type: String,
    default: '09:00',
  },
  /**
   * @description end time
   */
  end: {
    type: String,
    default: '18:00',
  },
  /**
   * @description time step
   */
  step: {
    type: String,
    default: '00:30',
  },
  /**
   * @description minimum time, any time before this time will be disabled
   */
  minTime: String,
  /**
   * @description maximum time, any time after this time will be disabled
   */
  maxTime: String,
  /**
   * @description same as `name` in native input
   */
  name: String,
  /**
   * @description custom prefix icon component
   */
  prefixIcon: {
    type: definePropType<string | Component>([String, Object]),
    default: () => Clock,
  },
  /**
   * @description custom clear icon component
   */
  clearIcon: {
    type: definePropType<string | Component>([String, Object]),
    default: () => CircleClose,
  },
} as const)

export type TimeSelectProps = ExtractPropTypes<typeof timeSelectProps>

export type TimeSelectInstance = InstanceType<typeof TimeSelect>
