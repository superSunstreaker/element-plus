/**
 * @summary ElDescriptionsItem 描述列表项 - el-descriptions 的子组件，用于定义描述列表中的一项，由 label（标题）和 slot 内容（值）组成，可通过 span 控制跨列、通过 align/className 控制样式
 *
 * @attr {string} label - 标签文本，默认 ''；也可通过具名插槽 label 自定义
 * @attr {number} span - 列数跨距，默认 1；表示该项占据多少列（el-descriptions 默认 3 列）
 * @attr {string | number} width - 列宽度，默认 ''；可设置固定宽度如 '100px' 或 100
 * @attr {string | number} minWidth - 列最小宽度，默认 ''；可设置最小宽度以避免内容挤压
 * @attr {'left' | 'center' | 'right'} align - 内容对齐方式，默认 'left'
 * @attr {'left' | 'center' | 'right'} labelAlign - 标签对齐方式，默认 ''（继承 align）
 * @attr {string} className - 自定义内容单元格的 class 名，默认 ''
 * @attr {string} labelClassName - 自定义标签单元格的 class 名，默认 ''
 *
 * @example
 * ```vue
 * <el-descriptions title="用户信息" :column="2" border>
 *   <el-descriptions-item label="用户名">admin</el-descriptions-item>
 *   <el-descriptions-item label="手机号" :span="2">13800000000</el-descriptions-item>
 *   <el-descriptions-item label="状态" label-class-name="my-label">
 *     <el-tag>启用</el-tag>
 *   </el-descriptions-item>
 * </el-descriptions>
 * ```
 */
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ElDescriptionsItem',
  props: {
    label: {
      type: String,
      default: '',
    },
    span: {
      type: Number,
      default: 1,
    },
    width: {
      type: [String, Number],
      default: '',
    },
    minWidth: {
      type: [String, Number],
      default: '',
    },
    align: {
      type: String,
      default: 'left',
    },
    labelAlign: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    labelClassName: {
      type: String,
      default: '',
    },
  },
})
