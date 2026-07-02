/**
 * @summary ElCard 卡片容器组件 - 用于将信息分组聚合到独立区域，常用于列表项、信息块、表单容器等需要视觉分隔的布局场景
 *
 * @attr {String} header - 卡片标题；也可通过 `slot#header` 传入 DOM 节点实现自定义标题，默认空字符串
 * @attr {String|Object|Array} bodyStyle - 卡片主体的自定义内联样式，支持与 Vue `style` 绑定相同的格式，默认空字符串
 * @attr {String} bodyClass - 卡片主体的自定义 CSS 类名，默认 undefined
 * @attr {String} shadow - 卡片阴影显示时机，可选值：'always'（始终显示）| 'hover'（鼠标悬停时显示）| 'never'（从不显示），默认 'always'
 *
 * @example
 * ```vue
 * <!-- 示例1：基础用法，带标题与内容的卡片 -->
 * <el-card header="用户信息">
 *   <p>姓名：张三</p>
 *   <p>角色：管理员</p>
 * </el-card>
 *
 * <!-- 示例2：高级用法，自定义头部插槽、主体样式与悬停阴影 -->
 * <el-card shadow="hover" body-style="{ padding: '20px', background: '#f5f5f5' }">
 *   <template #header>
 *     <div class="card-header">
 *       <span>订单详情</span>
 *       <el-button type="primary" size="small">编辑</el-button>
 *     </div>
 *   </template>
 *   <p>订单号：ORD-2024-001</p>
 *   <p>状态：待支付</p>
 * </el-card>
 * ```
 */
import { buildProps, definePropType } from '@element-plus/utils'
import type { ExtractPropTypes, StyleValue } from 'vue'

export const cardProps = buildProps({
  /**
   * @description title of the card. Also accepts a DOM passed by `slot#header`
   */
  header: {
    type: String,
    default: '',
  },
  /**
   * @description CSS style of card body
   */
  bodyStyle: {
    type: definePropType<StyleValue>([String, Object, Array]),
    default: '',
  },
  /**
   * @description custom class name of card body
   */
  bodyClass: String,
  /**
   * @description when to show card shadows
   */
  shadow: {
    type: String,
    values: ['always', 'hover', 'never'],
    default: 'always',
  },
} as const)
export type CardProps = ExtractPropTypes<typeof cardProps>
