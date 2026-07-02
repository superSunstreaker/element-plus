/**
 * @summary ElCountdown 倒计时 - 用于倒计时展示
 *
 * @attr {String} format - 倒计时显示格式，参考 dayjs format（默认 'HH:mm:ss'）
 * @attr {String} prefix - 倒计时前缀
 * @attr {String} suffix - 倒计时后缀
 * @attr {String} title - 倒计时标题
 * @attr {Number|Dayjs} value - 目标时间（默认 0）
 * @attr {String|Object|Array} valueStyle - 倒计时数值样式
 *
 * @event finish - 倒计时结束时触发
 * @event {Number} change - 倒计时变化时触发，参数为剩余毫秒数
 *
 * @example
 * <el-countdown title="距离活动开始" :value="Date.now() + 3600 * 1000" format="HH:mm:ss" />
 * <el-countdown :value="deadline" @finish="handleFinish" />
 */
import { buildProps, definePropType, isNumber } from '@element-plus/utils'
import { CHANGE_EVENT } from '@element-plus/constants'

import type { ExtractPropTypes, StyleValue } from 'vue'
import type { Dayjs } from 'dayjs'
import type Countdown from './countdown.vue'

export const countdownProps = buildProps({
  /**
   * @description Formatting the countdown display
   */
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  /**
   * @description Sets the prefix of a countdown
   */
  prefix: String,
  /**
   * @description Sets the suffix of a countdown
   */
  suffix: String,
  /**
   * @description countdown titles
   */
  title: String,
  /**
   * @description target time
   */
  value: {
    type: definePropType<number | Dayjs>([Number, Object]),
    default: 0,
  },
  /**
   * @description Styles countdown values
   */
  valueStyle: {
    type: definePropType<StyleValue>([String, Object, Array]),
  },
} as const)
export type CountdownProps = ExtractPropTypes<typeof countdownProps>

export const countdownEmits = {
  finish: () => true,
  [CHANGE_EVENT]: (value: number) => isNumber(value),
}
export type CountdownEmits = typeof countdownEmits

export type CountdownInstance = InstanceType<typeof Countdown>
