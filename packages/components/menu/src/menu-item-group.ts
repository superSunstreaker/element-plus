import type { ExtractPropTypes } from 'vue'

/**
 * @summary ElMenuItemGroup 菜单项分组 - el-menu / el-submenu 的子组件，用于将若干 el-menu-item 进行视觉分组并显示一个分组标题，本身不可选中
 *
 * @attr {string} title - 分组标题文本；也可通过具名插槽 title 自定义标题内容
 *
 * @example
 * ```vue
 * <el-menu>
 *   <el-sub-menu index="1">
 *     <template #title>分组一</template>
 *     <el-menu-item-group title="常用">
 *       <el-menu-item index="1-1">选项 1</el-menu-item>
 *       <el-menu-item index="1-2">选项 2</el-menu-item>
 *     </el-menu-item-group>
 *   </el-sub-menu>
 * </el-menu>
 * ```
 */
export const menuItemGroupProps = {
  title: String,
} as const
export type MenuItemGroupProps = ExtractPropTypes<typeof menuItemGroupProps>
