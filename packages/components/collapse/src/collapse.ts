/**
 * @summary ElCollapse 折叠面板 - 通过折叠/展开内容区域来节省空间，常用于分类信息展示、设置项分组等场景
 *
 * @attr {boolean} accordion - 是否开启手风琴模式（同一时间只允许展开一个面板），默认 false
 * @attr {string | number | Array<string | number>} modelValue / v-model - 当前展开的面板 name 列表；accordion 模式下为单个值，默认 []
 *
 * @event {(value: CollapseModelValue) => void} update:modelValue - 展开状态变化时触发，配合 v-model
 * @event {(value: CollapseModelValue) => void} change - 当前展开的面板变化时触发
 *
 * @example 基础用法（可同时展开多个）
 * ```vue
 * <template>
 *   <el-collapse v-model="active">
 *     <el-collapse-item title="一致性" name="1">
 *       <div>与现实生活一致：与现实生活的流程、逻辑保持一致</div>
 *     </el-collapse-item>
 *     <el-collapse-item title="反馈" name="2">
 *       <div>页面反馈：操作后通过页面元素的变化清晰地呈现当前状态</div>
 *     </el-collapse-item>
 *   </el-collapse>
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * const active = ref(['1'])
 * </script>
 * ```
 *
 * @example 手风琴模式（同时只能展开一项）
 * ```vue
 * <template>
 *   <el-collapse v-model="active" accordion>
 *     <el-collapse-item title="账号设置" name="account">
 *       <div>账号相关设置项</div>
 *     </el-collapse-item>
 *     <el-collapse-item title="通知设置" name="notify">
 *       <div>通知相关设置项</div>
 *     </el-collapse-item>
 *   </el-collapse>
 * </template>
 * <script setup>
 * import { ref } from 'vue'
 * // accordion 模式下 modelValue 为单个值
 * const active = ref('account')
 * </script>
 * ```
 */

import {
  buildProps,
  definePropType,
  isNumber,
  isString,
  mutable,
} from '@element-plus/utils'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import type { ExtractPropTypes } from 'vue'
import type { Arrayable } from '@element-plus/utils'

export type CollapseActiveName = string | number
export type CollapseModelValue = Arrayable<CollapseActiveName>

export const emitChangeFn = (value: CollapseModelValue) =>
  typeof isNumber(value) || isString(value) || Array.isArray(value)

export const collapseProps = buildProps({
  accordion: Boolean,
  modelValue: {
    type: definePropType<CollapseModelValue>([Array, String, Number]),
    default: () => mutable([] as const),
  },
} as const)
export type CollapseProps = ExtractPropTypes<typeof collapseProps>

export const collapseEmits = {
  [UPDATE_MODEL_EVENT]: emitChangeFn,
  [CHANGE_EVENT]: emitChangeFn,
}
export type CollapseEmits = typeof collapseEmits
