/**
 * @summary ElStatistic 统计数值 - 展示数值内容并支持格式化
 *
 * @attr {String} decimalSeparator - 小数点符号（默认 '.'）
 * @attr {String} groupSeparator - 千分位分隔符（默认 ','）
 * @attr {Number} precision - 数值精度，即小数位数（默认 0）
 * @attr {Function} formatter - 自定义数值展示函数
 * @attr {Number|Dayjs} value - 数值内容（默认 0）
 * @attr {String} prefix - 数值前缀
 * @attr {String} suffix - 数值后缀
 * @attr {String} title - 数值标题
 * @attr {String|Object|Array} valueStyle - 数值样式
 *
 * @example
 * <el-statistic title="销售额" :value="100000" :precision="2" prefix="¥" />
 * <el-statistic title="访问量" :value="8888" group-separator="," suffix="次" />
 */
import { buildProps, definePropType } from '@element-plus/utils'

import type { ExtractPropTypes, StyleValue } from 'vue'
import type { Dayjs } from 'dayjs'
import type Statistic from './statistic.vue'

export const statisticProps = buildProps({
  /**
   * @description Setting the decimal point
   */
  decimalSeparator: {
    type: String,
    default: '.',
  },
  /**
   * @description Sets the thousandth identifier
   */
  groupSeparator: {
    type: String,
    default: ',',
  },
  /**
   * @description numerical precision
   */
  precision: {
    type: Number,
    default: 0,
  },
  /**
   * @description Custom numerical presentation
   */
  formatter: Function,
  /**
   * @description Numerical content
   */
  value: {
    type: definePropType<number | Dayjs>([Number, Object]),
    default: 0,
  },
  /**
   * @description Sets the prefix of a number
   */
  prefix: String,

  /**
   * @description  Sets the suffix of a number
   */
  suffix: String,
  /**
   * @description Numeric titles
   */
  title: String,
  /**
   * @description Styles numeric values
   */
  valueStyle: {
    type: definePropType<StyleValue>([String, Object, Array]),
  },
} as const)
export type StatisticProps = ExtractPropTypes<typeof statisticProps>

export type StatisticInstance = InstanceType<typeof Statistic>
