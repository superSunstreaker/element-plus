/**
 * @summary ElTabPane 标签页面板 - el-tabs 的子组件，表示一个选项卡对应的内容面板，通过 label 设置标签标题、name 作为唯一标识，配合父级 v-model 控制显示
 *
 * @attr {string} label - 选项卡标题文本，默认 ''；也可通过具名插槽 label 自定义
 * @attr {string | number} name - 与选项卡 activeName 对应的标识符，建议唯一；未设置时默认为该面板在 el-tabs 中的索引
 * @attr {boolean} closable - 标签是否可关闭，默认 false；仅当父级 el-tabs 的 type 为 card/border-card 时生效
 * @attr {boolean} disabled - 是否禁用该选项卡，默认 false；禁用后不可点击切换
 * @attr {boolean} lazy - 是否延迟渲染，默认 false；为 true 时面板内容在首次被激活时才渲染，切换走后保留 DOM（不会销毁）
 *
 * @example
 * ```vue
 * <el-tabs v-model="activeTab">
 *   <el-tab-pane label="用户管理" name="user">
 *     <user-list />
 *   </el-tab-pane>
 *   <el-tab-pane label="角色管理" name="role" lazy>
 *     <role-list />
 *   </el-tab-pane>
 *   <el-tab-pane label="日志" name="log" disabled>日志</el-tab-pane>
 * </el-tabs>
 * ```
 */
import { buildProps } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type TabPane from './tab-pane.vue'

export const tabPaneProps = buildProps({
  label: {
    type: String,
    default: '',
  },
  name: {
    type: [String, Number],
  },
  closable: Boolean,
  disabled: Boolean,
  lazy: Boolean,
} as const)

export type TabPaneProps = ExtractPropTypes<typeof tabPaneProps>

export type TabPaneInstance = InstanceType<typeof TabPane>
