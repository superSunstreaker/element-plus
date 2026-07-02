/**
 * @summary ElSteps 步骤条 - 引导用户按照流程完成任务的导航条，支持水平/垂直方向、简洁模式、居中对齐等场景，常用于表单分步填写、订单流程展示等
 *
 * @attr {number | string} space - 每个 step 的间距，默认 ''（不设置时为响应式自适应）；支持像素数值或百分比字符串，如 200 或 '20%'
 * @attr {number} active - 当前激活步骤的索引（从 0 开始），默认 0；设置后会自动计算各步骤的 wait/process/finish 状态
 * @attr {'horizontal' | 'vertical'} direction - 显示方向，可选值为 horizontal（水平） / vertical（垂直），默认 'horizontal'
 * @attr {boolean} alignCenter - 是否居中对齐标题和描述，默认 false；开启后标题与描述文字居中显示，仅在水平方向且非 simple 模式下生效
 * @attr {boolean} simple - 是否启用简洁风格，默认 false；开启后步骤条显示为更紧凑的样式，适合步骤数较多的场景
 * @attr {'wait' | 'process' | 'finish' | 'error' | 'success'} finishStatus - 结束步骤的状态（即当前 active 之后已完成步骤的默认状态），可选值为 wait / process / finish / error / success，默认 'finish'
 * @attr {'wait' | 'process' | 'finish' | 'error' | 'success'} processStatus - 当前激活步骤（即 active 对应步骤）的状态，可选值为 wait / process / finish / error / success，默认 'process'
 *
 * @event {(newVal: number, oldVal: number) => void} change - 当前激活步骤变化时触发，newVal 为新的步骤索引，oldVal 为变化前的步骤索引
 *
 * @example
 * ```vue
 * <!-- 示例1: 基础水平步骤条 -->
 * <el-steps :active="active" finish-status="success" align-center>
 *   <el-step title="步骤 1" description="填写基本信息" />
 *   <el-step title="步骤 2" description="上传资料" />
 *   <el-step title="步骤 3" description="提交审核" />
 * </el-steps>
 *
 * <!-- 示例2: 垂直方向 + 简洁模式 + 自定义间距 -->
 * <el-steps
 *   direction="vertical"
 *   :active="2"
 *   :space="100"
 *   simple
 *   process-status="error"
 *   @change="onStepChange"
 * >
 *   <el-step title="已发货" />
 *   <el-step title="运输中" />
 *   <el-step title="已签收" />
 *   <el-step title="完成" />
 * </el-steps>
 * ```
 */

import { CHANGE_EVENT } from '@element-plus/constants'
import { buildProps, isNumber } from '@element-plus/utils'
import type Steps from './steps.vue'
import type { ExtractPropTypes } from 'vue'

export const stepsProps = buildProps({
  /**
   * @description the spacing of each step, will be responsive if omitted. Supports percentage.
   */
  space: {
    type: [Number, String],
    default: '',
  },
  /**
   * @description current activation step
   */
  active: {
    type: Number,
    default: 0,
  },
  /**
   * @description display direction
   */
  direction: {
    type: String,
    default: 'horizontal',
    values: ['horizontal', 'vertical'],
  },
  /**
   * @description center title and description
   */
  alignCenter: {
    type: Boolean,
  },
  /**
   * @description whether to apply simple theme
   */
  simple: {
    type: Boolean,
  },
  /**
   * @description status of end step
   */
  finishStatus: {
    type: String,
    values: ['wait', 'process', 'finish', 'error', 'success'],
    default: 'finish',
  },
  /**
   * @description status of current step
   */
  processStatus: {
    type: String,
    values: ['wait', 'process', 'finish', 'error', 'success'],
    default: 'process',
  },
} as const)
export type StepsProps = ExtractPropTypes<typeof stepsProps>

export const stepsEmits = {
  [CHANGE_EVENT]: (newVal: number, oldVal: number) =>
    [newVal, oldVal].every(isNumber),
}
export type StepsEmits = typeof stepsEmits

export type StepsInstance = InstanceType<typeof Steps>
