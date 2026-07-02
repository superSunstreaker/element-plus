/**
 * @summary ElDescriptions 描述列表 - 以结构化方式展示列表信息
 *
 * @attr {Boolean} border - 是否显示边框（默认 false）
 * @attr {Number} column - 一行展示的列数（默认 3）
 * @attr {String} direction - 排列方向，可选值 'horizontal' / 'vertical'（默认 'horizontal'）
 * @attr {String} size - 列表尺寸，可选 'large' / 'default' / 'small'（默认 'default'）
 * @attr {String} title - 标题文本（默认 ''）
 * @attr {String} extra - 操作区文本（默认 ''）
 *
 * @example
 * <el-descriptions title="用户信息" :column="2" border>
 *   <el-descriptions-item label="用户名">admin</el-descriptions-item>
 *   <el-descriptions-item label="手机号">13800000000</el-descriptions-item>
 * </el-descriptions>
 * <el-descriptions title="详情" direction="vertical" :column="3">
 *   <el-descriptions-item label="姓名">张三</el-descriptions-item>
 * </el-descriptions>
 */
import { buildProps } from '@element-plus/utils'
import { useSizeProp } from '@element-plus/hooks'

import type Description from './description.vue'

export const descriptionProps = buildProps({
  border: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Number,
    default: 3,
  },
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  size: useSizeProp,
  title: {
    type: String,
    default: '',
  },
  extra: {
    type: String,
    default: '',
  },
} as const)

export type DescriptionInstance = InstanceType<typeof Description>
