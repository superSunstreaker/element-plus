/**
 * @summary ElCarouselItem 走马灯项 - el-carousel 的子组件，表示轮播中的一张幻灯片，通过 name 标识、label 显示指示器标签，由父级 el-carousel 控制切换与动画
 *
 * @attr {string} name - 幻灯片名称（标识符），默认 ''；用于配合 el-carousel 的 setActiveItem 按名称切换
 * @attr {string | number} label - 该项对应指示器按钮上显示的文字，默认 ''；未设置时指示器显示为数字索引
 *
 * @example
 * ```vue
 * <el-carousel height="200px" :interval="4000">
 *   <el-carousel-item v-for="item in 4" :key="item" :label="`第 ${item} 张`">
 *     <h3>{{ item }}</h3>
 *   </el-carousel-item>
 * </el-carousel>
 *
 * <!-- 按名称切换 -->
 * <el-carousel ref="carousel" trigger="click">
 *   <el-carousel-item name="a">A</el-carousel-item>
 *   <el-carousel-item name="b">B</el-carousel-item>
 * </el-carousel>
 * ```
 */
import { buildProps } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'

export const carouselItemProps = buildProps({
  name: { type: String, default: '' },
  label: {
    type: [String, Number],
    default: '',
  },
} as const)

export type CarouselItemProps = ExtractPropTypes<typeof carouselItemProps>
