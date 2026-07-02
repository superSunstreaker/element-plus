/**
 * @summary ElImage 图片 - 支持懒加载、占位、预览的图片组件
 *
 * @attr {Boolean} hideOnClickModal - 预览模式下点击遮罩层是否可关闭预览
 * @attr {String} src - 图片源地址，同原生（默认 ''）
 * @attr {String} fit - 图片填充方式，同 CSS object-fit，可选 '' / 'contain' / 'cover' / 'fill' / 'none' / 'scale-down'（默认 ''）
 * @attr {String} loading - 浏览器加载方式，可选 'eager' / 'lazy'
 * @attr {Boolean} lazy - 是否启用懒加载
 * @attr {String|HTMLElement} scrollContainer - 懒加载时监听滚动的容器
 * @attr {String[]} previewSrcList - 开启图片预览的图片列表（默认 []）
 * @attr {Boolean} previewTeleported - 是否将 image-viewer 添加到 body（嵌套父元素有 transform 时应设为 true）
 * @attr {Number} zIndex - 图片预览的 z-index
 * @attr {Number} initialIndex - 初始预览图片索引，小于 previewSrcList 长度（默认 0）
 * @attr {Boolean} infinite - 预览是否无限切换（默认 true）
 * @attr {Boolean} closeOnPressEscape - 是否可通过 ESC 关闭预览（默认 true）
 * @attr {Number} zoomRate - 预览缩放速率（默认 1.2）
 *
 * @event {Event} load - 图片加载成功时触发
 * @event {Event} error - 图片加载失败时触发
 * @event {Number} switch - 预览切换图片时触发，参数为切换后的索引
 * @event close - 预览关闭时触发
 * @event show - 预览显示时触发
 *
 * @example
 * <el-image src="https://example.com/img.png" fit="cover" style="width: 100px; height: 100px" />
 * <el-image :src="url" :preview-src-list="srcList" lazy />
 * <el-image :src="url" :preview-src-list="srcList" :initial-index="2" infinite />
 */
import {
  buildProps,
  definePropType,
  isNumber,
  mutable,
} from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'

export const imageProps = buildProps({
  /**
   * @description when enabling preview, use this flag to control whether clicking on backdrop can exit preview mode.
   */
  hideOnClickModal: Boolean,
  /**
   * @description image source, same as native.
   */
  src: {
    type: String,
    default: '',
  },
  /**
   * @description indicate how the image should be resized to fit its container, same as [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).
   */
  fit: {
    type: String,
    values: ['', 'contain', 'cover', 'fill', 'none', 'scale-down'],
    default: '',
  },
  /**
   * @description Indicates how the browser should load the image, same as [native](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading)
   */
  loading: {
    type: String,
    values: ['eager', 'lazy'],
  },
  /**
   * @description whether to use lazy load.
   */
  lazy: Boolean,
  /**
   * @description the container to add scroll listener when using lazy load.
   */
  scrollContainer: {
    type: definePropType<string | HTMLElement | undefined>([String, Object]),
  },
  /**
   * @description allow big image preview.
   */
  previewSrcList: {
    type: definePropType<string[]>(Array),
    default: () => mutable([] as const),
  },
  /**
   * @description whether to append image-viewer to body. A nested parent element attribute transform should have this attribute set to `true`.
   */
  previewTeleported: Boolean,
  /**
   * @description set image preview z-index.
   */
  zIndex: {
    type: Number,
  },
  /**
   * @description initial preview image index, less than the length of `url-list`.
   */
  initialIndex: {
    type: Number,
    default: 0,
  },
  /**
   * @description whether the viewer preview is infinite.
   */
  infinite: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether the image-viewer can be closed by pressing ESC.
   */
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  /**
   * @description the zoom rate of the image viewer zoom event
   */
  zoomRate: {
    type: Number,
    default: 1.2,
  },
} as const)
export type ImageProps = ExtractPropTypes<typeof imageProps>

export const imageEmits = {
  load: (evt: Event) => evt instanceof Event,
  error: (evt: Event) => evt instanceof Event,
  switch: (val: number) => isNumber(val),
  close: () => true,
  show: () => true,
}
export type ImageEmits = typeof imageEmits
