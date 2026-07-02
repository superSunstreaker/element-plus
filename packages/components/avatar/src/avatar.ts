/**
 * @summary ElAvatar 头像 - 用于展示用户头像或图标
 *
 * @attr {Number|String} size - 头像尺寸，可选 'large' / 'default' / 'small' 或数字（默认 ''）
 * @attr {String} shape - 头像形状，可选值 'circle' / 'square'（默认 'circle'）
 * @attr {String|Component} icon - 图标组件，用于图标类型头像
 * @attr {String} src - 图片头像的源地址（默认 ''）
 * @attr {String} alt - 图片原生 alt 属性
 * @attr {String} srcSet - 图片原生 srcset 属性
 * @attr {String} fit - 图片填充方式，同 CSS object-fit（默认 'cover'）
 *
 * @event {Event} error - 图片加载失败时触发
 *
 * @example
 * <el-avatar :size="50" src="https://example.com/avatar.png" />
 * <el-avatar shape="square" :icon="UserFilled" />
 * <el-avatar size="large">用户</el-avatar>
 */
import {
  buildProps,
  definePropType,
  iconPropType,
  isNumber,
} from '@element-plus/utils'
import { componentSizes } from '@element-plus/constants'
import type { ExtractPropTypes } from 'vue'
import type { ObjectFitProperty } from 'csstype'

export const avatarProps = buildProps({
  /**
   * @description avatar size.
   */
  size: {
    type: [Number, String],
    values: componentSizes,
    default: '',
    validator: (val: unknown): val is number => isNumber(val),
  },
  /**
   * @description avatar shape.
   */
  shape: {
    type: String,
    values: ['circle', 'square'],
    default: 'circle',
  },
  /**
   * @description representation type to icon, more info on icon component.
   */
  icon: {
    type: iconPropType,
  },
  /**
   * @description the source of the image for an image avatar.
   */
  src: {
    type: String,
    default: '',
  },
  /**
   * @description native attribute `alt` of image avatar.
   */
  alt: String,
  /**
   * @description native attribute srcset of image avatar.
   */
  srcSet: String,
  /**
   * @description set how the image fit its container for an image avatar.
   */
  fit: {
    type: definePropType<ObjectFitProperty>(String),
    default: 'cover',
  },
} as const)
export type AvatarProps = ExtractPropTypes<typeof avatarProps>

export const avatarEmits = {
  error: (evt: Event) => evt instanceof Event,
}
export type AvatarEmits = typeof avatarEmits
