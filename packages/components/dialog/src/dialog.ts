/**
 * @summary ElDialog 对话框 - 在保留当前页面状态下告知用户并承载相关操作，常用于重要信息的确认、表单编辑等场景
 *
 * @attr {boolean} center - 是否让头部和底部居中对齐，默认 false
 * @attr {boolean} alignCenter - 是否让 Dialog 同时水平和垂直居中，默认 false
 * @attr {Component | string} closeIcon - 自定义关闭图标，默认为 Close 图标
 * @attr {string} customClass - Dialog 的自定义类名，默认 ''（已废弃，将在 2.4.0 版本移除，请使用 class 属性）
 * @attr {boolean} draggable - 是否为 Dialog 开启拖拽功能，默认 false
 * @attr {boolean} fullscreen - 是否全屏显示 Dialog，默认 false
 * @attr {boolean} showClose - 是否显示关闭按钮，默认 true
 * @attr {string} title - Dialog 的标题，也可通过具名 slot 传入，默认 ''
 * @attr {string} ariaLevel - header 的 aria-level 属性，默认 '2'
 * @attr {boolean} appendToBody - 是否将 Dialog 自身追加到 body 元素上，默认 false；嵌套的 Dialog 必须设置该属性为 true
 * @attr {DialogBeforeCloseFn} beforeClose - 关闭前的回调函数，会暂停 Dialog 的关闭，需调用 done 参数以真正关闭 Dialog
 * @attr {boolean} destroyOnClose - 关闭时销毁 Dialog 中的元素，默认 false
 * @attr {boolean} closeOnClickModal - 是否可以通过点击遮罩层关闭 Dialog，默认 true
 * @attr {boolean} closeOnPressEscape - 是否可以通过按下 ESC 键关闭 Dialog，默认 true
 * @attr {boolean} lockScroll - 是否在 Dialog 显示时锁定 body 的滚动，默认 true
 * @attr {boolean} modal - 是否需要遮罩层，默认 true
 * @attr {number} openDelay - Dialog 打开前的延迟时间（毫秒），默认 0
 * @attr {number} closeDelay - Dialog 关闭前的延迟时间（毫秒），默认 0
 * @attr {string} top - Dialog 的 margin-top CSS 值，默认 15vh
 * @attr {boolean} modelValue - 是否显示 Dialog，支持 v-model，默认 false
 * @attr {string} modalClass - 遮罩层的自定义类名
 * @attr {string | number} width - Dialog 的宽度，默认 50%
 * @attr {number} zIndex - Dialog 的 z-index 层级，同原生 CSS 的 z-index
 * @attr {boolean} trapFocus - 是否将焦点限制在 Dialog 内部，默认 false
 * @attr {string} headerAriaLevel - header 的 aria-level 属性，默认 '2'
 *
 * @event {() => void} open - Dialog 打开的瞬间触发
 * @event {() => void} opened - Dialog 打开动画结束时触发
 * @event {() => void} close - Dialog 关闭的瞬间触发
 * @event {() => void} closed - Dialog 关闭动画结束时触发
 * @event {(value: boolean) => void} update:modelValue - Dialog 显示状态变化时触发，配合 v-model 使用
 * @event {() => void} openAutoFocus - Dialog 打开时自动聚焦触发
 * @event {() => void} closeAutoFocus - Dialog 关闭时自动聚焦触发
 *
 * @example
 * ```vue
 * <template>
 *   <el-button type="primary" @click="dialogVisible = true">打开对话框</el-button>
 *   <el-dialog v-model="dialogVisible" title="提示" width="500px">
 *     <span>这是一段对话框内容</span>
 *     <template #footer>
 *       <el-button @click="dialogVisible = false">取消</el-button>
 *       <el-button type="primary" @click="handleConfirm">确定</el-button>
 *     </template>
 *   </el-dialog>
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 * const dialogVisible = ref(false)
 * const handleConfirm = () => {
 *   console.log('已确认')
 *   dialogVisible.value = false
 * }
 * </script>
 * ```
 *
 * @example
 * ```vue
 * <template>
 *   <el-button type="primary" @click="visible = true">编辑表单</el-button>
 *   <el-dialog
 *     v-model="visible"
 *     title="编辑用户信息"
 *     width="600px"
 *     :before-close="handleClose"
 *     destroy-on-close
 *     align-center
 *   >
 *     <el-form :model="form" label-width="80px">
 *       <el-form-item label="姓名">
 *         <el-input v-model="form.name" />
 *       </el-form-item>
 *       <el-form-item label="邮箱">
 *         <el-input v-model="form.email" />
 *       </el-form-item>
 *     </el-form>
 *     <template #footer>
 *       <el-button @click="visible = false">取消</el-button>
 *       <el-button type="primary" @click="handleSave">保存</el-button>
 *     </template>
 *   </el-dialog>
 * </template>
 *
 * <script setup>
 * import { ref, reactive } from 'vue'
 * import { ElMessageBox } from 'element-plus'
 * const visible = ref(false)
 * const form = reactive({ name: '', email: '' })
 * const handleClose = (done) => {
 *   ElMessageBox.confirm('确认关闭？未保存的数据将丢失。')
 *     .then(() => done())
 *     .catch(() => {})
 * }
 * const handleSave = () => {
 *   console.log('保存', form)
 *   visible.value = false
 * }
 * </script>
 * ```
 */

