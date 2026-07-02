import { buildProps, definePropType } from '@element-plus/utils'
import { createCollectionWithScope } from '@element-plus/components/collection'
import type { ExtractPropTypes, HTMLAttributes, StyleValue } from 'vue'

/**
 * @summary ElRovingFocusGroup 循环焦点组 - 在一组可聚焦元素间实现 roving tabindex 焦点管理的无障碍组件
 *
 * 🔒 内部组件：主要为 RadioGroup、Tabs、Menu 等需要在一组同级元素间用方向键移动焦点的组件服务
 *
 * @attr {String|Array|Object} style - 容器自定义样式
 * @attr {String|null} currentTabId - 当前获得 roving tabindex 的子项 id（受控）
 * @attr {String} defaultCurrentTabId - 默认获得 roving tabindex 的子项 id（非受控）
 * @attr {Boolean} loop - 是否在组内循环焦点
 * @attr {'ltr'|'rtl'} dir - 文本方向，影响方向键映射，默认 'ltr'
 * @attr {'horizontal'|'vertical'|undefined} orientation - 组的方向，影响使用左右还是上下键导航
 * @emit blur - 组失去焦点时触发
 * @emit focus - 组获得焦点时触发
 * @emit mousedown - 鼠标按下时触发
 *
 * @usage
 * <!-- 内部用法：RadioGroup 内部用 RovingFocusGroup 管理各 Radio 的焦点 -->
 * <el-roving-focus-group :loop="true" orientation="horizontal">
 *   <el-roving-focus-item>选项1</el-roving-focus-item>
 *   <el-roving-focus-item>选项2</el-roving-focus-item>
 * </el-roving-focus-group>
 */
export const rovingFocusGroupProps = buildProps({
  style: { type: definePropType<StyleValue>([String, Array, Object]) },
  currentTabId: {
    type: definePropType<string | null>(String),
  },
  defaultCurrentTabId: String,
  loop: Boolean,
  dir: {
    type: String, // left for direction support
    values: ['ltr', 'rtl'],
    default: 'ltr',
  },
  orientation: {
    // left for orientation support
    type: definePropType<HTMLAttributes['aria-orientation']>(String),
  },

  onBlur: Function,
  onFocus: Function,
  onMousedown: Function,
})

export type ElRovingFocusGroupProps = ExtractPropTypes<
  typeof rovingFocusGroupProps
>

const {
  ElCollection,
  ElCollectionItem,
  COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY,
} = createCollectionWithScope('RovingFocusGroup')

export {
  ElCollection,
  ElCollectionItem,
  COLLECTION_INJECTION_KEY as ROVING_FOCUS_COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY as ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
}
