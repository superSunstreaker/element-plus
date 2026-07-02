/**
 * @summary ElResult 结果 - 用于反馈一系列操作任务的处理结果
 *
 * @attr {String} title - 标题（默认 ''）
 * @attr {String} subTitle - 副标题（默认 ''）
 * @attr {String} icon - 图标类型，可选值 'success' / 'warning' / 'info' / 'error'（默认 'info'）
 *
 * @example
 * <el-result icon="success" title="操作成功" sub-title="请稍候...">
 *   <template #extra>
 *     <el-button type="primary">返回</el-button>
 *   </template>
 * </el-result>
 * <el-result icon="error" title="提交失败" sub-title="请检查网络后重试" />
 */
import { buildProps } from '@element-plus/utils'
import {
  CircleCheckFilled,
  CircleCloseFilled,
  InfoFilled,
  WarningFilled,
} from '@element-plus/icons-vue'
import type { Component, ExtractPropTypes } from 'vue'
import type Result from './result.vue'

export const IconMap = {
  success: 'icon-success',
  warning: 'icon-warning',
  error: 'icon-error',
  info: 'icon-info',
} as const

export const IconComponentMap: Record<
  typeof IconMap[keyof typeof IconMap],
  Component
> = {
  [IconMap.success]: CircleCheckFilled,
  [IconMap.warning]: WarningFilled,
  [IconMap.error]: CircleCloseFilled,
  [IconMap.info]: InfoFilled,
}

export const resultProps = buildProps({
  /**
   * @description title of result
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * @description sub title of result
   */
  subTitle: {
    type: String,
    default: '',
  },
  /**
   * @description icon type of result
   */
  icon: {
    type: String,
    values: ['success', 'warning', 'info', 'error'],
    default: 'info',
  },
} as const)

export type ResultProps = ExtractPropTypes<typeof resultProps>

export type ResultInstance = InstanceType<typeof Result>
