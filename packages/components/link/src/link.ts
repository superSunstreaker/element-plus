/**
 * @summary ElLink 链接 - 文字超链接组件，用于页面间跳转或触发操作
 *
 * @attr {String} type - 主题类型，可选值 'primary' / 'success' / 'warning' / 'info' / 'danger' / 'default'（默认 'default'）
 * @attr {Boolean} underline - 是否显示下划线（默认 true）
 * @attr {Boolean} disabled - 是否禁用（默认 false）
 * @attr {String} href - 原生 href 属性，同 `<a>` 标签（默认 ''）
 * @attr {String|Component} icon - 前缀图标组件
 *
 * @event {MouseEvent} click - 点击链接时触发
 *
 * @example
 * <el-link type="primary" href="https://example.com" :underline="false">主要链接</el-link>
 * <el-link type="danger" :icon="Delete" @click="handleClick">删除</el-link>
 */
import { buildProps, iconPropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type Link from './link.vue'

export const linkProps = buildProps({
  /**
   * @description type
   */
  type: {
    type: String,
    values: ['primary', 'success', 'warning', 'info', 'danger', 'default'],
    default: 'default',
  },
  /**
   * @description whether the component has underline
   */
  underline: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether the component is disabled
   */
  disabled: { type: Boolean, default: false },
  /**
   * @description same as native hyperlink's `href`
   */
  href: { type: String, default: '' },
  /**
   * @description icon component
   */
  icon: {
    type: iconPropType,
  },
} as const)
export type LinkProps = ExtractPropTypes<typeof linkProps>

export const linkEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}
export type LinkEmits = typeof linkEmits

export type LinkInstance = InstanceType<typeof Link>
