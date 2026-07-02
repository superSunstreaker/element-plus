/**
 * @summary ElCarousel 走马灯 - 在有限空间内循环展示内容的轮播组件
 *
 * 在有限空间内循环展示一组内容（图片/卡片/自定义），常用于 Banner、产品展示、引导页。
 * 支持自动播放、循环、指示器、箭头控制、卡片模式、横竖方向切换、悬停暂停等交互。
 *
 * @attr {Number} initialIndex - 初始展示项索引（默认 0）
 * @attr {String} height - 走马灯高度（默认 ''）
 * @attr {String} trigger - 指示器触发方式，可选 'hover'/'click'（默认 'hover'）
 * @attr {Boolean} autoplay - 是否自动切换（默认 true）
 * @attr {Number} interval - 自动切换间隔，单位毫秒（默认 3000）
 * @attr {String} indicatorPosition - 指示器位置，可选 ''/'none'/'outside'（默认 ''）
 * @attr {String} arrow - 切换箭头显示时机，可选 'always'/'hover'/'never'（默认 'hover'）
 * @attr {String} type - 模式，可选 ''/'card'（默认 ''，'card' 为卡片化）
 * @attr {Boolean} loop - 是否循环切换（默认 true）
 * @attr {String} direction - 展示方向，可选 'horizontal'/'vertical'（默认 'horizontal'）
 * @attr {Boolean} pauseOnHover - 鼠标悬停时是否暂停自动切换（默认 true）
 *
 * @event {Number,Number} change - 幻灯片切换时触发，参数为 (当前索引, 上一索引)
 *
 * @example
 * <el-carousel height="200px" :interval="4000" arrow="always">
 *   <el-carousel-item v-for="i in 4" :key="i">
 *     <h3>{{ i }}</h3>
 *   </el-carousel-item>
 * </el-carousel>
 *
 * @example
 * // 卡片模式
 * <el-carousel type="card" height="200px">
 *   <el-carousel-item v-for="i in 6" :key="i">...</el-carousel-item>
 * </el-carousel>
 */
import { buildProps, isNumber } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'

export const carouselProps = buildProps({
  initialIndex: {
    type: Number,
    default: 0,
  },
  height: {
    type: String,
    default: '',
  },
  trigger: {
    type: String,
    values: ['hover', 'click'],
    default: 'hover',
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 3000,
  },
  indicatorPosition: {
    type: String,
    values: ['', 'none', 'outside'],
    default: '',
  },
  arrow: {
    type: String,
    values: ['always', 'hover', 'never'],
    default: 'hover',
  },
  type: {
    type: String,
    values: ['', 'card'],
    default: '',
  },
  loop: {
    type: Boolean,
    default: true,
  },
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  pauseOnHover: {
    type: Boolean,
    default: true,
  },
} as const)

export const carouselEmits = {
  change: (current: number, prev: number) => [current, prev].every(isNumber),
}

export type CarouselProps = ExtractPropTypes<typeof carouselProps>
export type CarouselEmits = typeof carouselEmits
