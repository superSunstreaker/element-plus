/**
 * @summary ElProgress 进度条 - 用于展示操作进度
 *
 * @attr {String} type - 进度条类型，可选值 'line' / 'circle' / 'dashboard'（默认 'line'）
 * @attr {Number} percentage - 百分比，必填（默认 0，范围 0-100）
 * @attr {String} status - 当前状态，可选值 '' / 'success' / 'exception' / 'warning'（默认 ''）
 * @attr {Boolean} indeterminate - 是否为不定进度（动画）（默认 false）
 * @attr {Number} duration - 不定进度或条纹流动动画时长，单位秒（默认 3）
 * @attr {Number} strokeWidth - 进度条宽度（默认 6）
 * @attr {String} strokeLinecap - line/circle/dashboard 结束端形状，同 SVG stroke-linecap（默认 'round'）
 * @attr {Boolean} textInside - 是否将百分比放在进度条内部，仅 type 为 'line' 时生效（默认 false）
 * @attr {Number} width - circle/dashboard 类型画布宽度（默认 126）
 * @attr {Boolean} showText - 是否显示百分比（默认 true）
 * @attr {String|Array|Function} color - 进度条背景色，覆盖 status 属性（默认 ''）
 * @attr {Boolean} striped - 是否显示条纹
 * @attr {Boolean} stripedFlow - 条纹是否流动
 * @attr {Function} format - 自定义文本格式函数（默认显示 '百分比%'）
 *
 * @example
 * <el-progress :percentage="50" />
 * <el-progress :percentage="80" status="success" />
 * <el-progress type="circle" :percentage="70" :width="120" />
 * <el-progress :percentage="60" :color="customColors" striped striped-flow />
 */
import { buildProps, definePropType } from '@element-plus/utils'
import type { ExtractPropTypes, SVGAttributes } from 'vue'
import type Progress from './progress.vue'

export type ProgressColor = { color: string; percentage: number }
export type ProgressFn = (percentage: number) => string

export const progressProps = buildProps({
  /**
   * @description type of progress bar
   */
  type: {
    type: String,
    default: 'line',
    values: ['line', 'circle', 'dashboard'],
  },
  /**
   * @description percentage, required
   */
  percentage: {
    type: Number,
    default: 0,
    validator: (val: number): boolean => val >= 0 && val <= 100,
  },
  /**
   * @description the current status of progress bar
   */
  status: {
    type: String,
    default: '',
    values: ['', 'success', 'exception', 'warning'],
  },
  /**
   * @description set indeterminate progress
   */
  indeterminate: {
    type: Boolean,
    default: false,
  },
  /**
   * @description control the animation duration of indeterminate progress or striped flow progress
   */
  duration: {
    type: Number,
    default: 3,
  },
  /**
   * @description the width of progress bar
   */
  strokeWidth: {
    type: Number,
    default: 6,
  },
  /**
   * @description butt/circle/dashboard type shape at the end path
   */
  strokeLinecap: {
    type: definePropType<NonNullable<SVGAttributes['stroke-linecap']>>(String),
    default: 'round',
  },
  /**
   * @description whether to place the percentage inside progress bar, only works when `type` is 'line'
   */
  textInside: {
    type: Boolean,
    default: false,
  },
  /**
   * @description the canvas width of circle progress bar
   */
  width: {
    type: Number,
    default: 126,
  },
  /**
   * @description whether to show percentage
   */
  showText: {
    type: Boolean,
    default: true,
  },
  /**
   * @description background color of progress bar. Overrides `status` prop
   */
  color: {
    type: definePropType<string | ProgressColor[] | ProgressFn>([
      String,
      Array,
      Function,
    ]),
    default: '',
  },
  /**
   * @description stripe over the progress bar's color
   */
  striped: Boolean,
  /**
   * @description get the stripes to flow
   */
  stripedFlow: Boolean,
  /**
   * @description custom text format
   */
  format: {
    type: definePropType<ProgressFn>(Function),
    default: (percentage: number): string => `${percentage}%`,
  },
} as const)

export type ProgressProps = ExtractPropTypes<typeof progressProps>
export type ProgressInstance = InstanceType<typeof Progress>
