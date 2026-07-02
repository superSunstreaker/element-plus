import {
  buildProps,
  definePropType,
  isNumber,
  mutable,
} from '@element-plus/utils'

import type { Component, ExtractPropTypes } from 'vue'
import type ImageViewer from './image-viewer.vue'

export type ImageViewerAction =
  | 'zoomIn'
  | 'zoomOut'
  | 'clockwise'
  | 'anticlockwise'

/**
 * @summary ElImageViewer 图片预览组件 - 全屏大图预览器，支持图片列表浏览、缩放、旋转、翻转与上一张/下一张切换，常用于点击缩略图后的大图查看；通常由 el-image 的 preview-src-list 自动调用，也可独立使用
 *
 * @attr {string[]} urlList - 预览图片地址列表，默认 []；通过左右切换浏览
 * @attr {number} zIndex - 预览遮罩层的 z-index，默认不设置（由内部管理）
 * @attr {number} initialIndex - 初始预览图片的索引（基于 0），默认 0；不可超过 urlList 长度
 * @attr {boolean} infinite - 是否无限循环预览，默认 true
 * @attr {boolean} hideOnClickModal - 点击遮罩层是否可关闭预览，默认 false
 * @attr {boolean} teleported - 是否将图片本身 teleport 到 body，默认 false；嵌套父级有 transform 时建议设为 true
 * @attr {boolean} closeOnPressEscape - 是否支持按 ESC 关闭预览，默认 true
 * @attr {number} zoomRate - 缩放事件的缩放比率，默认 1.2；值越大每次缩放幅度越大
 *
 * @event {() => void} close - 预览关闭时触发
 * @event {(index: number) => void} switch - 切换图片时触发，参数为新的图片索引
 *
 * @example
 * ```vue
 * <!-- 独立使用 -->
 * <el-button @click="visible = true">预览</el-button>
 * <el-image-viewer
 *   v-if="visible"
 *   :url-list="urls"
 *   :initial-index="0"
 *   teleported
 *   @close="visible = false"
 * />
 * ```
 */
export const imageViewerProps = buildProps({
  /**
   * @description preview link list.
   */
  urlList: {
    type: definePropType<string[]>(Array),
    default: () => mutable([] as const),
  },
  /**
   * @description preview backdrop z-index.
   */
  zIndex: {
    type: Number,
  },
  /**
   * @description the initial preview image index, less than or equal to the length of `url-list`.
   */
  initialIndex: {
    type: Number,
    default: 0,
  },
  /**
   * @description whether preview is infinite.
   */
  infinite: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether user can emit close event when clicking backdrop.
   */
  hideOnClickModal: Boolean,
  /**
   * @description whether to append image itself to body. A nested parent element attribute transform should have this attribute set to `true`.
   */
  teleported: Boolean,
  /**
   * @description whether the image-viewer can be closed by pressing ESC.
   */
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  /**
   * @description the zoom rate of the image viewer zoom event.
   */
  zoomRate: {
    type: Number,
    default: 1.2,
  },
} as const)
export type ImageViewerProps = ExtractPropTypes<typeof imageViewerProps>

export const imageViewerEmits = {
  close: () => true,
  switch: (index: number) => isNumber(index),
}
export type ImageViewerEmits = typeof imageViewerEmits

export interface ImageViewerMode {
  name: string
  icon: Component
}

export type ImageViewerInstance = InstanceType<typeof ImageViewer>
