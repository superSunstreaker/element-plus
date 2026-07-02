/**
 * @summary ElRow 栅格行容器 - 24 栅格系统的行容器组件，用于组织布局中的列（el-col），通过 flex 布局提供水平排列、对齐与间距能力，常用于响应式页面排版
 *
 * @attr {string} tag - 自定义元素标签，默认 'div'，可改为 section、article 等语义化标签或自定义组件
 * @attr {number} gutter - 栅格间隔，默认 0，单位 px；会通过 CSS 变量向子级 el-col 传递左右 padding，形成列间距
 * @attr {'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'} justify - flex 主轴（水平）对齐方式，默认 'start'，可选 start/center/end/space-around/space-between/space-evenly
 * @attr {'top' | 'middle' | 'bottom'} align - flex 交叉轴（垂直）对齐方式，默认不设置（即 stretch），可选 top/middle/bottom
 *
 * @example
 * ```vue
 * <!-- 示例1：基础栅格 + 间隔 -->
 * <el-row :gutter="20">
 *   <el-col :span="12"><div>左侧</div></el-col>
 *   <el-col :span="12"><div>右侧</div></el-col>
 * </el-row>
 *
 * <!-- 示例2：flex 对齐 -->
 * <el-row justify="center" align="middle">
 *   <el-col :span="6">居中</el-col>
 * </el-row>
 * ```
 */
import { buildProps } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type Row from './row.vue'

export const RowJustify = [
  'start',
  'center',
  'end',
  'space-around',
  'space-between',
  'space-evenly',
] as const

export const RowAlign = ['top', 'middle', 'bottom'] as const

export const rowProps = buildProps({
  /**
   * @description custom element tag
   */
  tag: {
    type: String,
    default: 'div',
  },
  /**
   * @description grid spacing
   */
  gutter: {
    type: Number,
    default: 0,
  },
  /**
   * @description horizontal alignment of flex layout
   */
  justify: {
    type: String,
    values: RowJustify,
    default: 'start',
  },
  /**
   * @description vertical alignment of flex layout
   */
  align: {
    type: String,
    values: RowAlign,
  },
} as const)

export type RowProps = ExtractPropTypes<typeof rowProps>
export type RowInstance = InstanceType<typeof Row>
