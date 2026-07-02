/**
 * @summary ElSkeleton 骨架屏 - 在数据加载完成前显示的占位图形
 *
 * @attr {Boolean} animated - 是否显示加载动画（默认 false）
 * @attr {Number} count - 渲染占位项数量（默认 1）
 * @attr {Number} rows - 渲染行数，仅在无插槽模板时生效（默认 3）
 * @attr {Boolean} loading - 是否显示骨架屏（为 false 时显示真实 DOM）（默认 true）
 * @attr {Number} throttle - 渲染延迟，单位毫秒
 *
 * @example
 * <el-skeleton :loading="loading" animated :rows="5">
 *   <template #default>
 *     <div>真实内容</div>
 *   </template>
 * </el-skeleton>
 * <el-skeleton animated :count="3" />
 */
import { buildProps } from '@element-plus/utils'
import type Skeleton from './skeleton.vue'
import type { ExtractPropTypes } from 'vue'

export const skeletonProps = buildProps({
  /**
   * @description whether showing the animation
   */
  animated: {
    type: Boolean,
    default: false,
  },
  /**
   * @description how many fake items to render to the DOM
   */
  count: {
    type: Number,
    default: 1,
  },
  /**
   * @description whether showing the real DOM
   */
  rows: {
    type: Number,
    default: 3,
  },
  /**
   * @description numbers of the row, only useful when no template slot were given
   */
  loading: {
    type: Boolean,
    default: true,
  },
  /**
   * @description rendering delay in milliseconds
   */
  throttle: {
    type: Number,
  },
} as const)
export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>

export type SkeletonInstance = InstanceType<typeof Skeleton>
