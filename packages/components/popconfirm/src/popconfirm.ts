/**
 * @summary ElPopconfirm 气泡确认框 - 点击元素弹出气泡确认框，类似 confirm 但更轻量
 *
 * @attr {String} title - 标题内容
 * @attr {String} confirmButtonText - 确认按钮文字
 * @attr {String} cancelButtonText - 取消按钮文字
 * @attr {String} confirmButtonType - 确认按钮类型，可选值见 buttonTypes（默认 'primary'）
 * @attr {String} cancelButtonType - 取消按钮类型，可选值见 buttonTypes（默认 'text'）
 * @attr {String|Component} icon - 图标组件（默认 QuestionFilled）
 * @attr {String} iconColor - 图标颜色（默认 '#f90'）
 * @attr {Boolean} hideIcon - 是否隐藏图标（默认 false）
 * @attr {Number} hideAfter - 关闭延迟，单位毫秒（默认 200）
 * @attr {Boolean} teleported - 是否将 popconfirm 添加到 body
 * @attr {Boolean} persistent - 当 popconfirm 不活跃且 persistent 为 false 时将被销毁
 * @attr {String|Number} width - 宽度，最小 150px（默认 150）
 *
 * @event {MouseEvent} confirm - 点击确认按钮时触发
 * @event {MouseEvent} cancel - 点击取消按钮时触发
 *
 * @example
 * <el-popconfirm title="确定删除吗？" @confirm="handleConfirm" @cancel="handleCancel">
 *   <template #reference>
 *     <el-button>删除</el-button>
 *   </template>
 * </el-popconfirm>
 * <el-popconfirm title="确认提交？" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#409EFF" />
 */
import { buttonTypes } from '@element-plus/components/button'
import { QuestionFilled } from '@element-plus/icons-vue'
import { buildProps, iconPropType } from '@element-plus/utils'
import { useTooltipContentProps } from '@element-plus/components/tooltip'
import type { ExtractPropTypes } from 'vue'
import type Popconfirm from './popconfirm.vue'

export const popconfirmProps = buildProps({
  /**
   * @description Title
   */
  title: String,
  /**
   * @description Confirm button text
   */
  confirmButtonText: String,
  /**
   * @description Cancel button text
   */
  cancelButtonText: String,
  /**
   * @description Confirm button type
   */
  confirmButtonType: {
    type: String,
    values: buttonTypes,
    default: 'primary',
  },
  /**
   * @description Cancel button type
   */
  cancelButtonType: {
    type: String,
    values: buttonTypes,
    default: 'text',
  },
  /**
   * @description Icon Component
   */
  icon: {
    type: iconPropType,
    default: () => QuestionFilled,
  },
  /**
   * @description Icon color
   */
  iconColor: {
    type: String,
    default: '#f90',
  },
  /**
   * @description is hide Icon
   */
  hideIcon: {
    type: Boolean,
    default: false,
  },
  /**
   * @description delay of disappear, in millisecond
   */
  hideAfter: {
    type: Number,
    default: 200,
  },
  /**
   * @description whether popconfirm is teleported to the body
   */
  teleported: useTooltipContentProps.teleported,
  /**
   * @description when popconfirm inactive and `persistent` is `false` , popconfirm will be destroyed
   */
  persistent: useTooltipContentProps.persistent,
  /**
   * @description popconfirm width, min width 150px
   */
  width: {
    type: [String, Number],
    default: 150,
  },
} as const)

export const popconfirmEmits = {
  /**
   * @description triggers when click confirm button
   */
  confirm: (e: MouseEvent) => e instanceof MouseEvent,
  /**
   * @description triggers when click cancel button
   */
  cancel: (e: MouseEvent) => e instanceof MouseEvent,
}

export type PopconfirmEmits = typeof popconfirmEmits

export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>

export type PopconfirmInstance = InstanceType<typeof Popconfirm>
