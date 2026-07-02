/**
 * @summary ElStep 步骤 - el-steps 的子组件，表示流程中的一个步骤节点，包含标题、描述、图标与状态，由父级 el-steps 根据 active 自动计算状态，也可手动指定 status
 *
 * @attr {string} title - 步骤标题，默认 ''；也可通过具名插槽 title 自定义
 * @attr {Component | string} icon - 自定义步骤图标组件，支持传入 Element Plus 图标或自定义组件；也可通过具名插槽 icon 设置
 * @attr {string} description - 步骤描述文字，默认 ''；也可通过具名插槽 description 自定义
 * @attr {'' | 'wait' | 'process' | 'finish' | 'error' | 'success'} status - 当前步骤状态，默认 ''（由父级 el-steps 根据 active 自动计算）；手动设置可覆盖自动状态
 *
 * @example
 * ```vue
 * <el-steps :active="active" finish-status="success">
 *   <el-step title="步骤 1" description="填写信息" />
 *   <el-step title="步骤 2" description="上传资料" :icon="Upload" />
 *   <el-step title="步骤 3" description="完成" status="success" />
 * </el-steps>
 * ```
 */
import { buildProps, iconPropType } from '@element-plus/utils'
import type Step from './item.vue'
import type { ExtractPropTypes } from 'vue'

export const stepProps = buildProps({
  /**
   * @description step title
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * @description step custom icon. Icons can be passed via named slot as well
   */
  icon: {
    type: iconPropType,
  },
  /**
   * @description step description
   */
  description: {
    type: String,
    default: '',
  },
  /**
   * @description current status. It will be automatically set by Steps if not configured.
   */
  status: {
    type: String,
    values: ['', 'wait', 'process', 'finish', 'error', 'success'],
    default: '',
  },
} as const)

export type StepProps = ExtractPropTypes<typeof stepProps>

export type StepInstance = InstanceType<typeof Step>
