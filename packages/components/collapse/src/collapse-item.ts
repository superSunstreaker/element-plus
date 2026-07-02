/**
 * @summary ElCollapseItem 折叠面板项 - el-collapse 的子组件，每一项包含一个可点击的标题区与可展开/收起的内容区，通过 name 与父级 v-model 联动控制展开状态
 *
 * @attr {string} title - 面板标题文字，默认 ''；也可通过具名插槽 title 自定义标题内容
 * @attr {string | number} name - 唯一标识，默认自动生成；用于在父级 el-collapse 的 v-model 中标识当前面板是否展开
 * @attr {boolean} disabled - 是否禁用，默认 false；禁用后标题不可点击展开/收起
 *
 * @example
 * ```vue
 * <el-collapse v-model="activeNames">
 *   <el-collapse-item title="一致性" name="1">
 *     <div>与现实生活一致</div>
 *   </el-collapse-item>
 *   <el-collapse-item title="反馈" name="2" disabled>
 *     <div>控制反馈</div>
 *   </el-collapse-item>
 * </el-collapse>
 * ```
 */
import { buildProps, definePropType, generateId } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type { CollapseActiveName } from './collapse'

export const collapseItemProps = buildProps({
  title: {
    type: String,
    default: '',
  },
  name: {
    type: definePropType<CollapseActiveName>([String, Number]),
    default: () => generateId(),
  },
  disabled: Boolean,
} as const)
export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>
