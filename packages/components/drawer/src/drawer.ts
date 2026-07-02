/**
 * @summary ElDrawer 抽屉 - 从屏幕边缘滑出的浮层，常用于详情查看、表单编辑等场景；属性继承自 ElDialog
 *
 * @attr {boolean} modelValue / v-model - 是否显示 Drawer，默认 false
 * @attr {'ltr' | 'rtl' | 'ttb' | 'btt'} direction - Drawer 打开方向：ltr(左) / rtl(右) / ttb(上) / btt(下)，默认 'rtl'
 * @attr {string | number} size - Drawer 窗体的大小（横向为宽度，纵向为高度），默认 '30%'
 * @attr {string} title - 标题，也可通过具名 slot #header 传入，默认 ''
 * @attr {boolean} withHeader - 是否显示头部，默认 true
 * @attr {boolean} modal - 是否需要遮罩层，默认 true
 * @attr {boolean} modalFade - 是否启用遮罩淡入淡出动画，默认 true
 * @attr {string} modalClass - 遮罩层自定义类名
 * @attr {boolean} appendToBody - 是否追加到 body；嵌套 Drawer 必须设为 true，默认 false
 * @attr {boolean} lockScroll - 是否在显示时锁定 body 滚动，默认 true
 * @attr {boolean} closeOnClickModal - 是否可点击遮罩层关闭，默认 true
 * @attr {boolean} closeOnPressEscape - 是否可按 ESC 关闭，默认 true
 * @attr {boolean} showClose - 是否显示关闭按钮，默认 true
 * @attr {DialogBeforeCloseFn} beforeClose - 关闭前的回调，需调用 done 才会真正关闭
 * @attr {boolean} destroyOnClose - 关闭时销毁内部元素，默认 false
 * @attr {number} openDelay - 打开前的延迟（毫秒），默认 0
 * @attr {number} closeDelay - 关闭前的延迟（毫秒），默认 0
 * @attr {string} headerAriaLevel - header 的 aria-level，默认 '2'
 * @attr {boolean} center - 头部和底部是否居中对齐，默认 false
 * @attr {boolean} alignCenter - 是否水平垂直居中（仅对部分布局生效），默认 false
 * @attr {Component | string} closeIcon - 自定义关闭图标
 * @attr {boolean} draggable - 是否可拖拽（继承自 dialog 属性），默认 false
 * @attr {boolean} fullscreen - 是否全屏（继承自 dialog 属性），默认 false
 * @attr {boolean} trapFocus - 是否在 Drawer 内部锁定焦点，默认 false
 * @attr {number} zIndex - Drawer 的 z-index
 *
 * @event {() => void} open - 打开的瞬间触发
 * @event {() => void} opened - 打开动画结束时触发
 * @event {() => void} close - 关闭的瞬间触发
 * @event {() => void} closed - 关闭动画结束时触发
 * @event {(value: boolean) => void} update:modelValue - 显示状态变化时触发，配合 v-model
 * @event {() => void} openAutoFocus - 打开时自动聚焦触发
 * @event {() => void} closeAutoFocus - 关闭时自动聚焦触发
 *
 * @example 基础用法（右侧抽屉）
 * ```vue
 * <template>
 *   <el-button @click="visible = true">打开抽屉</el-button>
 *   <el-drawer v-model="visible" title="详情" size="40%">
 *     <p>这里是抽屉内容</p>
 *   </el-drawer>
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const visible = ref(false)
 * </script>
 * ```
 *
 * @example 不同方向 + 嵌套表单 + before-close
 * ```vue
 * <template>
 *   <el-radio-group v-model="direction">
 *     <el-radio-button value="ltr">左</el-radio-button>
 *     <el-radio-button value="rtl">右</el-radio-button>
 *     <el-radio-button value="ttb">上</el-radio-button>
 *     <el-radio-button value="btt">下</el-radio-button>
 *   </el-radio-group>
 *   <el-button @click="visible = true">打开</el-button>
 *   <el-drawer
 *     v-model="visible"
 *     :direction="direction"
 *     title="编辑资料"
 *     :before-close="handleClose"
 *     destroy-on-close
 *   >
 *     <el-form :model="form" label-width="80px">
 *       <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
 *     </el-form>
 *   </el-drawer>
 * </template>
 * <script setup>
 * import { ref, reactive } from 'vue'
 * import { ElMessageBox } from 'element-plus'
 * const visible = ref(false)
 * const direction = ref('rtl')
 * const form = reactive({ name: '' })
 * const handleClose = (done) => {
 *   ElMessageBox.confirm('确认关闭？').then(() => done()).catch(() => {})
 * }
 * </script>
 * ```
 */

import { buildProps } from '@element-plus/utils'
import { dialogEmits, dialogProps } from '@element-plus/components/dialog'
import type { ExtractPropTypes } from 'vue'

export const drawerProps = buildProps({
  ...dialogProps,
  direction: {
    type: String,
    default: 'rtl',
    values: ['ltr', 'rtl', 'ttb', 'btt'],
  },
  size: {
    type: [String, Number],
    default: '30%',
  },
  withHeader: {
    type: Boolean,
    default: true,
  },
  modalFade: {
    type: Boolean,
    default: true,
  },
  headerAriaLevel: {
    type: String,
    default: '2',
  },
} as const)

export type DrawerProps = ExtractPropTypes<typeof drawerProps>

export const drawerEmits = dialogEmits
