/**
 * @summary ElAlert 警告组件 - 用于页面中展示重要的提示信息，支持多种类型（成功/警告/信息/错误）、自定义图标、关闭按钮及内容居中等场景
 *
 * @attr {String} title - 警告标题，显示在主要内容区顶部，默认空字符串
 * @attr {String} description - 辅助文字描述，显示在标题下方，默认空字符串
 * @attr {String} type - 警告类型，可选值：'success' | 'warning' | 'info' | 'error'，默认 'info'，决定图标与主题色
 * @attr {Boolean} closable - 是否可关闭，默认 true；为 false 时不显示关闭按钮
 * @attr {String} closeText - 关闭按钮自定义文本，设置后会以文本替代默认的 X 图标，默认空字符串
 * @attr {Boolean} showIcon - 是否显示类型对应的图标，默认 false
 * @attr {Boolean} center - 文字是否居中显示，默认 false
 * @attr {String} effect - 主题样式，可选值：'light' | 'dark'，默认 'light'
 *
 * @event {(evt: MouseEvent) => void} close - 关闭 Alert 时触发，回调参数为原始鼠标事件对象 MouseEvent
 *
 * @example
 * ```vue
 * <!-- 示例1：基础用法，不同类型的提示 -->
 * <el-alert title="操作成功" type="success" description="数据已保存" showIcon />
 * <el-alert title="警告信息" type="warning" />
 * <el-alert title="错误提示" type="error" :closable="false" />
 *
 * <!-- 示例2：高级用法，自定义关闭文本与暗色主题 -->
 * <el-alert
 *   title="系统通知"
 *   type="info"
 *   effect="dark"
 *   center
 *   closeText="知道了"
 *   showIcon
 *   @close="handleClose"
 * />
 * ```
 */
import { TypeComponentsMap, buildProps, keysOf } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'

export const alertEffects = ['light', 'dark'] as const

export const alertProps = buildProps({
  /**
   * @description alert title.
   */
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  /**
   * @description alert type.
   */
  type: {
    type: String,
    values: keysOf(TypeComponentsMap),
    default: 'info',
  },
  /**
   * @description whether alert can be dismissed.
   */
  closable: {
    type: Boolean,
    default: true,
  },
  /**
   * @description text for replacing x button
   */
  closeText: {
    type: String,
    default: '',
  },
  /**
   * @description whether show icon
   */
  showIcon: Boolean,
  /**
   * @description should content be placed in center.
   */
  center: Boolean,
  effect: {
    type: String,
    values: alertEffects,
    default: 'light',
  },
} as const)
export type AlertProps = ExtractPropTypes<typeof alertProps>

export const alertEmits = {
  close: (evt: MouseEvent) => evt instanceof MouseEvent,
}
export type AlertEmits = typeof alertEmits
