/**
 * @summary ElMenuItem 菜单项 - el-menu 的子组件，表示一个可点击的叶子菜单项，通过 index 唯一标识、route 跳转路由，点击时触发 click 并更新父级选中状态
 *
 * @attr {string | null} index - 唯一标识，默认 null；同 el-menu 中必须唯一，用于高亮当前项与 v-model 联动
 * @attr {string | RouteLocationRaw} route - Vue Router 路由跳转对象，点击该项时跳转；与 index 配合实现菜单导航
 * @attr {boolean} disabled - 是否禁用，默认 false；禁用后不可点击且不参与高亮
 *
 * @event {(item: MenuItemRegistered) => void} click - 点击菜单项时触发，参数为包含 index 与 indexPath 的对象
 *
 * @example
 * ```vue
 * <el-menu :default-active="active" router>
 *   <el-menu-item index="1">处理中心</el-menu-item>
 *   <el-menu-item index="2" :route="{ path: '/user' }">用户管理</el-menu-item>
 *   <el-menu-item index="3" disabled>禁用项</el-menu-item>
 * </el-menu>
 * ```
 */
import { buildProps, definePropType, isString } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MenuItemRegistered } from './types'

export const menuItemProps = buildProps({
  index: {
    type: definePropType<string | null>([String, null]),
    default: null,
  },
  route: {
    type: definePropType<RouteLocationRaw>([String, Object]),
  },
  disabled: Boolean,
} as const)
export type MenuItemProps = ExtractPropTypes<typeof menuItemProps>

export const menuItemEmits = {
  click: (item: MenuItemRegistered) =>
    isString(item.index) && Array.isArray(item.indexPath),
}
export type MenuItemEmits = typeof menuItemEmits
