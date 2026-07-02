/**
 * @summary ElBreadcrumb 面包屑导航组件 - 用于显示当前页面在系统层级结构中的位置路径，支持点击返回上一级，常配合 el-breadcrumb-item 使用
 *
 * @attr {String} separator - 分隔符字符，显示在每一级导航项之间，默认 '/'
 * @attr {String|Component} separatorIcon - 分隔符图标组件，可传入图标组件名或组件对象；设置后将替代字符分隔符
 *
 * @example
 * ```vue
 * <!-- 示例1：基础用法，字符分隔符 -->
 * <el-breadcrumb separator="/">
 *   <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
 *   <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
 *   <el-breadcrumb-item>用户详情</el-breadcrumb-item>
 * </el-breadcrumb>
 *
 * <!-- 示例2：高级用法，图标分隔符与 replace 模式 -->
 * <el-breadcrumb :separator-icon="ArrowRight">
 *   <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
 *   <el-breadcrumb-item :to="{ path: '/order' }" replace>订单列表</el-breadcrumb-item>
 *   <el-breadcrumb-item>订单详情</el-breadcrumb-item>
 * </el-breadcrumb>
 * ```
 */
import { buildProps, iconPropType } from '@element-plus/utils'
import type { ExtractPropTypes } from 'vue'

export const breadcrumbProps = buildProps({
  /**
   * @description separator character
   */
  separator: {
    type: String,
    default: '/',
  },
  /**
   * @description icon component of icon separator
   */
  separatorIcon: {
    type: iconPropType,
  },
} as const)
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
