/**
 * @summary ElBreadcrumbItem 面包屑项 - el-breadcrumb 的子组件，表示层级路径中的一级，可通过 to 属性配置路由跳转，replace 控制是否替换历史记录
 *
 * @attr {string | RouteLocationRaw} to - 路由跳转目标，与 vue-router 的 to 一致，默认 ''；可为字符串路径或路由对象
 * @attr {boolean} replace - 是否以 replace 模式跳转，默认 false；为 true 时不会在浏览器历史记录中留下记录
 *
 * @example
 * ```vue
 * <el-breadcrumb separator="/">
 *   <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
 *   <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
 *   <el-breadcrumb-item>用户详情</el-breadcrumb-item>
 * </el-breadcrumb>
 * ```
 */
import { buildProps, definePropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const breadcrumbItemProps = buildProps({
  /**
   * @description target route of the link, same as `to` of `vue-router`
   */
  to: {
    type: definePropType<RouteLocationRaw>([String, Object]),
    default: '',
  },
  /**
   * @description if `true`, the navigation will not leave a history record
   */
  replace: {
    type: Boolean,
    default: false,
  },
} as const)
export type BreadcrumbItemProps = ExtractPropTypes<typeof breadcrumbItemProps>