import { buildProps, definePropType, isBoolean } from '@element-plus/utils'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { dialogContentProps } from './dialog-content'

import type { ExtractPropTypes } from 'vue'

type DoneFn = (cancel?: boolean) => void
export type DialogBeforeCloseFn = (done: DoneFn) => void

export const dialogProps = buildProps({
  ...dialogContentProps,
  /**
   * @description whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true`
   */
  appendToBody: Boolean,
  /**
   * @description callback before Dialog closes, and it will prevent Dialog from closing, use done to close the dialog
   */
  beforeClose: {
    type: definePropType<DialogBeforeCloseFn>(Function),
  },
  /**
   * @description destroy elements in Dialog when closed
   */
  destroyOnClose: Boolean,
  /**
   * @description whether the Dialog can be closed by clicking the mask
   */
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether the Dialog can be closed by pressing ESC
   */
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether scroll of body is disabled while Dialog is displayed
   */
  lockScroll: {
    type: Boolean,
    default: true,
  },
  /**
   * @description whether a mask is displayed
   */
  modal: {
    type: Boolean,
    default: true,
  },
  /**
   * @description the Time(milliseconds) before open
   */
  openDelay: {
    type: Number,
    default: 0,
  },
  /**
   * @description the Time(milliseconds) before close
   */
  closeDelay: {
    type: Number,
    default: 0,
  },
  /**
   * @description value for `margin-top` of Dialog CSS, default is 15vh
   */
  top: {
    type: String,
  },
  /**
   * @description visibility of Dialog
   */
  modelValue: Boolean,
  /**
   * @description custom class names for mask
   */
  modalClass: String,
  /**
   * @description width of Dialog, default is 50%
   */
  width: {
    type: [String, Number],
  },
  /**
   * @description same as z-index in native CSS, z-order of dialog
   */
  zIndex: {
    type: Number,
  },
  trapFocus: {
    type: Boolean,
    default: false,
  },
  /**
   * @description header's aria-level attribute
   */
  headerAriaLevel: {
    type: String,
    default: '2',
  },
} as const)

export type DialogProps = ExtractPropTypes<typeof dialogProps>

export const dialogEmits = {
  open: () => true,
  opened: () => true,
  close: () => true,
  closed: () => true,
  [UPDATE_MODEL_EVENT]: (value: boolean) => isBoolean(value),
  openAutoFocus: () => true,
  closeAutoFocus: () => true,
}
export type DialogEmits = typeof dialogEmits
