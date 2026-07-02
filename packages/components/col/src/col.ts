/**
 * @summary ElCol 栅格列 - 24 栅格系统的列组件，作为 el-row 的子项，通过 span/offset/push/pull 控制列宽与位移，并支持 xs/sm/md/lg/xl 响应式断点配置
 *
 * @attr {string} tag - 自定义元素标签，默认 'div'
 * @attr {number} span - 栅格占据的列数，默认 24（即整行），取值范围 0-24
 * @attr {number} offset - 栅格左侧间隔列数，默认 0；相当于在列左侧留出指定列数的空白
 * @attr {number} pull - 栅格向左移动的列数，默认 0；通过 relative 定位实现
 * @attr {number} push - 栅格向右移动的列数，默认 0；通过 relative 定位实现
 * @attr {number | ColSizeObject} xs - `<768px` 响应式栅格数或栅格属性对象（含 span/offset/pull/push）
 * @attr {number | ColSizeObject} sm - `≥768px` 响应式栅格数或栅格属性对象
 * @attr {number | ColSizeObject} md - `≥992px` 响应式栅格数或栅格属性对象
 * @attr {number | ColSizeObject} lg - `≥1200px` 响应式栅格数或栅格属性对象
 * @attr {number | ColSizeObject} xl - `≥1920px` 响应式栅格数或栅格属性对象
 *
 * @example
 * ```vue
 * <!-- 示例1：基础栅格 -->
 * <el-row :gutter="20">
 *   <el-col :span="8">8</el-col>
 *   <el-col :span="8" :offset="8">offset 8</el-col>
 * </el-row>
 *
 * <!-- 示例2：响应式布局 -->
 * <el-row>
 *   <el-col :xs="24" :sm="12" :md="8">响应式列</el-col>
 *   <el-col :xs="{ span: 12, offset: 12 }" :sm="12">对象式配置</el-col>
 * </el-row>
 * ```
 */
import { buildProps, definePropType, mutable } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type Col from './col.vue'

export type ColSizeObject = {
  span?: number
  offset?: number
  pull?: number
  push?: number
}
export type ColSize = number | ColSizeObject

export const colProps = buildProps({
  /**
   * @description custom element tag
   */
  tag: {
    type: String,
    default: 'div',
  },
  /**
   * @description number of column the grid spans
   */
  span: {
    type: Number,
    default: 24,
  },
  /**
   * @description number of spacing on the left side of the grid
   */
  offset: {
    type: Number,
    default: 0,
  },
  /**
   * @description number of columns that grid moves to the left
   */
  pull: {
    type: Number,
    default: 0,
  },
  /**
   * @description number of columns that grid moves to the right
   */
  push: {
    type: Number,
    default: 0,
  },
  /**
   * @description `<768px` Responsive columns or column props object
   */
  xs: {
    type: definePropType<ColSize>([Number, Object]),
    default: () => mutable({} as const),
  },
  /**
   * @description `≥768px` Responsive columns or column props object
   */
  sm: {
    type: definePropType<ColSize>([Number, Object]),
    default: () => mutable({} as const),
  },
  /**
   * @description `≥992px` Responsive columns or column props object
   */
  md: {
    type: definePropType<ColSize>([Number, Object]),
    default: () => mutable({} as const),
  },
  /**
   * @description `≥1200px` Responsive columns or column props object
   */
  lg: {
    type: definePropType<ColSize>([Number, Object]),
    default: () => mutable({} as const),
  },
  /**
   * @description `≥1920px` Responsive columns or column props object
   */
  xl: {
    type: definePropType<ColSize>([Number, Object]),
    default: () => mutable({} as const),
  },
} as const)
export type ColProps = ExtractPropTypes<typeof colProps>
export type ColInstance = InstanceType<typeof Col>
