/**
 * @summary ElButton 按钮 - 常用的操作按钮组件，用于触发一个操作，如提交表单、执行查询等交互场景
 *
 * @attr {'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | '' | 'text'} type - 按钮类型，可选值为 default / primary / success / warning / info / danger / text，默认 ''（注意：text 类型将在 3.0.0 版本废弃）
 * @attr {ComponentSize} size - 按钮尺寸，可选值为 large / default / small，默认继承自父级 Form 或 ConfigProvider
 * @attr {boolean} disabled - 是否禁用状态，默认 false，禁用后按钮不可点击且样式变灰
 * @attr {Component | string} icon - 按钮图标组件，支持传入 Element Plus 图标组件或自定义组件
 * @attr {'button' | 'submit' | 'reset'} nativeType - 原生 button 标签的 type 属性，可选值为 button / submit / reset，默认 button
 * @attr {boolean} loading - 是否显示为加载状态，默认 false，显示时按钮内容会被加载图标替换
 * @attr {Component | string} loadingIcon - 自定义加载图标组件，默认 Loading 图标，仅在 loading 为 true 时显示
 * @attr {boolean} plain - 是否为朴素按钮，默认 false，朴素按钮背景透明且边框与文字同色
 * @attr {boolean} text - 是否为文字按钮，默认 false，文字按钮无背景无边框，仅文字可点击
 * @attr {boolean} link - 是否为链接按钮，默认 false，链接按钮样式类似超文本链接
 * @attr {boolean} bg - 是否让文字按钮始终带背景色，默认 false，仅对 text 类型按钮生效
 * @attr {boolean} autofocus - 是否自动获取焦点，默认 false，页面加载后按钮会自动聚焦
 * @attr {boolean} round - 是否为圆角按钮，默认 false，圆角按钮具有较大的圆角弧度
 * @attr {boolean} circle - 是否为圆形按钮，默认 false，圆形按钮为正圆形，通常只放置图标
 * @attr {string} color - 自定义按钮颜色，支持传入十六进制颜色值或 CSS 颜色值，会自动计算 hover 和 active 状态的颜色
 * @attr {boolean} dark - 是否启用暗色模式，默认 false，暗色模式会将颜色转换为适合深色背景的变体
 * @attr {boolean} autoInsertSpace - 是否自动在中文字符之间插入空格，默认 undefined（未设置时继承全局配置），用于提升中文排版美观度
 * @attr {string | Component} tag - 自定义元素标签，默认 'button'，可设置为 a、div 等其他 HTML 标签或 Vue 组件
 *
 * @event {MouseEvent} click - 点击按钮时触发的事件，返回原生 MouseEvent 对象
 *
 * @example
 * ```vue
 * <el-button type="primary" size="large" @click="handleClick">主要按钮</el-button>
 * <el-button :loading="true">加载中</el-button>
 * <el-button type="success" round>成功按钮</el-button>
 * <el-button circle><el-icon><Search /></el-icon></el-button>
 * ```
 */

import { useSizeProp } from '@element-plus/hooks'
import { buildProps, definePropType, iconPropType } from '@element-plus/utils'
import { Loading } from '@element-plus/icons-vue'
import type { Component, ExtractPropTypes } from 'vue'

export const buttonTypes = [
  'default',
  'primary',
  'success',
  'warning',
  'info',
  'danger',
  /**
   * @deprecated
   * Text type will be deprecated in the next major version (3.0.0)
   */
  'text',
  '',
] as const
export const buttonNativeTypes = ['button', 'submit', 'reset'] as const

export const buttonProps = buildProps({
  /**
   * @description button size
   */
  size: useSizeProp,
  /**
   * @description disable the button
   */
  disabled: Boolean,
  /**
   * @description button type
   */
  type: {
    type: String,
    values: buttonTypes,
    default: '',
  },
  /**
   * @description icon component
   */
  icon: {
    type: iconPropType,
  },
  /**
   * @description native button type
   */
  nativeType: {
    type: String,
    values: buttonNativeTypes,
    default: 'button',
  },
  /**
   * @description determine whether it's loading
   */
  loading: Boolean,
  /**
   * @description customize loading icon component
   */
  loadingIcon: {
    type: iconPropType,
    default: () => Loading,
  },
  /**
   * @description determine whether it's a plain button
   */
  plain: Boolean,
  /**
   * @description determine whether it's a text button
   */
  text: Boolean,
  /**
   * @description determine whether it's a link button
   */
  link: Boolean,
  /**
   * @description determine whether the text button background color is always on
   */
  bg: Boolean,
  /**
   * @description native button autofocus
   */
  autofocus: Boolean,
  /**
   * @description determine whether it's a round button
   */
  round: Boolean,
  /**
   * @description determine whether it's a circle button
   */
  circle: Boolean,
  /**
   * @description custom button color, automatically calculate `hover` and `active` color
   */
  color: String,
  /**
   * @description dark mode, which automatically converts `color` to dark mode colors
   */
  dark: Boolean,
  /**
   * @description automatically insert a space between two chinese characters
   */
  autoInsertSpace: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @description custom element tag
   */
  tag: {
    type: definePropType<string | Component>([String, Object]),
    default: 'button',
  },
} as const)
export const buttonEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonEmits = typeof buttonEmits

export type ButtonType = ButtonProps['type']
export type ButtonNativeType = ButtonProps['nativeType']

export interface ButtonConfigContext {
  autoInsertSpace?: boolean
}
